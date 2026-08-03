# BOIP Scoring Engine v1.0

## 1. Purpose
The BOIP Scoring Engine transforms structured founder interview responses, business information, and market evidence into standardised scores. Its responsibilities are to score founder readiness, measure founder-opportunity fit, assess opportunity quality, identify strengths and weaknesses, calculate data confidence, flag contradictions and missing evidence, and provide consistent scoring inputs to other BOIP engines.

The Scoring Engine does not independently issue Green, Amber, Blue, Red, or Grey decisions.

## 2. Core Scoring Principles
Every score must be explainable, evidence-based, repeatable, version-controlled, adjustable by industry and business stage, protected against false precision, and reduced when data quality is weak.

BOIP must distinguish between a high score supported by strong evidence and a high score based mainly on founder assumptions. These are not equal.

## 3. Score Scale
All major dimensions use a score from 0-100:
- 85-100 - Exceptional
- 70-84 - Strong
- 55-69 - Promising
- 40-54 - Weak
- 20-39 - High concern
- 0-19 - Critical concern

A score must always be displayed with classification, confidence level, supporting evidence, key risks, and missing information.

Example: Founder Readiness: 78/100, Classification: Strong, Confidence: 82%, Primary strength: Relevant industry experience, Primary concern: Limited weekly availability.

## 4. Primary Scoring Dimensions

### 4.1 Founder Readiness Score
Measures whether the founder is prepared to start, build, or grow a business. Subdimensions: relevant experience, entrepreneurial experience, clarity of goals, commitment, decision-making readiness, resilience indicators, willingness to learn, and understanding of personal constraints.

Suggested weighting: Relevant experience 20%, Goal clarity 15%, Commitment 20%, Entrepreneurial exposure 15%, Self-awareness 10%, Learning readiness 10%, Constraint awareness 10%.

### 4.2 Skills Match Score
Measures alignment between the founder's abilities and the opportunity, covering core delivery, sales, marketing, operational, technical, and management capability, skill gaps, and ability to outsource missing skills. A founder does not need every skill personally; the engine should reward credible access to partners, employees, contractors, or automation.

### 4.3 Resource Readiness Score
Measures whether the founder has access to the practical resources required, including capital, equipment, premises, transport, licences, technology, professional network, audience, customer database, team, suppliers, and time. Weighting must vary by business type (for example, vehicle ownership is highly relevant for mobile services but low relevance for SaaS).

### 4.4 Financial Readiness Score
Measures the founder's financial ability to begin and sustain the opportunity, covering available capital, startup-cost compatibility, personal financial runway, funding dependency, ability to absorb early losses, financial assumptions, cost awareness, and cash-flow understanding. BOIP should never encourage a founder to risk essential living expenses.

### 4.5 Time and Execution Readiness Score
Measures whether the founder can realistically execute the plan, based on hours available each week, speed-to-income requirement, business complexity, launch workload, founder responsibilities, team support, operational burden, and required learning curve.

Example contradiction: an immediate income requirement combined with under five hours weekly availability and a complex marketplace platform model should sharply reduce execution compatibility.

### 4.6 Founder-Opportunity Fit Score
Measures the overall alignment between the person and the business: Skills Match, Interest Match, Experience Match, Working Style Fit, Risk Compatibility, Lifestyle Compatibility, and Goal Alignment.

Suggested weights: Skills Match 25%, Experience Match 20%, Working Style Fit 15%, Interest Match 10%, Risk Compatibility 10%, Lifestyle Compatibility 10%, Goal Alignment 10%.

### 4.7 Problem Clarity Score
Measures how clearly the business problem is understood, based on specificity, urgency, frequency, customer impact, evidence that it exists, clarity about who experiences it, and current alternatives. A vague inconvenience should not score like a painful, repeated, expensive problem.

### 4.8 Customer Clarity Score
Measures how well the target customer is defined, based on segment specificity, buying authority, willingness to pay, access to the customer, purchasing behaviour, customer urgency, existing validation, and segmentation quality.

