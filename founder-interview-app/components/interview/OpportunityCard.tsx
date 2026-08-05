import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";

interface OpportunityCardProps {
  match: OpportunityMatch;
}

const LABEL_STYLES: Record<OpportunityMatch["matchLabel"], string> = {
  "Best Match": "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  "Strong Alternative": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  "Different Direction": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function OpportunityCard({ match }: OpportunityCardProps) {
  const { opportunity } = match;

  return (
    <li className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${LABEL_STYLES[match.matchLabel]}`}>
          {match.matchLabel}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{match.matchScore}/100 profile fit</span>
      </div>

      <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{opportunity.title}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{opportunity.description}</p>

      <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">Why it fits: </span>
        {match.whyItFits}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Relevant skills</dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
            {match.relevantSkills.length > 0 ? match.relevantSkills.join(", ") : "None of your listed skills directly"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Startup-budget fit</dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">{match.budgetFit}</dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Time to revenue</dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">{match.timeToRevenueFit}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">Main limitation: </span>
        {match.mainLimitation}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">First practical action: </span>
        {match.firstAction}
      </p>
    </li>
  );
}
