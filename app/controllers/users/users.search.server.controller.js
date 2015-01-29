'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

// exports.search = function(req, res) {
// 	User.search({
// 	  	query_string: {
// 	    	query: req.params.query
// 	  	}
// 	}, function(err, results) {
// 	  	res.jsonp(results)
// 	});
// };