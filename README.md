# Borrower Copilot

## Introduction
<img width="1896" height="907" alt="Screenshot 2026-09-05 020145" src="https://github.com/user-attachments/assets/5e0e3d64-481c-4771-9d98-ca623db9d0d1" />

Borrower Copilot is a private, local-first assistant for Indian borrowers preparing to meet a lender. It helps answer four practical questions:
1. Should I borrow, borrow less, or pause?
2. What might a lender sanction versus what can I safely carry?
3. What interest-rate band and all-in APR should I negotiate?
4. What EMI should I agree to, including a bad-month stress case?

The app turns a borrower's own answers into a clear assessment and a one-page Negotiation Card. It does not require login, connect to a credit bureau, send data to a backend, or store personal information.

## Run locally

Requires Node.js 18+.

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Verify a production build with `npm run build`. No backend, account, personal-data storage, or bureau integration is used.

## Walkthrough

1. Start the assessment or select Priya, Ravi, or Anita from **See it in action**.
2. Answer the must questions. Follow-ups appear only for the selected income type or loan product.
3. Review the verdict, lender ceiling, safe ceiling, fair rate/APR band, and stress ceiling.
4. Open **Negotiation card** and print/save it for the lender conversation.
5. Read [RULES.md](RULES.md) and [RUNTHROUGHS.md](RUNTHROUGHS.md) for the assumptions and example borrowers.

## Key Technologies Used

- **React 19** for the interactive assessment flow and result views.
- **TypeScript** for typed borrower answers, question definitions, assessment results, and rule boundaries.
- **Vite** for fast local development and production bundling.
- **CSS** for the responsive visual system, mobile layout, print styles, and the Negotiation Card.
- **Browser-only state** through React state hooks. No database, API, authentication, or analytics layer is present.
- **Google Fonts** for the display and interface typography loaded by CSS.

## Models Used

This project deliberately does not use machine learning or a black-box credit score. The core model is deterministic, inspectable, and implemented in [`src/rules.ts`](src/rules.ts).

### 1. Affordability and FOIR model

The app estimates a lender-style maximum EMI using an income-type-specific FOIR ceiling:

- Salaried income: 50%
- Self-employed income: 45%
- Informal or gig income: 38%

Existing EMIs are deducted. Unknown scores, unstable income, variable-income share, age extremes, and the absence of a co-applicant adjust the lender estimate.

### 2. Safe borrower capacity model

The safe ceiling is intentionally lower than the lender ceiling. It caps new EMI at 33% of income after existing EMIs and also considers stated essential expenses plus a 10% income buffer. Informal income uses a 12% buffer.

Emergency savings change the safe capacity. The model does not treat missing information as zero evidence of risk; unknown credit score widens the rate range and reduces confidence.

### 3. Product and fair-rate model

The app uses transparent product bands for personal, business, two-wheeler, loan-against-property, and gold loans. Score knowledge and income type adjust the band. A business request with collateral worth more than 1.2 times the requested amount is routed to a secured business/LAP-style band instead of being treated as an unsecured personal loan.

### 4. APR comparison model

The displayed APR is an estimate that adds the entered processing fee to the interest band as a simple annualised comparison adjustment. It is not a substitute for the lender's official APR schedule. Borrowers are told to request total interest, GST, insurance, foreclosure, late-payment, and other charges in writing.

### 5. Stress model

The stress case reduces the safe EMI capacity to 78% and increases the rate by two percentage points when converting that EMI back into a safe amount. Informal borrowers receive an additional existing-EMI reduction in the stress case.

### 6. Verdict model

- **Pause this loan:** no safe EMI capacity, or a recent EMI/auto-debit bounce.
- **Borrow less:** the requested amount exceeds the resilient safe amount or the stress amount is materially below the request.
- **This can fit:** the request remains within the safe and stress-aware limits.

Every output includes a short reason so the borrower can see which answers caused the result. Full thresholds and assumptions are documented in [RULES.md](RULES.md).

## Analysis

The central product decision is to show two different ceilings rather than presenting the lender's maximum as the recommendation. A lender may approve an amount based on repayment capacity, but the borrower also needs room for rent, household costs, income volatility, emergencies, and rate changes.

The question flow uses a small must-set and adaptive follow-ups. Income type controls whether the user sees income-history and variable-income questions. Loan type controls whether collateral is asked. Each follow-up changes at least one output: affordability, stress capacity, product routing, rate/APR comparison, confidence, or the verdict.

The three seeded borrowers demonstrate different outcomes:

- **Priya:** strong score and stable salaried income, but the safe amount is still below the requested wedding loan.
- **Ravi:** collateral and business purpose route him toward secured business pricing, while unknown score keeps confidence low.
- **Anita:** an EMI bounce and existing high-cost app debt make “pause” a valid and actionable result instead of automatically approving the scooter request.

The model is intentionally conservative and explainable. It is a self-assessment for preparation, not an underwriting decision or financial guarantee.

## Limitations

- No lender policy, bureau score, bank statement, ITR, GST record, collateral valuation, or legal document is verified.
- Cash income and co-applicant income are not independently validated.
- The APR is a comparison estimate, not regulatory disclosure.
- Rate bands are judgement-based product ranges and should be refreshed against current lender offers.
- The rules have not been reviewed by a regulated credit professional yet.

## Conclusion

Borrower Copilot gives the borrower a defensible starting position before entering a lender conversation: a pause/borrow verdict, a lender ceiling, a safer personal ceiling, a fair-rate range, a stress case, and a card they can show across the desk.

The next responsible step is validation, not more complexity: test the rules with more borrower profiles, compare outputs with current Indian lending offers, and review thresholds with a qualified credit professional. The app should remain transparent and borrower-controlled as it grows.

## Next and cut

Next: a full amortisation APR calculator, document checklist, quote comparison, productive-loan split, and table-driven rules tests reviewed by a credit professional. I would cut login, bureau pulls, lender lead generation, black-box scoring, and “pre-approved” labels until the self-assessment is validated.
