import Link from "next/link";
import { resolveFrameworkPage } from "@/src/domain/framework-explorer/resolver/framework-explorer-resolver";

// BOIP's first Learning Capability: not a business plan generator, not
// AI - a deterministic page resolved entirely from the Knowledge
// Catalog (v0.7) plus this domain's own framework guidance knowledge.
// Server component, no client state - every field is already resolved
// before render.
export default async function FrameworkExplorerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = resolveFrameworkPage(id);

  if (!page) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Framework not found</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          We couldn&apos;t find a framework with the id &ldquo;{id}&rdquo;.
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
        Framework - {page.id}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{page.title}</h1>
      <span className="mt-2 inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {page.capability}
      </span>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">What it is</h2>
        <p className="mt-1 text-base text-zinc-700 dark:text-zinc-300">{page.whatItIs}</p>
      </div>

      {page.whyRecommended && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Why BOIP recommended it
          </h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{page.whyRecommended}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          When to use it
        </h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{page.whenToUse}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Expected outcome
        </h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{page.expectedOutcome}</p>
      </div>

      {page.commonMistakes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Common mistakes
          </h2>
          <ul className="mt-2 space-y-1.5">
            {page.commonMistakes.map((mistake) => (
              <li key={mistake} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="mt-0.5 text-amber-600 dark:text-amber-500" aria-hidden>
                  ●
                </span>
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/" className="mt-10 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
        Back to home
      </Link>
    </main>
  );
}
