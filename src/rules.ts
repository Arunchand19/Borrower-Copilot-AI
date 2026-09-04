export type Answers = { purpose: string; loanType: 'personal' | 'business' | 'two-wheeler' | 'lap' | 'gold'; wanted: number; income: number; incomeType: 'salaried' | 'self-employed' | 'informal'; existingEmi: number; expenses: number; age: number; scoreKnown: 'yes' | 'no'; score: number; incomeHistory: 'under-1' | '1-3' | '3-plus' | 'variable'; emergencySavings: number; variableShare: number; coApplicant: 'yes' | 'no'; collateral: number; bounces: 'none' | 'one' | 'multiple'; offeredRate: number; processingFee: number; tenure: number }

export const emptyAnswers: Answers = { purpose: '', loanType: 'personal', wanted: 0, income: 0, incomeType: 'salaried', existingEmi: 0, expenses: 0, age: 30, scoreKnown: 'no', score: 0, incomeHistory: '3-plus', emergencySavings: 0, variableShare: 0, coApplicant: 'no', collateral: 0, bounces: 'none', offeredRate: 0, processingFee: 1.5, tenure: 36 }
const rateBands: Record<Answers['loanType'], [number, number]> = { personal: [10.5, 18], business: [12.5, 20], 'two-wheeler': [11.5, 18], lap: [9.75, 14], gold: [9, 16] }
const formatRate = (value: number) => `${value.toFixed(1)}%`
const round = (value: number) => Math.round(value / 500) * 500
function emiFor(principal: number, annualRate: number, months: number) { const monthlyRate = annualRate / 1200; return principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1) }
function principalFor(emi: number, annualRate: number, months: number) { const monthlyRate = annualRate / 1200; return emi * ((1 + monthlyRate) ** months - 1) / (monthlyRate * (1 + monthlyRate) ** months) }

export type Assessment = { verdict: 'borrow' | 'borrow-less' | 'dont'; verdictTitle: string; verdictReason: string; lenderMax: number; safeMax: number; lenderEmi: number; safeEmi: number; stressEmi: number; stressSafeMax: number; fairRate: [number, number]; apr: [number, number]; productLabel: string; confidence: 'High' | 'Medium' | 'Low'; confidenceNote: string; reasons: string[]; negotiation: string[] }

