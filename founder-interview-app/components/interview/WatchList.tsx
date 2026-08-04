interface WatchListProps {
  items: string[];
}

export default function WatchList({ items }: WatchListProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Watch List</h2>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="mt-0.5 text-amber-600 dark:text-amber-500" aria-hidden>
              ●
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
