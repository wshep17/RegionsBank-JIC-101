module.exports = {

	//Helper method to provide "syntax sugar" for handling API responses
	handleResponse: function(status, data, res) {
		var response = {}
		response.status = status
		response.payload = data
		res.json(response)	
	}
}