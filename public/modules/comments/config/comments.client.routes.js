'use strict';

angular.module('comments').config(['$stateProvider', 
    function($stateProvider) {
        $stateProvider.
        state('listComments', {
            url: '/posts/:postId/comments',
            templateUrl: 'modules/comments/views/list-comments.client.view.html'
        }).
        state('newComment', {
            url: '/posts/:postId/comments/new',
            templateUrl: 'modules/comments/views/new-comment.client.view.html'
        });
    }
]);