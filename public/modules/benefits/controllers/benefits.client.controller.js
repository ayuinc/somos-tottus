'use strict';

angular.module('benefits').controller('BenefitsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Posts', 'Benefits', 'AWS',
    function($scope, $stateParams, $location, $http, Authentication, Posts, Benefits, AWS) {

        $scope.authentication = Authentication;

        if(!$scope.authentication.user) $location.path('/');

        $scope.new = function() {
          var startDate = new Date(
            $scope.benefit.startDay.yearString,
            $scope.benefit.startDay.monthString - 1,
            $scope.benefit.startDay.dayString,
            $scope.benefit.startDay.hourString,
            $scope.benefit.startDay.minuteString
          );

          var endDate = new Date(
            $scope.benefit.endDay.yearString,
            $scope.benefit.endDay.monthString - 1,
            $scope.benefit.endDay.dayString,
            $scope.benefit.endDay.hourString,
            $scope.benefit.endDay.minuteString
          );

          var newBenefit = new Benefits({
            benefit: {
              location: this.benefit.benefitLocation,
              start: startDate,
              end: endDate
            },
            post: {
              name: this.post.name,
              detail: this.post.detail
            }
          });

          newBenefit.$save(function(response) {
              console.log('response', response);
              $location.path('benefits/' + response._id);
          }, function(errorResponse) {
              console.log('houston', errorResponse.data.message);
              $scope.error = errorResponse.data.message;
          });
        };

        $scope.find = function() {
            $scope.benefits = Benefits.query();
        };

        $scope.findOne = function() {
            $scope.benefit = Benefits.get({ benefitId: $stateParams.benefitId });
        };
    }
  ]);