var express = require('express');
var router = express.Router();
var mongo = require('../scripts/db-setup');
var utilityFunctions = require('../scripts/utility-functions')
var db = mongo.getDb();
var AdminUser = require('../schema/AdminUser')

//API index route to make sure things work properly(remove before production)
router.get('/', function(req, res, next) {
	res.json({'message': 'Authentication Route!'})
});

//API Login Route
router.post('/login', function(req, res, next) {
	db.collection('AdminUser').find({'email': req.body.email}).toArray((err, data) => {
		if (data) {
			if (data[0].password === req.body.password) {
				req.session.email = data[0].email
				utilityFunctions.handleResponse(200, data[0], res)
			}
		} else {
			utilityFunctions.handleResponse(404, 'Incorrect Credentials', res)
		}
	})
})

//API Signup Route
router.post('/signup', function(req, res, next) {
	let adminUser = new AdminUser(req.body);
	saveAdmin(adminUser, req, res, next)
})

//API Authorization Check (aka: Are you an Admin/"Regions Representative" or not..?)
router.get('/auth-check', function(req, res, next) {
	if (req.session.email) {
		utilityFunctions.handleResponse(200, 'authorized', res)
	} else {
		utilityFunctions.handleResponse(404, 'unauthorized', res)
	}
})



//Function responsible for creating the admin user
function saveAdmin(adminUser, req, res, next) {
	//check if email exists in the db
	db.collection('AdminUser').find({email: req.body.email}).toArray((err, found) => {
		if (found.length > 0) {
			utilityFunctions.handleResponse(404, 'Email already in use', res)
		} else {
			//create the admin user
			AdminUser.create(adminUser)
			.then((user) => utilityFunctions.handleResponse(200, user, res))
			.catch((err) => utilityFunctions.handleResponse(404, err, res))			
		}
	})
}


module.exports = router;
