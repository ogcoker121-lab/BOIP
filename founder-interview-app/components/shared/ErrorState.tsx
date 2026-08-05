"use client";

// For the one case that isn't a missing id (EmptyState) - something
// actually went wrong (a crash, a failed request) and the founder needs
// a way forward. Client-only because retrying is an action, not a
// render of already-known data. Not wired into the domain layer itself:
// domains still never throw (null -> EmptyState, per the v0.6 review
// decision) - this exists for genuine runtime failures, e.g. a route
// error boundary.
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Try again
        </button>
      )}
    </div>
  );
}
