import Link from "next/link";
import { OpportunitySnapshot as OpportunitySnapshotData } from "@/src/domain/opportunity/snapshot-model";
import { Recommendation } from "@/src/domain/recommendation/models/recommendation";
import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";
import { NextMove } from "@/src/domain/route-decision/mapper/next-move-mapper";
import { Explanation } from "@/src/domain/decision/models/decision";
import FounderSummary from "./FounderSummary";
import OpportunityOverview from "./OpportunityOverview";
import StrengthsList from "./StrengthsList";
import WatchList from "./WatchList";
import RecommendedActions from "./RecommendedActions";
import TopOpportunities from "./TopOpportunities";
import NextMoveCard from "./NextMoveCard";

interface OpportunitySnapshotProps {
  snapshot: OpportunitySnapshotData;
  recommendations: Recommendation[];
  matches: OpportunityMatch[];
  nextMove: NextMove;
  explanation: Explanation;
  onRestart: () => void;
}

export default function OpportunitySnapshot({
  snapshot,
  recommendations,
  matches,
  nextMove,
  explanation,
  onRestart,
}: OpportunitySnapshotProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Your Opportunity Snapshot</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Based on the answers you just gave - no AI, just a first structured read on your idea.
      </p>

      <div className="mt-6">
        <NextMoveCard nextMove={nextMove} explanation={explanation} />
      </div>

      <div className="mt-6 space-y-6 divide-y divide-zinc-200 [&>section:not(:first-child)]:pt-6 dark:divide-zinc-800">
        <FounderSummary sentences={snapshot.founderSummary} />
        <OpportunityOverview overview={snapshot.overview} />
        <StrengthsList items={snapshot.strengths} />
        <WatchList items={snapshot.watchList} />
        <TopOpportunities matches={matches} />
        <RecommendedActions recommendations={recommendations} />
      </div>

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
