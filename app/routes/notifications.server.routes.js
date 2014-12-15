notifications.server.routes.js

'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users'),
      notification = require('../../app/controllers/notifications');

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


  app.route('/notification').get(notification.index);
  app.route('/notification').post(users.requiresLogin, users.hasAuthorization, notification.create);
  app.route('/notification/:notificationId').get(notification.show);
  app.route('/notification/:notificationId').put(users.requiresLogin, notification.hasAuthorization, notification.update);
  app.route('/notification/:notificationId').delete(users.requiresLogin, notification.hasAuthorization, notification.delete);

  app.param('notificationId', notification.notificationByID);
};