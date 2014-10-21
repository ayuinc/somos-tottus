'use strict';

angular.module('likes').config(['$stateProvider', 
    function($stateProvider) {
        $stateProvider.
        state('like', {
            url: '/posts/:postId/like',
            templateUrl: 'modules/like/views/like.client.view.html'
        }).
        state('dislike', {
            url: '/posts/:postId/dislike',
            templateUrl: 'modules/like/views/dislike.client.view.html'
        });
    }
]);