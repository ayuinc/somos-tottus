'use strict';

<<<<<<< HEAD
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Events', 'AWS', 'FileUploader',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Events, AWS, FileUploader) {
        $scope.authentication = Authentication;
        $scope.uploader = new FileUploader({
            url: 'https://s3.amazonaws.com/tottus/',
            method: 'POST',
            queueLimit: 1
        });

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

=======
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Events',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Events) {
        $scope.authentication = Authentication;
        // $scope.evt = {
        //     startDay: Date.now,
        //     endDay: Date.now
        // };

        if(!$scope.authentication.user) $location.path('/');

>>>>>>> events
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

<<<<<<< HEAD
            if($scope.uploader.queue[0]) {
                var uploadItem = $scope.uploader.queue[0];
                uploadItem.onSuccess = function() {
                    $scope.detail = '';
                    $location.path('posts/' + response._id);
                };

                newEvent.$save(function(response) {
                    uploadItem.formData = [{
                        key: 'post_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
                        AWSAccessKeyId: $scope.credentials.access_key, 
                        acl: 'private',
                        policy: $scope.credentials.policy,
                        signature: $scope.credentials.signature,
                        'Content-Type': 'application/octet-stream',
                        filename: 'post_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
                    }];

                    uploadItem.upload();

                    Posts.get(response.post, function(err, response) {
                        if(err) console.log(err);
                        response.imgFilePath = 'https://s3.amazonaws.com/tottus/post_' + post._id + '.' + uploadItem.file.name.split('.').pop();
                        response.$update();
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
            // newEvent.$save(function(response) {
            //    $location.path('events/' + response._id);
            // }, function(errorResponse) {
            //     console.log('houston', errorResponse.data.message);
            //     $scope.error = errorResponse.data.message;
            // });
=======
            newEvent.$save(function(response) {
               $location.path('events/' + response._id);
            }, function(errorResponse) {
                console.log('houston', errorResponse.data.message);
                $scope.error = errorResponse.data.message;
            });
>>>>>>> events
        };

        $scope.find = function() {
            $scope.events = Events.query();
        };

        $scope.findOne = function() {
<<<<<<< HEAD
            $scope.evt = Events.get({ eventId: $stateParams.eventId });
=======
            $scope.evt = Events.get({ eventId: $stateParams.eventId })
>>>>>>> events
        };
    }
]);
