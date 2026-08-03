# BOIP Architecture

**Version:** BOIP Curriculum v1.0
**Status:** Frozen (modules 01-38 and 40 locked; slot 39 reserved)

## 1. Philosophy

BOIP (Business Opportunity Intelligence Platform) is not a folder of business documents. It is a curriculum that doubles as a reasoning engine. Every module teaches a human founder a specific business discipline, and simultaneously teaches an AI system what to know and when to consult it.

Two structures run through BOIP at once:

- Business Knowledge: Lean Startup, Marketing, Finance, Strategy, and the other traditional business subjects.
- BOIP Intelligence: Knowledge Architecture, Master Prompt, Workflow, Opportunity Scoring, and Meta-Reasoning/Integration, the modules that teach BOIP how to think rather than what to know.

Keeping these two structures conceptually separate is what keeps future development clean as BOIP grows.

## 2. The Five Levels

### Level 1 - Opportunity Discovery (Modules 01-10)
Answers: "Is there an opportunity worth pursuing?" Takes a founder from raw idea through mindset, ideation, design, market sizing, customer validation, psychology, competition, external environment, and industry structure.

### Level 2 - Business Design (Modules 11-18)
Answers: "What business should we build?" Covers business model design and alternatives, pricing, the three BOIP system modules, founder coaching, and the final opportunity scoring decision.

### Level 3 - Business Building (Modules 19-28)
Answers: "How do we build and launch it?" Covers go-to-market execution: marketing, branding, product-market fit, sales, funding, financial intelligence, innovation, decision-making, growth, and leadership.

### Level 4 - Enterprise Intelligence (Modules 29-38)
Answers: "How do we build an enduring, world-class company?" Covers corporate strategy, AI and automation, emerging technology, advanced venture building, macroeconomics and geopolitics, data science, and R&D.

### Level 5 - BOIP Intelligence Engine (Module 40)
A different responsibility than Levels 1-4. Where Levels 1-4 teach BOIP what to know, Level 5 teaches BOIP how to think: it is the orchestration layer that decides which modules to consult and in what order when answering a real founder question.

Progression: Level 1 (Can we build it?) -> Level 2 (What should we build?) -> Level 3 (How do we launch it?) -> Level 4 (How do we build an enduring company?) -> Level 5 (How does BOIP reason across all of it?)

## 3. Complete Numbered Curriculum

### Level 1 - Opportunity Discovery
01. Lean Startup
02. Business Idea Generator Framework
03. Design Thinking
04. Market Opportunity Analysis
05. Customer Discovery
06. Consumer Psychology
07. Competitive Intelligence
08. PESTLE Analysis
09. Porter's Five Forces
10. Blue Ocean Strategy

### Level 2 - Business Design
11. Business Model Canvas
12. Business Model Library
13. Pricing Strategies
14. BOIP Knowledge Architecture
15. BOIP Master Prompt
16. BOIP Workflow
17. Entrepreneur Coaching Framework
18. Opportunity Scoring System

### Level 3 - Business Building
19. Marketing Frameworks
20. Branding & Identity
21. Product Development & Product-Market Fit
22. Sales & Negotiation
23. Funding & Capital Raising
24. Financial Intelligence for Entrepreneurs
25. Innovation & Creative Problem Solving
26. Decision-Making & Strategic Thinking
27. Business Growth & Scaling Strategies
28. Leadership & High-Performance Organisations

### Level 4 - Enterprise Intelligence
29. Corporate Strategy & Competitive Advantage
30. Artificial Intelligence, Automation & Digital Transformation
31. Innovation Management & Emerging Technologies
32. Entrepreneurship & Venture Building (Advanced)
33. Global Economics & Macroeconomic Strategy
34. Artificial Intelligence, Autonomous Agents & Human-AI Collaboration
35. Data Science, Analytics, Forecasting & Business Intelligence
36. Innovation, Research & Development, Product Strategy & Emerging Technologies
37. Global Economics, Geopolitics & Macro Strategy
38. BOIP Master Integration, Meta-Reasoning & Autonomous Enterprise Intelligence

### Reserved
39. Reserved - BOIP Future Expansion (intentionally left open as a planned extension point for a future strategic capability)

### Level 5 - BOIP Intelligence Engine
40. BOIP Core Engine

## 4. Dependency Graph

The reasoning chain that BOIP traverses for a typical new-venture question runs through Level 1 and Level 2 in this order:

Idea -> Market Opportunity -> Customer Discovery -> Consumer Psychology -> Competition -> External Environment (PESTLE) -> Industry Structure (Porter's Five Forces) -> Blue Ocean Strategy -> Business Model -> Pricing -> BOIP Intelligence -> Founder Coaching -> Opportunity Score

Selected module-level dependencies:

- Business Model Canvas (11) depends on: Customer Discovery (05), Market Opportunity Analysis (04), Competitive Intelligence (07), Pricing Strategies (13)
- Opportunity Scoring System (18) depends on: every Level 1 module plus Business Model Canvas (11), Business Model Library (12), Pricing Strategies (13)
- BOIP Workflow (16) depends on: BOIP Knowledge Architecture (14), BOIP Master Prompt (15)
- Level 3 modules (19-28) depend on: a completed Opportunity Score (18) as their entry condition
- Level 4 modules (29-38) depend on: an operating business, meaning completion of Level 3
- BOIP Core Engine (40) depends on: all of Levels 1-4; it is the orchestration layer, not a sequential step

Example orchestration: a founder asking "Should I open a smoothie bar?" causes Module 40 to automatically invoke Market Opportunity Analysis, Customer Discovery, Consumer Psychology, Business Model Canvas, Pricing Strategies, Financial Intelligence, Branding & Identity, Marketing Frameworks, Decision-Making & Strategic Thinking, and Opportunity Scoring System, without the user needing to name any of them.

## 5. Changelog

### v1.0 - 2026-08-03
- Audited and renumbered the 18 foundational modules (Lean Startup through Opportunity Scoring System) into a single deliberate sequence, 01-18, replacing the prior alphabetical/ad hoc ordering.
- Renumbered modules 20-40 down into 19-38 to close the gap left by the foundational renumbering, preserving their original relative order within Level 3 and Level 4.
- Split out "Business Opportunity Intelligence Engine (The BOIP Core)" as its own Level 5, renamed to BOIP Core Engine, and assigned it module 40.
- Reserved module 39 deliberately as a future expansion slot rather than leaving an unexplained gap.
- Shortened the three BOIP system module names for consistency: Database Structure to Knowledge Architecture, Master Prompt kept as-is, and Workflow kept as-is, all prefixed with BOIP.
- Established the five-level architecture (Opportunity Discovery, Business Design, Business Building, Enterprise Intelligence, BOIP Intelligence Engine) as the organizing structure for all future modules.
- Created this file as the project's constitution, to be read before any future renumbering, module addition, or dependency change.
