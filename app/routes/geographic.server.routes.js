'use strict';

module.exports = function(app) {
	// Routing logic   
	// ...

    var geo = require('../../app/controllers/geographic');
    app.route('/districts').get(geo.districts);

};