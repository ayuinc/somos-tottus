'use strict';

angular.module('users').controller('BirthdaysController', ['$scope', '$http', '$location', '$stateParams', 'Users', 'Authentication', 'getUsersBirthdays',
    function($scope, $http, $location, $stateParams, Users, Authentication, getUsersBirthdays) {
        $scope.user = Authentication.user;

        if (!$scope.user) $location.path('/');

        $scope.getBirthdays = function() {
            getUsersBirthdays.getBirthdays().then(function(usersBirthday){
                $scope.usersBirthday = usersBirthday;
            });
        };
    }
]);
