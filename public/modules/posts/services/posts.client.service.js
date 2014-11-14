'use strict';

angular.module('posts')
.factory('Posts', ['$resource',
    function($resource) {
        return $resource('posts/:postId', {
            postId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])
.factory('getPostsPerUser', ['$http', function($http) {
        var postsPerUser = {};
        postsPerUser.getPosts = function (userId) {
            return $http.get('/users/'+userId+'/posts').then(function(res) {
                return res.data;
            });
        };
        return postsPerUser;
    }   
]);