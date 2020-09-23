var amortize = require('amortize');

function calculateLoanData(inputs) {
  const {
    purchasePrice,
    cashBack,
    taxRate,
    tradeInValue,
    tradeInOwed,
    loanTerm,
    interestRate,
    downPayment,
  } = inputs;

  const netTradeInWorth = tradeInValue - tradeInOwed;
  const loanAmount = ((purchasePrice - cashBack) - downPayment - netTradeInWorth) * (1 + taxRate / 100);
  const monthlyPayment = (loanAmount / loanTerm) * (1 + interestRate / 100);

  return { loanAmount: loanAmount, monthlyPayment: monthlyPayment };
}

function calculateAmortizedLoanData(inputs) {
  const {
    purchasePrice,
    cashBack,
    taxRate,
    tradeInValue,
    tradeInOwed,
    loanTerm,
    interestRate,
    downPayment,
  } = inputs;

  const netTradeInWorth = tradeInValue - tradeInOwed;
  const loanAmount = ((purchasePrice - cashBack) - downPayment - netTradeInWorth) * (1 + taxRate / 100);

  const numYears = Math.ceil(loanTerm / 12); // number of years the loan extends
  const interestPaidData = [];
  const principalPaidData = [];
  var prevLoanAmount = 0;
  var prevLoanTerm = 0;
  for (let i = 0; i < numYears; i++) {
    const newLoanAmount = loanAmount - prevLoanAmount; // update new loan amount based on accumulated principal paid
    if (newLoanAmount < 0) {
      return [interestPaidData, principalPaidData];
    }
    const amortizedData = amortize({
      amount: newLoanAmount,
      rate: interestRate,
      totalTerm: loanTerm - prevLoanTerm, // update new loan term: 12 months fewer
      amortizeTerm: 12 // our graph shows per-year data; 12 months in a year
    });
    interestPaidData.push({ 'year': i + 1, 'dollars': amortizedData.interestRound })
    principalPaidData.push({ 'year': i + 1, 'dollars': amortizedData.principalRound })
    prevLoanAmount += amortizedData.principal;
    prevLoanTerm += 12;
  }

  return [interestPaidData, principalPaidData];
}

export { calculateLoanData, calculateAmortizedLoanData };
