interface NextStepsProps {
  items: string[];
}

export default function NextSteps({ items }: NextStepsProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Recommended Next Steps
      </h2>
      <ol className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={item} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-900">
              {index + 1}
            </span>
            <span className="pt-0.5">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
