'use strict';

angular.module('users').controller('ModalController', ['$scope', '$modal', '$log', 
    function ($scope, $modal, $log) {
        $scope.modalChangePassword = function() {
          $modal.open({
                    templateUrl: 'modules/users/views/modals/change-password-modal.client.view.html',
                    backdrop: 'static',
                    controller: function($scope, $modalInstance) {
                        $scope.ok = function() {
                            $modalInstance.close();
                        };
                    }
                });
        };
        $scope.modalFirstProfileUpdate = function() {
          $modal.open({
                    templateUrl: 'modules/users/views/modals/first-profile-update-modal.client.view.html',
                    backdrop: 'static',
                    controller: function($scope, $modalInstance) {
                        $scope.ok = function() {
                            $modalInstance.close();
                        };
                    }
                });
        };
    }
]);
