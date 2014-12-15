'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({

  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  notifications:     {
    type: Object,
    required: 'Please fill in a textfield',
    trim: true
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Notification', NotificationSchema);