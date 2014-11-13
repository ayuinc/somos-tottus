'use strict';

angular.module('events').factory('Events', ['$resource',
    function($resource) {
        return $resource('events/:eventId', {
            eventId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
