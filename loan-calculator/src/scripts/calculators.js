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
  const loanAmount = ((purchasePrice - cashBack) - downPayment - netTradeInWorth) * (1+taxRate/100);
  const monthlyPayment = (loanAmount / loanTerm) * (1+interestRate/100);

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
  const graphData = []
  var prevLoanAmount = 0;
  var prevLoanTerm = 0;
  for (let i = 0; i < numYears; i++) {
    const amortizedData = amortize({
      amount: loanAmount - prevLoanAmount, // update new loan amount based on accumulatd principal paid
      rate: interestRate,
      totalTerm: loanTerm - prevLoanTerm, // update new loan term: 12 months fewer
      amortizeTerm: 12 // our graph shows per-year data; 12 months in a year
    });
    graphData.push({ 'year': i+1, 'dollars': amortizedData.interestRound})
    prevLoanAmount += amortizedData.principal;
    prevLoanTerm += 12;
  }

  return graphData;
}

export { calculateLoanData, calculateAmortizedLoanData };
