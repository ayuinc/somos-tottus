'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        comments = require('../../app/controllers/comment');

    // --------------------backend--------------------
    // route               verb                method
    // /comments              POST                create post     => post.create()
    // /comments/:id          GET                 show post       => post.show()
    // /comments/:id          PUT                 update posts    => post.update()
    // /comments/:id          DELETE              delete posts    => post.delete()



    // --------------------frontend--------------------
    // state               verb                method
    // /comments/new          GET                 create on angular

   
    app.route('/comments').get(comments.index);
    app.route('/comments').post(users.requiresLogin, comments.create);
    app.route('/comments/:commentId').get(comments.show);
    app.route('/comments/:commentId').put(users.requiresLogin, comments.hasAuthorization, comments.update);
    app.route('/comments/:commentId').delete(users.requiresLogin, comments.hasAuthorization, comments.delete);

};	