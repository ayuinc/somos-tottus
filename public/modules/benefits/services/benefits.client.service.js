'use strict';

angular.module('benefits').factory('Benefits', ['$resource',
    function($resource) {
        return $resource('benefits/:benefitId', {
            benefitId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
