'use strict';

//Setting up route
angular.module('event').config(['$stateProvider',
	function($stateProvider) {
		// Event state routing
		$stateProvider.
		state('listEvents', {
			url: '/events',
			templateUrl: 'modules/events/views/list-events.client.view.html'
		}).
        state('createEvent', {
            url: '/events/create',
            templateUrl: 'modules/events/views/new-event.client.view.html'
        }).
        state('viewEvent', {
            url: '/events/:eventId',
            templateUrl: 'modules/events/views/view-event.client.view.html'
        });
	}
]);