export function assess(a: Answers): Assessment {
  const foir = a.incomeType === 'salaried' ? 0.5 : a.incomeType === 'self-employed' ? 0.45 : 0.38
  const stabilityPenalty = a.incomeHistory === 'under-1' ? 0.08 : a.incomeHistory === 'variable' ? 0.04 : 0
  const scoreUnknown = a.scoreKnown === 'no'
  const scorePenalty = scoreUnknown ? 0.03 : a.score < 650 ? 0.1 : a.score < 725 ? 0.04 : 0
  const variablePenalty = a.variableShare / 100 * 0.05
  const coApplicantLift = a.coApplicant === 'yes' ? 0.03 : 0
  const agePenalty = a.age > 50 ? 0.03 : a.age < 23 ? 0.02 : 0
  const lenderFoir = Math.max(0.25, foir - stabilityPenalty - scorePenalty - variablePenalty - agePenalty + coApplicantLift)
  const lenderEmi = Math.max(0, a.income * lenderFoir - a.existingEmi)
  const expenseBuffer = a.income * (a.incomeType === 'informal' ? 0.12 : 0.1)
  const savingsFactor = Math.min(1, 0.9 + Math.min(a.emergencySavings, 6) * 0.0167)
  const safeEmi = Math.max(0, Math.min(a.income * 0.33 - a.existingEmi, a.income - a.expenses - a.existingEmi - expenseBuffer) * savingsFactor)
  const stressSafeEmi = Math.max(0, safeEmi * 0.78 - (a.incomeType === 'informal' ? a.existingEmi * 0.1 : 0))
  const [baseLow, baseHigh] = rateBands[a.loanType]
  const scoreLift = scoreUnknown ? 1.5 : a.score >= 750 ? -1.2 : a.score >= 700 ? 0 : 2
  const incomeLift = a.incomeType === 'informal' ? 1.5 : a.incomeType === 'self-employed' ? 0.75 : 0
  let fairRate: [number, number] = [Math.max(7, baseLow + scoreLift + incomeLift), baseHigh + (scoreUnknown ? 2 : 0) + incomeLift]
  if (a.loanType === 'business' && a.collateral > a.wanted * 1.2) fairRate = [10.5, 14]
  const feeImpact = a.processingFee / Math.max(12, a.tenure) * 2
  const apr: [number, number] = [fairRate[0] + feeImpact, fairRate[1] + feeImpact]
  const productLabel = a.loanType === 'business' && a.collateral > 0 ? 'Secured business loan / LAP' : a.loanType === 'two-wheeler' ? 'Two-wheeler loan' : a.loanType === 'lap' ? 'Loan against property' : a.loanType === 'gold' ? 'Gold loan' : 'Unsecured personal loan'
  const lenderMax = round(principalFor(lenderEmi, fairRate[1], a.tenure))
  const safeMax = round(principalFor(safeEmi, fairRate[0], a.tenure))
  const stressSafeMax = round(principalFor(stressSafeEmi, fairRate[0] + 2, a.tenure))
  const badSignals = a.bounces !== 'none' || (a.incomeType === 'informal' && a.expenses >= a.income * 0.7)
  const verdict: Assessment['verdict'] = safeEmi <= 0 || badSignals ? 'dont' : a.wanted > safeMax * 1.05 || stressSafeMax < a.wanted * 0.8 ? 'borrow-less' : 'borrow'
  const verdictTitle = verdict === 'dont' ? 'Pause this loan' : verdict === 'borrow-less' ? 'Borrow less than you asked' : 'This can fit, with a ceiling'
  const verdictReason = verdict === 'dont' ? 'Your current cash flow has no reliable room for another EMI. Fix the bounce or build a buffer before taking new debt.' : verdict === 'borrow-less' ? `A lender may sanction more than your resilient budget can carry. Keep the new EMI under ${formatINR(safeEmi)}.` : `Your new EMI can stay within ${formatINR(safeEmi)} and still leave room for a bad month.`
  const confidence: Assessment['confidence'] = scoreUnknown || a.incomeType === 'informal' ? 'Low' : a.collateral > 0 && a.incomeHistory === '3-plus' ? 'High' : 'Medium'
  const reasons = [`Lender ceiling uses a ${Math.round(lenderFoir * 100)}% FOIR cap for ${a.incomeType.replace('-', ' ')} income, less your existing ${formatINR(a.existingEmi)} EMI.`, `Your safe ceiling protects ${a.incomeType === 'informal' ? '12%' : '10%'} of income for shocks and respects your stated ${formatINR(a.expenses)} household outflow.`, scoreUnknown ? 'No score was supplied, so the rate band is wider and the lender ceiling is held back.' : `A ${a.score} score moves your rate band and lender ceiling.`]
  const quoteLine = a.offeredRate > 0 ? `The quoted ${formatRate(a.offeredRate)} is ${a.offeredRate > fairRate[1] ? 'above' : 'inside'} this fair band; ask them to explain the gap.` : 'If you receive a quote, compare it to this band and ask for the reason for any gap.'
  const negotiation = [`Ask for ${formatRate(fairRate[0])}–${formatRate(fairRate[1])} interest, not a single headline number.`, quoteLine, `Ask the lender to show APR of ${formatRate(apr[0])}–${formatRate(apr[1])} including your ${a.processingFee}% processing fee.`, `Do not agree to an EMI above ${formatINR(safeEmi)}; at +2 points, your stress ceiling falls to ${formatINR(stressSafeEmi)}.`]
  return { verdict, verdictTitle, verdictReason, lenderMax, safeMax, lenderEmi, safeEmi, stressEmi: emiFor(a.wanted, fairRate[1] + 2, a.tenure), stressSafeMax, fairRate, apr, productLabel, confidence, confidenceNote: scoreUnknown ? 'Score unknown; range is wider by design.' : 'Based on the answers you gave; lenders may apply their own policy.', reasons, negotiation }
}
export function formatINR(value: number) { return `₹${Math.max(0, Math.round(value)).toLocaleString('en-IN')}` }
