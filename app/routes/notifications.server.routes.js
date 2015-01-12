'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users'),
      notifications = require('../../app/controllers/notifications');

  // --------------------backend--------------------
  // route                      verb                method
  // /notification              GET                 list notification      => notifications.index()
  // /notification              POST                create notification    => notification.create()

  app.route('/notifications').get(notifications.index);
  app.route('/notifications').post(users.requiresLogin, notifications.create);
  app.route('/notifications/:notificationId/markAsRead').put(users.requiresLogin, notifications.markAsRead);
  app.route('/notifications/unRead').get(users.requiresLogin, notifications.countUnread);

  app.param('notificationId', notifications.notificationByID);
};