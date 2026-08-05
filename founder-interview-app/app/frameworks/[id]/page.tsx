import Link from "next/link";
import { resolveFrameworkPage } from "@/src/domain/framework-explorer";
import { frameworkRegistry } from "@/src/domain/framework";
import EmptyState from "@/components/shared/EmptyState";

// Every framework id is known at build time (a fixed, curated
// registry, not open-ended user content) - pre-rendering all of them
// statically means a request for /frameworks/FW-001 is served from the
// build output instead of resolving the page fresh per request. Purely
// a rendering-time change: resolveFrameworkPage's own output is
// identical either way, and any id outside this list still falls back
// to on-demand rendering (and the same not-found EmptyState below) as
// before.
export function generateStaticParams() {
  return Object.keys(frameworkRegistry).map((id) => ({ id }));
}

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
        <EmptyState
          title="Framework not found"
          message={`We couldn't find a framework with the id “${id}”.`}
          action={{ href: "/", label: "Back to home" }}
        />
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

      {(page.relatedCapability || page.leadsTo || page.usedBy.length > 0) && (
        <div className="mt-8 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Capability
          </h2>
          <dl className="mt-2 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Capability</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">{page.capability}</dd>
            </div>
            {page.relatedCapability && (
              <div>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">Related capability</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{page.relatedCapability}</dd>
              </div>
            )}
            {page.usedBy.length > 0 && (
              <div>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">Used by</dt>
                <dd className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                  {page.usedBy.map((reference) => (
                    <span key={reference.id} className="font-medium text-zinc-900 dark:text-zinc-50">
                      {reference.title}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {page.leadsTo && (
              <div>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">Leads to</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{page.leadsTo}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {page.relatedFrameworks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Related frameworks
          </h2>
          <ul className="mt-2 space-y-1.5">
            {page.relatedFrameworks.map((framework) => (
              <li key={framework.id}>
                <Link
                  href={`/frameworks/${framework.id}`}
                  className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-50"
                >
                  {framework.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {page.nextRecommendedFramework && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Recommended next framework
          </h2>
          <Link
            href={`/frameworks/${page.nextRecommendedFramework.id}`}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Explore {page.nextRecommendedFramework.title}
          </Link>
        </div>
      )}

      <Link href="/" className="mt-10 block text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
        Back to home
      </Link>
    </main>
  );
}
