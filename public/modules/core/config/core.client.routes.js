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
			controller: function($scope, $location) {
				if ($scope.authentication.user) { console.log("core ctrl"); $location.path('/posts'); }
			}
		}).
		state('navigationDrawer', {
			url: '/menu',
			templateUrl: 'modules/core/views/nav-drawer.client.view.html'
		});
	}
]);
