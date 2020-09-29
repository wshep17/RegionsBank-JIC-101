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
  for (let i = 1; i <= 5; i++) {
    // loan term in months, start with 12 months, ends with 60 months
    const loanTerm = i*12;
    // loan amount paid after the loan term
    const loanAmount = monthlyPayment * loanTerm * (100/(100 + interestRate));
    // vehicle price affordable with the loan amount available
    const vehiclePrice = (cashBack + downPayment + netTradeInWorth) + (loanAmount * (100/(100 + salesTaxRate)));
    if (vehiclePrice < 0) {
      return graphData;
    }
    graphData.push({ 'year': loanTerm, 'dollars': vehiclePrice })
  }
  return graphData;
}

function calculateCashBack(inputs) {
  const {
    purchasePrice,
    cashBack,
    lowinterestrate,
    taxRate,
    tradeInValue,
    tradeInOwed,
    loanTerm,
    interestRate,
    downPayment,
  } = inputs;

  const netTradeInWorth = tradeInValue - tradeInOwed;
  const graphData = []
  const totalInterestPaidData = []
  const totalPrincipalPaidData = []
  const totalData = []

  if (purchasePrice < 0) {
    return [totalInterestPaidData, totalPrincipalPaidData, totalData];
  }
  //Cash Back Calculations
  const totalCashBack = ((purchasePrice - cashBack) - downPayment - netTradeInWorth) * (1 + taxRate / 100);
  const totalPrincipalCashBack = (purchasePrice - cashBack); //loan amount
  const totalInterestCashBack = totalCashBack - totalPrincipalCashBack; //paid interest
  //const totalCashBack = totalInterestCashBack + totalPrincipalCashBack; //loan amount with interest
  //cashback option calculation
  const monthlyCashBack = amortize({
    amount: totalCashBack,
    rate: interestRate,
    totalTerm: loanTerm, // update new loan term: 12 months fewer
    amortizeTerm: 12 // our graph shows per-year data; 12 months in a year
  });
  //totalPrincipalCashBack
  totalInterestPaidData.push({ 'year': 1, 'dollars': totalInterestCashBack })
  totalPrincipalPaidData.push({ 'year': 1, 'dollars': totalPrincipalCashBack })
  totalData.push({ 'year': 1, 'dollars': totalCashBack })
  
  //Low Rate Calculations
  const totalLowRate = ((purchasePrice) - downPayment - netTradeInWorth) * (1 + taxRate / 100);
  const totalPrincipalLowRate = purchasePrice; //loan amount
  const totalInterestLowRate = totalLowRate - totalPrincipalLowRate; //paid interest
  //const totalLowRate = totalInterestLowRate + totalPrincipalLowRate; //loan amount with interest
  //low rate option calculation
  const monthlyLowRate = amortize({
    amount: totalLowRate,
    rate: lowinterestrate,
    totalTerm: loanTerm, // update new loan term: 12 months fewer
    amortizeTerm: 12 // our graph shows per-year data; 12 months in a year
  });

  totalInterestPaidData.push({ 'year': 2, 'dollars': totalInterestLowRate })
  totalPrincipalPaidData.push({ 'year': 2, 'dollars': totalPrincipalLowRate })
  totalData.push({ 'year': 2, 'dollars': totalLowRate })

  //return graphData
  return graphData;
}

export { calculateLoanData, calculateAmortizedLoanData, calculateAffordability, calculateCashBack};
