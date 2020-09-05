var express = require('express');
var router = express.Router();
var mongo = require('../scripts/db-setup');
var db = mongo.getDb();
var utilityFunctions = require('../scripts/utility-functions')

//API index route to make sure things work properly(remove before production)
router.get('/', function(req, res, next) {
	res.json({'message': 'Ya made it buddy!'})
});

//API route to fetch all the chat rooms.
router.get('/get-rooms', function(req, res, next) {
	fetchChatRooms()
	.then((data) => {
		utilityFunctions.handleResponse(200, data, res)
	})
	.catch((err) => {
		utilityFunctions.handleResponse(404, 'Error Fetching User', res)
	})
});


/**
This method will return a promise depending on the search results of
fetching all the chat rooms from mongo database.
*/
function fetchChatRooms() {
	return new Promise((resolve, reject) => {
		db.collection('ChatRooms').find({}).toArray(function(err, data) {
			if (data) {
				resolve(data)
			} else {
				reject(err)
			}
		})
	})
}

module.exports = router;
