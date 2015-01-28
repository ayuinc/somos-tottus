'use strict';

// Setting up route
angular.module('benefits').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listBenefits', {
            url: '/benefits',
            templateUrl: 'modules/benefits/views/list-benefits.client.view.html',
            controller: 'BenefitsController'
        }).
        state('newBenefit', {
            url: '/benefits/new',
            templateUrl: 'modules/benefits/views/new-benefit.client.view.html',
            controller: 'BenefitsController'
        }).
        state('menuBenefit', {
            url: '/benefits/menu',
            templateUrl: 'modules/benefits/views/menu-benefits.client.view.html',
            controller: 'BenefitsController'
        }).
        state('viveloBenefit', {
            url: '/benefits/vivelo',
            templateUrl: 'modules/benefits/views/vivelo-benefits.client.view.html',
            controller: 'BenefitsController'
        }).
        state('disfrutaloBenefit', {
            url: '/benefits/disfrutalo',
            templateUrl: 'modules/benefits/views/disfrutalo-benefits.client.view.html',
            controller: 'BenefitsController'
        }).
        state('comparteloBenefit', {
            url: '/benefits/compartelo',
            templateUrl: 'modules/benefits/views/compartelo-benefits.client.view.html',
            controller: 'BenefitsController'
        }).
        state('showBenefit', {
            url: '/benefits/:benefitId',
            templateUrl: 'modules/benefits/views/show-benefit.client.view.html',
            controller: 'BenefitsController'
        });
    }
]);