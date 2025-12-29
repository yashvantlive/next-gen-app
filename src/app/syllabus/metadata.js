export function generateMetadata({ searchParams }) {
  const syllabusId = searchParams?.id;

  if (!syllabusId) {
    return {
      title: "Syllabus - ConnectInfinity",
      description: "Engineering syllabus for all branches",
    };
  }

  return {
    title: "Engineering Syllabus | ConnectInfinity",
    description:
      "Branch-wise engineering syllabus with units, topics, PYQs and resources.",
    openGraph: {
      title: "Engineering Syllabus",
      description: "Free syllabus access for engineering students",
      type: "article",
    },
  };
}
