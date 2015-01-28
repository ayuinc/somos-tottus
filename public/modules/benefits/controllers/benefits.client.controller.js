'use strict';

angular.module('benefits').controller('BenefitsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Benefits', 'AWS', 'FileUploader', 'Notifications',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Benefits, AWS, FileUploader, Notifications) {
        $scope.authentication = Authentication;
        $scope.detailLetterLimit = 110;

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
                }, function(errorResponse) {
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
            if($scope.benefit && $scope.post) {
                // var startDate = new Date(
                //   $scope.benefit.startDay.yearString,
                //   $scope.benefit.startDay.monthString - 1,
                //   $scope.benefit.startDay.dayString,
                //   $scope.benefit.startDay.hourString,
                //   $scope.benefit.startDay.minuteString
                // );

                // var endDate = new Date(
                //   $scope.benefit.endDay.yearString,
                //   $scope.benefit.endDay.monthString - 1,
                //   $scope.benefit.endDay.dayString,
                //   $scope.benefit.endDay.hourString,
                //   $scope.benefit.endDay.minuteString
                // );
                

                var endDateArr = $scope.benefit.end.split('-');
                if(endDateArr.length === 3) {
                    $scope.benefit.end = new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2], 23, 59);
                } else {
                    $scope.error = 'Ingrese una fecha completa';
                }

                var newBenefit = new Benefits({
                    benefit: {
                        location: this.benefit.benefitLocation,
                        subtitle: this.benefit.subtitle,
                        category: this.benefit.category,
                        end: this.benefit.end
                        // start: startDate,
                        // end: endDate
                    },
                    post: {
                        name: this.post.name,
                        detail: this.post.detail,
                        imgFilePath: 'assets/img/posts-placeholder.png'
                    }
                });

                if($scope.uploader.queue[0]) {
                    var uploadItem = $scope.uploader.queue[0];

                    newBenefit.$save(function(response) {
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
                            $location.path('benefits/' + response._id);
                        };

                        uploadItem.upload();

                        var nextUrl = 'benefits/' + response._id;
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
                    newBenefit.$save(function(response) {
                        var nextUrl = 'benefits/' + response._id;
                        registerNotification(response.post, nextUrl);

                        $location.path('benefits/' + response._id);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }
            } else {
                $scope.error = 'Completa los campos requeridos.';
            }
        };

        $scope.find = function() {
            $scope.benefits = Benefits.query();
        };

        $scope.findOne = function() {
            $scope.benefit = Benefits.get({ benefitId: $stateParams.benefitId });

            $scope.benefit.$promise.then(function(benefit) {
                benefit.post = Posts.get({ postId: benefit.post });

                benefit.post.$promise.then(function(post){
                    post.ngLike = false;
                    for (var i = post.likes.length - 1; i >= 0; i--) {
                        if(post.likes[i].user === $scope.authentication.user._id){
                            post.ngLike = true;
                            return;
                        }
                    }
                });
            });
        };

        $scope.remove = function(benefit) {
            if(benefit) {
                benefit.$remove();
                for (var i in $scope.benefits) {
                    if ($scope.benefits[i] === benefit) {
                        $scope.benefits.splice(i, 1);
                    }
                }
            } else {
                $scope.benefit.$remove(function() {
                    $location.path('benefits');
                });
            }
        };

        $scope.canRemove = function() {
            return !!~$scope.authentication.user.roles.indexOf('admin');
        };
    }
  ]);