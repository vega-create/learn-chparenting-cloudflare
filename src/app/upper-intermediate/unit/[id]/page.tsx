import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return Array.from({ length: 40 }, (_, i) => ({ id: String(i + 1) }));
}

export default function Page() {
  return <ClientPage />;
}
