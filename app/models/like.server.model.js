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
    }
});

mongoose.model('Like', LikeSchema);