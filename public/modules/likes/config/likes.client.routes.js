'use strict';

angular.module('likes').config(['$stateProvider', 
    function($stateProvider) {
        $stateProvider.
        state('like', {
            url: '/posts/:postId/like',
            templateUrl: 'modules/likes/views/like.client.view.html'
        }).
        state('dislike', {
            url: '/posts/:postId/dislike',
            templateUrl: 'modules/likes/views/dislike.client.view.html'
        });
    }
]);