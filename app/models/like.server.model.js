'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Like Schema
 */
var LikeSchema = new Schema({
    // Like model fields   
    // ...
    post:    {
        type: Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    user:    {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
    },
});

LikeSchema.pre('save', function(next) {
    var now = new Date();
    if (!this.created) this.created = now;
    next();
});

mongoose.model('Like', LikeSchema);
