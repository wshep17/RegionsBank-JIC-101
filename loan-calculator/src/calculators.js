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
    netTradeInWorth,
  } = inputs;
  netTradeInWorth = tradeInValue - tradeInOwed;
  //purchasePrice -= cashBack;
  loanAmount = ((purchasePrice - cashBack) - downPayment - netTradeInWorth) * taxRate;
  monthlyPayment = (loanAmount / loanTerm) * interestRate;
  
  return monthlyPayment; //monthlyPayment = purchasePrice * loanTerm * interestRate;
}

export { calculateMonthlyPayment };