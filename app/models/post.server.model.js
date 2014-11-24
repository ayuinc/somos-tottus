'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Comment = mongoose.model('Comment'),
    Like = mongoose.model('Like');

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
<<<<<<< HEAD
    name: {
        type: String,
        default: '',
        trim: true
=======
    name:     {
        type: String,
        default: '',
        trim: true,
>>>>>>> events
    },
    detail:     {
        type: String,
        default: '',
        trim: true,
        required: 'Por favor, rellene el cuadro de texto',
    },
    notification:     {
        type: Schema.ObjectId,
        ref: 'Notification'/*,
        required: true*/
    },
    imgFilePath: {
        type: String,
        default: 'assets/img/img-placeholder.png'
    },
    category: {
        type: String
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

PostSchema.pre('save', function(next) {
    var now = new Date();
    this.updated = now;

    if (!this.category) this.category = 'Publicación';
    if (!this.created) this.created = now;
    next();
});

// pre hook, it doesn't work
// PostSchema.pre('query', function(query, next) {
//     query.where({ category: 'Publicación' });
//     next();
// });

PostSchema.methods.newComment = function(data) {
    var _this = this;
    var comment = new Comment({
        post: _this,
        user: data.user,
        text: data.text
    });
    comment.save();

    _this.comments.push(comment);
    _this.save();
};

PostSchema.methods.newLike = function(data) {
    var _this = this;
    var like = new Like({
        post: _this,
        user: data.user,
    });
    like.save();

    _this.likes.push(like);
    _this.save();
};

mongoose.model('Post', PostSchema);
