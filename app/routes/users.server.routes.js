'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');

	// Setting up the users profile api
	app.route('/users').get(users.list);
	app.route('/users').put(users.update);
	app.route('/users/birthdays').get(users.birthdaysPerUser); // cumpleaños por usuarios
	app.route('/users/me').get(users.me);
	app.route('/users/:userId').get(users.show);
	app.route('/users/:userId/posts').get(users.postsPerUser); // posts por usuarios
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/firstSignin').post(users.firstSignin);
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	app.route('/users/search/:query').get(users.search);
	
	// Finish by binding the user middleware
	app.param('userId', users.userByID 	);
	//app.param('user', users.postsPerUser);
};
