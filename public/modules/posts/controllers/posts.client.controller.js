'use strict';

angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Comments', 'Likes', 'AWS', 'FileUploader', 'getPostsPerUser', 'getPostsPerStore', 'Notifications', 'Stores',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Comments, Likes, AWS, FileUploader, getPostsPerUser, getPostsPerStore, Notifications, Stores) {
        $scope.authentication = Authentication;
        $scope.uploader = new FileUploader({
            url: 'https://s3.amazonaws.com/tottus/',
            method: 'POST',
            queueLimit: 1
        });

        // If user is signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

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

        $scope.getStores = function() {
            $scope.stores = Stores.query();
        };

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

        $scope.new = function() {
            console.log(this.storeId);
            
            var post = new Posts({
                detail: this.detail,
                store: this.storeId
            });

            if($scope.uploader.queue[0])
            {
                var uploadItem = $scope.uploader.queue[0];

                post.$save(function(response) {
                    uploadItem.formData = [{
                        key: 'post_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
                        AWSAccessKeyId: $scope.credentials.access_key, 
                        acl: 'private',
                        policy: $scope.credentials.policy,
                        signature: $scope.credentials.signature,
                        'Content-Type': 'application/octet-stream',
                        filename: 'post_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
                    }];

                    uploadItem.onSuccess = function() {
                        $scope.detail = '';
                        $location.path('posts/' + response._id);
                    };
                    
                    var nextUrl = 'posts/' + response._id;
                    registerNotification(response._id, nextUrl);

                    uploadItem.upload();

                    response.imgFilePath = 'https://s3.amazonaws.com/tottus/post_' + post._id + '.' + uploadItem.file.name.split('.').pop();
                    response.$update();
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
            else
            {
                post.$save(function(response) {
                    var nextUrl = 'posts/' + response._id;
                    registerNotification(response._id, nextUrl);

                    $location.path('posts/' + response._id);
                    $scope.detail = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        $scope.like = function(post) {
            console.log('post', post);
            var like = new Likes({
                post: post._id
            });

            post.ngLike = true;

            post.likes.push($scope.authentication.user);
            
            like.create(post._id);
        };

        $scope.find = function() {
            $scope.posts = Posts.query();
            $scope.posts.$promise.then(function(posts){
                for (var i = posts.length - 1; i >= 0; i--) {
                    $scope.posts[i].ngLike = false;
                    for (var j = posts[i].likes.length - 1; j >= 0; j--) {
                        if(posts[i].likes[j].user === $scope.authentication.user._id){
                            $scope.posts[i].ngLike = true; 
                            break;
                        }
                    }
                }
            });
        };
        
        $scope.findOne = function() {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            });

            $scope.post.$promise.then(function(post){
                $scope.post.ngLike = false;
                for (var i = post.likes.length - 1; i >= 0; i--) {
                    if(post.likes[i].user === $scope.authentication.user._id){
                        $scope.post.ngLike = true; // te gusta 
                        return;
                    }
                }
            });
        };

        $scope.findByStore = function() {
                getPostsPerStore.getPosts($stateParams.storeId).then(function(posts){
                    for (var i = posts.length - 1; i >= 0; i--) {
                        posts[i].ngLike = false;
                        for (var j = posts[i].likes.length - 1; j >= 0; j--) {
                            if(posts[i].likes[j].user === $scope.authentication.user._id){
                                posts[i].ngLike = true; 
                                break;
                            }
                        }
                    }

                    $scope.posts = posts;
                });
        };

        $scope.canRemove = function(post) {
            if(post.$resolved)
                return !!~$scope.authentication.user.roles.indexOf('admin') || $scope.authentication.user._id === post.user._id;
            else
                return !!~$scope.authentication.user.roles.indexOf('admin');
        };

        $scope.remove = function(post) {
            if (post) {
                post.$remove();

                for (var i in $scope.posts) {
                    if ($scope.posts[i] === post) {
                        $scope.posts.splice(i, 1);
                    }
                }
            } else {
                $scope.post.$remove(function() {
                    $location.path('posts');
                });
            }
        };

        $scope.removeFromProfile = function(post) {
            if(post) {
                getPostsPerUser.delete(post._id);

                for (var i in $scope.posts) {
                    if ($scope.posts[i] === post) {
                        $scope.posts.splice(i, 1);
                    }
                }
            }
        };
    }
]);
