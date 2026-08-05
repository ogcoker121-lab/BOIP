import { Explanation } from "@/src/domain/decision";

interface WhyBoipRecommendedProps {
  explanation: Explanation;
}

// Optional, collapsed by default - a native <details> so it needs no
// client-side state. Nothing here is computed in this component; every
// word comes from Explanation, itself generated entirely from the
// Decision engine's evaluations (see src/domain/decision/trace/).
export default function WhyBoipRecommended({ explanation }: WhyBoipRecommendedProps) {
  if (explanation.bullets.length === 0) return null;

  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-medium text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300">
        Why BOIP recommended this
      </summary>
      <div className="mt-3 rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{explanation.headline}</p>
        <ul className="mt-2 space-y-1.5">
          {explanation.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="mt-0.5 text-emerald-600 dark:text-emerald-500" aria-hidden>
                ✓
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
