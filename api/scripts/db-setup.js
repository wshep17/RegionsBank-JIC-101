//This script is responsible for INITIALIZING the database reference(Testing Purposes Only!)

var MongoClient = require('mongodb').MongoClient;
var AdminUser = require('../schema/AdminUser')
var utilityFunctions = require('./utility-functions')


createDatabase()
.then(() => {
	populateDatabase()
})
.catch((err) => {
	console.log(err)
	process.exit(1)
})


//Note: To successfully create a database, you must ALSO place a collection in it ;)
function createDatabase() {
	return new Promise((resolve, reject) => {
		MongoClient.connect( "mongodb://localhost:27017/", function(err, client) {
			if (err) {
				reject(err)
			} else {
				let database = client.db('Regions')
				//Check to see if adminuser collection exists before creating it
				database.listCollections({name: 'AdminUser'})
				.next((err, exists) => {
					if (err) {
						reject(err)
					} else {
						if (exists) {
							//it already exists
							database.collection('AdminUser').drop((err, deletion_status) => {
								if (err) {
									reject(err)
								} else {
									console.log('AdminUser Collection successfully dropped! (db-setup.js)')
									resolve(deletion_status)
								}
							})
						} else {
							resolve(exists)
						}
					}
				})
			}
		})		
	})
}


function populateDatabase() {
	//Initialize Users
	var sarah = new AdminUser({'email': 'sarah@regions.com', 'password': 'password123'});
	var mike = new AdminUser({'email': 'mike@regions.com', 'password': 'password123'});
	var john = new AdminUser({'email': 'john@regions.com', 'password': 'password123'});

	//Create Admin Users in the AdminUser collection
	AdminUser.create(sarah)
	.then(() => AdminUser.create(mike))
	.then(() => AdminUser.create(john))
	.then(() => {
		console.log('Admin User Collection Created! (db-setup.js)')
		console.log('Admin User Collection Populated! (db-setup.js)')
		process.exit(1)
	})
	.catch((err) => console.log(err))
}


