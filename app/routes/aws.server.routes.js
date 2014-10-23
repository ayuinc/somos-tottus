'use strict';

module.exports = function(app) {
    // AWS S3 routing
    var aws = require('../../app/controllers/aws');
    app.route('/aws/s3-signature').get(aws.signature);
};