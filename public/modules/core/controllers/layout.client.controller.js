'use strict';

angular.module('core').controller('LayoutController', ['$scope', '$location', 'Authentication', 'Layout',
  function($scope, $location, Authentication, Layout) {
    // AUTH PATHS
  	var isAuthPath = {
  		'/signin': true,
  		'/signup': true,
  		'/settings/first-change-password': true,
      '/firstsignin': true
  	};
    $scope.$on('$stateChangeStart', function(){
      var state = $location.$$url;
      var isAuth = isAuthPath[state];
      var stateId = state.split('/');
      if (stateId.length > 2) {
        var statePath = stateId[1] == 'posts' ? 'posts' : 'users';
        state = '/' + statePath + '/:stateId';
      }
      $scope.isAuth = isAuth; // Check if it's on auth paths
      var stateObj = Layout.getPageContent({state: state, isAuth: isAuthPath[state]});
      if (stateObj) {
        var navViewActionBar = stateObj.navViewActionBar;
        if(!isAuth) {
          $scope.actionButtonText = navViewActionBar.actionButtonText;
          $scope.actionButtonAction = navViewActionBar.actionButtonAction;
          $scope.previousPage = navViewActionBar.previousPage && '#!' + navViewActionBar.previousPage;
        }
      }
    });
  }   
]);