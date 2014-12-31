'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/posts/views/list-posts.client.view.html'
		}).
		state('navigationDrawer', {
			url: '/menu',
			templateUrl: 'modules/core/views/nav-drawer.client.view.html'
		});
	}
]);