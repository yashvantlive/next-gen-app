/**
 * Branch Intelligence Engine
 * Transforms raw user data into an ATS-optimized format.
 * No AI hallucinations, just pure logic mapping.
 */

// Branch-wise safe section titles
const SECTION_TITLES = {
  CSE: "TECHNICAL SKILLS",
  IT: "TECHNICAL SKILLS",
  CS: "TECHNICAL SKILLS",
  AI: "TECHNICAL SKILLS",
  ME: "CORE ENGINEERING SKILLS",
  MECH: "CORE ENGINEERING SKILLS",
  CE: "CORE ENGINEERING SKILLS",
  CIVIL: "CORE ENGINEERING SKILLS",
  EE: "CORE ENGINEERING SKILLS",
  EEE: "CORE ENGINEERING SKILLS",
  ECE: "CORE ENGINEERING SKILLS",
  BBA: "BUSINESS & MANAGEMENT SKILLS",
  MBA: "BUSINESS & MANAGEMENT SKILLS",
  COMMERCE: "FINANCIAL & ACCOUNTING SKILLS",
  ARTS: "CORE COMPETENCIES",
  MEDICAL: "ACADEMIC & CLINICAL SKILLS",
  LAW: "LEGAL EXPERTISE",
  DEFAULT: "CORE SKILLS",
};

// Branch-wise action verbs (ATS safe)
const ACTION_VERBS = {
  CSE: ["Built", "Optimized", "Implemented", "Developed", "Deployed"],
  IT: ["Maintained", "Configured", "Developed", "Tested"],
  AI: ["Designed", "Trained", "Evaluated", "Implemented", "Modeled"],
  ME: ["Designed", "Analyzed", "Fabricated", "Tested", "Simulated"],
  MECH: ["Designed", "Analyzed", "Fabricated", "Tested", "Simulated"],
  CE: ["Planned", "Designed", "Executed", "Surveyed", "Estimated"],
  CIVIL: ["Planned", "Designed", "Executed", "Surveyed", "Estimated"],
  EE: ["Developed", "Tested", "Integrated", "Analyzed", "Calibrated"],
  EEE: ["Developed", "Tested", "Integrated", "Analyzed", "Calibrated"],
  COMMERCE: ["Analyzed", "Prepared", "Audited", "Managed", "Reconciled"],
  MEDICAL: ["Observed", "Assisted", "Documented", "Evaluated", "Diagnosed"],
  LAW: ["Drafted", "Researched", "Argued", "Filed", "Advised"],
  DEFAULT: ["Worked on", "Contributed to", "Assisted in", "Managed"],
};

/**
 * Normalizes branch strings (e.g., "Computer Science" -> "CSE")
 */
function getBranchKey(branch) {
  if (!branch) return "DEFAULT";
  const b = branch.toUpperCase();
  
  if (b.includes('COMPUTER') || b.includes('SOFTWARE') || b.includes('CSE')) return 'CSE';
  if (b.includes('MECH')) return 'ME';
  if (b.includes('CIVIL')) return 'CE';
  if (b.includes('ELECTR')) return 'EE';
  if (b.includes('COMMERCE') || b.includes('ACCOUNT')) return 'COMMERCE';
  if (b.includes('MANAGE') || b.includes('BBA') || b.includes('MBA')) return 'BBA';
  if (b.includes('LAW') || b.includes('LEGAL')) return 'LAW';
  
  return "DEFAULT";
}

// 🔥 MAIN ENGINE
export function buildBranchAwareResume({
  branchId,
  userSkills = [],
  firestoreSkills = {}, // Pass empty object if not available
  firestoreInterests = {}, // Pass empty object if not available
}) {
  const branchKey = getBranchKey(branchId);

  // Get curated lists from metadata (if they exist), else empty arrays
  const branchSkillsList = firestoreSkills[branchKey] || [];
  const branchInterestsList = firestoreInterests[branchKey] || [];

  // 1️⃣ ATS skill prioritization: Put branch-relevant skills first
  const prioritizedSkills = [
    ...branchSkillsList.filter((s) => userSkills.includes(s)), // Intersection
    ...userSkills.filter((s) => !branchSkillsList.includes(s)), // Remaining
  ];

  // 2️⃣ Section title
  const skillsSectionTitle = SECTION_TITLES[branchKey] || SECTION_TITLES.DEFAULT;

  // 3️⃣ Summary context (single safe line)
  const summaryContext =
    branchInterestsList.length > 0
      ? ` Focusing on areas like ${branchInterestsList.slice(0, 3).join(", ")}.`
      : "";

  // 4️⃣ Action verbs
  const verbs = ACTION_VERBS[branchKey] || ACTION_VERBS.DEFAULT;

  return {
    prioritizedSkills,
    skillsSectionTitle,
    summaryContext,
    verbs,
  };
}