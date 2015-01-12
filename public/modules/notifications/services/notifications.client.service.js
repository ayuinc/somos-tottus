'use strict';

angular.module('notifications')
.factory('Notifications', ['$resource',
    function($resource) {
        return $resource('notifications/:notificationId', {
            notificationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])
.factory('NotificationsExtra', ['$http', function($http) {
    var NotificationsExtra = {};
    NotificationsExtra.markAsRead = function (notId) {
        return $http.put('/notifications/' + notId + '/markAsRead').then(function(res) {
            return res.data;
        });
    };

    NotificationsExtra.countUnRead = function() {
        return $http.get('/notifications/unRead').then(function(res) {
            return res.data;
        });
    };

    return NotificationsExtra;
}]);