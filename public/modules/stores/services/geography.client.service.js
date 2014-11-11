'use strict';

angular.module('stores').factory('Geography', ['$http',
    function($http) {
        var getDistricts = function() {
            var response;
            $http.get('/districts', function(data) {
                response = data.districts;
            });
            return response;
        }
        return {
            getDistricts: getDistricts
        };
    }
]);