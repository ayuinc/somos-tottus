'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var stores = require('../../app/controllers/stores');

	// Stores Routes
	app.route('/stores').get(stores.list);
	app.route('/stores').post(users.requiresLogin, stores.create);

	app.route('/stores/:storeId').get(stores.show);
	app.route('/stores/:storeId').put(users.requiresLogin, stores.hasAuthorization, stores.update);
	app.route('/stores/:storeId').delete(users.requiresLogin, stores.hasAuthorization, stores.delete);

	app.route('/stores/:storeId/posts').get(stores.getPosts);
	app.route('/stores/:storeId/events').get(stores.getEvents);

	// Finish by binding the Store middleware
	app.param('storeId', stores.storeByID);
};
