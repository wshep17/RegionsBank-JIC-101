var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Regions')

const AdminSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		required: "Email is required",
		match: [/.+@regions\..+/, "Please use your Regions email"]
	},
	password: {
		type: String,
		trim: true,
		required: "Password is required",
		validate: [
			function(input) {
				return input.length >= 6;
			}, "Password should be longer."
		]
	},
}, {collection: 'AdminUser'})

// Creates model from above schema
var AdminUser = mongoose.model("AdminUser", AdminSchema);

// Export the Admin User model
module.exports = AdminUser;