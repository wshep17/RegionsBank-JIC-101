//API Imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var app = express();
var utilityFunctions = require('./scripts/utility-functions');


//Start db connection and step into callback
utilityFunctions.connectToServer(function(err) {
	if (err) {
		console.log(err)
	} else {

		//Establish Sessions for the entire API :)
		app.use(session({
			secret: 'sa7aeiwe8o-3$%^@()$_+@$0',
			resave: true, //refresh or "resave" session if another request is made
			saveUninitialized: false,
			cookie: { secure: false } //set the cookie regardless of an https connection
		}))

		//Our API Routes.
		var chat = require('./routes/chat');
		var auth = require('./routes/auth')

		//Setup the View Engine
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');

		//Where we initialize our API with necessary modules
		app.use(logger('dev'));
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use(express.static(path.join(__dirname, 'public')));

		//Where we "register" the imported routes for the API to use.
		app.use('/chat', chat);
		app.use('/auth', auth)

		//Our API Instructions for dealing with 404 errors
		app.use(function(req, res, next) {
		  next(createError(404));
		});

		//Our API Error Handler
		app.use(function(err, req, res, next) {
		  // set locals, only providing error in development
		  res.locals.message = err.message;
		  res.locals.error = req.app.get('env') === 'development' ? err : {};

		  // render the error page
		  res.status(err.status || 500);
		  res.render('error');
		});
	}
})




module.exports = app;
