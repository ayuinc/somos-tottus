'use strict';

angular.module('event').controller('EventsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts',
    function($scope, $stateParams, $location, $http, Authentication, Posts) {
        $scope.authentication = Authentication;

        if(!$scope.authentication.user) $location.path('/');

        $scope.new = function() {
            var newEvent = new Event({
                location: this.eventLocation,
                post: {
                    name: this.post.name,
                    detail: this.post.detail
                }
            });

            newEvent.$save(function(response) {
                $location.path('events/' + response._id);
            }, function(errorResponse) {
                console.log('houston', errorResponse.data.message);
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
