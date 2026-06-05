import ClientPage from "./ClientPage";
import { UI_UNITS } from "@/data/upper-intermediate";
import { LEVELS, generateUnitMetadata, UnitSEOInput } from "@/lib/unit-seo";
import UnitSEOContent from "@/components/seo/UnitSEOContent";
import type { Metadata } from "next";

const LEVEL = LEVELS["upper-intermediate"];

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: LEVEL.totalUnits }, (_, i) => ({ id: String(i + 1) }));
}

function getUnitSeoData(uid: number): UnitSEOInput | undefined {
  const u = UI_UNITS.find(x => x.id === uid);
  if (!u) return undefined;
  const listeningCount = Array.isArray(u.listening) ? u.listening.length : 0;
  return {
    id: u.id, title: u.title, icon: u.icon,
    vocabCount:    u.vocab.length,
    grammarCount:  u.grammar.length,
    listeningCount,
    vocabPreview:  u.vocab.slice(0, 6).map(v => v.en),
    grammarPreview: u.grammar.slice(0, 3).map(g => g.title),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return generateUnitMetadata(LEVEL, getUnitSeoData(Number(id)));
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const uid = Number(id);
  const unit = UI_UNITS.find(u => u.id === uid);
  const seo  = getUnitSeoData(uid);

  return (
    <>
      <ClientPage />
      {unit && seo && (
        <UnitSEOContent
          level={LEVEL}
          unit={seo}
          vocabItems={unit.vocab.slice(0, 6).map(v => ({ display: v.en, zh: v.zh, ex: v.ex }))}
          grammarItems={unit.grammar.slice(0, 3).map(g => ({ title: g.title, explain: g.explain }))}
          prevUnit={UI_UNITS.find(u => u.id === uid - 1) && { id: uid - 1, title: UI_UNITS.find(u => u.id === uid - 1)!.title }}
          nextUnit={UI_UNITS.find(u => u.id === uid + 1) && { id: uid + 1, title: UI_UNITS.find(u => u.id === uid + 1)!.title }}
        />
      )}
    </>
  );
}
