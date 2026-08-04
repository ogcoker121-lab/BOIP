interface StrengthsListProps {
  items: string[];
}

export default function StrengthsList({ items }: StrengthsListProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Strengths</h2>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="mt-0.5 text-green-600 dark:text-green-500" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
