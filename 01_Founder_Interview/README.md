# 01_Founder_Interview

## Purpose
This module is the entry point of BOIP. It conducts a structured discovery interview with a founder, scores their responses, and generates a tailored business recommendation report. It is designed to be BOIP's first revenue-generating product: a standalone, guided intake experience that can operate on its own or feed into the wider 40-module BOIP curriculum (see /00_BOIP_ARCHITECTURE.md).

## How this folder fits into BOIP
This folder sits inside Level 1 (Opportunity Discovery). It is the product-facing implementation of modules 04 (Market Opportunity Analysis) and 05 (Customer Discovery), turned into an interactive interview experience rather than a static reference document.

## Files in this folder
- Founder Discovery Interview.md - the interview methodology and conversational structure
- Question Bank.md - the categorized question set the interview draws from
- Decision Engine.md - branching logic for which question/path comes next
- Scoring Engine.md - the rubric used to score founder responses
- Business Recommendation Engine.md - logic that converts scores into a recommendation
- Report Routing.md - how the final report is delivered and to which downstream systems
- UX Flow.md - step-by-step user experience of the interview
- API Specification.md - endpoints and payloads for programmatic integration
- MVP.md - scope definition for the first shippable version

## Status
Draft v0.1 - initial skeleton created. Content to be filled in collaboratively.