### 4.9 Solution Strength Score
Measures whether the proposed solution meaningfully addresses the problem, based on problem-solution alignment, usefulness, usability, differentiation, deliverability, adoption barriers, customer value, and proof or prototype evidence.

### 4.10 Market Signal Score
Measures the attractiveness and timing of the market, based on demand, growth, trend direction, search behaviour, customer activity, funding activity, regulatory movement, technology shifts, market maturity, and seasonality. Founder belief alone is not market evidence.

### 4.11 Competitive Position Score
Measures whether the opportunity can compete effectively, based on competition intensity, competitor quality, differentiation, switching barriers, customer loyalty, price pressure, barriers to entry, substitute products, access to distribution, and defensibility. High competition should not automatically create a low score; strong demand with clear differentiation may remain attractive.

### 4.12 Business Model Strength Score
Measures whether the business can create, deliver, and capture value, based on revenue clarity, customer acquisition method, delivery model, cost structure, gross margin potential, repeat purchases, recurring revenue, operational feasibility, scalability, and partner dependency.

### 4.13 Pricing Strength Score
Measures whether the pricing approach is credible and sustainable, based on customer willingness to pay, competitor benchmarks, value-based pricing, gross margin, affordability, pricing simplicity, recurring revenue potential, discount dependency, and price sensitivity.

### 4.14 Validation Score
Measures how much real-world evidence exists, using an evidence hierarchy from weakest to strongest: founder assumption, informal conversations, structured interviews, waiting-list signups, deposits or pre-orders, paying customers, and repeat customers.

### 4.15 Growth Potential Score
Measures the opportunity's ability to expand, based on market size, repeatability, scalability, geographic expansion, product expansion, channel expansion, recurring revenue, automation potential, network effects, and partnership potential.

### 4.16 Risk Score
Unlike other dimensions, a higher Risk Score means greater danger. Risk categories: market, financial, founder, operational, legal, regulatory, technology, competitive, supplier, and reputational risk.

Display both a Risk Score with classification (for example, Risk Score: 68/100, Risk Classification: High) and a separate Risk-Adjusted Strength Score (for example, 54/100), to avoid confusing users.

## 5. Data Quality Score
Measures how reliable the analysis is, based on answer completeness, answer specificity, contradictions, use of evidence, financial detail, market evidence, validation evidence, and number of "Not sure" answers.

Suggested scale: 85-100 Strong evidence base, 70-84 Good evidence, 55-69 Usable but incomplete, 40-54 Significant gaps, 0-39 Insufficient for reliable analysis.

## 6. Confidence Score
Confidence should not equal the Opportunity Score.

Suggested formula: Confidence Score = Data Completeness x Evidence Quality x Consistency x Source Reliability, each scored 0-100 and combined using weighted averages.

Suggested weights: Data completeness 30%, Evidence quality 30%, Answer consistency 20%, Source reliability 20%.

## 7. Overall BOIP Opportunity Score
Calculated only after the main dimensions are available.

Suggested v1.0 weighting: Founder-Opportunity Fit 15%, Problem Clarity 10%, Customer Clarity 10%, Solution Strength 10%, Market Signal 12%, Competitive Position 8%, Business Model Strength 10%, Pricing Strength 5%, Financial Readiness 7%, Execution Readiness 5%, Validation 5%, Growth Potential 3%. Total: 100%.

Risk should be applied separately as an adjustment rather than hidden inside the base opportunity score.

Example: Base Opportunity Score: 76, Risk Adjustment: -9, Risk-Adjusted Opportunity Score: 67, Confidence: 72%.

## 8. Risk Adjustment
Suggested v1.0 model: Risk Score 0-19 no adjustment, 20-39 -2, 40-54 -5, 55-69 -9, 70-84 -15, 85-100 -25.

Severe legal, safety, regulatory, or financial risks may trigger a hard flag regardless of the total score.

