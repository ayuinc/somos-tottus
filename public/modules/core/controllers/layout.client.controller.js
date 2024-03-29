'use strict';

angular.module('core').controller('LayoutController', ['$scope', '$location', 'Authentication', 'Layout', '$anchorScroll', 'NotificationsExtra',
  function($scope, $location, Authentication, Layout, $anchorScroll, NotificationsExtra) {
    $scope.authentication = Authentication;
    // console.log('$user', $scope.authentication.user);
    
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

      // update notifications counter
      NotificationsExtra.countUnRead().then(function(data) {
        $scope.unreadNotifications = data.unread;
      });

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

        if(navViewIndicator.hasFilter) {
          $scope.hasNavIndicatorFilter = navViewIndicator.hasFilter;
          $scope.filterCategory = navViewIndicator.filterCategory;
        }

        if(navViewIndicator.getStore) {
          var store = navViewIndicator.getStore(fromState.storeId);
          store.$promise.then(function(store){
            $scope.indicatorText = store.name;
          });
        }

        // NAV SUBNAV TABS
        $scope.hasNavSubnavTabs = navSubnavTabs.hasThis;
        $scope.isRoute = function($state){
          if (state === $state) {
            // console.log(state);
            return navSubnavTabs.isActive;
          }
        };
      }
    });

    var scrollToTop = function() {
      $anchorScroll();
    };

    // SCROLL TOP ON EVERY VIEW CHANGE
    $scope.$on('$stateChangeSuccess', scrollToTop); 
  }
]);
