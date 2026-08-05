import Link from "next/link";
import { Recommendation } from "@/src/domain/recommendation";
import { resolveFrameworks } from "@/src/domain/framework";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const PRIORITY_STYLES: Record<Recommendation["priority"], string> = {
  Critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Low: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const frameworks = resolveFrameworks(recommendation.frameworkReferences);

  return (
    <li className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[recommendation.priority]}`}
      >
        {recommendation.priority}
      </span>
      <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{recommendation.title}</h3>

      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">Why: </span>
        {recommendation.reason}
      </p>

      <ul className="mt-3 space-y-1.5">
        {recommendation.actions.map((action) => (
          <li key={action} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="mt-0.5 text-green-600 dark:text-green-500" aria-hidden>
              ✓
            </span>
            {action}
          </li>
        ))}
      </ul>

      <dl className="mt-4 flex gap-6 text-xs">
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Estimated effort</dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">{recommendation.estimatedEffort}</dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Expected impact</dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">{recommendation.estimatedImpact}</dd>
        </div>
      </dl>

      {frameworks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          {frameworks.map((framework) => (
            <span key={framework.id}>
              {framework.name}{" "}
              <Link
                href={`/frameworks/${framework.id}`}
                aria-label={`Learn more about ${framework.name}`}
                className="font-medium text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
              >
                Learn More
              </Link>
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
