export const SHARE_CONFIG = {
  syllabus: {
    title: (data) => `Syllabus: ${data.subjectName} (${data.subjectCode})`,
    text: (data) => `📚 **${data.subjectName} Syllabus**\nBranch: ${data.branchId} | Sem: ${data.semester}\n\n🚀 **Smart Analysis:**\n• Unit-wise breakdown\n• Video Resources\n\nView the smart syllabus for free here 👇`.trim(),
  },
  app: {
    title: () => "ConnectInfinity - The Student Super App",
    text: () => `🚀 **Upgrade Your College Life!**\nSyllabus, Resumes, Notes, and AI Tools - All in one place.\n\nJoin thousands of students using ConnectInfinity. It's Free! 👇`.trim(),
  }
};