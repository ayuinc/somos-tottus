'use strict';

// Stores controller
angular.module('stores').controller('StoresController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Stores', 'LocationService',
	function($scope, $stateParams, $location, $http, Authentication, Stores, LocationService) {
		$scope.authentication = Authentication;

		// Create new Store
		$scope.create = function() {
			// Create new Store object
			var store = new Stores ({
				name: this.name,
				address: this.address,
				region: this.region.region,
				district: this.district
			});

			// Redirect after save
			store.$save(function(response) {
				$location.path('stores/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Store
		$scope.remove = function(store) {
			if ( store ) { 
				store.$remove();

				for (var i in $scope.stores) {
					if ($scope.stores [i] === store) {
						$scope.stores.splice(i, 1);
					}
				}
			} else {
				$scope.store.$remove(function() {
					$location.path('stores');
				});
			}
		};

		// Update existing Store
		$scope.update = function() {
			var store = $scope.store;

			store.$update(function() {
				$location.path('stores/' + store._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stores
		$scope.find = function() {
			$scope.stores = Stores.query();
		};

		$scope.initRoute = function() {
			$scope.route = $location.search().category;
		};

		// Find existing Store
		$scope.findOne = function() {
			$scope.store = Stores.get({ 
				storeId: $stateParams.storeId
			});
		};

		// Get locations
		$scope.getLocations = function() {
			LocationService.getLocations().then(function(res) {
				$scope.locations = res.data;
				console.log('locations', $scope.locations);
			});
			console.log('locations', $scope.locations);
		};

		$scope.updateRegion = function() {
			$scope.availableDistricts = $scope.region.districts;
		};
	}
]);
