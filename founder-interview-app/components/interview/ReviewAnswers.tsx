import { InterviewAnswers, InterviewQuestion } from "@/types/interview";

interface ReviewAnswersProps {
  questions: InterviewQuestion[];
  answers: InterviewAnswers;
  onEdit: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ReviewAnswers({ questions, answers, onEdit, onBack, onSubmit }: ReviewAnswersProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Review your answers</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Check everything looks right before you submit. You can edit any answer.
      </p>

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {questions.map((question, index) => {
          const value = answers[question.id]?.trim();
          return (
            <li key={question.id} className="flex items-start justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{question.question}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {value ? value : <span className="italic text-zinc-400 dark:text-zinc-600">No answer</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEdit(index)}
                aria-label={`Edit: ${question.question}`}
                className="shrink-0 text-sm font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
              >
                Edit
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md px-5 py-2.5 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-md bg-zinc-900 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
