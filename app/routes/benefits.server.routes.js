'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        benefits = require('../../app/controllers/benefits');

    app.route('/benefits').get(benefits.index);
    app.route('/benefits').post(users.requiresLogin, benefits.create);
    app.route('/benefits/:benefitId').get(benefits.show);
    app.route('/benefits/:benefitId').put(users.requiresLogin, benefits.hasAuthorization, benefits.update);
    app.route('/benefits/:benefitId').delete(users.requiresLogin, benefits.hasAuthorization, benefits.delete);

    app.param('benefitId', benefits.benefitByID);
};