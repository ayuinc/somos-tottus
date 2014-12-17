'use strict';

angular.module('core').controller('LayoutController', ['$scope', '$location', 'Authentication', 'Layout', '$anchorScroll',
  function($scope, $location, Authentication, Layout, $anchorScroll) {
    $scope.authentication = Authentication;
    console.log('$user', $scope.authentication.user);
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
      // console.log(state);
      var stateObj = Layout.getPageContent({state: state});
      if (stateObj) {
        var navViewActionBar = stateObj.navViewActionBar;
        var navViewIndicator = stateObj.navViewIndicator;
        var navSubnavTabs = stateObj.navSubnavTabs;

        // VIEW ACTION BAR
        $scope.hasNavViewActionBar = navViewActionBar.hasThis;
        if(navViewActionBar.hasThis) {
          if(navViewActionBar.shouldRender) {
            $scope.shouldRender = navViewActionBar.shouldRender($scope.authentication.user) && navViewActionBar.actionButtonText;
          } else {
            $scope.shouldRender = navViewActionBar.actionButtonText;
          }
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
        $scope.isRoute = function($state){
          if (state === $state) {
            // console.log(state);
            return navSubnavTabs.isActive;
          }
        }
      }
    });

    // SCROLL TOP ON EVERY VIEW CHANGE
    $scope.$on('$stateChangeSuccess', scrollToTop);
    function scrollToTop() {
      // console.log('success');
      $anchorScroll();
    }
  }   
]);
