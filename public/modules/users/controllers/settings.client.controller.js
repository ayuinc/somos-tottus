'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'AWS', 'FileUploader', 'getPostsPerUser',
	function($scope, $http, $location, Users, Authentication, AWS, FileUploader, getPostsPerUser) {
		$scope.user = Authentication.user;
		$scope.uploader = new FileUploader({
            url: 'https://s3.amazonaws.com/tottus/',
            method: 'POST',
            queueLimit: 1
        });
		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Update a user profile
		$scope.showUserProfile = function() {
			$scope.showProfile = {
                statePosts : false,
                statePersonalInfo : true,
                personalInfo : 'active',
                userPosts : ''
            };
            getPostsPerUser.getPosts($scope.user._id).then(function(posts){
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

		$scope.updateUserProfile = function(isValid) {
            if (isValid){
                var uploadItem = $scope.uploader.queue[0];
                var user = new Users($scope.user);
                $scope.success = $scope.error = null;

                if($scope.uploader.queue[0]) {
                    user.$update(function(response) {
                        $scope.success = true;
                        Authentication.user = response;
                        uploadItem.formData = [{
                            key: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
                            AWSAccessKeyId: $scope.credentials.access_key, 
                            acl: 'private',
                            policy: $scope.credentials.policy,
                            signature: $scope.credentials.signature,
                            'Content-Type': 'application/octet-stream',
                            filename: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
                        }];
                        
                        uploadItem.onSuccess = function() {
                            $scope.detail = '';
                            $location.path('/users/' + Authentication.user._id); 
                        };

                        uploadItem.upload();
                        response.assets.profilePicURL = 'https://s3.amazonaws.com/tottus/user_' + user._id + '.' + uploadItem.file.name.split('.').pop();
                        response.$update();
                    }, function(response) {
                        $scope.error = response.data.message;
                    });
                } else {
                    user.$update(function(response) {
                        $scope.success = true;
                        Authentication.user = response;
                        $location.path('/users/' + Authentication.user._id);
                    }, function(response) {
                        $scope.error = response.data.message;
                    });
                }
            } else {
                $scope.submitted = true;
            }

			// if (isValid){
			// 	$scope.success = $scope.error = null;
			// 	var user = new Users($scope.user);
	
			// 	user.$update(function(response) {
			// 		$scope.success = true;
			// 		Authentication.user = response;
   //                  $location.path('/users/' + Authentication.user._id);
			// 	}, function(response) {
			// 		$scope.error = response.data.message;
			// 	});
			// } else {
			// 	$scope.submitted = true;
			// }
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.firstchangeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				//$scope.success = true;
				$scope.passwordDetails = null;
				$location.path('/settings/first-update-profile');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Inicio de métodos parar upload image en AWS S3
		
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

        // Fin de métodos parar upload image en AWS S3

		$scope.firstupdateUserProfile = function(isValid) {
			var bday = new Date($scope.user.personal.yearString, $scope.user.personal.monthString -1, $scope.user.personal.dayString);
			var user = new Users($scope.user);

			/*var bday = new Date($scope.user.personal.yearString, $scope.user.personal.monthString -1, $scope.user.personal.dayString);
			$scope.success = $scope.error = null;
			var user = new Users($scope.user);
			user.personal.dateOfBirth = bday;
			//user.isRegistered = true;

			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
				//$location.path('/');
				$location.path('/posts'); //ruta provicional para la presentacion con Hana
			}, function(response) {
				$scope.error = response.data.message;
			});*/

			if($scope.uploader.queue[0])
			{	
				var uploadItem = $scope.uploader.queue[0];
				$scope.success = $scope.error = null;
				user.personal.dateOfBirth = bday;
				user.isRegistered = true; 
				
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					uploadItem.formData = [{
			            key: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
			            AWSAccessKeyId: $scope.credentials.access_key, 
			            acl: 'private',
			            policy: $scope.credentials.policy,
			            signature: $scope.credentials.signature,
			            'Content-Type': 'application/octet-stream',
			            filename: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
			        }];
					
					uploadItem.onSuccess = function() {
			            $scope.detail = '';
			            $location.path('/posts');//ruta provicional para la presentacion con Hana
			        };

			        uploadItem.upload();
					response.assets.profilePicURL = 'https://s3.amazonaws.com/tottus/user_' + user._id + '.' + uploadItem.file.name.split('.').pop();
			        console.log(response);
			        response.$update();

				}, function(response) {
					$scope.error = response.data.message;
				});
			}
			
			else {
				$scope.success = $scope.error = null;
				user.personal.dateOfBirth = bday;
				user.isRegistered = true;
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					//$location.path('/');
					$location.path('/posts'); //ruta provicional para la presentacion con Hana
				}, function(response) {
					$scope.error = response.data.message;
				});
            }
				
			
		};

		/*
			=================================
			USER SETTINGS FIELDS
			=================================
		*/
		// Pass the field to be edited to the edit-field view
		//$scope.requestField = $state.params.field;
		// Render the correspondent form to the edit-field view

	}
]);
