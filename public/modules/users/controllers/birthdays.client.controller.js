'use strict';

angular.module('users').controller('BirthdaysController', ['$scope', '$http', '$location', '$stateParams', 'Users', 'Authentication', 'getUsersBirthdays',
    function($scope, $http, $location, $stateParams, Users, Authentication, getUsersBirthdays) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        $scope.getBirthdays = function() {
            getUsersBirthdays.getBirthdays().then(function(usersBirthday){
                $scope.usersBirthday = usersBirthday;
                console.log(usersBirthday);
            });
        };
    }
]);
