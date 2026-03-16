import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    // lower
    { gradeId: "lower", topicId: "zhuyin" },
    { gradeId: "lower", topicId: "characters" },
    { gradeId: "lower", topicId: "vocabulary" },
    { gradeId: "lower", topicId: "reading" },
    // middle
    { gradeId: "middle", topicId: "idioms" },
    { gradeId: "middle", topicId: "reading" },
    { gradeId: "middle", topicId: "writing" },
    // high
    { gradeId: "high", topicId: "idioms" },
    { gradeId: "high", topicId: "reading" },
    { gradeId: "high", topicId: "grammar" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
