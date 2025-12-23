import { 
  Target, DollarSign, Activity, Cpu, 
  Briefcase, Heart, Rocket, Brain, Smile, Star 
} from "lucide-react";

export const WIDGETS_CONFIG = [
  // --- 1. ACADEMIC ---
  {
    id: "trajectory_lock",
    name: "Trajectory Lock",
    icon: Target,
    componentName: "TrajectoryLock",
    description: "Track academic performance against goals.",
    defaultData: { 
      currentCGPA: 7.5, 
      targetCGPA: 9.0, 
      attendance: 85,
      notes: "Focus on Data Structures this semester."
    },
    schema: [
      { key: "currentCGPA", label: "Current CGPA", type: "number", min: 0, max: 10, step: 0.1 },
      { key: "targetCGPA", label: "Target CGPA", type: "number", min: 0, max: 10, step: 0.1 },
      { key: "attendance", label: "Attendance %", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 2. FINANCIAL ---
  {
    id: "runway_tracker",
    name: "Runway Tracker",
    icon: DollarSign,
    componentName: "RunwayTracker",
    description: "Manage monthly budget and savings goals.",
    defaultData: { 
      currentBalance: 5000, 
      monthlyBudget: 8000, 
      savingsGoal: 15000,
      notes: "Saving for a new laptop."
    },
    schema: [
      { key: "currentBalance", label: "Current Balance (₹)", type: "number" },
      { key: "monthlyBudget", label: "Monthly Limit (₹)", type: "number" },
      { key: "savingsGoal", label: "Savings Goal (₹)", type: "number" }
    ]
  },

  // --- 3. RELATIONSHIPS ---
  {
    id: "network_health",
    name: "Network Health",
    icon: Activity,
    componentName: "NetworkHealth",
    description: "Track relationship strength vs goals.",
    defaultData: {
      relationships: {
        family: { current: 50, goal: 80 },
        mentor: { current: 60, goal: 90 },
        friends: { current: 40, goal: 70 }
      },
      notes: "Call parents this weekend."
    },
    schema: [
      { key: "family.current", label: "Family: Status (%)", type: "slider", min: 0, max: 100 },
      { key: "family.goal", label: "Family: Goal (%)", type: "slider", min: 0, max: 100 },
      { key: "mentor.current", label: "Mentor: Status (%)", type: "slider", min: 0, max: 100 },
      { key: "mentor.goal", label: "Mentor: Goal (%)", type: "slider", min: 0, max: 100 },
      { key: "friends.current", label: "Friends: Status (%)", type: "slider", min: 0, max: 100 },
      { key: "friends.goal", label: "Friends: Goal (%)", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 4. COGNITIVE ---
  {
    id: "mental_bandwidth",
    name: "Mental Bandwidth",
    icon: Cpu,
    componentName: "MentalBandwidth",
    description: "Monitor cognitive load and stress.",
    defaultData: { 
      academicLoad: 60, 
      projectLoad: 20, 
      stressLevel: 30, 
      notes: "Feeling overwhelmed by finals." 
    },
    schema: [
      { key: "academicLoad", label: "Academic Load %", type: "slider", min: 0, max: 100 },
      { key: "projectLoad", label: "Project/Work Load %", type: "slider", min: 0, max: 100 },
      { key: "stressLevel", label: "Stress Level", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 5. CAREER ---
  {
    id: "employability_index",
    name: "Employability Index",
    icon: Briefcase,
    componentName: "EmployabilityIndex",
    description: "Track market-ready skills and projects.",
    defaultData: { 
      skillScore: 65, 
      projectCount: 3, 
      marketDemand: 80, 
      notes: "Need more React projects." 
    },
    schema: [
      { key: "skillScore", label: "Skill Mastery (Avg %)", type: "slider", min: 0, max: 100 },
      { key: "projectCount", label: "Portfolio Projects", type: "number", min: 0, max: 50 },
      { key: "marketDemand", label: "Market Alignment %", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 6. HEALTH ---
  {
    id: "body_stress_test",
    name: "Body Stress Test",
    icon: Heart,
    componentName: "BodyStressTest",
    description: "Monitor physical health metrics.",
    defaultData: { 
      sleepQuality: 70, 
      nutrition: 50, 
      exercise: 30, 
      notes: "Need to fix sleep schedule." 
    },
    schema: [
      { key: "sleepQuality", label: "Sleep Quality %", type: "slider", min: 0, max: 100 },
      { key: "nutrition", label: "Nutrition Quality %", type: "slider", min: 0, max: 100 },
      { key: "exercise", label: "Exercise Frequency %", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 7. PRODUCTIVITY ---
  {
    id: "commitment_stack",
    name: "Commitment Stack",
    icon: Rocket,
    componentName: "CommitmentStack",
    description: "Visualize upcoming deadline pressure.",
    defaultData: { 
      urgentTasks: 2, 
      upcomingTasks: 5, 
      clearanceRate: 80, 
      notes: "Math assignment due Friday." 
    },
    schema: [
      { key: "urgentTasks", label: "Urgent Tasks (< 48h)", type: "number", min: 0, max: 20 },
      { key: "upcomingTasks", label: "Upcoming Tasks (< 7d)", type: "number", min: 0, max: 50 },
      { key: "clearanceRate", label: "Task Clearance Rate %", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 8. LEARNING ---
  {
    id: "knowledge_decay",
    name: "Knowledge Decay",
    icon: Brain,
    componentName: "KnowledgeDecay",
    description: "Track retention of key subjects.",
    defaultData: { 
      subject1: 80, 
      subject2: 40, 
      subject3: 60, 
      notes: "Review Calculus formulas." 
    },
    schema: [
      { key: "subject1", label: "Subject 1 Retention %", type: "slider", min: 0, max: 100 },
      { key: "subject2", label: "Subject 2 Retention %", type: "slider", min: 0, max: 100 },
      { key: "subject3", label: "Subject 3 Retention %", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 9. EMOTIONAL ---
  {
    id: "mood_seismograph",
    name: "Mood Seismograph",
    icon: Smile,
    componentName: "MoodSeismograph",
    description: "Track emotional stability over time.",
    defaultData: { 
      currentMood: 70, 
      volatility: 20, 
      energy: 60, 
      notes: "Feeling energetic today." 
    },
    schema: [
      { key: "currentMood", label: "Current Mood (0-100)", type: "slider", min: 0, max: 100 },
      { key: "energy", label: "Energy Level", type: "slider", min: 0, max: 100 },
      { key: "volatility", label: "Volatility (Swings)", type: "slider", min: 0, max: 100 }
    ]
  },

  // --- 10. LONG TERM ---
  {
    id: "legacy_builder",
    name: "Legacy Builder",
    icon: Star,
    componentName: "LegacyBuilder",
    description: "Track long-term impact and achievements.",
    defaultData: { 
      impactScore: 45, 
      achievements: 2, 
      community: 30, 
      notes: "Mentored a junior student." 
    },
    schema: [
      { key: "impactScore", label: "Overall Impact Score", type: "slider", min: 0, max: 100 },
      { key: "achievements", label: "Major Achievements", type: "number", min: 0, max: 100 },
      { key: "community", label: "Community Contrib %", type: "slider", min: 0, max: 100 }
    ]
  }
];