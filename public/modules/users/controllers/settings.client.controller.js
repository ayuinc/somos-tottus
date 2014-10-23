'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {

		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.firstchangeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				//$scope.success = true;
				$scope.passwordDetails = null;
				$location.path('/settings/first-update-profile');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.firstupdateUserProfile = function(isValid) {
			if (isValid){
				var bday = new Date($scope.user.personal.yearString, $scope.user.personal.monthString -1, $scope.user.personal.dayString);
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
				user.personal.dateOfBirth = bday;
				// console.log(user.personal);
				user.isRegistered = true;
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					//$location.path('/');
					$location.path('/posts'); //ruta provicional para la presentacion con Hana
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

	}
]);
