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
exports.list = function(req, res) {
// Init Variables
    User.find(function(err, users) {
        if(err){
            res.send(err);
        }
        res.json(users);
	});
};
