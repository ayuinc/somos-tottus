'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
        comments = require('../../app/controllers/comment');

    // --------------------backend--------------------
    // route                                verb                method
    // /comments                            GET                 comments list             => post.create()
    // /comments/:commentId                 GET                 show comment              => post.show()
    //
    // /posts/:postId/comments              GET                 list comment per post     => comment.create() =)
    // /posts/:postId/comments/:commentId   GET                 show comment              => comment.show()   
    // /posts/:postId/comments/:commentId   PUT                 update comment            => comment.update()
    // /posts/:postId/comments/:commentId   DELETE              delete comment            => comment.delete()

    // --------------------frontend--------------------
    // state               verb                method
    // /comments/new          GET                 create on angular

    // app.route('/comments').post(users.requiresLogin, comments.create);
    app.route('/posts/:postId/comments').get(comments.index);
    app.route('/posts/:postId/comments').post(comments.create);
    app.route('/posts/:postId/comments/:commentId').get(comments.show);
    app.route('/posts/:postId/comments/:commentId').put(users.requiresLogin, comments.hasAuthorization, comments.update);
    app.route('/posts/:postId/comments/:commentId').delete(users.requiresLogin, comments.hasAuthorization, comments.delete);

};	