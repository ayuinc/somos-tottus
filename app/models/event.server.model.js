'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	// Event model fields   
	// ...

    post:    {
        type: Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    start: {
        type: Date,
        default: Date.now
        // required: true
    },
    end: {
        type: Date,
        default: Date.now
        // required: true
    },
    location:     {
        type: String,
        trim: true,
        required: 'Por favor, rellene el cuadro de texto',
    },
    attendees: [{
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }]
});

mongoose.model('Event', EventSchema);
