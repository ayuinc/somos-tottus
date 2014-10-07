'use strict';

angular.module('core').service('Layout', [
  function() {
   	this.hasViewActionBar = function($location) {
   		for (var key in $location) {
   			console.log(key);
   		}
   	};
   	this.hasViewIndicator = function() {};
   	this.hasSubNavTabs = function() {};  	
  }   
]);