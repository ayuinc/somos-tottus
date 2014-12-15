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
        required: true
    },
    end: {
        type: Date,
        required: true
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
    }],
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

EventSchema.pre('save', function(next) {
    var now = new Date();
    this.updated = now;

    if (!this.created) this.created = now;
    next();
});

EventSchema.methods.registerAttendee = function(user) {
    var _this = this;

    _this.attendees.push(user);
    _this.save();
};

mongoose.model('Event', EventSchema);
