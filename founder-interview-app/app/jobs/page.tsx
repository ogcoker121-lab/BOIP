import Link from "next/link";

export default function JobsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Job and Career Guidance</h1>
      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Deterministic job-family and career guidance based on your profile is a later BOIP release. Live vacancy search is
        a release after that, and only once BOIP is connected to a real job-data provider - we won&apos;t show fabricated
        listings or invented application links before then.
      </div>
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
        Back to home
      </Link>
    </main>
  );
}
