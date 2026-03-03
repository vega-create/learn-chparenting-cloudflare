"use client";
import ParentGuide, { type GuideContent } from "@/components/ParentGuide";

interface Props {
  unitTitle: string;
  unitId: string;
  level: string;
  toolSlug: string;
  toolName: string;
  ebookSlug: string;
  color: string;
  guide: GuideContent;
  pdfUrl?: string;
  nextGuideUrl?: string;
  unitUrl: string;
}

export default function GuidePageClient(props: Props) {
  return <ParentGuide {...props} />;
}
