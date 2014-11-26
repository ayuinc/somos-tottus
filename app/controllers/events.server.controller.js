'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Evt = mongoose.model('Event'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post'),
    _ = require('lodash');

/**
 * Create a Event
 */
exports.create = function(req, res) {
    var post = new Post(req.body.post);
    post.user = req.user;
    post.category = 'Evento';

    var evt = new Evt(req.body.evt);

    post.save(function(err, post) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            evt.post = post;
            evt.save(function(err) {
                if(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(evt);
                }
            });
        }
    });
};

/**
 * Show the current Event
 */
exports.show = function(req, res) {
    res.jsonp(req.evt);
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
    Evt.find().limit(20)
        .populate('post', 'name detail imgFilePath category')
        .exec(function(err, events) {
            if(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            res.jsonp(events);
        });
};


exports.registerAttendee = function(req, res) {
    var evt = req.evt,
        usr = req.user;
    if(_.indexOf(evt.attendees, usr._id) === -1) {
        evt.attendees.push(usr);
        evt.save(function(err, evt) {
            if(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(evt);
            }
        });
    } else {
        return res.status(400).send({
            message: 'Asistencia ya registrada'
        });
    }
};

exports.eventByID = function(req, res, next, id) {
    Evt.findById(id)
        .populate('post', 'name detail imgFilePath category')
        .exec(function(err, evt) {
            if(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            req.evt = evt;
            next();
        });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.post.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'Usuario no autorizado'
        });
    }
    next();
};
