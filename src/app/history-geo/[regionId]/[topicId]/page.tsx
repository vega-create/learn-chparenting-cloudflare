import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    // taiwan
    { regionId: "taiwan", topicId: "taiwan-history" },
    { regionId: "taiwan", topicId: "taiwan-geography" },
    { regionId: "taiwan", topicId: "taiwan-culture" },
    // asia
    { regionId: "asia", topicId: "asia-history" },
    { regionId: "asia", topicId: "asia-geography" },
    // world
    { regionId: "world", topicId: "world-history" },
    { regionId: "world", topicId: "world-geography" },
    { regionId: "world", topicId: "world-culture" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
