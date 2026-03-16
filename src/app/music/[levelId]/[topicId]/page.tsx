import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    // intro
    { levelId: "intro", topicId: "notes" },
    { levelId: "intro", topicId: "rhythm" },
    { levelId: "intro", topicId: "pitch" },
    // basic
    { levelId: "basic", topicId: "scales" },
    { levelId: "basic", topicId: "intervals" },
    { levelId: "basic", topicId: "dynamics" },
    // advanced
    { levelId: "advanced", topicId: "chords" },
    { levelId: "advanced", topicId: "form" },
    { levelId: "advanced", topicId: "knowledge" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
