'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        likes = require('../../app/controllers/likes');

    // --------------------backend--------------------
    // route                                verb                method
    // /likes                            GET                 likes list                   => like.create()
    // /likes/:likeId                    GET                 show comment                 => like.show()
    //
    // /posts/:postId/comments              GET                 list likes per post     => like.create()
    // /posts/:postId/likes/:likeId         GET                 show like               => like.show()   
    // /posts/:postId/likes/:likeId         PUT                 update like             => like.update()
    // /posts/:postId/likes/:likeId         DELETE              delete like             => like.delete()

    // --------------------frontend--------------------
    // state               verb                method
    // /comments/new          GET                 create on angular
    app.route('/likes').get(likes.all);
    app.route('/posts/:postId/likes').get(users.requiresLogin, likes.index);
    app.route('/posts/:postId/likes').post(users.requiresLogin, likes.create);
    app.route('/posts/:postId/likes/:likeId').get(likes.show);
    app.route('/posts/:postId/likes/:likeId').put(users.requiresLogin, likes.hasAuthorization, likes.update);
    app.route('/posts/:postId/likes/:likeId').delete(users.requiresLogin, likes.hasAuthorization, likes.delete);

};