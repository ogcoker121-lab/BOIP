import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";
import OpportunityCard from "./OpportunityCard";

interface TopOpportunitiesProps {
  matches: OpportunityMatch[];
}

export default function TopOpportunities({ matches }: TopOpportunitiesProps) {
  if (matches.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Your Top Opportunities
      </h2>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        From the Starter Opportunity Library - curated BOIP knowledge, not live market listings.
      </p>
      <ul className="mt-3 space-y-3">
        {matches.map((match) => (
          <OpportunityCard key={match.opportunity.id} match={match} />
        ))}
      </ul>
    </section>
  );
}
