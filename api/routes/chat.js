var express = require('express');
var router = express.Router();
var mongo = require('../scripts/db-setup');
var db = mongo.getDb();


router.get('/', function(req, res, next) {
	var response = {}
	fetchUser("William Sheppard")
	.then((data) => {
		response.status = 200
		response.payload = data;
		res.json(response)
	})
	.catch((err) => {
		response.status = 404
		response.payload = 'Error Fetching User'
		res.json(response)
	})
});


//Asynchronous function to fetch the user
function fetchUser(username) {
	return new Promise((resolve, reject) => {
		db.collection('Users').findOne({name: "William Sheppard"}, function(err, data) {
			if (data) {
				resolve(data)
			} else {
				reject(err)
			}
		})		
	})
}

module.exports = router;
