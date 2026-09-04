# Borrower Copilot

A private, local-first self-assessment for an Indian borrower before meeting a lender. It answers whether to borrow, two honest ceilings, a fair rate/APR band, and a stress-tested EMI ceiling.

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

## Next and cut

Next: a full amortisation APR calculator, document checklist, quote comparison, productive-loan split, and table-driven rules tests reviewed by a credit professional. I would cut login, bureau pulls, lender lead generation, black-box scoring, and “pre-approved” labels until the self-assessment is validated.
