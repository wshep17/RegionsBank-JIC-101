/*
  class for all loan calculations
*/
var amortize = require('amortize');
/*
  calculateLoanData() takes inputs from users then
  calculates a monthly loan rate with a flat interest rate
*/
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

/*
  calculateAmortizedLoanData() takes inputs from users then
  calculates a monthly loan rate with a compounding interest rate
*/
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

  const numYears = Math.ceil(loanTerm / 12); // Number of years the loan extends
  const interestPaidData = [];
  const principalPaidData = [];
  const endingBalanceData = [];
  var prevLoanAmount = 0;
  var prevLoanTerm = 0;
  for (let i = 0; i < numYears; i++) {
    const newLoanAmount = loanAmount - prevLoanAmount; // Update new loan amount based on accumulated principal paid
    if (newLoanAmount < 0) {
      return [interestPaidData, principalPaidData, endingBalanceData];
    }
    const amortizedData = amortize({
      amount: newLoanAmount,
      rate: interestRate,
      totalTerm: loanTerm - prevLoanTerm, // Update new loan term: 12 months fewer
      amortizeTerm: 12 // Our chart shows per-year data; 12 months in a year
    });
    interestPaidData.push({ 'year': i + 1, 'dollars': amortizedData.interestRound })
    principalPaidData.push({ 'year': i + 1, 'dollars': amortizedData.principalRound })
    endingBalanceData.push({ 'year': i + 1, 'dollars': amortizedData.balanceRound })
    prevLoanAmount += amortizedData.principal;
    prevLoanTerm += 12;
  }

  return [interestPaidData, principalPaidData, endingBalanceData];
}

/*
  calculateAffordability() takes inputs from users then
  calculates what kind of loan/ vehicle price the user can afford
*/
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
  for (let i = 1; i <= 5; i++) {
    // Loan term in months, start with 12 months, ends with 60 months
    const loanTerm = i*12;
    // Loan amount paid after the loan term
    const loanAmount = monthlyPayment * loanTerm * (100/(100 + interestRate));
    // Vehicle price affordable with the loan amount available
    const vehiclePrice = (cashBack + downPayment + netTradeInWorth) + (loanAmount * (100/(100 + salesTaxRate)));
    if (vehiclePrice < 0) {
      return graphData;
    }
    graphData.push({ 'year': loanTerm, 'dollars': vehiclePrice })
  }

  return graphData;
}

/*
  calculateCashBack() takes inputs from users then
  calculates a monthly loan rate based on a low interest rate
  and cash back rate to compare which saves more money
*/
function calculateCashBack(inputs) {
  const {
    purchasePrice,
    cashBack,
    lowInterestRate,
    taxRate,
    tradeInValue,
    tradeInOwed,
    loanTerm,
    interestRate,
    downPayment,
  } = inputs;

  const netTradeInWorth = tradeInValue - tradeInOwed;
  const totalInterestPaidData = []
  const totalPrincipalPaidData = []
  const totalData = []

  if (purchasePrice < 0) {
    return [totalInterestPaidData, totalPrincipalPaidData, totalData];
  }
  // Cash Back Calculations
  const totalCashBack = ((purchasePrice - cashBack) - downPayment - netTradeInWorth) * (1 + taxRate / 100);
  // Inputs for cash back data
  const monthlyCashBack = amortize({
    amount: totalCashBack,
    rate: interestRate,
    totalTerm: loanTerm, // Update new loan term: 12 months fewer
    amortizeTerm: loanTerm // Our chart shows per-year data; 12 months in a year
  });

  totalData.push({ 'year': 'Cash Back Option', 'dollars': monthlyCashBack.principal + monthlyCashBack.interest });
  totalPrincipalPaidData.push({ 'year': 'Cash Back Option', 'dollars': monthlyCashBack.principal });
  totalInterestPaidData.push({ 'year': 'Cash Back Option', 'dollars': monthlyCashBack.interest });

  // Low Rate Calculations
  const totalLowRate = ((purchasePrice) - downPayment - netTradeInWorth) * (1 + taxRate / 100);
  // Inputs for low rate data
  const monthlyLowRate = amortize({
    amount: totalLowRate,
    rate: lowInterestRate,
    totalTerm: loanTerm, // Update new loan term: 12 months fewer
    amortizeTerm: loanTerm // Our chart shows per-year data; 12 months in a year
  });
  totalData.push({ 'year': 'Low Rate Option', 'dollars': monthlyLowRate.principal + monthlyLowRate.interest });
  totalPrincipalPaidData.push({ 'year': 'Low Rate Option', 'dollars': monthlyLowRate.principal });
  totalInterestPaidData.push({ 'year': 'Low Rate Option', 'dollars': monthlyLowRate.interest });

  // Return data
  return [totalData, totalPrincipalPaidData, totalInterestPaidData];
}

export { calculateLoanData, calculateAmortizedLoanData, calculateAffordability, calculateCashBack};
