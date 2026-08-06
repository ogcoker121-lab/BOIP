import Link from "next/link";

// The shared shape for "there's nothing here" - an unresolved id, a
// domain lookup that returned null, a list with no items yet. This is
// the UI half of BOIP's null -> empty state convention: domains never
// throw on a missing id (see e.g. resolveFrameworkPage, getOpportunityById),
// they return null, and every page that gets null renders this instead of
// duplicating its own title/message/back-link markup. Deliberately has no
// outer <main> wrapper - callers already control their own page chrome.
interface EmptyStateAction {
  href: string;
  label: string;
}

interface EmptyStateProps {
  title: string;
  message: string;
  action?: EmptyStateAction;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
