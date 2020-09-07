var MongoClient = require('mongodb').MongoClient;
var database;


module.exports = {

	//Helper method to provide "syntax sugar" for handling API responses
	handleResponse: function(status, data, res) {
		var response = {}
		response.status = status
		response.payload = data
		res.json(response)	
	},

	/**
	Creates a Regions Database REFERENCE.
	(Note: A database reference is NOT intialized UNTIL a Collection is made)
	*/
	connectToServer: function(callback) {
		MongoClient.connect( "mongodb://localhost:27017/", function(err, client) {
			database = client.db('Regions')
			//create the collection
			database.listCollections({name: 'AdminUser'})
			.next((err, exists) => {
				if (err) {
					callback(err)
				} else {
					if (!exists) {
						database.createCollection('AdminUser', (err, result) => {
							if (err) callback(err)
							console.log('Regions Database Created! (utility-functions.js)')
							console.log('AdminUser collection Created (utility-functions.js)')
						})
					}
				}
			})

			return callback(err)
		})
	},

	//Getter for the database reference
	getDb: function() {
		return database
	}



}