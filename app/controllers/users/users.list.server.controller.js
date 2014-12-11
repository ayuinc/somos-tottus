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
        .where('category').equals('Publicación')
        .populate('user', 'personal.displayName assets.profilePicURL organizational.currentJobPosition organizational.branch')
        .populate('comments')
        .populate('likes')
        .sort('-created')
        .exec(function(err, posts) {
            if(err) return next(err);
            if(!posts) return next(new Error('Error leyendo los posts del usuario' + req.params.userId));
            return res.json(posts);
        });
};

exports.birthdaysPerUser = function(req, res, next) {
    var actualMonth = new Date().getMonth(); // January = 0, Febrary = 1, ...
    var usersBirthdays = [];
    var itertaciones = 0;
    User.find()
        .select('personal.dateOfBirth')
        .select('personal.displayName')
        .select('organizational.currentJobPosition')
        .select('organizational.branch')
        .select('_id')
        .sort('personal.dateOfBirth')
        .exec(function(err, users) {
            if(err) return next(err);   
            if(!users) return next(new Error('Error leyendo las fechas de cumpleaños por usuario'));
            for (var i = 0; i < users.length; i++) {
                var monthOfBirth = new Date(users[i].personal.dateOfBirth).getMonth();
                if(actualMonth === monthOfBirth){
                    usersBirthdays.push(users[i]);
                }
            }
            return res.json(usersBirthdays);
        });
};
