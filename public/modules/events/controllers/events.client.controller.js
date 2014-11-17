'use strict';

angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Events', 'AWS',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Events, AWS) {
        $scope.authentication = Authentication;
        // $scope.evt = {
        //     startDay: Date.now,
        //     endDay: Date.now
        // };

        if(!$scope.authentication.user) $location.path('/');

        $scope.new = function() {
            var startDate = new Date(
                    $scope.evt.startDay.yearString,
                    $scope.evt.startDay.monthString - 1,
                    $scope.evt.startDay.dayString,
                    $scope.evt.startDay.hourString,
                    $scope.evt.startDay.minuteString
                );

            var endDate = new Date(
                    $scope.evt.endDay.yearString,
                    $scope.evt.endDay.monthString - 1,
                    $scope.evt.endDay.dayString,
                    $scope.evt.endDay.hourString,
                    $scope.evt.endDay.minuteString
                );

            var newEvent = new Events({
                evt: {
                    location: this.evt.eventLocation,
                    start: startDate,
                    end: endDate
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

        $scope.find = function() {
            $scope.events = Events.query();
        };

        $scope.findOne = function() {
            $scope.evt = Events.get({ eventId: $stateParams.eventId });
        };
    }
]);
