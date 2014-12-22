'use strict';

angular.module('notifications').controller('NotificationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notifications', 'AWS', 'FileUploader', function($scope, $stateParams, $location, Authentication, Notifications, AWS, FileUploader) {
        $scope.authentication = Authentication;

        $scope.uploader = new FileUploader({
          url: 'https://s3.amazonaws.com/tottus/',
          method: 'POST',
          queueLimit: 1
        });

        // If user is signed in then redirect back home
        // if ($scope.authentication.user) $location.path('/');

      $scope.getCredentials = function() {
        AWS.getCredentials().then(function(res) {
          $scope.credentials = res.data;
        });
      };

      $scope.find = function() {
        $scope.notifications = Notifications.query();
      };

      $scope.new = function() {
        var notification = new Notifications({detail: this.detail});

        if($scope.uploader.queue[0]) {
          var uploadItem = $scope.uploader.queue[0];

          notification.$save(function(response) {
            uploadItem.formData = [{
              key: 'notification_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
              AWSAccessKeyId: $scope.credentials.access_key,
              acl: 'private',
              policy: $scope.credentials.policy,
              signature: $scope.credentials.signature,
              'Content-Type': 'application/octet-stream',
              filename: 'notification_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
            }];

            uploadItem.onSuccess = function() {
              $scope.detail = '';
              $location.path('notification/' + response._id);
            };

            uploadItem.upload();

            response.imgFilePath = 'https://s3.amazonaws.com/tottus/notification_' + notification._id + '.' + uploadItem.file.name.split('.').pop();
            response.$update();
          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        } else {
          notification.$save(function(response) {
            $location.path('notification/' + response._id);
            $scope.detail = '';
          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        }
      };
    }
]);