'use strict';

angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Events',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Events) {
        $scope.authentication = Authentication;
        // $scope.evt = {
        //     startDay: Date.now,
        //     endDay: Date.now
        // };

        if(!$scope.authentication.user) $location.path('/');

        $scope.new = function() {
            var newEvent = new Events({
                evt: {
                    location: this.evt.eventLocation,
                    start: this.evt.startDay,
                    end: this.evt.endDay
                },
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
