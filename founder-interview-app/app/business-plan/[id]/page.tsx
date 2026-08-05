import Link from "next/link";
import { getOpportunityById, opportunityLibrary } from "@/src/domain/opportunity";
import { resolveFrameworks } from "@/src/domain/framework";
import EmptyState from "@/components/shared/EmptyState";

// Every opportunity id is known at build time (the curated Starter
// Opportunity Library, not user content) - see the matching comment in
// app/frameworks/[id]/page.tsx for why this is safe to pre-render.
export function generateStaticParams() {
  return opportunityLibrary.map((opportunity) => ({ id: opportunity.id }));
}

export default async function BusinessPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = getOpportunityById(id);

  if (!opportunity) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <EmptyState
          title="Opportunity not found"
          message={`We couldn't find an opportunity with the id “${id}”.`}
          action={{ href: "/", label: "Back to home" }}
        />
      </main>
    );
  }

  const frameworks = resolveFrameworks(opportunity.frameworkReferences);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Business Plan - {opportunity.id}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{opportunity.title}</h1>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Full deterministic business plan generation (executive summary, pricing, 30-day launch plan, and more) is a later
        BOIP release. For now, here&apos;s what we know about this opportunity from the Starter Opportunity Library -
        curated BOIP knowledge, not a personalised plan yet.
      </div>

      <p className="mt-6 text-base text-zinc-700 dark:text-zinc-300">{opportunity.description}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Revenue model</dt>
          <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">{opportunity.revenueModel}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Capital required</dt>
          <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">{opportunity.capitalRequired}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Time to revenue</dt>
          <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">{opportunity.timeToRevenue}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">First action</h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{opportunity.firstAction}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Main limitation</h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{opportunity.mainLimitation}</p>
      </div>

      {frameworks.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Relevant frameworks
          </h2>
          <ul className="mt-1 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            {frameworks.map((framework) => (
              <li key={framework.id}>
                <span className="font-medium">{framework.name}</span> - {framework.summary}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/" className="mt-8 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
        Back to home
      </Link>
    </main>
  );
}
