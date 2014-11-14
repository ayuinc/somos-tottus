'use strict';

angular.module('likes').controller('LikesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts', 'Likes', 
    function($scope, $stateParams, $location, Authentication, Posts, Likes) {
        $scope.authentication = Authentication;

        $scope.new = function() {
            var like = new Likes({
                post: $scope.post
            });
            like.$save(function(response) {
            },function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);