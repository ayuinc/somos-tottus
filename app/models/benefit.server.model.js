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
    },
    category: {
      type: String,
      trim: true,
      required: false
    }
});

mongoose.model('Benefit', BenefitSchema);
