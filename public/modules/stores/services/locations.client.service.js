'use strict';

angular.module('stores').factory('LocationService', ['$http',
    function($http) {
        var LocationService = {};
                
        LocationService.getLocations = function() {
            return $http.get('/locations').then(function(data) {
                return data;
            });
        };

        return LocationService;
    }
]);
