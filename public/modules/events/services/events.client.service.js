'use strict';

angular.module('events')
.factory('Events', ['$resource',
    function($resource) {
        return $resource('events/:eventId', {
            eventId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])
.factory('getEventsPerStore', ['$http', function($http) {
        var getEventsPerStore = {};
        getEventsPerStore.getStores = function (storeId) {
            return $http.get('/stores/'+storeId+'/events').then(function(res) {
                return res.data;
            });
        };

        // getEventsPerStore.delete = function(postId) {
        //     return $http.delete('/posts/' + postId).then(function(res) {
        //         return res.data;
        //     });
        // };
        return getEventsPerStore;
    }   
]);