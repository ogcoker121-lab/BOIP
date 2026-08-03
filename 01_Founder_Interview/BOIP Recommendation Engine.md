# BOIP Recommendation Engine

## 1. Purpose
The Business Recommendation Engine analyses founder data, business readiness, market intelligence, and strategic fit to determine the most appropriate BOIP recommendation, report, workflow, and next action for every user.

## 2. Inputs

### Founder Profile
- Goals
- Skills
- Experience
- Budget
- Available Time
- Resources
- Risk Tolerance
- Interests
- Preferred Business Model
- Location
- Existing Business
- Existing Audience

### Business Data
- Business Idea
- Industry
- Stage
- Revenue
- Customers
- Competition
- Market

### BOIP Scores
- Founder Readiness
- Opportunity Readiness
- Market Signal
- Risk
- Innovation
- Execution
- Finance
- Competition
- Growth

## 3. Recommendation Categories
- Discover -> Business Discovery Report
- Validate -> Founder Intelligence Report
- Compare -> Business Comparison Report
- Build -> Business Plan
- Grow -> Business Growth Intelligence
- Fund -> Investor Package
- Learn -> Entrepreneur Coaching

## 4. Confidence Score
Each recommendation returns a named business, a confidence score, and the reasons behind it rather than a bare label.

Example:
- Recommended Business: Mobile Coffee Cart
- Confidence: 94%
- Reasons: High skills match, low startup capital, growing market, local demand, low competition

## 5. Why? (Explainability)
Every recommendation includes a plain-language explanation of the reasoning behind it. Transparency builds trust with the founder.

## 6. Alternative Recommendations
Every result set returns more than one option:
- Top Match
- Second Match
- Third Match
- Wildcard

This structure also supports upsell opportunities on the results screen.

## 7. Opportunity Matrix
Extends the original 2x2 (Opportunity Readiness x Market Signal) into four dimensions:
- Founder
- Market
- Competition
- Resources

This gives the engine richer reasoning across a broader set of signals.

## 8. Recommendation Levels
Replaces the binary Proceed / Don't Proceed model with five levels:
- Green - Launch immediately
- Amber - Validate further
- Blue - Pivot
- Red - Pause
- Grey - Insufficient data

## 9. Next Action Generator
Every recommendation automatically generates the next three actions for the founder to take.

Example (Coffee Shop):
1. Interview ten customers
2. Find suppliers
3. Create pricing model

## 10. Future AI Hooks
Reserved for future autonomous agent integration (not built yet):
- Founder Agent
- Market Agent
- Finance Agent
- Marketing Agent
- Risk Agent
- Investor Agent
- Legal Agent

These will later become autonomous agents within BOIP.
