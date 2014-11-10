'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Stores Schema
 */
var StoresSchema = new Schema({
	// Stores model fields   
	// ...

    name: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    employees: [{
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }],
    // events: [{
    //     type: Schema.ObjectId,
    //     ref: 'Event',
    //     required: true
    // }],
    // benefits: [{
    //     type: Schema.ObjectId,
    //     ref: 'Benefit',
    //     required: true
    // }],
    // vacancies: [{
    //     type: Schema.ObjectId,
    //     ref: 'Vacancy',
    //     required: true
    // }],
    posts: [{
        type: Schema.ObjectId,
        ref: 'Post',
        required: true
    }],
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Stores', StoresSchema);