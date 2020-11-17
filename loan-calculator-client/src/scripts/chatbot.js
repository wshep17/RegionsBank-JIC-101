const whatIsQuestion = "What is...";
const loanQuestion = "Loan-based questions";
const interestQuestion = "What is an interest payment?";
const loanTermQuestion = "What is a loan term?";
const redirectQuestion = "Chat with an advisor";
const principalBalanceQuestion = "Why are the Principal Balance and the Payoff Amount Different?";
const autoLoanQuestion = "How does this auto loan work?";
const latePaymentQuestion = "How is this loan affected by late payments?";

const interestResponse = "An interst payment is the payment from a borrow to a lender of an amount above repayment of the amount borrowed, at a particular rate.";
const loanTermResponse = "The loan term is the length of time that you have to repay the loan."
const principalBalanceResponse = "The Payoff Amount represents the principal balance, plus accrued interest and any applicable fees. This is the amount you would have to pay to fully pay off your car."
const autoLoanResponse = "This is a simple interest loan. Interest is accrued against the remaining principle daily over the life of the loan. As the principal is paid off, the monthly interest decreases, meaning more of our payment goes towards principal each month."
const latePaymentResponse = "Late payments can result in late fees. It will also cause more interest to accrue between payments. This means you would pay more interest over the life of the loan."
const redirectResponse = "Please wait while I connect you with a loan advisor...";

function getChatbotResponse(context) {
    let response;
    let respond;
    let retContext;
    switch(context) {
        case "whatis":
            response = ""
            respond = false
            retContext = context
            break;
        case "loan":
            response = ""
            respond = false
            retContext = context
            break;
        case "interest":
            response = interestResponse
            respond = true
            retContext = ""
            break;
        case "term":
            response = loanTermResponse
            respond = true
            retContext = ""
            break;
        case "principal":
            response = principalBalanceResponse
            respond = true
            retContext = ""
            break;
        case "auto":
            response = autoLoanResponse
            respond = true
            retContext = ""
            break;
        case "late":
            response = latePaymentResponse
            respond = true
            retContext = ""
            break;
        case "redirect":
            response = redirectResponse
            respond = true
            retContext = context
            break;
        default:
            response = ""
            respond = false
            retContext = context
            break;
    }
    return {response: response, respond: respond, context: retContext}
}

function getChatbotBtns(context) {
    let btns;
    switch(context) {
        case "whatis":
            btns = [
                {text: interestQuestion, context: "interest"},
                {text: loanTermQuestion, context: "term"},
                {text: redirectQuestion, context: "redirect"},
                {text: "Back", context: ""}
            ]
            break;
        case "loan":
            btns = [
                {text: principalBalanceQuestion, context: "principal"},
                {text: autoLoanQuestion, context: "auto"},
                {text: latePaymentQuestion, context: "late"},
                {text: redirectQuestion, context: "redirect" },
                {text: "Back", context: ""}
            ]
            break;
        default:
            btns = [
                {text: whatIsQuestion, context: "whatis"},
                {text: loanQuestion, context: "loan"},
                {text: redirectQuestion, context: "redirect"},
            ]
            break;
    }
    return btns;
}

export {getChatbotResponse, getChatbotBtns};
