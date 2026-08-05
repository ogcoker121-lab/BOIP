import Link from "next/link";
import { NextMove } from "@/src/domain/route-decision/mapper/next-move-mapper";
import { Explanation } from "@/src/domain/decision/models/decision";
import WhyBoipRecommended from "./WhyBoipRecommended";

interface NextMoveCardProps {
  nextMove: NextMove;
  explanation: Explanation;
}

export default function NextMoveCard({ nextMove, explanation }: NextMoveCardProps) {
  return (
    <section className="rounded-lg border border-zinc-900 p-5 dark:border-zinc-50">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Your Next Move</h2>
      <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{nextMove.title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{nextMove.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={nextMove.primaryActionRoute}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {nextMove.primaryActionLabel}
        </Link>
        {nextMove.secondaryActionLabel && nextMove.secondaryActionRoute && (
          <Link
            href={nextMove.secondaryActionRoute}
            className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
          >
            {nextMove.secondaryActionLabel}
          </Link>
        )}
      </div>

      <WhyBoipRecommended explanation={explanation} />
    </section>
  );
}
