'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$state', 'Authentication',
	function($scope, $http, $location, $state, Authentication) {		
		$scope.authentication = Authentication;

		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$scope.credentials.username = $scope.credentials.personal.DNI;

			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				$scope.authentication.user = response;

				$location.path('/posts');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				$scope.authentication.user = response;

				if($scope.authentication.user.isRegistered){
					$location.path('/posts');
				}
				else{
					$location.path('/settings/first-change-password');
				}
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.firstsignin = function() {
			if(!$scope.credentials.acceptTerms) {
				$scope.error = 'Lo sentimos. No podrás registrarte en Somos Tottus si no aceptas los términos y condiciones expuestos anteriormente.';
			} else {
				$http.post('/auth/firstSignin', $scope.credentials).success(function(response) {
					$scope.authentication.user = response;
					if($scope.authentication.user.isRegistered){
						$location.path('/posts');
					}
					else{
						$location.path('/settings/first-change-password');
					}
				}).error(function(response) {
					$scope.error = response.message;
				});
			}
		};
	}
]);
