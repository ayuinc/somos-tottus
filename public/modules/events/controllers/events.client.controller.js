'use strict';

angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Events', 'AWS', 'FileUploader', 'Attendees', 'Notifications',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Events, AWS, FileUploader, Attendees, Notifications) {
        $scope.authentication = Authentication;
        $scope.detailLetterLimit = 170;

        // If user is signed in then redirect back home
        if(!$scope.authentication.user) $location.path('/');

        $scope.uploader = new FileUploader({
            url: 'https://s3.amazonaws.com/tottus/',
            method: 'POST',
            queueLimit: 1
        });

        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        var registerNotification = function(post, nextUrl) {
            if(!!~$scope.authentication.user.roles.indexOf('admin')) {
                // is admin
                var newNot = new Notifications({
                    post: post,
                    nextUrl: nextUrl
                });

                newNot.$save(function(response) {
                    console.log('success!');
                }, function(errorResponse) {
                    console.log('error!');
                });

            } else {
                return false;
            }
        };

        $scope.getCredentials = function() {
            AWS.getCredentials().then(function(res) {
                $scope.credentials = res.data;
            });
        };

        $scope.new = function() {
            if($scope.evt && $scope.post) {
                var startDateArr = $scope.evt.startDate.split('-');
                var startTimeArr = $scope.evt.startTime.split(':');
                var endDateArr = $scope.evt.endDate.split('-');
                var endTimeArr = $scope.evt.endTime.split(':');

                if( startDateArr.length === 3 &&
                    startTimeArr.length === 2 &&
                    endDateArr.length === 3 &&
                    endTimeArr.length === 2) {

                    var startDate = new Date(
                            startDateArr[0],
                            startDateArr[1] - 1,
                            startDateArr[2],
                            startTimeArr[0],
                            startTimeArr[1]
                        );

                    var endDate = new Date(
                            endDateArr[0],
                            endDateArr[1] - 1,
                            endDateArr[2],
                            endTimeArr[0],
                            endTimeArr[1]
                        );

                    var newEvent = new Events({
                        evt: {
                            location: this.evt.eventLocation,
                            start: startDate,
                            end: endDate
                        },
                        post: {
                            name: this.post.name,
                            detail: this.post.detail,
                            imgFilePath: 'assets/img/img-placeholder.png'
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

                            var nextUrl = 'events/' + response._id;
                            registerNotification(response.post, nextUrl);

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
                            var nextUrl = 'events/' + response._id;
                            registerNotification(response.post, nextUrl);

                            $location.path('events/' + response._id);
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }

                } else {
                    $scope.error = 'Completa los campos requeridos.';
                }

            } else {
                $scope.error = 'Completa los campos requeridos.';
            }
        };

        $scope.find = function() {
            $scope.events = Events.query();

            $scope.events.$promise.then(function(events) {
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

        $scope.remove = function(evt) {
            if(evt) {
                evt.$remove();
                for (var i in $scope.events) {
                    if ($scope.events[i] === evt) {
                        $scope.events.splice(i, 1);
                    }
                }
            } else {
                $scope.evt.$remove(function() {
                    $location.path('events');
                });
            }
        };

        $scope.canRemove = function() {
            return !!~$scope.authentication.user.roles.indexOf('admin');
        };
    }
]);
