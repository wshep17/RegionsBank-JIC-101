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
  const endingBalanceData = [];
  var prevLoanAmount = 0;
  var prevLoanTerm = 0;
  for (let i = 0; i < numYears; i++) {
    const newLoanAmount = loanAmount - prevLoanAmount; // update new loan amount based on accumulated principal paid
    if (newLoanAmount < 0) {
      return [interestPaidData, principalPaidData, endingBalanceData];
    }
    const amortizedData = amortize({
      amount: newLoanAmount,
      rate: interestRate,
      totalTerm: loanTerm - prevLoanTerm, // update new loan term: 12 months fewer
      amortizeTerm: 12 // our graph shows per-year data; 12 months in a year
    });
    interestPaidData.push({ 'year': i + 1, 'dollars': amortizedData.interestRound })
    principalPaidData.push({ 'year': i + 1, 'dollars': amortizedData.principalRound })
    endingBalanceData.push({ 'year': i + 1, 'dollars': amortizedData.balanceRound })
    prevLoanAmount += amortizedData.principal;
    prevLoanTerm += 12;
  }

  return [interestPaidData, principalPaidData, endingBalanceData];
}


function calculateAffordability(inputs) {
  const {
    monthlyPayment,
    interestRate,
    salesTaxRate,
    cashBack,
    valueOfTradeIn,
    amountOwnedOnTradeIn,
    downPayment,
  } = inputs;

  const netTradeInWorth = valueOfTradeIn - amountOwnedOnTradeIn;

  const graphData = []
  for (let i = 1; i < 5; i++) {
    //loan term in months, start with 12 months, ends with 60 months
    const loanTerm = i * 12;
    // loan amount payed after the loan term
    const loanAmount = monthlyPayment * loanTerm * 100 * (1/(1 + interestRate));
    // vehicle price affordable with the loan Amount available
    const vehiclePrice = (cashBack + downPayment + netTradeInWorth) * (loanAmount * 100 / (1 + salesTaxRate));
    if (vehiclePrice < 0) {
      return graphData;
    }
    graphData.push({ 'year': i, 'dollars': vehiclePrice })
  }
  return graphData;
}

export { calculateLoanData, calculateAmortizedLoanData, calculateAffordability};
