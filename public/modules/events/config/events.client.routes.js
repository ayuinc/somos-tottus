'use strict';

<<<<<<< HEAD
// Setting up route
angular.module('events').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listEvents', {
            url: '/events',
            templateUrl: 'modules/events/views/list-events.client.view.html'
        }).
        state('newEvent', {
            url: '/events/new',
            templateUrl: 'modules/events/views/new-event.client.view.html'
        }).
        state('showEvent', {
            url: '/events/event',
            templateUrl: 'modules/events/views/show-event.client.view.html'
        });
    }
]);
=======
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
            url: '/events/create',
            templateUrl: 'modules/events/views/new-event.client.view.html'
        }).
        state('viewEvent', {
            url: '/events/:eventId',
            templateUrl: 'modules/events/views/view-event.client.view.html'
        });
	}
]);
>>>>>>> 9d514f311e9e5889f128beed7966dc3f3ab7e928
