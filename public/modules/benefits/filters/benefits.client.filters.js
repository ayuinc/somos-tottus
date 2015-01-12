'use strict';

angular.module('benefits').filter('benefitImageFilter', function() { 
    return function(input) {
        return input !== 'assets/img/posts-placeholder.png' ? true : false;
    };
});