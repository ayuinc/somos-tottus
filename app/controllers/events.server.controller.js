'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Evt = mongoose.model('Event'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post'),
    Notification = mongoose.model('Notification'),
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
    var evt = req.evt;

    evt.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Notification.remove({ post: evt.post }, function(err) {
                if(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            });

            Post.remove({ _id: evt.post }, function(err) {
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
 * List of Events
 */
exports.index = function(req, res) {
    var now = new Date();

    Evt.find({
            start: { 
                $gte: now
            }
        })
        .limit(30)
        .populate('post', 'name detail imgFilePath category')
        .sort('start')
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

exports.getAttendees = function(req, res) {
    var evt = req.evt;

    Evt.findById(evt._id)
        .populate('post', 'name')
        .exec(function(err, evt) {
            if(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }

            User.populate(evt, {
                    path: 'attendees',
                    select: 'personal.displayName assets.profilePicURL organizational.currentJobPosition organizational.branch',
                }, function(err, data) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    res.jsonp(data);
                });

        });
};

exports.eventByID = function(req, res, next, id) {
    Evt.findById(id)
        // .populate('post', 'name detail imgFilePath category')
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
    if (req.user.roles.indexOf('admin') === -1) {
        if (req.evt.post.user.id !== req.user.id) {
            return res.status(403).send({
                message: 'Usuario no autorizado'
            });
        }
    }
    next();
};
