import { InterviewQuestion } from "@/types/interview";

interface QuestionCardProps {
  question: InterviewQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const fieldClasses =
  "w-full rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-base text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export default function QuestionCard({ question, value, onChange, error }: QuestionCardProps) {
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
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
