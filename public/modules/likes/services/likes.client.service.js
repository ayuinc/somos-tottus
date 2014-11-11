'use strict';

angular.module('likes').factory('Likes', ['$http', 
    function($http) {
        var Likes = function(data) {
            angular.extend(this, data);
        };

        Likes.prototype.create = function(postId) {
            var like = this;
            return $http.post('/posts/' +  postId + '/likes', like).then(function(res) {
                like._id = res.data._id;
                return like;
            });
        };

        return Likes;
    }
]);