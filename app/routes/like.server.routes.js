'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users'),
        likes = require('../../app/controllers/like');

    // --------------------backend--------------------
    // route               verb                method
    // /likes              POST                create post     => post.create()
    // /likes/:id          GET                 show post       => post.show()
    // /likes/:id          PUT                 update posts    => post.update()
    // /likes/:id          DELETE              delete posts    => post.delete()



    // --------------------frontend--------------------
    // state               verb                method
    // /likes/new          GET                 create on angular

   
    app.route('/likes').get(likes.index);
    app.route('/likes').post(users.requiresLogin, likes.create);
    app.route('/likes/:commentId').get(likes.show);
    app.route('/likes/:commentId').put(users.requiresLogin, likes.hasAuthorization, likes.update);
    app.route('/likes/:commentId').delete(users.requiresLogin, likes.hasAuthorization, likes.delete);

};