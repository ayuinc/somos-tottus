'use strict';

angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Comments', 'Likes', 'AWS', 'FileUploader',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Comments, Likes, AWS, FileUploader) {
        $scope.authentication = Authentication;
        $scope.uploader = new FileUploader({
            url: 'https://s3.amazonaws.com/tottus/',
            method: 'POST',
            queueLimit: 1
        });

        // If user is signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.new = function() {
            var post = new Posts({
                detail: this.detail
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
                    uploadItem.upload();

                    response.imgFilePath = 'https://s3.amazonaws.com/tottus/post_' + post._id + '.' + uploadItem.file.name.split('.').pop();
                    response.$update();

                    $location.path('posts/' + response._id);
                    $scope.detail = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
            else
            {
                post.$save(function(response) {
                    $location.path('posts/' + response._id);
                    $scope.detail = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        $scope.like_list_posts = function(id, post_like) {
            var like = new Likes({
                post: id
            });
            post_like.likes.push({ user: { _id: $scope.authentication.user._id, personal: { displayName: $scope.authentication.user.personal.displayName} }});
            like.create(post_like._id);
            for (var i = $scope.posts.length - 1; i >= 0; i--) {
                if( $scope.posts[i]._id == id ){
                    $scope.posts[i].ng_like = true;
                }
            };
        };

        $scope.like_show_post = function() {
            var like = new Likes({
                post: $scope.post._id
            });
            $scope.post.likes.push({ user: { _id: $scope.authentication.user._id, personal: { displayName: $scope.authentication.user.personal.displayName} }});
            like.create($scope.post._id);
            $scope.ng_like =  true; // me gusta
        };

        $scope.comment = function() {
            var comment = new Comments({
                text: this.text
            });

            $scope.post.comments.push({ text: this.text, user: { _id: $scope.authentication.user, personal: { displayName: $scope.authentication.user.personal.displayName} }});
            $scope.text = '';
            comment.create($scope.post._id);
        };

        $scope.getCredentials = function() {
            AWS.getCredentials().then(function(res) {
                $scope.credentials = res.data;
            });
        };


        $scope.find = function() {
            $scope.posts = Posts.query();
            $scope.posts.$promise.then(function(posts){
                for (var i = posts.length - 1; i >= 0; i--) {
                    $scope.posts[i].ng_like = false;
                    for (var j = posts[i].likes.length - 1; j >= 0; j--) {
                        if(posts[i].likes[j].user == $scope.authentication.user._id){
                            $scope.posts[i].ng_like = true; //te gusta 
                            break;
                        }
                    }
                }
            });
        };
        
        $scope.findOne = function() {
            $scope.ng_like = false; 
            $scope.post = Posts.get({
                postId: $stateParams.postId
            });
            $scope.post.$promise.then(function(post){
                for (var i = post.likes.length - 1; i >= 0; i--) {
                    if(post.likes[i].user == $scope.authentication.user._id){
                        $scope.ng_like = true; // te gusta 
                        return;
                    }
                }
            });
            
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

    }
]);
