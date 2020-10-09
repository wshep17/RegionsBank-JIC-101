const response1 = "response for faq 1"
const response2 = "response for faq 2"
const response3 = "response for faq 3"
const redirectResponse = "Please wait while I connect you with a Regions representative"

function getChatbotResponse(userMessage) {
    let response;
    let status;
    switch(userMessage) {
        case "faq 1":
            response = response1
            status = true
            break;
        case "faq 2":
            response = response2
            status = true
            break;
        case "faq 3":
            response = response3
            status = true
            break;
        default:
            response = redirectResponse
            status = false
            break;
    }
    return {message: response, status: status}
}

export {getChatbotResponse};
