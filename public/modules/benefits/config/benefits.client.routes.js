'use strict';

// Setting up route
angular.module('benefits').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listBenefits', {
            url: '/benefits',
            templateUrl: 'modules/benefits/views/list-benefits.client.view.html'
        }).
        state('newBenefit', {
            url: '/benefits/new',
            templateUrl: 'modules/benefits/views/new-benefit.client.view.html'
        }).
        state('showBenefit', {
            url: '/benefits/benefit',
            templateUrl: 'modules/benefits/views/show-benefit.client.view.html'
        });
    }
]);