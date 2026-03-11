interface ToolIntroProps {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
}

export function ToolIntroSection({ badge, title, description, highlights }: ToolIntroProps) {
  return (
    <section className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <span className="inline-block text-xs font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full mb-3">
        {badge}
      </span>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
      <ul className="space-y-1">
        {highlights.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500 font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
