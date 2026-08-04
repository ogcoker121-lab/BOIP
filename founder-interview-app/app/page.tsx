import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          BOIP
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Founder Discovery Interview
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Answer ten short questions about you and your business idea. It
          takes about five minutes, and you can review everything before you
          submit.
        </p>
        <Link
          href="/interview"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start Interview
        </Link>
      </div>
    </main>
  );
}
