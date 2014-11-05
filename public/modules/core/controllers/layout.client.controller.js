'use strict';

angular.module('core').controller('LayoutController', ['$scope', '$location', 'Authentication', 'Layout',
  function($scope, $location, Authentication, Layout) {
    // AUTH PATHS
  	var isAuthPath = {
  		'signin': true,
  		'signup': true,
  		'first-change-password': true,
      'firstsignin': true
  	};
    var isCreatePath = {
      'newPost': true,
      'newComment': true
    };
    $scope.$on('$stateChangeStart', function(toState, toParams, fromState, fromParams){
      // console.log(toParams);
      var state = toParams.name;
      var isAuth = isAuthPath[state];
      var isCreate = isCreatePath[state];
      $scope.isAuth = isAuth; // Check if it's on auth paths
      $scope.isCreatePath = isCreate;
      var stateObj = Layout.getPageContent({state: state});
      if (stateObj) {
        var navViewActionBar = stateObj.navViewActionBar;
        var navViewIndicator = stateObj.navViewIndicator;
        var navSubnavTabs = stateObj.navSubnavTabs;

        // VIEW ACTION BAR
        $scope.hasNavViewActionBar = navViewActionBar.hasThis;
        if(navViewActionBar.hasThis) {
          $scope.actionButtonText = navViewActionBar.actionButtonText;
          $scope.actionButtonAction = navViewActionBar.actionButtonAction;
          $scope.previousPage = navViewActionBar.previousPage && '#!' + navViewActionBar.previousPage;
        }

        // VIEW INDICATOR
        $scope.hasNavViewIndicator = navViewIndicator.hasThis;
        if(navViewIndicator.hasThis) {
          $scope.indicatorText = navViewIndicator.indicatorText;
        }

        // NAV SUBNAV TABS
        $scope.hasNavSubnavTabs = navSubnavTabs.hasThis;
        if(navSubnavTabs.hasThis) {
        }

      }
    });
  }   
]);