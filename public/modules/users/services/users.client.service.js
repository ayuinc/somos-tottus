'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users')
.factory('Users', ['$resource', function($resource) {
        return $resource('users', {}, {
            update: {
                method: 'PUT'
            }
        });
    }   
])
.factory('getUser', ['$http', function($http) {
        var profile = {};
        profile.getProfile = function (userId) {
            return $http.get('/users/'+userId).then(function(res) {
                return res.data;
            });
        };
        return profile;
    }   
]);