## 9. Hard Flags
Hard flags override ordinary scoring when necessary, for example: required licence unavailable, illegal or prohibited business activity, founder intends to use essential living money, impossible revenue assumptions, serious unresolved safety risk, major regulatory barrier, no identifiable customer, no realistic delivery method, critical contradiction in founder responses, and evidence of fraud or deception.

Possible output: HARD_FLAG: REGULATORY_BLOCKER - Decision Engine review required.

## 10. Path-Specific Scoring
- Path A: Existing Business Idea - emphasise problem clarity, customer clarity, validation, market signal, solution strength, and founder fit.
- Path B: Multiple Ideas - score each idea separately using the same model, then compare opportunity score, founder fit, startup cost, time to revenue, risk, scalability, and confidence.
- Path C: No Business Idea - emphasise skills match, resource match, working style, budget compatibility, time-to-income fit, interest alignment, and local or market suitability.
- Path D: Existing Business - emphasise revenue health, margins, retention, customer acquisition, operational capacity, growth constraints, cash flow, and market position.
- Path E: Investor - emphasise return potential, risk, management quality, scalability, defensibility, liquidity, investment horizon, and capital requirements.

## 11. Missing Data Rules
Missing data must never be silently treated as zero. Use NOT_AVAILABLE, then recalculate weights among available dimensions when appropriate, reduce confidence, identify missing evidence, request clarification when critical, and prevent a final score when too many essential dimensions are absent.

Example: Opportunity Score: 71, Confidence: 43%, Status: Provisional, Reason: Customer validation and pricing evidence are missing.

## 12. Contradiction Penalties
Contradictions affect confidence first, not always the opportunity score. Examples: a low-risk preference paired with a high-risk venture model, an immediate income need paired with a long product-development cycle, no available budget paired with a capital-intensive opportunity, a desire to work alone paired with a labour-intensive operation, and a passive-income goal paired with a founder-dependent service business.

The engine should detect the contradiction, ask for clarification, store the response, adjust compatibility scores, and reduce confidence if unresolved.

## 13. Explainability Output
Every score should output: Score Name, Numeric Score, Classification, Confidence, Positive Factors, Negative Factors, Evidence Used, Missing Evidence, Questions Affecting Score, and Recommended Improvement.

Example: Skills Match: 82/100, Classification: Strong, Confidence: 88%.
Positive Factors: Ten years of hospitality experience, existing customer-service skills, relevant local contacts.
Negative Factors: Limited bookkeeping experience.
Recommended Improvement: Use accounting software or outsource bookkeeping.

## 14. Engine Output Schema
The engine should produce: Founder Readiness Score, Skills Match Score, Resource Readiness Score, Financial Readiness Score, Execution Readiness Score, Founder-Opportunity Fit Score, Problem Clarity Score, Customer Clarity Score, Solution Strength Score, Market Signal Score, Competitive Position Score, Business Model Strength Score, Pricing Strength Score, Validation Score, Growth Potential Score, Risk Score, Data Quality Score, Confidence Score, Base Opportunity Score, Risk-Adjusted Opportunity Score, Hard Flags, Missing Data, Contradictions, Score Explanations, and Scoring Model Version.

## 15. Scoring Model Versioning
Every completed analysis must record: Scoring Model Version 1.0, Question Bank Version 1.0, Decision Engine Version 1.0, and Analysis Timestamp. Scores may change as the model improves; version records preserve auditability.

## 16. Testing Requirements
Before release, test the scoring model using varied cases: strong founder and strong opportunity, strong founder and weak opportunity, weak founder and strong opportunity, low-budget service business, capital-intensive business, no-idea founder, existing profitable business, investor profile, contradictory responses, incomplete data, unrealistic financial expectations, and regulated business.

The same inputs must generate the same score under the same model version.

## 17. Version Roadmap
- v1.0 - Rule-based weighted scoring with confidence and risk adjustments.
- v1.1 - Industry-specific weighting profiles.
- v1.2 - Regional and currency-aware financial benchmarks.
- v2.0 - Market-data-assisted scoring.
- v3.0 - Multi-agent scoring with continuous calibration against real business outcomes.
