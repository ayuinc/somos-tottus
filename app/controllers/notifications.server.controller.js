'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Notification = mongoose.model('Notification'),
    User = mongoose.model('User'),
    _ = require('lodash');

exports.create = function(req, res) {
    var notification = new Notification(req.body);
    var match = [];

    User.find(function(err, users) {
        if(err) {
            return res.status(400).send({
                message: 'error reading users.'
            });
        } else {
            for(var i in users) {
                match.push({ user: users[i] });
            }

            notification.match = match;            
            notification.save(function(err) {
                if(err) {
                    return res.status(400).send({
                        message: err
                    });
                } else {
                    res.jsonp(notification);
                }
            });
        }
    });
};

var notificationIsRead = function(notification, user) {
    var isRead;
    for(var i in notification.match) {
        if(notification.match[i].user == user.id) {
            isRead = notification.match[i].isRead;
            return isRead;
        }
    }
}

exports.index = function(req, res) {
    Notification.find()
        .sort('-created')
        .populate('post', 'detail name category imgFilePath')
        .exec(function(err, notifications) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var arr = [];
                for(var i in notifications) {
                    var elem = {
                        _id: notifications[i]._id,
                        post: notifications[i].post,
                        nextUrl: notifications[i].nextUrl,
                        isRead: notificationIsRead(notifications[i], req.user)
                    };

                    arr.push(elem);
                }
                res.jsonp(arr);
            }
        });
};

exports.show = function(req, res) {
    res.jsonp(req.notification);
};

exports.markAsRead = function(req, res) {
    var notif = req.notification;

    for(var i in notif.match) {
        if(notif.match[i].user == req.user.id) {
            notif.match[i].isRead = true;
        }
    }

    notif.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err),
            });
        } else {
            res.jsonp(notif);
        }
    });
};

exports.countUnread = function(req, res) {
    Notification.find()
        .exec(function(err, notifications) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var count = 0;

                for(var i in notifications) {
                    if(!notificationIsRead(notifications[i], req.user)) {
                        count++;
                    }
                }

                res.jsonp({
                    unread: count
                });
            }
        });
}

exports.notificationByID = function(req, res, next, id) {
    Notification.findById(id).exec(function(err, notification) {
        if(err) return next(err);
        if(!notification) return next(new Error('Error leyendo notificación ' + id));
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