'use strict';

angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts', 'Comments',
    function($scope, $stateParams, $location, Authentication, Posts, Comments) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.new = function() {
            var post = new Posts({
                detail: this.detail
            });

            post.$save(function(response) {
                $location.path('posts/' + response._id);
                $scope.detail = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.comment = function() {
            var comment = new Comments({
                text: this.text
            });

            comment.create($scope.post._id)
                .then(function(response) {
                    $scope.text = '';
                })
                .catch(function(err) {
                    $scope.error = err.data.message;
                });

            comment.user = $scope.authentication.user;
            $scope.post.comments.push(comment);

            // comment.$save({
            //     postId: $scope.post._id,
            // }, function(response) {
            //     console.log('response ', response);
            //     $location.path('posts/' + response.post);
            //     $scope.text = '';
            // }, function(errorResponse) {
            //     $scope.error = errorResponse.data.message;
            //     console.log('error', $scope.error);
            // });
        };

        $scope.find = function() {
            $scope.posts = Posts.query();
        };

        $scope.findOne = function() {
            $scope.post = Posts.get({
                postId: $stateParams.postId
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
