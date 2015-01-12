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
  post: {
    type: Schema.ObjectId,
    ref: 'Post'
  },
  match: {
    type: [{
      user: { type: Schema.ObjectId, ref: 'User'},
      isRead: { type: Boolean, default: false}
    }],

    default: []
  },
  nextUrl: {
    type: String,
    required: true
  },
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