'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Comment = mongoose.model('Comment');

/**
 * Post Schema
 */
var PostSchema = new Schema({
    // Post model fields   
    // ...
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    detail:     {
        type: String,
        default: '',
        trim: true,
        required: 'Por favor, rellene el cuadro de texto',
    },
    likes:      {
        type    : [{ type: Schema.ObjectId, ref: 'Like' }],
        default : []
    },
    comments:       {
        type    : [{ type: Schema.ObjectId, ref: 'Comment' }],
        default : []
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
});

PostSchema.methods.newComment = function(data) {
    var _this = this;
    var comment = new Comment({
        post: _this,
        user: data.user,
        text: data.text
    });
    comment.save();

    _this.comments.push(comment._id);
    _this.save();
};

mongoose.model('Post', PostSchema);