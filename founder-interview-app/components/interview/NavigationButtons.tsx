interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  nextLabel?: string;
}

export default function NavigationButtons({
  onPrevious,
  onNext,
  canGoPrevious,
  nextLabel = "Next",
}: NavigationButtonsProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="rounded-md px-5 py-2.5 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        className="rounded-md bg-zinc-900 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {nextLabel}
      </button>
    </div>
  );
}
