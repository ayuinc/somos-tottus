'use strict';

// Setting up route
angular.module('vacancies').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listVacancies', {
            url: '/vacancies',
            templateUrl: 'modules/vacancies/views/list-vacancies.client.view.html'
        }).
        state('newVacancy', {
            url: '/vacancies/new',
            templateUrl: 'modules/vacancies/views/new-vacancy.client.view.html'
        }).
        state('showVacancy', {
            url: '/vacancies/vacancy',
            templateUrl: 'modules/vacancies/views/show-vacancy.client.view.html'
        });
    }
]);