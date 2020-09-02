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
    loanAmount,
  } = inputs;
  loanAmount = purchasePrice - downPayment;
  monthlyPayment = loanAmount * loanTerm * interestRate;

  return 0; //monthlyPayment = purchasePrice * loanTerm * interestRate;
}

export { calculateMonthlyPayment };