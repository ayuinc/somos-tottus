'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        events = require('../../app/controllers/events');

    app.route('/events').get(events.index);
    app.route('/events').post(users.requiresLogin, events.create);
    app.route('/events/:eventId').get(events.show);
    app.route('/events/:eventId').put(users.requiresLogin, events.hasAuthorization, events.update);
    app.route('/events/:eventId').delete(users.requiresLogin, events.hasAuthorization, events.delete);

    app.param('eventId', events.eventByID);    
};
