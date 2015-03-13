'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Store = mongoose.model('Store'),
    Post = mongoose.model('Post'),
    Evt = mongoose.model('Event'),
    _ = require('lodash');

/**
 * Create a Store
 */
exports.create = function(req, res) {
    var store = new Store(req.body);

    store.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(store);
        }
    });
};

/**
 * Show the current Store
 */
exports.show = function(req, res) {
    res.jsonp(req.store);
};

/**
 * Update a Store
 */
exports.update = function(req, res) {
    var store = req.store ;

    store = _.extend(store , req.body);

    store.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(store);
        }
    });
};

/**
 * Delete an Store
 */
exports.delete = function(req, res) {
    var store = req.store ;

    store.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(store);
        }
    });
};

/**
 * List of Stores
 */
exports.list = function(req, res) { 
    Store.find().sort('-created').exec(function(err, stores) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(stores);
        }
    });
};

/**
 * Posts by Store
 */
exports.getPosts = function(req, res) {
    Post.find()
        .where('store').equals(req.store._id)
        .where('category').equals('Publicación')
        .sort('-created')
        .limit(30)
        .populate('likes')
        .populate('user', 'personal.displayName assets.profilePicURL organizational.currentJobPosition organizational.branch')
        .exec(function(err, posts) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            res.jsonp(posts);
        });
};

exports.getEvents = function(req, res) {
    var now = new Date();

    Post.find({
            $and: [{store: req.store._id}, {category: 'Evento'}]
        })
        .select('_id detail category store')
        .exec(function(err, posts) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            
            var postsArr = [];

            for (var i = posts.length - 1; i >= 0; i--) {
                postsArr.push(posts[i]._id);
            }

            Evt.find({
                    start: { 
                        $gte: now
                    },
                    post: {
                        $in: posts
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
        });
};

/**
 * Store middleware
 */
exports.storeByID = function(req, res, next, id) { 
    Store.findById(id).exec(function(err, store) {
        if (err) return next(err);
        if (! store) return next(new Error('Failed to load Store ' + id));
        req.store = store ;
        next();
    });
};

/**
 * Store authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.store.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
