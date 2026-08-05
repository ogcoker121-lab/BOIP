# Accessibility Audit — v0.9.1 Platform Hardening

Manual audit against keyboard operability, focus visibility, semantic
structure, ARIA correctness, screen-reader behaviour, and colour
contrast (WCAG 2.1 AA). Every page and interactive component in the app
was reviewed; findings are listed most-to-least significant. Contrast
figures were computed directly from the WCAG relative-luminance formula
against the exact Tailwind hex values and background colours this app
actually uses (`app/globals.css`), not estimated.

This document is findings only — no fixes are made here. Each finding
is addressed in the following commit (see `git log` for
`fix(a11y): ...`).

## Findings

### 1. Focus indicator removed on every interview form field — High

`components/interview/QuestionCard.tsx`, `fieldClasses` (used by the
`text`, `textarea`, and `select` field types — 17 of the interview's 19
questions):

```
outline-none focus:border-zinc-500
```

The native browser focus outline is removed, leaving only a border
colour shift (`zinc-300` → `zinc-500`) as the sole focus indicator.
That shift is visually subtle and is the *only* signal a keyboard user
gets for which field currently has focus, across nearly the entire
interview.

### 2. Required fields carry no programmatic "required" signal — High

`components/interview/QuestionCard.tsx`: `question.required` currently
drives only a visual `*` (a plain `<span>`, no accessible name of its
own) next to the label. The underlying `<input>` / `<textarea>` /
`<select>` never gets the native `required` attribute or
`aria-required="true"`. A screen reader user has no way to know a field
is mandatory until after they try to advance and hit the inline error.

### 3. Validation error isn't associated with its field or announced — High

`components/interview/QuestionCard.tsx`: the inline error (`{error &&
<p>...}`) is rendered as a plain paragraph with:
- no `id` linked from the field via `aria-describedby`,
- no `role="alert"` (or equivalent live region), so its appearance
  isn't announced,
- no `aria-invalid="true"` set on the field itself.

A screen reader user who has moved focus away, or whose device doesn't
happen to re-scan the DOM, may never learn that an error appeared.

### 4. Multi-select group's accessible name is the first option's text, not the question — Medium

`components/interview/QuestionCard.tsx`, multi-select branch:

```tsx
<div className="..." role="group" aria-labelledby={question.id}>
  {question.options?.map((option) => (
    <button
      ...
      id={option === question.options?.[0] ? question.id : undefined}
```

