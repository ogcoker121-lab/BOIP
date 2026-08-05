import Link from "next/link";
import { getOpportunityById } from "@/src/domain/opportunity";

export default async function SideHustlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = getOpportunityById(id);

  if (!opportunity) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Opportunity not found</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          We couldn&apos;t find an opportunity with the id &ldquo;{id}&rdquo;.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Side-Hustle Launch Plan - {opportunity.id}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{opportunity.title}</h1>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        A full seven-day action plan is a later BOIP release. For now, here&apos;s what we know from the Starter
        Opportunity Library - curated BOIP knowledge, not a personalised plan yet.
      </div>

      <p className="mt-6 text-base text-zinc-700 dark:text-zinc-300">{opportunity.description}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Realistic startup cost</dt>
          <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">{opportunity.capitalRequired}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Weekly time needed</dt>
          <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            From about {opportunity.minWeeklyHours} hours a week
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          First-customer route
        </h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{opportunity.firstAction}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Worth knowing</h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{opportunity.mainLimitation}</p>
      </div>

      <Link href="/" className="mt-8 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
        Back to home
      </Link>
    </main>
  );
}
