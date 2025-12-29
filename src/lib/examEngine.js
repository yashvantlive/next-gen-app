import { db } from "./firebaseClient";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

// --- CONFIGURATION ---
export const EXAMS = [
  { id: "GATE", label: "GATE 2026" },
  { id: "ISRO", label: "ISRO (Scientist)" },
  { id: "SSC", label: "SSC JE" },
];

export const BRANCHES = [
  { id: "ME", label: "Mechanical (ME)" },
  { id: "CS", label: "Computer Science (CS)" },
  { id: "CE", label: "Civil (CE)" },
  { id: "EE", label: "Electrical (EE)" },
  { id: "EC", label: "Electronics (EC)" },
  { id: "DA", label: "Data Science (DA)" },
];

// --- 🛠️ HELPER: PARSE TOPICS ---
export const parseTopics = (inputString) => {
  if (!inputString) return [];
  return inputString.split(',').map(t => t.trim().replace(/\.$/, '')).filter(t => t.length > 0);
};

// --- 🧠 AI PARSER: RAW TEXT TO SYLLABUS ---
export const parseRawSyllabus = (rawText) => {
  const lines = rawText.split('\n');
  const subjects = [];
  let currentSection = "General Modules";

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (line.toLowerCase().startsWith("section")) {
      currentSection = line.replace(/:$/, "").trim(); 
      return;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const subjectName = line.substring(0, colonIndex).trim();
      const contentStr = line.substring(colonIndex + 1).trim();
      
      const topicsList = parseTopics(contentStr);
      
      if (topicsList.length > 0) {
        subjects.push({
          id: Date.now() + Math.random(),
          section: currentSection,
          name: subjectName,
          topics: topicsList.map(t => ({ name: t, resources: [] })) // Default empty resources
        });
      }
    }
  });
  return subjects;
};

// --- 🔄 SMART MERGE LOGIC (Crucial) ---
// This merges new text-parsed structure with existing database data
// to PRESERVE LINKS (YouTube/PDF) for matching topics.
export const mergeSyllabusData = (existingSubjects, newParsedSubjects) => {
  return newParsedSubjects.map(newSub => {
    // 1. Check if Subject exists in old data
    const oldSub = existingSubjects.find(s => s.name.toLowerCase() === newSub.name.toLowerCase());
    
    if (oldSub) {
      // 2. Subject exists, now map topics
      const mergedTopics = newSub.topics.map(newTopic => {
        // Check if Topic exists in old Subject
        const oldTopic = oldSub.topics?.find(t => t.name.toLowerCase() === newTopic.name.toLowerCase());
        
        if (oldTopic) {
          // ✅ FOUND! Keep old resources (links) and ID
          return { ...newTopic, resources: oldTopic.resources || [] };
        } else {
          // New Topic
          return newTopic;
        }
      });

      // Return merged subject (Keep old ID, but update Section/Name from text if needed)
      return { ...newSub, id: oldSub.id, topics: mergedTopics };
    } else {
      // New Subject entirely
      return newSub;
    }
  });
};

// --- 🔒 ADMIN: SAVE SYLLABUS (Now saves rawText too) ---
export const saveExamSyllabus = async (examId, branchId, data) => {
  const docId = `${examId}_${branchId}`;
  await setDoc(doc(db, "exam_syllabus", docId), {
    examId,
    branchId,
    syllabusPdf: data.pdfLink || "",
    rawSyllabusText: data.rawText || "", // ✅ Saving the Text Area content
    subjects: data.subjects,
    lastUpdated: new Date()
  });
};

// --- 🌍 PUBLIC: FETCH SYLLABUS ---
export const getExamSyllabus = async (examId, branchId) => {
  const docId = `${examId}_${branchId}`;
  const snap = await getDoc(doc(db, "exam_syllabus", docId));
  return snap.exists() ? snap.data() : null;
};

// --- 🔄 AUTO-TODO SYNC ---
export const syncTopicToTodo = async (userId, topicName, subjectName, examId, isDone) => {
  if (!userId) return; 
  const todoQuery = query(
    collection(db, "todos"),
    where("userId", "==", userId),
    where("linkedTopic", "==", topicName),
    where("examId", "==", examId)
  );
  const snapshot = await getDocs(todoQuery);

  if (!snapshot.empty) {
    const todoDoc = snapshot.docs[0];
    await updateDoc(doc(db, "todos", todoDoc.id), {
      status: isDone ? "done" : "active",
      completedAt: isDone ? new Date() : null
    });
  } else if (isDone) {
    await addDoc(collection(db, "todos"), {
      userId,
      title: topicName,
      subtitle: `${subjectName} (${examId})`,
      type: "academic",
      examId,
      linkedTopic: topicName,
      status: "done",
      completedAt: new Date(),
      createdAt: new Date()
    });
  }
};