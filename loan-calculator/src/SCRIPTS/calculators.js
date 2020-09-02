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

export { calculateLoanData };