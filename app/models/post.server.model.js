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
        required: 'Detail cannot be blank',
    },
    likes:      {
        type    : [{type: Schema.Types.ObjectId, required: true}],
        default : []
    },
    comments:       {
        type    : [{type: Schema.Types.ObjectId, required: true}],
        default : []
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