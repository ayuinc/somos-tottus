'use strict';

angular.module('users').controller('ModalController', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
      $modal.open({
                templateUrl: 'modules/users/views/modals/change-password-modal.client.view.html',
                controller: function($scope, $modalInstance) {
                    $scope.ok = function() {
                        $modalInstance.close();
                    };
                }
            });
    }
]);
