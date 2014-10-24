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

    // NAVIGATION CONTROL
    var pageContent = {
      '/posts': {
        navViewActionBar: {
          actionButtonText: 'Publicar',
          actionButtonAction: '/#!/posts/new',
          isURL: true
        }
      },
      '/posts/new': {
        navViewActionBar: {
          actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/posts'
        }
      }
    };

    $scope.$on('$stateChangeStart', function(){
      var pathName = $location.$$path;
      var isAuth = isAuthPath[pathName];
      var previousPage = pageContent[pathName].navViewActionBar.previousPage;
      $scope.isAuth = isAuth; // Check if it's on auth paths
      
      if (!isAuth) {
        // console.log(pageContent[pathName].navViewActionBar.actionButtonText);
        $scope.actionButtonText = pageContent[pathName].navViewActionBar.actionButtonText;
        $scope.actionButtonAction = pageContent[pathName].navViewActionBar.actionButtonAction;
        $scope.previousPage = previousPage && '#!' + previousPage;
      }
    });
  }   
]);