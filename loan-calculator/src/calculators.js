function calculateMonthlyPayment(inputs) {
  const {
    purchasePrice,
    cashBack,
    taxRate,
    tradeInValue,
    tradeInOwed,
    loanTerm,
    interestRate,
    downPayment,
    monthlyPayment,
  } = inputs;
  return 0; //monthlyPayment = purchasePrice * loanTerm * interestRate;
}

export { calculateMonthlyPayment };