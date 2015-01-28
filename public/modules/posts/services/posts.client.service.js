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

        postsPerUser.delete = function(postId) {
            return $http.delete('/posts/' + postId).then(function(res) {
                return res.data;
            });
        };
        return postsPerUser;
    }   
])
.factory('getPostsPerStore', ['$http', function($http) {
        var getPostsPerStore = {};
        getPostsPerStore.getPosts = function (storeId) {
            return $http.get('/stores/'+storeId+'/posts').then(function(res) {
                return res.data;
            });
        };

        getPostsPerStore.delete = function(postId) {
            return $http.delete('/posts/' + postId).then(function(res) {
                return res.data;
            });
        };
        return getPostsPerStore;
    }   
]);