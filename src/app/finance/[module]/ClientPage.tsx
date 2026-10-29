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
        <Link href="/finance" className="text-[#2457A7] hover:underline no-underline mt-4 inline-block">← 回到兒童理財</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/finance" className="text-sm font-bold text-[#2457A7] hover:underline no-underline">← 回到兒童理財</Link>
      <div className="flex items-center gap-3 mt-4 mb-6">
        <span className="w-12 h-12 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl" aria-hidden="true">{mod.icon}</span>
        <div className="min-w-0">
          <div className="text-sm font-bold text-[#E65E83]">兒童理財</div>
          <h1 className="text-2xl md:text-3xl font-black text-[#263238] m-0 leading-tight">{mod.title}</h1>
          <p className="text-sm text-[#52616B] mt-1 mb-0">{mod.description}</p>
        </div>
      </div>
      <Component />
    </div>
  );
}
