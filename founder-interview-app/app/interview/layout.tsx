import { ReactNode } from "react";
import { InterviewProvider } from "./context/InterviewContext";

export default function InterviewLayout({ children }: { children: ReactNode }) {
  return (
    <InterviewProvider>
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">{children}</main>
    </InterviewProvider>
  );
}
