'use strict';

angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Events', 'AWS', 'FileUploader', 'Attendees',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Events, AWS, FileUploader, Attendees) {
        $scope.authentication = Authentication;
        $scope.uploader = new FileUploader({
            url: 'https://s3.amazonaws.com/tottus/',
            method: 'POST',
            queueLimit: 1
        });
        $scope.detailLetterLimit = 170;

        // If user is signed in then redirect back home
        if(!$scope.authentication.user) $location.path('/');

        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        $scope.getCredentials = function() {
            AWS.getCredentials().then(function(res) {
                $scope.credentials = res.data;
            });
        };

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

            if($scope.uploader.queue[0]) {
                var uploadItem = $scope.uploader.queue[0];

                newEvent.$save(function(response) {
                    uploadItem.formData = [{
                        key: 'post_' + response.post + '.' + uploadItem.file.name.split('.').pop(),
                        AWSAccessKeyId: $scope.credentials.access_key, 
                        acl: 'private',
                        policy: $scope.credentials.policy,
                        signature: $scope.credentials.signature,
                        'Content-Type': 'application/octet-stream',
                        filename: 'post_' + response.post + '.' + uploadItem.file.name.split('.').pop(),
                    }];

                    uploadItem.onSuccess = function() {
                        $scope.detail = '';
                        $location.path('events/' + response._id);
                    };

                    uploadItem.upload();

                    var post = Posts.get({ postId: response.post }, function() {
                        post.imgFilePath = 'https://s3.amazonaws.com/tottus/post_' + response.post + '.' + uploadItem.file.name.split('.').pop();
                        post.$update();
                    });

                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            } 
            else {
                newEvent.$save(function(response) {
                   $location.path('events/' + response._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        $scope.find = function() {
            $scope.events = Events.query();

            $scope.events.$promise.then(function(events) {
                console.log('events', events);
                // for (var i=events.length; i > 0; i--) {
                //     $scope.events[i].attended = false;
                //     for (var j = events[i].attendees.length; j > 0; j--) {
                //         if(events[i].attendees[j] === $scope.authentication.user._id){
                //             $scope.events[i].attended = true; 
                //             return;
                //         }
                //     }
                // }
            });
        };

        $scope.findOne = function() {
            $scope.evt = Events.get({ eventId: $stateParams.eventId });

            $scope.evt.$promise.then(function(evt) {
                evt.attended = false;
                evt.post = Posts.get({ postId: evt.post });

                for (var i = evt.attendees.length - 1; i >= 0; i--) {
                    if(evt.attendees[i] === $scope.authentication.user._id) {
                        evt.attended = true;
                        return;
                    }
                }
            });
        };

        $scope.registerAttendee = function() {
            $scope.evt.attended = true;
            $scope.evt.attendees.push($scope.authentication.user._id);
            Attendees.registerAttendee($scope.evt._id).then();
        };
    }
]);
