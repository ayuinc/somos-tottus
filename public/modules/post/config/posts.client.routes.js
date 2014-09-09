'use strict';

// Setting up route
angular.module('posts').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('new', {
            url: '/posts/new',
            templateUrl: 'modules/users/views/new.client.view.html'
        });
    }
]);