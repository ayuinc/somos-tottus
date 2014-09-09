'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        posts = require('../../app/controllers/post');

    // --------------------backend--------------------
    // route               verb                method
    // /posts              GET                 list posts      => post.index()
    // /posts              POST                create post     => post.create()
    // /posts/:id          GET                 show post       => post.show()
    // /posts/:id          PUT                 update posts    => post.update()
    // /posts/:id          DELETE              delete posts    => post.delete()



    // --------------------frontend--------------------
    // state               verb                method
    // /posts/new          GET                 create on angular

   
    app.route('/posts').get(posts.index);
    app.route('/posts').post(users.requiresLogin, posts.create);
    app.route('/posts/:postId').get(posts.show);
    app.route('/posts/:postId').put(users.requiresLogin, posts.hasAuthorization, posts.update);
    app.route('/posts/:postId').delete(users.requiresLogin, posts.hasAuthorization, posts.delete);

    app.param('postId', posts.postByID);    
};