// The interview UI is rendered by app/interview/layout.tsx, which owns the
// session state and needs to persist across this route and its siblings
// (review, complete). This page only needs to exist so /interview is routable.
export default function InterviewPage() {
  return null;
}
