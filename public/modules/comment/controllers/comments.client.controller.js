'use strict';

angular.module('comments').controller('CommentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts', 'Comments', 
    function($scope, $stateParams, $location, Authentication, Posts, Comments) {
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
                window.location.href = '#!/posts/' + $stateParams.postId ;
            }, function (response) {
                $scope.error = errorResponse.data.message;
            });
            $scope.text = '';
        }

    }
]);