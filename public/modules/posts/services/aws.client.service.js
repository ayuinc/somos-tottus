'use strict';

angular.module('posts').factory('AWS', ['$http', 
    function($http) {
        var AWS = {};
                
        AWS.getCredentials = function() {
            return $http.get('/aws/s3-signature/').then(function(res) {
                return res;
            });
        };

        return AWS;
    }
]);
