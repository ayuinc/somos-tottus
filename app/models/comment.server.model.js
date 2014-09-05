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
	postId:    {
	    type: Schema.Types.ObjectId,
	    required: true
	},
	userId:    {
	    type: Schema.Types.ObjectId,
	    required: true
	},
	text: 		{
		type: String,
		required: 'Please fill in a textfield',
		trim: true
	}

});

mongoose.model('Comment', CommentSchema);