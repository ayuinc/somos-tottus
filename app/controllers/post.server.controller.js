'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    Post = mongoose.model('Post');

/**
 * Create a Post
 */
exports.create = function(req, res) {

};

/**
 * Show the current Post
 */
exports.read = function(req, res) {

};

/**
 * Update a Post
 */
exports.update = function(req, res) {

};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {

};

/**
 * List of Posts
 */
exports.list = function(req, res) {
    Post.find(function(err, Posts) {
        if(err){
            res.send(err);
        }
        res.json(Posts);
    });
};