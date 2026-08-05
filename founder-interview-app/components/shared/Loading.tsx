// A single shared loading indicator - not page-specific. Any page or
// component that needs "content isn't ready yet" (data still resolving,
// a request in flight) renders this instead of its own ad-hoc text, so
// the app has one loading affordance rather than several inconsistent
// ones. Deliberately has no outer <main> wrapper - callers already
// control their own page chrome (see app/interview/layout.tsx), so this
// only owns the loading content itself.
interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading…" }: LoadingProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span
        aria-hidden
        className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50"
      />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}
