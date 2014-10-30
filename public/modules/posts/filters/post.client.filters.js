'use strict';

angular.module('posts').filter('imageFilter', function() { 
    return function(input) {
        return input !== 'assets/img/img-placeholder.png' ? true : false;
    };
});