import { OpportunityOverview as OpportunityOverviewData } from "@/src/domain/opportunity/snapshot-model";

interface OpportunityOverviewProps {
  overview: OpportunityOverviewData;
}

export default function OpportunityOverview({ overview }: OpportunityOverviewProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Stage", value: overview.stage },
    { label: "Industry", value: overview.industry },
    { label: "Customer", value: overview.customer },
    { label: "Revenue", value: overview.revenueModel },
    { label: "Market", value: overview.marketType },
  ];

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Opportunity Overview
      </h2>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">{row.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
