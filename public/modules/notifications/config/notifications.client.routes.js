'use strict';

// Setting up route
angular.module('notifications').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listNotifications', {
            url: '/notifications',
            templateUrl: 'modules/notifications/views/list-notifications.client.view.html'
        }).
        state('newNotification', {
            url: '/notifications/new',
            templateUrl: 'modules/notifications/views/new-notification.client.view.html'
        }).
        state('showNotification', {
            url: '/notifications/:notificationId',
            templateUrl: 'modules/notifications/views/show-notification.client.view.html'
        });
    }
]);

$.ajax({type: 'GET', url:'/notifications', dataType: 'json', data: {'title': 'I', 'content': 'ov'}, success: function(d){ console.log(d)}, error: function(err){console.error(err)}});