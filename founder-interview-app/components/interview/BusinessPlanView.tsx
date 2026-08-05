import Link from "next/link";
import { BusinessPlan, BusinessPlanSection } from "@/src/domain/business-plan/models/business-plan";

interface BusinessPlanViewProps {
  plan: BusinessPlan;
}

// content lines are already fully rendered by templates/ - this only
// decides how a line looks (bucket header, bullet, or paragraph) based
// on its own shape ("Days 1-30:" vs "- item" vs plain text). No prose
// is written here.
function SectionBlock({ section }: { section: BusinessPlanSection }) {
  if (section.content.length === 0 && section.recommendedFrameworks.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {section.title}
      </h2>
      <div className="mt-2 space-y-1.5">
        {section.content.map((line, index) =>
          line.startsWith("- ") ? (
            <p key={index} className="pl-4 text-sm text-zinc-700 dark:text-zinc-300">
              {line}
            </p>
          ) : line.endsWith(":") ? (
            <p key={index} className="mt-3 text-sm font-medium text-zinc-900 first:mt-0 dark:text-zinc-50">
              {line}
            </p>
          ) : (
            <p key={index} className="text-sm text-zinc-700 dark:text-zinc-300">
              {line}
            </p>
          ),
        )}
      </div>

      {section.recommendedFrameworks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          {section.recommendedFrameworks.map((framework) => (
            <span key={framework.id}>
              {framework.title}{" "}
              <Link
                href={`/frameworks/${framework.id}`}
                className="font-medium text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
              >
                Learn More
              </Link>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default function BusinessPlanView({ plan }: BusinessPlanViewProps) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Business Plan</p>
      <h1 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{plan.title}</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Assembled entirely from your interview answers and BOIP&apos;s existing knowledge - no AI, nothing invented.
      </p>

      <div className="mt-6 space-y-6 divide-y divide-zinc-200 [&>section:not(:first-child)]:pt-6 dark:divide-zinc-800">
        {plan.sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>

      <Link
        href="/interview/complete"
        className="mt-8 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
      >
        Back to snapshot
      </Link>
    </div>
  );
}
