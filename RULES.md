# Borrower Copilot rules

This is a transparent self-assessment, not a credit decision. It uses the borrower's inputs only, makes no bureau call, and stores nothing.

| What | Value | Why | Source |
|---|---:|---|---|
| Salaried lender FOIR cap | 50% of net income less existing EMIs | Common affordability ceiling for retail lending; a lender's maximum is not a safe budget | My judgement, informed by FOIR practice |
| Self-employed lender FOIR cap | 45% | Lower count for variable/verifiable income | My judgement |
| Informal/gig lender FOIR cap | 38% | Wider income uncertainty | My judgement |
| Unknown-score lender adjustment | 3 percentage points lower FOIR | Unknown is not a 300 score; it widens rate and slightly reduces sanction | My judgement |
| Score under 650 adjustment | 10 percentage points lower FOIR | Reflects high repayment risk without pretending to know the lender's model | My judgement |
| Score 650-724 adjustment | 4 percentage points lower FOIR | Mid-band risk adjustment | My judgement |
| Safe EMI cap | 33% of income less existing EMIs | Keeps borrower below the lender-style maximum | My judgement |
| Safe essential-outflow buffer | 10% of income; 12% for informal income | Reserves room for an ordinary shock and unreported costs | My judgement |
| Stress test | Safe EMI x 78%; informal also subtracts 10% of existing EMI | Represents income drop / rate rise without claiming a forecast | My judgement |
| Bounce verdict | Any recent bounce produces Don't borrow | A recent bounce is an immediate cash-flow warning | My judgement |
| Personal rate band | 10.5%-18% | Typical unsecured retail range used for comparison, not a quote | My judgement; validate with current lender offers |
| Business rate band | 12.5%-20% unsecured | Higher verification and business risk range | My judgement |
| Two-wheeler rate band | 11.5%-18% | Secured vehicle product range | My judgement |
| LAP rate band | 9.75%-14% | Secured property product range | My judgement |
| Gold rate band | 9%-16% | Secured gold product range | My judgement |
| Known score 750+ rate adjustment | -1.2 points | Strong score should tighten the range downward | My judgement |
| Known score 700-749 rate adjustment | 0 points | Baseline band | My judgement |
| Known score under 700 rate adjustment | +2 points | Higher observed risk | My judgement |
| Unknown score rate adjustment | +1.5 points low end, +2 high end | Unknown widens instead of becoming a false score | My judgement |
| Informal income rate adjustment | +1.5 points | Income proof and stability uncertainty | My judgement |
| Self-employed income rate adjustment | +0.75 points | Moderate verification uncertainty | My judgement |
| Secured business override | 10.5%-14% if collateral > 1.2x wanted amount | Routes a collateral-backed productive request to secured pricing | My judgement |
| APR fee adjustment | processing fee % / max(12, tenure) x 2 | Simple annualised comparison proxy; real APR depends on schedule, GST and other fees | My judgement; borrower must request lender APR schedule |
| Default processing fee | 1.5% before GST | Neutral placeholder when there is no quote | My judgement |
| Rounding | Nearest ₹500 | Keeps ranges readable and avoids false precision | Product judgement |
| Confidence | Low if score unknown or informal; High if collateral + 3+ years; otherwise Medium | Confidence reflects missing or unstable inputs | Product judgement |
| Tenure | 36 months default; Ravi seeded at 60 | Longer tenure reduces EMI but increases total interest | Product judgement |
| Additional question: income history | Changes lender FOIR | Stability affects how much income can be relied on | Product judgement |
| Additional question: savings | Used in stress framing / future extension | Savings should change shock capacity; current prototype keeps the stress multiplier conservative | Product judgement |
| Additional question: collateral | Changes product label and secured rate band | Secured productive borrowing should not be treated as unsecured personal debt | Product judgement |
| Additional question: bounces | Can reach Don't borrow | Direct evidence of current cash-flow strain | Product judgement |

## Limits

- No lender policy, bureau score, bank statement, ITR, GST, collateral valuation, or legal documentation is verified.
- Cash income and co-applicant income are not added to the computation unless the borrower enters them as their own conservative income.
- The APR shown is a comparison estimate, not regulatory disclosure. Ask the lender for the official annualised rate, total interest, processing fee, GST, insurance, foreclosure and late-payment charges.
- The app intentionally favors a lower safe ceiling over a higher sanction ceiling.
