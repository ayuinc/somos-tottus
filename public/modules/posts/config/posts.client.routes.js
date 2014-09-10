'use strict';

// Setting up route
angular.module('posts').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listPosts', {
            url: '/posts',
            templateUrl: 'modules/posts/views/list-posts.client.view.html'
        }).
        state('newPost', {
            url: '/posts/new',
            templateUrl: 'modules/posts/views/new-post.client.view.html'
        }).
        state('showPost', {
            url: '/posts/:postId',
            templateUrl: 'modules/posts/views/show-post.client.views.html'
        });
    }
]);