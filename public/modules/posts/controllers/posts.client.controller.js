'use strict';

angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
    function($scope, $stateParams, $location, Authentication, Posts) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        // if ($scope.authentication.user) $location.path('/');

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