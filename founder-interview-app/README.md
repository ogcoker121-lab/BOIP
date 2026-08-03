# Founder Discovery Interview (MVP v0.1)

A minimal Next.js app implementing the BOIP Founder Discovery Interview
workflow: landing page -> 10-question interview -> review -> submit ->
completion.

Scope is intentionally narrow: no AI, no auth, no database, no scoring,
no API, no persistence. Answers live in React state for the duration of
the session.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `data/questions.ts` - the 10 interview questions (data, not UI)
- `types/interview.ts` - the `InterviewQuestion` shape
- `components/interview/` - Interview, QuestionCard, ProgressBar,
  NavigationButtons, ReviewAnswers, CompletionCard
- `app/` - routes: `/`, `/interview`, `/interview/review`,
  `/interview/complete`
