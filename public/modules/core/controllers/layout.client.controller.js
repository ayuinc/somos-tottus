'use strict';

angular.module('core').controller('LayoutController', ['$scope', '$location', 'Authentication', 'Layout',
  function($scope, $location, Authentication, Layout) {
  	var isBackgroundGreen = {
  		'/signin': true,
  		'/signup': true,
  		'/settings/first-change-password': true,
  		'/firstsignin': true
  	};
   	$scope.$on('$stateChangeStart', function(){
   		$scope.isGreen = isBackgroundGreen[$location.$$path];
   	});
  }   
]);