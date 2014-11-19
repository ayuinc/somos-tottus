'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Benefit = mongoose.model('Benefit'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post'),
    _ = require('lodash');

/**
 * Create a Benefit
 */
exports.create = function(req, res) {
    var post = new Post(req.body.post);
    post.user = req.user;
    post.category = 'Benefit';

    var benefit = new Benefit(req.body.benefit);

    post.save(function(err, post) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            benefit.post = post;
            benefit.save(function(err) {
                if(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(benefit);
                }
            });
        }
    });
};

/**
 * Show the current Benefit
 */
exports.show = function(req, res) {
    res.jsonp(req.benefit);
};

/**
 * Update a Benefit
 */
exports.update = function(req, res) {

};

/**
 * Delete an Benefit
 */
exports.delete = function(req, res) {

};

/**
 * List of Benefits
 */
exports.index = function(req, res) {
    Benefit.find().limit(20)
        .populate('post', 'name detail')
        .exec(function(err, benefits) {
            if(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            res.jsonp(benefits);
        });
};

exports.benefitByID = function(req, res, next, id) {
    Benefit.findById(id)
        .populate('post', 'name detail')
        .exec(function(err, benefit) {
            if(err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            req.benefit = benefit;
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
