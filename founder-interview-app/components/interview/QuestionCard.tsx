import { InterviewQuestion } from "@/types/interview";

interface QuestionCardProps {
  question: InterviewQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const fieldClasses =
  "w-full rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-base text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-400";

function parseSelections(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function QuestionCard({ question, value, onChange, error }: QuestionCardProps) {
  const selections = question.type === "multi-select" ? parseSelections(value) : [];
  const labelId = `${question.id}-label`;
  const errorId = `${question.id}-error`;

  return (
    <div>
      <label id={labelId} htmlFor={question.id} className="block text-xl font-medium text-zinc-900 dark:text-zinc-50">
        {question.question}
        {question.required && (
          <span className="ml-1 text-red-600 dark:text-red-400" aria-hidden>
            *
          </span>
        )}
      </label>
      {question.description && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{question.description}</p>
      )}

      <div className="mt-4">
        {question.type === "textarea" && (
          <textarea
            id={question.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            required={question.required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={fieldClasses}
          />
        )}

        {question.type === "text" && (
          <input
            id={question.id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={fieldClasses}
          />
        )}

        {question.type === "select" && (
          <select
            id={question.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={fieldClasses}
          >
            <option value="" disabled>
              Select an option
            </option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {question.type === "multi-select" && (
          <div>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-labelledby={labelId}
              aria-describedby={error ? errorId : undefined}
            >
              {question.options?.map((option) => {
                const isSelected = selections.includes(option);
                const atLimit = question.maxSelections !== undefined && selections.length >= question.maxSelections;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={!isSelected && atLimit}
                    onClick={() => {
                      if (isSelected) {
                        onChange(selections.filter((item) => item !== option).join(","));
                      } else if (!atLimit) {
                        onChange([...selections, option].join(","));
                      }
                    }}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors outline-none focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 dark:focus:ring-zinc-400 ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                        : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {question.maxSelections !== undefined && (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {selections.length} of {question.maxSelections} selected
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
