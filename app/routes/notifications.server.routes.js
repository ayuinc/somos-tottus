'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users'),
      notifications = require('../../app/controllers/notifications');

  // --------------------backend--------------------
  // route                      verb                method
  // /notification              GET                 list notification      => notifications.index()
  // /notification              POST                create notification    => notification.create()
  // /notification/:id          GET                 show notification      => notification.show()
  // /notification/:id          PUT                 update notification    => notification.update()
  // /notification/:id          DELETE              delete notification    => notification.delete()



  // --------------------frontend--------------------
  // state                      verb                method
  // /notification/new          GET                 create on angular


  app.route('/notifications').get(notifications.index);
  app.route('/notifications').post(users.requiresLogin, notifications.create);
  app.route('/notifications/:notificationId').get(notifications.show);
  app.route('/notifications/:notificationId').put(users.requiresLogin, notifications.hasAuthorization, notifications.update);
  app.route('/notifications/:notificationId').delete(users.requiresLogin, notifications.hasAuthorization, notifications.delete);

  app.param('notificationId', notifications.notificationByID);
};