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
  notifications: [{
      title : String,
      content : String
      // created: Date,
      // updated: Date
  }],
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

NotificationSchema.pre('save', function(next) {
    var now = new Date();
    this.updated = now;

    if (!this.created) this.created = now;
    next();
});

mongoose.model('Notification', NotificationSchema);