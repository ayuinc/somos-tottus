'use strict';

angular.module('events').factory('Attendees', ['$http', function($http) {
        var Attendees = {};
        Attendees.registerAttendee = function (eventId) {
            return $http.post('/events/' + eventId + '/registerAttendee').then(function(res) {
                return res.data;
            });
        };

        Attendees.getAttendees = function(eventId) {
            return $http.get('/events/' + eventId + '/attendees').then(function(res) {
                return res.data;
            });
        };
        return Attendees;
    }   
]);
