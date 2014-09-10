'use strict';
(function() {
    describe('PostsController', function() {
        var PostsController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            scope = $rootScope.new();

            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            PostsController = $controller('PostsController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create a new array of posts', inject(function(Posts) {
            var demoPost = new Posts({
                detail: 'I want to say thank you!'
            });

            var demoPosts = [demoPost];

            $httpBackend.expectGET('posts').respond(demoPosts);

            scope.find();
            $httpBackend.flush();

            expect(scope.posts).toEqualData(demoPosts);
        }));

        it('$scope.findOne() should create a new array with one post', inject(function(Posts) {
            var demoPost = new Posts({
                detail: 'I want to say thank you!'
            });

            $stateParams.postId = '525a8422f6d0f87f0e407a33';

            $httpBackend.expectGET(/posts\/([0-9a-fA-F]{24})$/).respond(demoPost);

            scope.findOne();
            $httpBackend.flush();

            expect(scope.post).toEqualData(demoPost);
        }));
    });
}());