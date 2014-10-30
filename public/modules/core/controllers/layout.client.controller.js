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
    var isCreatePath = {
      '/posts/new': true
    };
    $scope.$on('$stateChangeStart', function(){
      var state = $location.$$url;
      var isAuth = isAuthPath[state];
      var isCreate = isCreatePath[state];
      var stateId = state.split('/');
      if (stateId.length > 2 && stateId[2] != 'new') {
        var statePath = stateId[1] == 'posts' ? 'posts' : 'users';
        state = '/' + statePath + '/:stateId';
      }
      $scope.isAuth = isAuth; // Check if it's on auth paths
      $scope.isCreatePath = isCreate;
      var stateObj = Layout.getPageContent({state: state, isAuth: isAuthPath[state]});      
      if (stateObj) {
        var navViewActionBar = stateObj.navViewActionBar;
        var navViewIndicator = stateObj.navViewIndicator;
        if(!isAuth) {
          // VIEW ACTION BAR
          $scope.actionButtonText = navViewActionBar.actionButtonText;
          $scope.actionButtonAction = navViewActionBar.actionButtonAction;
          $scope.previousPage = navViewActionBar.previousPage && '#!' + navViewActionBar.previousPage;

          // VIEW INDICATOR
          $scope.indicatorText = navViewIndicator.indicatorText;
        }
      }
    });
  }   
]);