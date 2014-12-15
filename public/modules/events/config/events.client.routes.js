'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Event state routing
		$stateProvider.
		state('listEvents', {
			url: '/events',
			templateUrl: 'modules/events/views/list-events.client.view.html'
		}).
        state('createEvent', {
            url: '/events/new',
            templateUrl: 'modules/events/views/new-event.client.view.html'
        }).
        state('viewEvent', {
            url: '/events/:eventId',
            templateUrl: 'modules/events/views/show-event.client.view.html'
        });
	}
]);
