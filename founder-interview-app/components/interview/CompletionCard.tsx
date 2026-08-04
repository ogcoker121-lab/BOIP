import Link from "next/link";

interface CompletionCardProps {
  onRestart: () => void;
}

export default function CompletionCard({ onRestart }: CompletionCardProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">You&apos;re all set</h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        Thanks for completing the Founder Discovery Interview. Your answers have been submitted.
      </p>
      <Link
        href="/"
        onClick={onRestart}
        className="mt-8 inline-flex items-center justify-center rounded-md bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to home
      </Link>
    </div>
  );
}
