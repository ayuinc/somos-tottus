'use strict';

angular.module('events').factory('Attendees', ['$http', function($http) {
        var Atendees = {};
        Atendees.registerAttendee = function (eventId) {
            return $http.post('/events/' + eventId + '/registerAttendee').then(function(res) {
                return res.data;
            });
        };
        return Atendees;
    }   
]);
