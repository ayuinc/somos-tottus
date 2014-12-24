'use strict';

angular.module('posts').filter('imageFilter', function() { 
    return function(input) {
        return input !== 'assets/img/posts-placeholder.png' ? true : false;
    };
});