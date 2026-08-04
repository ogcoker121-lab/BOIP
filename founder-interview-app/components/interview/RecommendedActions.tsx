import { Recommendation } from "@/src/domain/recommendation/models/recommendation";
import RecommendationCard from "./RecommendationCard";

interface RecommendedActionsProps {
  recommendations: Recommendation[];
}

export default function RecommendedActions({ recommendations }: RecommendedActionsProps) {
  if (recommendations.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Recommended Actions
      </h2>
      <ul className="mt-3 space-y-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </ul>
    </section>
  );
}
