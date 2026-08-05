import { InterviewQuestion } from "@/types/interview";

interface QuestionCardProps {
  question: InterviewQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const fieldClasses =
  "w-full rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-base text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

function parseSelections(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function QuestionCard({ question, value, onChange, error }: QuestionCardProps) {
  const selections = question.type === "multi-select" ? parseSelections(value) : [];

  return (
    <div>
      <label htmlFor={question.id} className="block text-xl font-medium text-zinc-900 dark:text-zinc-50">
        {question.question}
        {question.required && <span className="ml-1 text-red-500">*</span>}
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
            className={fieldClasses}
          />
        )}

        {question.type === "select" && (
          <select
            id={question.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby={question.id}>
              {question.options?.map((option) => {
                const isSelected = selections.includes(option);
                const atLimit = question.maxSelections !== undefined && selections.length >= question.maxSelections;
                return (
                  <button
                    key={option}
                    type="button"
                    id={option === question.options?.[0] ? question.id : undefined}
                    aria-pressed={isSelected}
                    disabled={!isSelected && atLimit}
                    onClick={() => {
                      if (isSelected) {
                        onChange(selections.filter((item) => item !== option).join(","));
                      } else if (!atLimit) {
                        onChange([...selections, option].join(","));
                      }
                    }}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
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

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
