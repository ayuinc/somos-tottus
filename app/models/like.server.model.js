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
    postId:    {
        type: Schema.Types.ObjectId,
        required: true
    },
    userId:    {
        type: Schema.Types.ObjectId,
        required: true
    }
});

mongoose.model('Like', LikeSchema);