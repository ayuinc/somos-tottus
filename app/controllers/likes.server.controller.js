'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Like = mongoose.model('Like'),
    _ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function(req, res) {
    var like = new Like(req.body);
    like.user = req.user;
    like.post = req.post;

    like.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(like);
        }
    });
};

exports.index = function(req, res) {
    var postId = req.params.postId;
    Like.find({post:postId}).sort('-created').populate('user', 'personal.displayName').exec(function(err, likes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(likes);
        }
    });
};

exports.show = function(req, res) {
    res.jsonp(req.like);
};

exports.all = function(req, res) {
    Like.find().populate('user', 'personal.displayName').exec(function(err, likes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(likes);
        }
    });
};
exports.update = function(req, res) {
    var like = req.like;

    like = _.extend(like, req.body);

    like.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(like);
        }
    });
};

exports.delete = function(req, res) {
    var like = req.like;

    like.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(like);
        }
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.like.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'Usuario no autorizado'
        });
    }
    next();
};
