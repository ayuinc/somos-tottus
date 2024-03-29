'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('search', {
			url: '/users/search',
			templateUrl: 'modules/users/views/search/search.client.view.html'
		}).
		state('public-profile', {
			url: '/users/:userId',
			templateUrl: 'modules/users/views/public-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('first-change-password', {
			url: '/settings/first-change-password',
			templateUrl: 'modules/users/views/settings/first-change-password.client.view.html'
		}).
		state('first-update-profile', {
			url: '/settings/first-update-profile',
			templateUrl: 'modules/users/views/settings/first-update-profile.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('firstsignin', {
			url: '/firstsignin',
			templateUrl: 'modules/users/views/authentication/firstsignin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
		/*
			=================================
			USER SETTINGS ROUTES
			=================================
		*/
		state('edit', {
			url: '/settings/edit/:field',
			templateUrl: 'modules/users/views/settings/edit_form_fields/edit.client.view.html'
		}).
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('listBirthdays', {
            url: '/birthdays',
            templateUrl: 'modules/users/views/birthdays/list-birthdays.client.view.html'
        }).
        state('showBirthday', {
            url: '/birthdays/birthday',
            templateUrl: 'modules/users/views/birthdays/show-birthday.client.view.html'
        });
		// .state('update-email', {
		// 	url: '/settings/edit-email',
		// 	templateUrl: 'modules/users/views/settings/edit_form_fields/user.email.client.view.html'
		// });
	}
]);
