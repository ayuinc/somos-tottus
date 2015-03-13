'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.personal.displayName = user.personal.firstName + ' ' + user.personal.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'Usuario no autorizado'
		});
	}
};

exports.search = function(req, res) {
	User.search({
	  	query_string: {
	    	query: req.params.query + '~'
	  	}
	}, function(err, results) {
		if(results.hits.total) {
			var aux = results.hits.hits;
			var users = [];
			for (var i = aux.length - 1; i >= 0; i--) {
				aux[i]._source.password = undefined;
				users.push(aux[i]._source);
			}

			res.jsonp(users);
		} else {
		  	res.jsonp({
				message: 'No hay coincidencias con tu búsqueda'
			});
		}
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

exports.show = function(req, res) {
    res.jsonp(req.profile || null);
};
