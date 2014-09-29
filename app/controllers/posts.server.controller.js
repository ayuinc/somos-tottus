'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post'),
    _ = require('lodash');

exports.create = function(req, res) {
    var post = new Post(req.body);
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

exports.index = function(req, res) {
    Post.find().sort('-created').limit(25)
        .populate('comments', 'text')
        .populate('user', 'personal.displayName')
        .exec(function(err, posts) {
            User.populate(posts, {
                path: 'user',
                select: 'personal.displayName',
            }, function(err, data) {
                console.log('posts', data);
                res.jsonp(data);
            });

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                //res.jsonp(posts);
                console.log('posts');
            }
        });
};

exports.show = function(req, res) {
    res.jsonp(req.post);
};

exports.update = function(req, res) {
    var post = req.post;

    post = _.extend(post, req.body);

    post.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

exports.delete = function(req, res) {
    var post = req.post;

    post.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

exports.postByID = function(req, res, next, id) {
    Post.findById(id).populate('user', 'personal.displayName').exec(function(err, post) {
        if(err) return next(err);
        if(!post) return next(new Error('Error leyendo post ' + id));
        req.post = post;
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
