'use strict';

module.exports = function(app) {
    var posts = require('../../app/controllers/post');

    app.route('/posts').get(posts.list);
};