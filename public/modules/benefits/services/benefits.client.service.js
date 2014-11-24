'use strict';

angular.module('benefits').factory('Benefits', ['$resource',
    function($resource) {
        return $resource('benefits/:benefitId', {
            eventId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
