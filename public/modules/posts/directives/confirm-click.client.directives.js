'use strict';

angular.module('posts').directive('confirmClick', ['$window',
    function($window) {
        return {
            link: function(scope, element, attr) {
                var msg = attr.confirmClick || '¿Estás seguro?';
                var clickAction = attr.confirmedClick;

                element.bind('click', function() {
                    if( $window.confirm(msg) ) {
                        scope.$eval(clickAction);
                    }
                });
            }
        };
    }
]);
