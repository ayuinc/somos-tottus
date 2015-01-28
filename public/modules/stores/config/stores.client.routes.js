'use strict';

//Setting up route
angular.module('stores').config(['$stateProvider',
	function($stateProvider) {
		// Stores state routing
		$stateProvider.
		state('listStores', {
			url: '/stores',
			templateUrl: 'modules/stores/views/list-stores.client.view.html'
		}).
		state('newStore', {
			url: '/stores/new',
			templateUrl: 'modules/stores/views/new-store.client.view.html'
		}).
		state('storePosts', {
			url: '/stores/:storeId/posts',
			templateUrl: 'modules/stores/views/store-posts.client.view.html'
		}).
		state('storeEvents', {
			url: '/stores/:storeId/events',
			templateUrl: 'modules/stores/views/store-events.client.view.html'
		}).
		state('viewStore', {
			url: '/stores/:storeId',
			templateUrl: 'modules/stores/views/view-store.client.view.html'
		}).
		state('editStore', {
			url: '/stores/:storeId/edit',
			templateUrl: 'modules/stores/views/edit-store.client.view.html'
		});
	}
]);