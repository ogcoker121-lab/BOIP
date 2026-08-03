# Scoring Engine

## Purpose
Converts a founder's interview answers into quantified scores across defined dimensions, to be used by the Business Recommendation Engine.

## Scoring Dimensions (proposed)
1. Problem Clarity (0-10)
2. Market Signal Strength (0-10)
3. Founder-Market Fit (0-10)
4. Resource Readiness (0-10)
5. Risk Alignment (0-10)

## Method
- Each dimension is scored from specific interview answers (mapped in Question Bank.md)
- Scores are weighted and combined into a single Opportunity Readiness Score (0-100)
- Weighting should reference Module 18 (BOIP Opportunity Scoring System) in the main curriculum for consistency

## Example Weighting (draft)
- Problem Clarity: 20%
- Market Signal Strength: 25%
- Founder-Market Fit: 20%
- Resource Readiness: 20%
- Risk Alignment: 15%

## Outputs
- Per-dimension scores
- Composite Opportunity Readiness Score
- Passed to Business Recommendation Engine.md

## Status
Draft v0.1 - weights are placeholders pending calibration against real founder data.
