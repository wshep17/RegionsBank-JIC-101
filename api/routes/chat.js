var express = require('express');
var router = express.Router();
var utilityFunctions = require('../scripts/utility-functions');
var db = utilityFunctions.getDb();

//API index route to make sure things work properly(remove before production)
router.get('/', function(req, res, next) {
	res.json({'message': 'Ya made it buddy!'})
});

//API route to fetch all the chat rooms.
router.get('/get-rooms', isAdminMiddleWare, function(req, res, next) {
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

//API Admin-Only middleware
function isAdminMiddleWare(req, res, next) {
	if (req.session.email) {
		return next();
	} else {
		utilityFunctions.handleResponse(404, 'Page Not Found', res)
	}
}


module.exports = router;
