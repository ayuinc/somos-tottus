'use strict';



angular.module('comments').factory('Comments', ['$resource', function($resource) {
  return $resource('posts/:postId/comments/:commentId', { commentId:'@_id', postId: '@postId' });
}]);
