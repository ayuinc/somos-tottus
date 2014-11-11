'use strict';

angular.module('users').directive('requestField', function () {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.on('click', function(e){
				e.preventDefault();
			});
		}
	}
});