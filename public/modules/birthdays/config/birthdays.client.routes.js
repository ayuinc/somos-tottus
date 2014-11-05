'use strict';

// Setting up route
angular.module('birthdays').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listBirthdays', {
            url: '/birthdays',
            templateUrl: 'modules/birthdays/views/list-birthdays.client.view.html'
        }).
        state('showBirthday', {
            url: '/birthdays/birthday',
            templateUrl: 'modules/birthdays/views/show-birthday.client.view.html'
        });
    }
]);