'use strict';

angular.module('users').controller('UsersController', ['$scope', '$http', '$location', '$stateParams', 'Users', 'Authentication',
    function($scope, $http, $location, $stateParams, Users, Authentication) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Update a user profile
        $scope.find = function() {
            $scope.profile = Users.get({
                userId: $stateParams.userId
            });
            console.log('profile', $scope.profile);
        };
    }
]);
