interface FounderSummaryProps {
  sentences: string[];
}

export default function FounderSummary({ sentences }: FounderSummaryProps) {
  if (sentences.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Founder Summary
      </h2>
      <p className="mt-2 text-lg text-zinc-900 dark:text-zinc-50">{sentences.join(" ")}</p>
    </section>
  );
}
