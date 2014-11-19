'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Benefit Schema
 */
var BenefitSchema = new Schema({
  // Benefit model fields
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
    }
    // },
    // location:     {
    //     type: String,
    //     trim: true,
    //     required: 'Por favor, rellene el cuadro de texto',
    // },
    // attendees: [{
    //     type: Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // }]
});

mongoose.model('Benefit', BenefitSchema);
