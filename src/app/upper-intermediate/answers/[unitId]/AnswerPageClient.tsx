"use client";
import AnswerPage from "@/components/AnswerPage";

interface Props {
  unitTitle: string;
  unitId: string;
  level: string;
  toolSlug: string;
  toolName: string;
  ebookSlug: string;
  color: string;
  answers: { question: string; options: string[]; answer: number; explanation: string }[];
  nextUnitUrl?: string;
  pdfUrl?: string;
}

export default function AnswerPageClient(props: Props) {
  return <AnswerPage {...props} />;
}