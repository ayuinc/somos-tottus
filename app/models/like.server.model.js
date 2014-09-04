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
});

mongoose.model('Like', LikeSchema);