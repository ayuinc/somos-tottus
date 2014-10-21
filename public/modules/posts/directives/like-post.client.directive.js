'use strict';

angular.module('posts').directive('like-post', function() {
 	return {
 		scope: {
			title: '@'
		},
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.addPane(scope);
		},
		templateUrl: 'my-pane.html'
 	};   
});