import { InterviewQuestion } from "@/types/interview";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import NavigationButtons from "./NavigationButtons";

interface InterviewProps {
  question: InterviewQuestion;
  value: string;
  questionNumber: number;
  totalQuestions: number;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  error?: string;
  onAnswerChange: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Interview({
  question,
  value,
  questionNumber,
  totalQuestions,
  canGoPrevious,
  isLastQuestion,
  error,
  onAnswerChange,
  onNext,
  onPrevious,
}: InterviewProps) {
  return (
    <div>
      <ProgressBar current={questionNumber} total={totalQuestions} />
      <div className="mt-8">
        <QuestionCard question={question} value={value} onChange={onAnswerChange} error={error} />
      </div>
      <NavigationButtons
        onPrevious={onPrevious}
        onNext={onNext}
        canGoPrevious={canGoPrevious}
        nextLabel={isLastQuestion ? "Review Answers" : "Next"}
      />
    </div>
  );
}
