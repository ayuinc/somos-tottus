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
        type: Date,
        default: Date.now
    },

});

mongoose.model('Comment', CommentSchema);