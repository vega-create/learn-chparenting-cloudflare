import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    { topic: "basic-arithmetic" },
    { topic: "fractions" },
    { topic: "decimals" },
    { topic: "percentages" },
    { topic: "geometry" },
    { topic: "intro-algebra" },
    { topic: "word-problems" },
    { topic: "time-measurement" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
