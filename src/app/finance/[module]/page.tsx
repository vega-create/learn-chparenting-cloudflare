import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [
    { module: "money-basics" },
    { module: "needs-vs-wants" },
    { module: "savings-calculator" },
    { module: "allowance-budget" },
    { module: "red-envelope" },
    { module: "expense-tracker" },
  ];
}

export default function Page() {
  return <ClientPage />;
}
