'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    EventModel = mongoose.model('Event'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post'),
    _ = require('lodash');

/**
 * Create a Event
 */
exports.create = function(req, res) {
    var post = new Post(req.body.post);
    post.user = req.user;

    post.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * Show the current Event
 */
exports.show = function(req, res) {

};

/**
 * Update a Event
 */
exports.update = function(req, res) {

};

/**
 * Delete an Event
 */
exports.delete = function(req, res) {

};

/**
 * List of Events
 */
exports.index = function(req, res) {

};

exports.eventByID = function(req, res, next, id) {
};

exports.hasAuthorization = function(req, res, next) {
    if (req.post.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'Usuario no autorizado'
        });
    }
    next();
};
