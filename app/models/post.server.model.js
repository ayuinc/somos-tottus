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
    userId:     {
        type: Schema.Types.ObjectId,
        required: true
    },
    detail:     {
        type: String,
        trim: true,
        required: 'Please fill in a textfield',
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
        postId: _this._id,
        userId: data.userId,
        text: data.text
    });
    comment.save();

    _this.comments.push(comment._id);
    _this.save();
};

mongoose.model('Post', PostSchema);