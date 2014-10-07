'use strict';

// angular.module('comments').factory('Comments', ['$resource',
//     function($resource) {
//         return $resource('posts/:postId/comments/:commentId', {
//             commentId: '@_id',
//             postId: '@post.id'
//         }, {
//             update: {
//                 method: 'PUT'
//             }
//         });z
//     }
// ]);

angular.module('comments').factory('Comments', ['$http', 
    function($http) {
        var Comments = function(data) {
            angular.extend(this, data);
        };

        Comments.query = function(postId) {
            return $http.get('/posts/' + postId + '/comments').then(function(res) {
                return new Comments(res.data);
            });
        };

        Comments.get = function(postId, commentId) {
            return $http.get('/posts/' +  postId + '/comments' + commentId).then(function(res) {
                return new Comments(res.data);
            });
        };

        Comments.prototype.create = function(postId) {
            var comment = this;
            return $http.post('/posts/' +  postId + '/comments', comment).then(function(res) {
                comment._id = res.data._id;
                return comment;
            });
        };

        return Comments;
    }
]);
