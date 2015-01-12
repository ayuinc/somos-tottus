'use strict';

angular.module('notifications').controller('NotificationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notifications', 'NotificationsExtra',
    function($scope, $stateParams, $location, Authentication, Notifications, NotificationsExtra) {
        $scope.authentication = Authentication;
        $scope.detailLetterLimit = 140;

        $scope.find = function() {
            $scope.notifications = Notifications.query();
        };

        $scope.nextRedirect = function(notification) {
            NotificationsExtra.markAsRead(notification._id).then();
            $location.path(notification.nextUrl);
        };
    }
]);