'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Posts',
    function($scope, $location, Authentication, Posts) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        // if (!$scope.authentication.user) $location.path('/signin');

        $scope.user = $scope.authentication.user;
    }   
]);
