# Decision Engine

## Purpose
Defines the branching logic that determines which question or path is surfaced next in the interview, based on prior answers.

## Principles
- Branching should reduce founder fatigue by skipping irrelevant questions
- Every branch decision should be traceable to a specific prior answer
- The engine should degrade gracefully - if a signal is missing, default to the general path

## Example Branch Logic

IF founder has started a business before:
  -> ask "What happened, and what did you learn?"
  ELSE:
    -> skip to "Why this idea, and why now?"

    IF founder has NOT talked to potential customers:
      -> flag "Missing Topic: Market Signal" for the audit
        -> ask a lighter-weight substitute question instead

        IF stated capital is below $5,000 AND idea requires physical inventory:
          -> flag "Constraint Risk: Capital vs. Business Model"

## Inputs
- Founder's real-time answers
- Question Bank.md

## Outputs
- Ordered, personalized question sequence
- Flags passed to Scoring Engine.md

## Status
Draft v0.1 - logic shown is illustrative; needs a real rule set defined during build.
