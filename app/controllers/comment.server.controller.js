'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Comment = mongoose.model('Comment'),
    _ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function(req, res) {
    console.log(req);
    var comment = new Comment(req.body);
    comment.user = req.post.user;
    comment.post = req.post;

    comment.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comment);
        }
    });
};

exports.index = function(req, res) {
    var postId = req.params.postId;
    Comment.find({post:postId}).sort('-created').populate('user', 'personal.displayName').exec(function(err, comments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comments);
        }
    });
};

exports.all = function(req, res) {
    Comment.find().populate('user', 'personal.displayName').exec(function(err, comments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comments);
        }
    });
};

exports.show = function(req, res) {
    res.jsonp(req.comment);
};

exports.update = function(req, res) {
    var comment = req.comment;
    comment = _.extend(comment, req.body);
    comment.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comment);
        }
    });
};

exports.delete = function(req, res) {
    var comment = req.comment;

    comment.remove(function(err) {
      if(err) {
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          });
      } else {
          res.jsonp(comment);
      }
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.comment.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'Usuario no autorizado'
        });
    }
    next();
};
