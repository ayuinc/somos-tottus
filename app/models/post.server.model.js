'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
	// Post model fields   
	// ...
	userId: 	{
		type: Schema.Types.ObjectId,
		required: true
	},
	detail: 	{
		type: String,
		trim: true,
		required: 'Please fill in a textfield',
	},
	likes: 		{
	    type	: [{type: Schema.Types.ObjectId, required: true}],
	    default	: []
	},
	comments: 		{
	    type	: [{type: Schema.Types.ObjectId, required: true}],
	    default	: []
	},
});

mongoose.model('Post', PostSchema);