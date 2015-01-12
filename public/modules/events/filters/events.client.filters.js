'use strict';

angular.module('events').filter('eventImageFilter', function() { 
    return function(input) {
        return input !== 'assets/img/img-placeholder.png' ? true : false;
    };
});