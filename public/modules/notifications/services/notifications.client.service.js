'use strict';

angular.module('notifications').factory('Notifications', ['$resource',
    function($resource) {
        return $resource('notifications/:notificationId', {
            notificationId: '@_id',
            postId: '@post.id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);