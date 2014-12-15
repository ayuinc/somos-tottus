'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Notification = mongoose.model('Notification'),
    _ = require('lodash');

exports.create = function(req, res) {
    var notification = new Notification(req.body);
    notification.user = req.user;

    notification.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(notification);
        }
    });
};

exports.index = function(req, res) {
    Notification.find().sort('-created').populate('user', 'personal.displayName').exec(function(err, notifications) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(notifications);
        }
    });
};

exports.show = function(req, res) {
    res.jsonp(req.notification);
};

exports.update = function(req, res) {
    var notification = req.notification;

    notification = _.extend(notification, req.body);

    notification.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(notification);
        }
    });
};

exports.delete = function(req, res) {
    var notification = req.notification;

    notification.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(notification);
        }
    });
};

exports.notificationByID = function(req, res, next, id) {
    Notification.findById(id).populate('user', 'personal.displayName').exec(function(err, notification) {
        if(err) return next(err);
        if(!notification) return next(new Error('Error leyendo notification ' + id));
        req.notification = notification;
        next();
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.notification.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'Usuario no autorizado'
        });
    }
    next();
};