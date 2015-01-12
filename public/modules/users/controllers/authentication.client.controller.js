'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {		
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$scope.credentials.username = $scope.credentials.personal.DNI;

			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/posts');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				if($scope.authentication.user.isRegistered){
					//$location.path('/');
					$location.path('/posts'); //ruta provicional para la presentacion con Hana
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
				$scope.error = 'Lo sentimos. No podrás registrarte en Somos Tottus si no aceptas los términos y condiciones expuestos anteriormente.'
			} else {
				$http.post('/auth/firstSignin', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
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
