# BOIP Question Bank v1.0

## 1. Purpose
The BOIP Question Bank is the central catalogue of approved questions used across the Founder Discovery Interview. It defines wording, answer format, path usage, requirement status, follow-up triggers, consuming scores, privacy classification, and version for every question.

The Question Bank supplies questions to the BOIP Interview Decision Engine. It does not decide which question appears next.

## 2. Question Record Format
Every question uses the same structure:

Question ID: Q-FP-001
Category: Founder Profile
Question: What is your current employment situation?
Help Text: Select the option that best reflects your present position.
Answer Type: Single choice
Options: Employed full-time, Employed part-time, Self-employed, Business owner, Student, Not currently working, Retired, Prefer not to say
Required: Yes
Used In Paths: A, B, C, D, E
Scoring Dimensions: Founder Readiness, Financial Readiness
Triggers: If "Business owner" -> ask Q-EB-001. If "Self-employed" -> ask Q-FP-006
Privacy Classification: Personal
Version: 1.0

## 3. Question ID System
Questions use category-based IDs so each question has a stable address that can be updated without breaking the interview architecture:

- FP - Founder Profile
- GO - Goals
- SK - Skills
- EX - Experience
- RS - Resources
- FN - Financial Position
- TM - Time and Availability
- RK - Risk Profile
- WS - Working Style
- IN - Interests
- BI - Existing Business Idea
- MI - Multiple Ideas
- BD - Business Discovery
- EB - Existing Business
- IV - Investor Profile
- MK - Market
- CU - Customer
- CP - Competition
- BM - Business Model
- PR - Pricing
- VA - Validation
- CH - Challenges
- CF - Clarification
- CO - Consent and Privacy

## 4. Shared Founder Profile Questions
- Q-FP-001 - What is your full name? Short text, required, Paths A-E, privacy: personally identifiable.
- Q-FP-002 - What email address should we use for your results and reports? Email, required, Paths A-E, validated format, privacy: personally identifiable.
- Q-FP-003 - Which country are you based in? Country selector, required, Paths A-E, scores Market Fit and Regulatory Context.
- Q-FP-004 - Which city, region, or market do you expect the business to operate in? Short text, required, Paths A-E, scores Market Signal and Location Fit.
- Q-FP-005 - What is your current occupation or main area of work? Short text, optional, Paths A-D, scores Founder Experience and Skills Match.
- Q-FP-006 - What is your current employment situation? Single choice (see Section 2 example), required, Paths A-D, scores Financial Readiness and Time Availability.

## 5. Founder Goals
- Q-GO-001 - What are you hoping to achieve through business ownership? Multiple choice covering income replacement, side income, lifestyle, family business, wealth, high growth, solving a problem, social impact, employment creation, eventual sale, exploration, and other. Required, Paths A-D, scores Goal Alignment.
- Q-GO-002 - What monthly personal income would you ideally like the business to generate? Currency range from under GBP 1,000 to more than GBP 25,000, or not sure yet. Required, scores Opportunity Fit and Business Model Fit.
- Q-GO-003 - How quickly do you need the business to begin generating income? Single choice from immediately to long term. Required, scores Time-to-Revenue Fit.
- Q-GO-004 - What would success look like for you three years from now? Long text, optional, scores Goal Alignment and Growth Ambition.

## 6. Skills and Experience
- Q-SK-001 - Which skills could you confidently use in a business today? Searchable multiple choice across roughly 30 skill areas including sales, marketing, management, finance, design, programming, and trades. Required for Paths B and C, scores Skills Match and Execution Readiness.
- Q-SK-002 - Which three skills are your strongest? Ranked selection, required for Paths B and C, scores Skills Match.
- Q-EX-001 - Which industries have you worked in or understand well? Searchable multiple choice, optional, scores Industry Fit.
- Q-EX-002 - Have you previously started, managed, or helped run a business? Single choice from successfully to no, required, scores Founder Readiness.
- Q-EX-003 - Briefly describe your most relevant business or professional experience. Long text, conditional on Q-EX-002 not being "No".

## 7. Resources and Financial Position
- Q-FN-001 - How much money could you realistically invest without putting essential living costs at risk? Currency range from GBP 0 to more than GBP 50,000, or prefer not to say. Required, scores Financial Readiness and Opportunity Compatibility.
- Q-FN-002 - Would you need external funding to start? Single choice (yes, no, possibly, not sure). Required, scores Funding Dependency.
- Q-TM-001 - How many hours per week can you consistently dedicate to the business? Single choice from less than 5 hours to full-time. Required, scores Execution Readiness.
- Q-RS-001 - Which useful resources do you already have access to? Multiple choice across equipment, premises, digital assets, contacts, team, and certifications, or none of these. Required, scores Resource Readiness and Startup Cost Fit.

## 8. Risk and Working Style
- Q-RK-001 - How much financial risk are you comfortable taking? Five-point scale from very low to very high. Required, scores Risk Compatibility.
- Q-RK-002 - Which statement best describes you? Single choice from preferring a proven model to wanting the highest possible growth potential. Required, scores Risk Profile and Innovation Fit.
- Q-WS-001 - How would you prefer to work? Multiple choice covering solo, team, customer-facing, remote, and location preferences. Required for Paths B and C, scores Founder-Business Fit.
- Q-WS-002 - Which activities do you most enjoy? Multiple choice covering creating, selling, teaching, analysing, building systems, and more. Required for Paths B and C, scores Working Style Fit.

