'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Post = mongoose.model('Post');

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

exports.postsPerUser = function(req, res, next) {
	Post.find({ 'user': req.params.userId})
    .populate('users', 'personal.displayName', { '_id': req.params.userId })
    .populate('user', 'personal.displayName')
    .populate('comments')
    .populate('likes')
    .exec(function(err, posts) {
        if(err) return next(err);
        if(!posts) return next(new Error('Error leyendo los posts del usuario' + req.params.userId));
        return res.json(posts);
    });
};
