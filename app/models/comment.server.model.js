'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	// Comment model fields   
	// ...
	post: {
        type: Schema.ObjectId,
        ref: 'Post',
        required: true
    },
	user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	text: 		{
		type: String,
		required: 'Por favor, rellene el cuadro de texto',
		trim: true
	},
    updated: {
        type: Date
    },
    created: {
        type: Date
    },

});

CommentSchema.pre('save', function(next) {
    var now = new Date();
    this.updated = now;
    if (!this.created) this.created = now;
    next();
});

mongoose.model('Comment', CommentSchema);
