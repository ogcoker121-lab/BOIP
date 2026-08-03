# BOIP Interview Decision Engine

## 1. Purpose
The BOIP Interview Decision Engine controls the adaptive Founder Discovery Interview.

It determines:
- which question appears next
- which questions are skipped
- when follow-up questions are required
- when sufficient information has been collected
- which interview path the user follows
- when the interview should be submitted for scoring and analysis

Its responsibility is navigation and data collection, not final business recommendations.

## 2. Primary Interview Paths
The engine begins by routing the user into one of five paths.

### Path A: Existing Business Idea
User selection: "I already have a business idea."

Required data:
- business idea
- problem being solved
- proposed solution
- target customer
- market
- competitors
- revenue model
- pricing
- budget
- business stage

Primary output: Founder Intelligence Report

### Path B: Multiple Business Ideas
User selection: "I have several business ideas."

Required data:
- each idea
- founder goals
- budget
- skills
- time available
- preferred working style
- income target
- risk tolerance

Primary output: Business Comparison Report

### Path C: No Business Idea
User selection: "I do not know what business to start."

Required data:
- interests
- skills
- experience
- assets
- budget
- available time
- location
- income target
- preferred business type
- risk tolerance
- lifestyle goals

Primary output: Business Discovery Report

### Path D: Existing Business
User selection: "I already own a business."

Required data:
- business details
- trading history
- revenue
- customers
- products or services
- current challenges
- marketing channels
- costs
- growth goals
- team and resources

Primary output: Business Growth Intelligence Report

### Path E: Investor
User selection: "I am looking for business opportunities to invest in."

Required data:
- available capital
- preferred sectors
- investment horizon
- risk tolerance
- target return
- active or passive involvement
- preferred geography
- preferred business stage

Primary output: Investment Intelligence Report

## 3. Question Types
The engine should support:
- single choice
- multiple choice
- free text
- numeric input
- currency input
- percentage input
- date input
- scale rating
- yes/no
- ranked preference
- file upload
- conditional follow-up

## 4. Branching Rules
Use this format for every decision rule:

Rule ID: ID-001
Trigger: User selects "I have no business idea."
Action: Activate Business Discovery path.
Ask Next: What are your strongest skills?
Skip: Existing business revenue questions.
Required Before Completion: Skills, interests, budget, time, risk tolerance and income goal.

## 5. Core Routing Logic
1. Select founder path
2. Collect shared founder profile
3. Activate path-specific questions
4. Evaluate missing information
5. Ask conditional follow-up questions
6. Check completion threshold
7. Send responses to BOIP Scoring Engine
8. Send scores to BOIP Decision Intelligence Engine
9. Send conclusions to BOIP Recommendation Engine
10. Route user to results and report offer

## 6. Shared Questions
These should appear across most paths:
- name
- email
- country
- city or operating location
- current occupation
- founder goal
- available budget
- available time
- income target
- risk tolerance
- relevant skills
- relevant experience
- existing resources
- biggest obstacle

Questions should only be repeated when clarification is necessary.

## 7. Conditional Follow-Up Examples

### Food Business
When the user describes a food or beverage business, ask:
- physical premises, mobile unit or delivery?
- food hygiene certification?
- council permissions?
- kitchen access?
- suppliers?
- average selling price?
- expected sales volume?
- seasonality?

### SaaS Business
When the user describes software or SaaS, ask:
- B2B or B2C?
- subscription price?
- technical capability?
- MVP status?
- expected acquisition channel?
- hosting costs?
- monthly recurring revenue target?

### Local Service Business
Ask:
- service radius?
- transport available?
- required licences?
- hourly or fixed pricing?
- local competition?
- repeat-purchase potential?

### Existing Business
When revenue exists, ask:
- monthly revenue?
- gross margin?
- monthly costs?
- customer retention?
- highest-performing product?
- biggest growth constraint?

## 8. Completion Rules
The interview can finish when:
- all required shared questions are answered
- all required path-specific questions are answered
- no critical contradiction remains unresolved
- minimum data quality threshold is reached
- the confidence threshold for routing is met

The interview must not finish when:
- the founder path is unclear
- budget information is missing
- the business idea is too vague to analyse
- essential financial figures are absent for an existing business
- answers materially contradict one another

## 9. Missing Data Handling
When information is missing:
- Missing non-critical information -> Continue and flag it in the report.
- Missing important information -> Ask a follow-up question.
- Missing critical information -> Prevent submission until resolved.
- User does not know -> Accept "Not sure" and generate a validation task.

## 10. Contradiction Handling
Example:
- User wants immediate income
- User has no available time
- User wants a passive technology startup

BOIP should respond with a clarification question rather than silently accepting all three answers.

Example clarification: "You selected immediate income, limited weekly availability, and a technology startup. Which priority matters most: speed to income, low time commitment, or long-term growth?"

## 11. Progress Tracking
The user should see progress based on required information collected, not a fixed number of questions.

Example:
- Founder Profile: Complete
- Goals: Complete
- Resources: Complete
- Opportunity Details: In Progress
- Financial Readiness: Not Started

This works better than displaying "Question 14 of 25," because adaptive interviews have different lengths.

## 12. Outputs
The engine sends:
- selected founder path
- completed answers
- skipped questions
- missing fields
- contradictions detected
- clarification responses
- data completeness score
- path confidence score
- recommended report route
- interview completion status

## 13. Completion Statuses
Use:
- NOT_STARTED
- IN_PROGRESS
- REQUIRES_CLARIFICATION
- READY_FOR_ANALYSIS
- COMPLETED
- ABANDONED

## 14. Version Roadmap
- v1.0 - Rule-based branching and required-field logic.
- v1.1 - Industry-specific follow-up question packs.
- v2.0 - AI-generated contextual follow-up questions.
- v3.0 - Conversational adaptive interview with dynamic question sequencing and real-time opportunity analysis.
