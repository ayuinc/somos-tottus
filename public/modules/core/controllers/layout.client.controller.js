'use strict';

angular.module('core').controller('LayoutController', ['$scope', '$location', 'Authentication', 'Layout',
  function($scope, $location, Authentication, Layout) {
   	$scope.hasViewActionBar = function($location) {
   		for (var key in $location) {
   			console.log(key);
   		}
   	};
   	$scope.hasViewIndicator = function() {};
   	$scope.hasSubNavTabs = function() {};  	
  }   
]);