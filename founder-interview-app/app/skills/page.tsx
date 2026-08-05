import Link from "next/link";

export default function SkillsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Skill-Building Options</h1>
      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Specific, deterministic skill-building recommendations - courses, qualifications, practical routes to close the
        gap BOIP identified - are a later release. For now, this confirms BOIP has flagged that building a skill would
        materially improve your options before recommending a specific business or side hustle.
      </div>
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
        Back to home
      </Link>
    </main>
  );
}
