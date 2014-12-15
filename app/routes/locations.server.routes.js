'use strict';

module.exports = function(app) {
	// Routing logic   
	// ...

    var locations = require('../../app/controllers/locations');
    app.route('/locations').get(locations.list);
};
