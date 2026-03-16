"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FINANCE_MODULES } from "@/data/finance/modules";
import MoneyBasics from "./MoneyBasics";
import NeedsVsWants from "./NeedsVsWants";
import SavingsCalculator from "./SavingsCalculator";
import AllowanceBudget from "./AllowanceBudget";
import RedEnvelope from "./RedEnvelope";
import ExpenseTracker from "./ExpenseTracker";

const COMPONENTS: Record<string, React.ComponentType> = {
  "money-basics": MoneyBasics,
  "needs-vs-wants": NeedsVsWants,
  "savings-calculator": SavingsCalculator,
  "allowance-budget": AllowanceBudget,
  "red-envelope": RedEnvelope,
  "expense-tracker": ExpenseTracker,
};

export default function FinanceModulePage() {
  const params = useParams();
  const moduleId = params.module as string;
  const mod = FINANCE_MODULES.find((m) => m.id === moduleId);
  const Component = COMPONENTS[moduleId];

  if (!mod || !Component) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">找不到這個模組</p>
        <Link href="/finance" className="text-purple-500 hover:underline no-underline mt-4 inline-block">← 回到兒童理財</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/finance" className="text-sm text-purple-500 hover:underline no-underline">← 回到兒童理財</Link>
      <div className="text-center mt-4 mb-6">
        <div className="text-4xl mb-2">{mod.icon}</div>
        <h1 className="text-2xl font-black text-slate-800">{mod.title}</h1>
        <p className="text-sm text-slate-500">{mod.description}</p>
      </div>
      <Component />
    </div>
  );
}
