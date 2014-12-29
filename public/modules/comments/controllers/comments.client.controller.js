'use strict';

angular.module('comments').controller('CommentsController', ['$scope', '$stateParams', '$window', 'Authentication', 'Posts', 'Comments', 
    function($scope, $stateParams, $window, Authentication, Posts, Comments) {
        $scope.authentication = Authentication;

        $scope.text = '';

        $scope.getPost = function() {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            });
        };

        $scope.addComment = function(){
            var comment = new Comments({
                text: $scope.text,
                postId: $stateParams.postId
            });

            comment.$save(function () {
                $window.history.back();
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);