## 9. Interests
- Q-IN-001 - Which areas genuinely interest you? Searchable multiple choice across roughly 28 sectors. Required for Paths B and C, scores Interest Match.
- Q-IN-002 - Are there any industries you definitely do not want to work in? Searchable multiple choice plus free text, optional, scores Exclusion Filter.

## 10. Path A: Existing Business Idea
- Q-BI-001 - Describe your business idea in one or two sentences. Long text, required.
- Q-BI-002 - What problem does the business solve? Long text, required, scores Problem Clarity.
- Q-BI-003 - Who experiences this problem most strongly? Long text, required, scores Customer Clarity.
- Q-BI-004 - What product or service will you provide? Long text, required, scores Solution Clarity.
- Q-BI-005 - What stage is the idea currently at? Single choice from early idea to already making sales. Required, scores Opportunity Readiness.
- Q-BI-006 - Why do you believe customers will choose this business? Long text, required, scores Differentiation.

## 11. Path B: Multiple Ideas
- Q-MI-001 - How many business ideas would you like BOIP to compare? Single choice, two to five, required.
- Q-MI-002 - Briefly describe each business idea. Repeating long-text field, required.
- Q-MI-003 - Which idea are you currently most drawn to, even if you are unsure why? Single selection from submitted ideas, optional, scores Founder Preference.
- Q-MI-004 - What is making the decision difficult? Multiple choice covering profitability, skills fit, startup costs, demand, competition, speed to income, or liking all ideas equally. Required.

## 12. Path C: No Business Idea
- Q-BD-001 - Which type of business appeals to you most? Multiple choice across service, product, retail, food, agency, subscription, marketplace, franchise, software, and social enterprise models, or I do not know. Required.
- Q-BD-002 - Would you rather sell products, services, expertise, access, or software? Multiple choice, required, scores Business Model Compatibility.
- Q-BD-003 - Do you prefer generating income quickly or building something larger over time? Five-point scale, required, scores Time Horizon Fit.
- Q-BD-004 - What everyday problems or frustrations do you notice people experiencing? Long text, optional, scores Opportunity Awareness.
- Q-BD-005 - Is there anything people regularly ask you to help them with? Long text, optional, scores Natural Capability Signal.

## 13. Path D: Existing Business
- Q-EB-001 - What is the name of your business? Short text, required.
- Q-EB-002 - What does the business sell? Long text, required.
- Q-EB-003 - How long has the business been trading? Single choice, required.
- Q-EB-004 - What was the business's approximate revenue during the last complete month? Currency, required, privacy: commercially sensitive.
- Q-EB-005 - What are the business's approximate monthly operating costs? Currency, required, privacy: commercially sensitive.
- Q-EB-006 - What is currently preventing the business from growing faster? Multiple choice plus text covering customers, margins, pricing, marketing, staffing, cash flow, capacity, competition, quality, funding, time, technology, and regulation, or not sure. Required.

## 14. Path E: Investor
- Q-IV-001 - How much capital are you considering investing? Currency range, required.
- Q-IV-002 - Which industries are you interested in? Searchable multiple choice, required.
- Q-IV-003 - What level of involvement do you want? Single choice from passive investor to full acquisition. Required.
- Q-IV-004 - What investment timeframe do you prefer? Single choice from less than one year to long-term ownership. Required.
- Q-IV-005 - What matters most in an investment opportunity? Ranked choice across income, capital growth, low risk, social impact, strategic influence, innovation, scalability, and exit potential. Required.

## 15. Shared Closing Questions
- Q-CH-001 - What is the biggest obstacle stopping you from moving forward today? Long text, required, scores Barrier Analysis.
- Q-CH-002 - What is the biggest uncertainty you want BOIP to help resolve? Long text, required, scores Report Priority.
- Q-CO-001 - Do you confirm that the information you have provided is accurate to the best of your knowledge? Yes/No, required.
- Q-CO-002 - Do you agree that BOIP may use your answers to generate personalised analysis and recommendations? Consent checkbox, required. Exact legal wording to be reviewed before launch.

## 16. Clarification Questions
Activated by contradictions or weak responses in the interview.

- Q-CF-001 - Triggered when immediate income is selected alongside fewer than five hours per week available. Asks which matters most: quick income, low time commitment, long-term income, or help balancing priorities.
- Q-CF-002 - Triggered when a high income target is paired with a very low startup budget. Offers options to start with a low-cost service, seek external funding, start smaller and reinvest, extend the timeframe, or keep the original target.
- Q-CF-003 - Triggered when a user provides a vague business description. Asks, in multiple choice plus free text, what the customer would actually pay for.

## 17. Data Quality Rules
Each answer is classified as one of: Complete, Partial, Vague, Contradictory, Not Sure, Skipped, or Invalid. The Interview Decision Engine decides whether a follow-up is required based on this classification.

## 18. Question Governance
Every question must:
- Have a unique ID
- Have a clear purpose
- Collect only information BOIP needs
- Avoid repeating information already supplied
- Use accessible language
- Include answer validation where needed
- Identify which scores or engines consume the answer
- Record its version
- Identify whether it contains personal or commercially sensitive data

Questions are never removed once used in production. They are marked deprecated instead, so historical interview records remain interpretable.

## 19. Version Roadmap
- v1.0 - Core shared questions and five path-specific question sets.
- v1.1 - Industry-specific question packs.
- v1.2 - Improved accessibility, localisation, and currency handling.
- v2.0 - AI-generated contextual follow-ups.
- v3.0 - Dynamic conversational interviews that adapt wording, depth, and order in real time.