`question.id` is only ever assigned to the *first option button*, not
to the actual question `<label>` above the field. For the one
multi-select question in the interview ("Which of these best describes
your strongest professional skills?"), a screen reader announces the
group's accessible name as **"Sales & Business Development"** (the
first option's label) instead of the actual question.

### 5. Repeated identical link/button text with no disambiguating accessible name — Medium

- `components/interview/ReviewAnswers.tsx`: up to 19 "Edit" buttons
  render in a row, one per interview question, all with the identical
  accessible name "Edit" and nothing distinguishing which question each
  one edits.
- `components/interview/RecommendationCard.tsx` and
  `components/interview/BusinessPlanView.tsx` (`SectionBlock`): every
  framework reference renders a "Learn More" link; a page with several
  recommendations or sections can show many identically-labelled links.

Both fail WCAG 2.4.4/2.4.9 under a screen reader's "list all
links"/"list all buttons" navigation, where surrounding context isn't
read.

### 6. Required-field asterisk and validation error text fall short of AA contrast in light mode — Medium

`text-red-500` (`#ef4444`) on this app's light-mode background
(`#ffffff`, from `app/globals.css`) measures **3.76:1** against the
WCAG relative-luminance formula — below the 4.5:1 threshold WCAG AA
requires for normal-size text. This class is used for both the
required-field `*` marker and the inline validation error message in
`QuestionCard.tsx`.

(Dark mode's implicit near-black background, `#0a0a0a`, scores 5.26:1
for the same red and passes. Every other text/background pairing this
app uses — all four priority badges, all three opportunity match-label
badges, and every muted `zinc-400`/`zinc-500` body-text colour in both
themes — was checked the same way and passes AA; see the computation
below.)

<details>
<summary>Contrast ratios computed (WCAG relative luminance, foreground vs. background)</summary>

| Pairing | Ratio | AA (4.5:1 normal text) |
|---|---|---|
| `zinc-500` on white | 4.83 | Pass |
| `zinc-400` on `#0a0a0a` | 7.72 | Pass |
| `zinc-600` on white | 7.73 | Pass |
| `zinc-700` on white | 10.44 | Pass |
| `red-500` on white | 3.76 | **Fail** |
| `red-500` on `#0a0a0a` | 5.26 | Pass |
| `red-700` on `red-100` (Critical badge, light) | 5.30 | Pass |
| `red-400` on `red-950` (Critical badge, dark) | 5.84 | Pass |
| `orange-700` on `orange-100` (High badge, light) | 4.52 | Pass |
| `orange-400` on `orange-950` (High badge, dark) | 6.92 | Pass |
| `amber-700` on `amber-100` (Medium badge, light) | 4.51 | Pass |
| `amber-400` on `amber-950` (Medium badge, dark) | 8.97 | Pass |
| `zinc-700` on `zinc-100` (Low badge, light) | 9.50 | Pass |
| `zinc-400` on `zinc-800` (Low badge, dark) | 5.81 | Pass |
| `green-700` on `green-100` (Best Match, light) | 4.57 | Pass |
| `green-400` on `green-950` (Best Match, dark) | 8.55 | Pass |
| `blue-700` on `blue-100` (Strong Alternative, light) | 5.49 | Pass |
| `blue-400` on `blue-950` (Strong Alternative, dark) | 5.78 | Pass |
| `amber-900` on `amber-50` (info banners, light) | 8.75 | Pass |
| `amber-200` on `amber-950` (info banners, dark) | 12.03 | Pass |

</details>

### 7. Progress bar conveys no semantic progress state — Low

`components/interview/ProgressBar.tsx` renders a purely decorative
`<div>` fill bar with no `role="progressbar"` / `aria-valuenow` /
`aria-valuemin` / `aria-valuemax`. The equivalent information
("Question X of Y", the percentage) is already present as visible text
right next to it, so no information is actually lost to screen reader
users today — the bar itself just has no accessible semantics of its
own if it's ever used without that adjacent text.

### 8. No skip-to-content link — Low, informational only

Every page renders its content directly, with no persistent
header/nav/sidebar to skip past today, so there's nothing for a skip
link to usefully skip yet. Noted only so it isn't forgotten if a
persistent nav is ever added.

## Verified clean (no action needed)

- **Heading hierarchy**: every page reviewed goes `h1` → `h2` → `h3`
  with no skipped levels (checked: landing, interview wizard, review,
  complete/snapshot, business plan, framework explorer, side-hustle,
  jobs, skills).
- **`<details>`/`<summary>`** ("Why BOIP recommended this",
  `components/interview/WhyBoipRecommended.tsx`): native element, fully
  keyboard- and screen-reader-accessible with zero extra ARIA needed.
- **Keyboard operability**: every interactive element in the app is a
  native `<button>`, `<a>`/`next/link`, `<input>`, `<textarea>`, or
  `<select>` — nothing relies on a non-interactive element with a
  click handler and no keyboard path.
- **Decorative icons**: existing checkmark/dot icons throughout
  (`StrengthsList`, `WatchList`, `RecommendationCard`,
  `WhyBoipRecommended`) are already correctly marked `aria-hidden` —
  this convention was already right before this audit and needs no
  change.
- **No images anywhere in the app** — no alt-text risk exists today.
- **`lang="en"`** is set on `<html>` in `app/layout.tsx`.
