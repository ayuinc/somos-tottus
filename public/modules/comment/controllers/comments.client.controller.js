'use strict';

angular.module('comments').controller('CommentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts', 'Comments', 
    function($scope, $stateParams, $location, Authentication, Posts, Comments) {
        $scope.authentication = Authentication;

        $scope.getPost = function() {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            });
        };

        $scope.new = function() {
            var comment = new Comments({
                post: $scope.post,
                text: this.text
            });

            comment.$save(function(response) {
                $location.path('posts/' + response.post._id);
                $scope.text = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function() {
            $scope.comments = Comments.query({ postId: this.post._id });
        };

        $scope.remove = function(comment) {
            if(comment) {
                comment.$remove();

                for(var i in $scope.comments) {
                    if($scope.comment[i] === comment) {
                        $scope.comments.splice(i, 1);
                    }
                }
            } else {
                $scope.comment.$remove(function() {
                    $location.path('posts/' + $scope.post._id + '/comments');
                });
            }
        };
    }
]);