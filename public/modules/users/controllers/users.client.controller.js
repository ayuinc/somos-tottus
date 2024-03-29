'use strict';

angular.module('users').controller('UsersController', ['$scope', '$http', '$location', '$stateParams', 'Users', 'Authentication','Posts', 'getUser', 'getPostsPerUser', 'searchUsers',
    function($scope, $http, $location, $stateParams, Users, Authentication, Posts, getUser, getPostsPerUser, searchUsers) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        $scope.canEdit = function() {
            if($scope.userProfile)
                return $scope.user._id === $scope.userProfile._id;
        };

        // Update a user profile
        $scope.find = function() {
        	$scope.showProfile = {
                statePosts : false,
                statePersonalInfo : true,
                personalInfo : 'active',
                userPosts : ''
            };

            getUser.getProfile($stateParams.userId).then(function(user){
                $scope.userProfile = user;
            });
            
            getPostsPerUser.getPosts($stateParams.userId).then(function(posts){
                for (var i = posts.length - 1; i >= 0; i--) {
                    posts[i].ngLike = false;
                    for (var j = posts[i].likes.length - 1; j >= 0; j--) {
                        if(posts[i].likes[j].user === $scope.user._id){
                            posts[i].ngLike = true; 
                            break;
                        }
                    }
                }
                $scope.posts = posts;
            });
        };

		$scope.switchPublicProfile = function( option ) {
			if(option === 'posts'){
				if ($scope.showProfile.userPosts === ''){
					$scope.showProfile.personalInfo = '';
                    $scope.showProfile.userPosts = 'active';
                    $scope.showProfile.statePosts = true;
                    $scope.showProfile.statePersonalInfo = false;
				}
			}
			if(option === 'profile'){
				if ($scope.showProfile.personalInfo === ''){
					$scope.showProfile.personalInfo = 'active';
                    $scope.showProfile.userPosts = '';
                    $scope.showProfile.statePosts = false;
                    $scope.showProfile.statePersonalInfo = true;
				}
			}
		};

        $scope.search = function() {
            if($scope.search.queryString) {
                searchUsers.search($scope.search.queryString).then(function(results) {
                    $scope.results = results;
                });
            } else {
                $scope.results = [];
            }
        };
    }
]);
