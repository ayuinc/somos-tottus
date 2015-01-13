'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'somos-tottus';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('benefits', ['angularFileUpload']);'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('comments');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core', ['angularMoment']);'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('events', ['angularFileUpload']);'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('likes');'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('notifications');'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('posts', [
  'angularFileUpload',
  'angularMoment'
]);'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('stores');'use strict';
// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users', [
  'ui.bootstrap',
  'ui.router'
]);'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('vacancies', ['angularFileUpload']);'use strict';
// Setting up route
angular.module('benefits').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('listBenefits', {
      url: '/benefits',
      templateUrl: 'modules/benefits/views/list-benefits.client.view.html',
      controller: 'BenefitsController'
    }).state('newBenefit', {
      url: '/benefits/new',
      templateUrl: 'modules/benefits/views/new-benefit.client.view.html',
      controller: 'BenefitsController'
    }).state('showBenefit', {
      url: '/benefits/:benefitId',
      templateUrl: 'modules/benefits/views/show-benefit.client.view.html',
      controller: 'BenefitsController'
    });
  }
]);'use strict';
angular.module('benefits').controller('BenefitsController', [
  '$scope',
  '$stateParams',
  '$location',
  '$http',
  'Authentication',
  'Posts',
  'Benefits',
  'AWS',
  'FileUploader',
  'Notifications',
  function ($scope, $stateParams, $location, $http, Authentication, Posts, Benefits, AWS, FileUploader, Notifications) {
    $scope.authentication = Authentication;
    $scope.detailLetterLimit = 110;
    // If user is signed in then redirect back home
    if (!$scope.authentication.user)
      $location.path('/');
    $scope.uploader = new FileUploader({
      url: 'https://s3.amazonaws.com/tottus/',
      method: 'POST',
      queueLimit: 1
    });
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
    var registerNotification = function (post, nextUrl) {
      if (!!~$scope.authentication.user.roles.indexOf('admin')) {
        // is admin
        var newNot = new Notifications({
            post: post,
            nextUrl: nextUrl
          });
        newNot.$save(function (response) {
          console.log('success!');
        }, function (errorResponse) {
          console.log('error!');
        });
      } else {
        return false;
      }
    };
    $scope.getCredentials = function () {
      AWS.getCredentials().then(function (res) {
        $scope.credentials = res.data;
      });
    };
    $scope.new = function () {
      if ($scope.benefit && $scope.post) {
        // var startDate = new Date(
        //   $scope.benefit.startDay.yearString,
        //   $scope.benefit.startDay.monthString - 1,
        //   $scope.benefit.startDay.dayString,
        //   $scope.benefit.startDay.hourString,
        //   $scope.benefit.startDay.minuteString
        // );
        // var endDate = new Date(
        //   $scope.benefit.endDay.yearString,
        //   $scope.benefit.endDay.monthString - 1,
        //   $scope.benefit.endDay.dayString,
        //   $scope.benefit.endDay.hourString,
        //   $scope.benefit.endDay.minuteString
        // );
        var endDateArr = $scope.benefit.end.split('-');
        if (endDateArr.length === 3) {
          $scope.benefit.end = new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2], 23, 59);
        } else {
          $scope.error = 'Ingrese una fecha completa';
        }
        var newBenefit = new Benefits({
            benefit: {
              location: this.benefit.benefitLocation,
              subtitle: this.benefit.subtitle,
              category: this.benefit.category,
              end: this.benefit.end
            },
            post: {
              name: this.post.name,
              detail: this.post.detail,
              imgFilePath: 'assets/img/posts-placeholder.png'
            }
          });
        if ($scope.uploader.queue[0]) {
          var uploadItem = $scope.uploader.queue[0];
          newBenefit.$save(function (response) {
            uploadItem.formData = [{
                key: 'post_' + response.post + '.' + uploadItem.file.name.split('.').pop(),
                AWSAccessKeyId: $scope.credentials.access_key,
                acl: 'private',
                policy: $scope.credentials.policy,
                signature: $scope.credentials.signature,
                'Content-Type': 'application/octet-stream',
                filename: 'post_' + response.post + '.' + uploadItem.file.name.split('.').pop()
              }];
            uploadItem.onSuccess = function () {
              $scope.detail = '';
              $location.path('benefits/' + response._id);
            };
            uploadItem.upload();
            var nextUrl = 'benefits/' + response._id;
            registerNotification(response.post, nextUrl);
            var post = Posts.get({ postId: response.post }, function () {
                post.imgFilePath = 'https://s3.amazonaws.com/tottus/post_' + response.post + '.' + uploadItem.file.name.split('.').pop();
                post.$update();
              });
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        } else {
          newBenefit.$save(function (response) {
            var nextUrl = 'benefits/' + response._id;
            registerNotification(response.post, nextUrl);
            $location.path('benefits/' + response._id);
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        }
      } else {
        $scope.error = 'Completa los campos requeridos.';
      }
    };
    $scope.find = function () {
      $scope.benefits = Benefits.query();
    };
    $scope.findOne = function () {
      $scope.benefit = Benefits.get({ benefitId: $stateParams.benefitId });
      $scope.benefit.$promise.then(function (benefit) {
        benefit.post = Posts.get({ postId: benefit.post });
        benefit.post.$promise.then(function (post) {
          post.ngLike = false;
          for (var i = post.likes.length - 1; i >= 0; i--) {
            if (post.likes[i].user === $scope.authentication.user._id) {
              post.ngLike = true;
              return;
            }
          }
        });
      });
    };
    $scope.remove = function (benefit) {
      if (benefit) {
        benefit.$remove();
        for (var i in $scope.benefits) {
          if ($scope.benefits[i] === benefit) {
            $scope.benefits.splice(i, 1);
          }
        }
      } else {
        $scope.benefit.$remove(function () {
          $location.path('benefits');
        });
      }
    };
    $scope.canRemove = function () {
      return !!~$scope.authentication.user.roles.indexOf('admin');
    };
  }
]);'use strict';
angular.module('benefits').filter('benefitImageFilter', function () {
  return function (input) {
    return input !== 'assets/img/posts-placeholder.png' ? true : false;
  };
});'use strict';
angular.module('benefits').factory('Benefits', [
  '$resource',
  function ($resource) {
    return $resource('benefits/:benefitId', { benefitId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
angular.module('comments').config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('listComments', {
      url: '/posts/:postId/comments',
      templateUrl: 'modules/comments/views/list-comments.client.view.html'
    }).state('newComment', {
      url: '/posts/:postId/comments/new',
      templateUrl: 'modules/comments/views/new-comment.client.view.html'
    });
  }
]);'use strict';
angular.module('comments').controller('CommentsController', [
  '$scope',
  '$stateParams',
  '$window',
  'Authentication',
  'Posts',
  'Comments',
  function ($scope, $stateParams, $window, Authentication, Posts, Comments) {
    $scope.authentication = Authentication;
    $scope.text = '';
    $scope.getPost = function () {
      $scope.post = Posts.get({ postId: $stateParams.postId });
    };
    $scope.addComment = function () {
      var comment = new Comments({
          text: $scope.text,
          postId: $stateParams.postId
        });
      comment.$save(function () {
        $window.history.back();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);'use strict';
angular.module('comments').factory('Comments', [
  '$resource',
  function ($resource) {
    return $resource('posts/:postId/comments/:commentId', {
      commentId: '@_id',
      postId: '@postId'
    });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      controller: function ($scope, $location) {
        if ($scope.authentication.user)
          $location.path('/posts');
      }
    }).state('navigationDrawer', {
      url: '/menu',
      templateUrl: 'modules/core/views/nav-drawer.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  '$location',
  'Authentication',
  'Posts',
  function ($scope, $location, Authentication, Posts) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    if (!$scope.authentication.user)
      $location.path('/signin');
    $scope.user = $scope.authentication.user;
  }
]);'use strict';
angular.module('core').controller('LayoutController', [
  '$scope',
  '$location',
  'Authentication',
  'Layout',
  '$anchorScroll',
  'NotificationsExtra',
  function ($scope, $location, Authentication, Layout, $anchorScroll, NotificationsExtra) {
    $scope.authentication = Authentication;
    // console.log('$user', $scope.authentication.user);
    // AUTH PATHS
    var isAuthPath = {
        'signin': true,
        'signup': true,
        'first-change-password': true,
        'firstsignin': true
      };
    var isCreatePath = {
        'newPost': true,
        'newComment': true
      };
    $scope.$on('$stateChangeStart', function (toState, toParams, fromState, fromParams) {
      // console.log(toParams);
      var state = toParams.name;
      var isAuth = isAuthPath[state];
      var isCreate = isCreatePath[state];
      $scope.isAuth = isAuth;
      // Check if it's on auth paths
      $scope.isCreatePath = isCreate;
      // console.log(state);
      // update notifications counter
      NotificationsExtra.countUnRead().then(function (data) {
        $scope.unreadNotifications = data.unread;
      });
      var stateObj = Layout.getPageContent({ state: state });
      if (stateObj) {
        var navViewActionBar = stateObj.navViewActionBar;
        var navViewIndicator = stateObj.navViewIndicator;
        var navSubnavTabs = stateObj.navSubnavTabs;
        // VIEW ACTION BAR
        $scope.hasNavViewActionBar = navViewActionBar.hasThis;
        if (navViewActionBar.hasThis) {
          if (navViewActionBar.shouldRender) {
            $scope.shouldRender = navViewActionBar.shouldRender($scope.authentication.user) && navViewActionBar.actionButtonText;
          } else {
            $scope.shouldRender = navViewActionBar.actionButtonText;
          }
          $scope.actionButtonText = navViewActionBar.actionButtonText;
          $scope.actionButtonAction = navViewActionBar.actionButtonAction;
          $scope.previousPage = navViewActionBar.previousPage && '#!' + navViewActionBar.previousPage;
        }
        // VIEW INDICATOR
        $scope.hasNavViewIndicator = navViewIndicator.hasThis;
        if (navViewIndicator.hasThis) {
          $scope.indicatorText = navViewIndicator.indicatorText;
        }
        // NAV SUBNAV TABS
        $scope.hasNavSubnavTabs = navSubnavTabs.hasThis;
        $scope.isRoute = function ($state) {
          if (state === $state) {
            // console.log(state);
            return navSubnavTabs.isActive;
          }
        };
      }
    });
    // SCROLL TOP ON EVERY VIEW CHANGE
    $scope.$on('$stateChangeSuccess', scrollToTop);
    function scrollToTop() {
      // console.log('success');
      $anchorScroll();
    }
  }
]);'use strict';
angular.module('core').directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});'use strict';
angular.module('core').service('Layout', [function () {
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // NAVIGATION CONTROL
    var pageContentHash = {
        'listPosts': {
          navViewActionBar: {
            hasThis: true,
            actionButtonText: 'Publicar',
            actionButtonAction: '/#!/posts/new',
            isURL: true,
            shouldRender: shouldRender,
            roles: ['*']
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Muro'
          },
          navSubnavTabs: {
            hasThis: true,
            isActive: true
          }
        },
        'newPost': {
          navViewActionBar: {
            hasThis: true,
            actionButtonAction: '',
            isURL: true,
            previousPage: '/posts'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Nueva publicaci\xf3n'
          },
          navSubnavTabs: { hasThis: false }
        },
        'showPost': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/posts'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Publicaci\xf3n'
          },
          navSubnavTabs: { hasThis: true }
        },
        'listComments': {},
        'newComment': {
          navViewActionBar: {
            hasThis: true,
            previousPage: '/posts',
            isURL: true
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Escribe un comentario'
          },
          navSubnavTabs: { hasThis: false }
        },
        'public-profile': {
          navViewActionBar: {
            hasThis: true,
            isURL: true
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Perfil'
          },
          navSubnavTabs: { hasThis: true }
        },
        'profile': {
          navViewActionBar: {
            hasThis: true,
            isURL: true
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Mi perfil'
          },
          navSubnavTabs: { hasThis: true }
        },
        'password': {},
        'first-change-password': {
          navViewActionBar: { hasThis: false },
          navViewIndicator: { hasThis: false },
          navSubnavTabs: { hasThis: false }
        },
        'first-update-profile': {
          navViewActionBar: { hasThis: true },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Confirma tus datos'
          },
          navSubnavTabs: { hasThis: false }
        },
        'accounts': {},
        'signup': {
          navViewActionBar: { hasThis: false },
          navViewIndicator: { hasThis: false },
          navSubnavTabs: { hasThis: false }
        },
        'signin': {
          navViewActionBar: { hasThis: false },
          navViewIndicator: { hasThis: false },
          navSubnavTabs: { hasThis: false }
        },
        'firstsignin': {
          navViewActionBar: { hasThis: false },
          navViewIndicator: { hasThis: false },
          navSubnavTabs: { hasThis: false }
        },
        'forgot': {},
        'reset-invalid': {},
        'reset-success': {},
        'reset': {},
        'edit-field': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/settings/profile'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Editar informaci\xf3n'
          },
          navSubnavTabs: { hasThis: false }
        },
        'navigationDrawer': {
          navViewActionBar: {
            hasThis: true,
            isURL: true
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Men\xfa'
          },
          navSubnavTabs: {
            hasThis: true,
            isActive: true
          }
        },
        'listBenefits': {
          navViewActionBar: {
            hasThis: true,
            actionButtonText: 'Publicar beneficio',
            actionButtonAction: '/#!/benefits/new',
            isURL: true,
            shouldRender: shouldRender,
            roles: ['admin']
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Beneficios'
          },
          navSubnavTabs: { hasThis: true }
        },
        'newBenefit': {
          navViewActionBar: {
            hasThis: true,
            actionButtonAction: '',
            isURL: true,
            previousPage: '/benefits'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Nuevo beneficio'
          },
          navSubnavTabs: { hasThis: false }
        },
        'showBenefit': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/benefits'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Beneficio'
          },
          navSubnavTabs: { hasThis: true }
        },
        'listEvents': {
          navViewActionBar: {
            hasThis: true,
            actionButtonText: 'Publicar evento',
            actionButtonAction: '/#!/events/new',
            isURL: true,
            shouldRender: shouldRender,
            roles: ['admin']
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Eventos'
          },
          navSubnavTabs: { hasThis: true }
        },
        'createEvent': {
          navViewActionBar: {
            hasThis: true,
            actionButtonAction: '',
            isURL: true,
            previousPage: '/events'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Nuevo evento'
          },
          navSubnavTabs: { hasThis: false }
        },
        'viewEvent': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/events'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Evento'
          },
          navSubnavTabs: { hasThis: true }
        },
        'listAttendees': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/events'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Asistentes'
          },
          navSubnavTabs: { hasThis: true }
        },
        'listStores': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            shouldRender: shouldRender,
            roles: ['admin']
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Tiendas'
          },
          navSubnavTabs: { hasThis: true }
        },
        'newStore': {
          navViewActionBar: {
            hasThis: true,
            actionButtonAction: '',
            isURL: true,
            previousPage: '/stores'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Nueva tienda'
          },
          navSubnavTabs: { hasThis: false }
        },
        'storeWall': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/stores'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Publicaciones'
          },
          navSubnavTabs: { hasThis: true }
        },
        'listVacancies': {
          navViewActionBar: {
            hasThis: true,
            actionButtonText: 'Publicar oportunidad',
            actionButtonAction: '/#!/vacancies/new',
            isURL: true
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Oportunidades de cambio interno'
          },
          navSubnavTabs: { hasThis: true }
        },
        'newVacancy': {
          navViewActionBar: {
            hasThis: true,
            actionButtonAction: '',
            isURL: true,
            previousPage: '/vacancies'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Nueva oportunidad'
          },
          navSubnavTabs: { hasThis: false }
        },
        'showVacancy': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/vacancies'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Oportunidad de cambio interno'
          },
          navSubnavTabs: { hasThis: true }
        },
        'listBirthdays': {
          navViewActionBar: {
            hasThis: true,
            isURL: true
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Cumplea\xf1os'
          },
          navSubnavTabs: { hasThis: true }
        },
        'showBirthday': {
          navViewActionBar: {
            hasThis: true,
            isURL: true,
            previousPage: '/birthdays'
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Cumplea\xf1os'
          },
          navSubnavTabs: { hasThis: true }
        },
        'listNotifications': {
          navViewActionBar: {
            hasThis: true,
            isURL: true
          },
          navViewIndicator: {
            hasThis: true,
            indicatorText: 'Notificaciones'
          },
          navSubnavTabs: {
            hasThis: true,
            isActive: true
          }
        }
      };
    this.getPageContent = function (stateObj) {
      var pageContent = {};
      var state = stateObj.state;
      // var isAuth = stateObj.isAuth;
      // var previousPage = pageContentHash[state].navViewActionBar.previousPage;
      pageContent = pageContentHash[state];
      return pageContent;
    };
  }]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
//Setting up route
angular.module('events').config([
  '$stateProvider',
  function ($stateProvider) {
    // Event state routing
    $stateProvider.state('listEvents', {
      url: '/events',
      templateUrl: 'modules/events/views/list-events.client.view.html'
    }).state('createEvent', {
      url: '/events/new',
      templateUrl: 'modules/events/views/new-event.client.view.html'
    }).state('viewEvent', {
      url: '/events/:eventId',
      templateUrl: 'modules/events/views/show-event.client.view.html'
    }).state('listAttendees', {
      url: '/events/:eventId/attendees',
      templateUrl: 'modules/events/views/list-attendees.client.view.html'
    });
  }
]);'use strict';
angular.module('events').controller('EventsController', [
  '$scope',
  '$stateParams',
  '$location',
  '$http',
  'Authentication',
  'Posts',
  'Events',
  'AWS',
  'FileUploader',
  'Attendees',
  'Notifications',
  function ($scope, $stateParams, $location, $http, Authentication, Posts, Events, AWS, FileUploader, Attendees, Notifications) {
    $scope.authentication = Authentication;
    $scope.detailLetterLimit = 170;
    // If user is signed in then redirect back home
    if (!$scope.authentication.user)
      $location.path('/');
    $scope.uploader = new FileUploader({
      url: 'https://s3.amazonaws.com/tottus/',
      method: 'POST',
      queueLimit: 1
    });
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
    var registerNotification = function (post, nextUrl) {
      if (!!~$scope.authentication.user.roles.indexOf('admin')) {
        // is admin
        var newNot = new Notifications({
            post: post,
            nextUrl: nextUrl
          });
        newNot.$save(function (response) {
          console.log('success!');
        }, function (errorResponse) {
          console.log('error!');
        });
      } else {
        return false;
      }
    };
    $scope.getCredentials = function () {
      AWS.getCredentials().then(function (res) {
        $scope.credentials = res.data;
      });
    };
    $scope.new = function () {
      if ($scope.evt && $scope.post) {
        var startDateArr = $scope.evt.startDate.split('-');
        var startTimeArr = $scope.evt.startTime.split(':');
        var endDateArr = $scope.evt.endDate.split('-');
        var endTimeArr = $scope.evt.endTime.split(':');
        if (startDateArr.length === 3 && startTimeArr.length === 2 && endDateArr.length === 3 && endTimeArr.length === 2) {
          var startDate = new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2], startTimeArr[0], startTimeArr[1]);
          var endDate = new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2], endTimeArr[0], endTimeArr[1]);
          var newEvent = new Events({
              evt: {
                location: this.evt.eventLocation,
                start: startDate,
                end: endDate
              },
              post: {
                name: this.post.name,
                detail: this.post.detail,
                imgFilePath: 'assets/img/img-placeholder.png'
              }
            });
          if ($scope.uploader.queue[0]) {
            var uploadItem = $scope.uploader.queue[0];
            newEvent.$save(function (response) {
              uploadItem.formData = [{
                  key: 'post_' + response.post + '.' + uploadItem.file.name.split('.').pop(),
                  AWSAccessKeyId: $scope.credentials.access_key,
                  acl: 'private',
                  policy: $scope.credentials.policy,
                  signature: $scope.credentials.signature,
                  'Content-Type': 'application/octet-stream',
                  filename: 'post_' + response.post + '.' + uploadItem.file.name.split('.').pop()
                }];
              uploadItem.onSuccess = function () {
                $scope.detail = '';
                $location.path('events/' + response._id);
              };
              uploadItem.upload();
              var nextUrl = 'events/' + response._id;
              registerNotification(response.post, nextUrl);
              var post = Posts.get({ postId: response.post }, function () {
                  post.imgFilePath = 'https://s3.amazonaws.com/tottus/post_' + response.post + '.' + uploadItem.file.name.split('.').pop();
                  post.$update();
                });
            }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
            });
          } else {
            newEvent.$save(function (response) {
              var nextUrl = 'events/' + response._id;
              registerNotification(response.post, nextUrl);
              $location.path('events/' + response._id);
            }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
            });
          }
        } else {
          $scope.error = 'Completa los campos requeridos.';
        }
      } else {
        $scope.error = 'Completa los campos requeridos.';
      }
    };
    $scope.find = function () {
      $scope.events = Events.query();
      $scope.events.$promise.then(function (events) {
      });
    };
    $scope.findOne = function () {
      $scope.evt = Events.get({ eventId: $stateParams.eventId });
      $scope.evt.$promise.then(function (evt) {
        evt.attended = false;
        evt.post = Posts.get({ postId: evt.post });
        for (var i = evt.attendees.length - 1; i >= 0; i--) {
          if (evt.attendees[i] === $scope.authentication.user._id) {
            evt.attended = true;
            return;
          }
        }
      });
    };
    $scope.getAttendees = function () {
      Attendees.getAttendees($stateParams.eventId).then(function (res) {
        $scope.evtAttendees = res;
      });
    };
    $scope.registerAttendee = function () {
      $scope.evt.attended = true;
      $scope.evt.attendees.push($scope.authentication.user._id);
      Attendees.registerAttendee($scope.evt._id).then();
    };
    $scope.remove = function (evt) {
      if (evt) {
        evt.$remove();
        for (var i in $scope.events) {
          if ($scope.events[i] === evt) {
            $scope.events.splice(i, 1);
          }
        }
      } else {
        $scope.evt.$remove(function () {
          $location.path('events');
        });
      }
    };
    $scope.canRemove = function () {
      return !!~$scope.authentication.user.roles.indexOf('admin');
    };
  }
]);'use strict';
angular.module('events').directive('attended', [function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
      }
    };
  }]);'use strict';
angular.module('events').filter('eventImageFilter', function () {
  return function (input) {
    return input !== 'assets/img/img-placeholder.png' ? true : false;
  };
});'use strict';
angular.module('events').factory('Attendees', [
  '$http',
  function ($http) {
    var Attendees = {};
    Attendees.registerAttendee = function (eventId) {
      return $http.post('/events/' + eventId + '/registerAttendee').then(function (res) {
        return res.data;
      });
    };
    Attendees.getAttendees = function (eventId) {
      return $http.get('/events/' + eventId + '/attendees').then(function (res) {
        return res.data;
      });
    };
    return Attendees;
  }
]);'use strict';
angular.module('events').factory('Events', [
  '$resource',
  function ($resource) {
    return $resource('events/:eventId', { eventId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
angular.module('likes').config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('like', {
      url: '/posts/:postId/like',
      templateUrl: 'modules/likes/views/like.client.view.html'
    }).state('dislike', {
      url: '/posts/:postId/dislike',
      templateUrl: 'modules/likes/views/dislike.client.view.html'
    });
  }
]);'use strict';
angular.module('likes').controller('LikesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Posts',
  'Likes',
  function ($scope, $stateParams, $location, Authentication, Posts, Likes) {
    $scope.authentication = Authentication;
    $scope.new = function () {
      var like = new Likes({ post: $scope.post });
      like.$save(function (response) {
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);'use strict';
angular.module('likes').factory('Likes', [
  '$http',
  function ($http) {
    var Likes = function (data) {
      angular.extend(this, data);
    };
    Likes.prototype.create = function (postId) {
      var like = this;
      return $http.post('/posts/' + postId + '/likes', like).then(function (res) {
        like._id = res.data._id;
        return like;
      });
    };
    return Likes;
  }
]);'use strict';
// Setting up route
angular.module('notifications').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('listNotifications', {
      url: '/notifications',
      templateUrl: 'modules/notifications/views/list-notifications.client.view.html'
    });
  }
]);  // $.ajax({type: 'GET', url:'/notifications', dataType: 'json', data: {'title': 'I', 'content': 'ov'}, success: function(d){ console.log(d)}, error: function(err){console.error(err)}});
'use strict';
angular.module('notifications').controller('NotificationsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Notifications',
  'NotificationsExtra',
  function ($scope, $stateParams, $location, Authentication, Notifications, NotificationsExtra) {
    $scope.authentication = Authentication;
    $scope.detailLetterLimit = 140;
    $scope.find = function () {
      $scope.notifications = Notifications.query();
    };
    $scope.nextRedirect = function (notification) {
      NotificationsExtra.markAsRead(notification._id).then();
      $location.path(notification.nextUrl);
    };
  }
]);'use strict';
angular.module('notifications').factory('Notifications', [
  '$resource',
  function ($resource) {
    return $resource('notifications/:notificationId', { notificationId: '@_id' }, { update: { method: 'PUT' } });
  }
]).factory('NotificationsExtra', [
  '$http',
  function ($http) {
    var NotificationsExtra = {};
    NotificationsExtra.markAsRead = function (notId) {
      return $http.put('/notifications/' + notId + '/markAsRead').then(function (res) {
        return res.data;
      });
    };
    NotificationsExtra.countUnRead = function () {
      return $http.get('/notifications/unRead').then(function (res) {
        return res.data;
      });
    };
    return NotificationsExtra;
  }
]);'use strict';
angular.module('posts').run([
  'amMoment',
  function (amMoment) {
    amMoment.changeLocale('es');
  }
]);'use strict';
// Setting up route
angular.module('posts').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('listPosts', {
      url: '/posts',
      templateUrl: 'modules/posts/views/list-posts.client.view.html'
    }).state('newPost', {
      url: '/posts/new',
      templateUrl: 'modules/posts/views/new-post.client.view.html'
    }).state('showPost', {
      url: '/posts/:postId',
      templateUrl: 'modules/posts/views/show-post.client.view.html'
    });
  }
]);'use strict';
angular.module('posts').controller('PostsController', [
  '$scope',
  '$stateParams',
  '$location',
  '$http',
  'Authentication',
  'Posts',
  'Comments',
  'Likes',
  'AWS',
  'FileUploader',
  'getPostsPerUser',
  'getPostsPerStore',
  'Notifications',
  'Stores',
  function ($scope, $stateParams, $location, $http, Authentication, Posts, Comments, Likes, AWS, FileUploader, getPostsPerUser, getPostsPerStore, Notifications, Stores) {
    $scope.authentication = Authentication;
    $scope.uploader = new FileUploader({
      url: 'https://s3.amazonaws.com/tottus/',
      method: 'POST',
      queueLimit: 1
    });
    // If user is signed in then redirect back home
    if (!$scope.authentication.user)
      $location.path('/');
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
    $scope.getCredentials = function () {
      AWS.getCredentials().then(function (res) {
        $scope.credentials = res.data;
      });
    };
    $scope.getStores = function () {
      $scope.stores = Stores.query();
    };
    var registerNotification = function (post, nextUrl) {
      if (!!~$scope.authentication.user.roles.indexOf('admin')) {
        // is admin
        var newNot = new Notifications({
            post: post,
            nextUrl: nextUrl
          });
        newNot.$save(function (response) {
          console.log('success!');
        }, function (errorResponse) {
          console.log('error!', errorResponse);
        });
      } else {
        return false;
      }
    };
    $scope.new = function () {
      console.log(this.storeId);
      var post = new Posts({
          detail: this.detail,
          store: this.storeId
        });
      if ($scope.uploader.queue[0]) {
        var uploadItem = $scope.uploader.queue[0];
        post.$save(function (response) {
          uploadItem.formData = [{
              key: 'post_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
              AWSAccessKeyId: $scope.credentials.access_key,
              acl: 'private',
              policy: $scope.credentials.policy,
              signature: $scope.credentials.signature,
              'Content-Type': 'application/octet-stream',
              filename: 'post_' + response._id + '.' + uploadItem.file.name.split('.').pop()
            }];
          uploadItem.onSuccess = function () {
            $scope.detail = '';
            $location.path('posts/' + response._id);
          };
          var nextUrl = 'posts/' + response._id;
          registerNotification(response._id, nextUrl);
          uploadItem.upload();
          response.imgFilePath = 'https://s3.amazonaws.com/tottus/post_' + post._id + '.' + uploadItem.file.name.split('.').pop();
          response.$update();
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      } else {
        post.$save(function (response) {
          var nextUrl = 'posts/' + response._id;
          registerNotification(response._id, nextUrl);
          $location.path('posts/' + response._id);
          $scope.detail = '';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };
    $scope.like = function (post) {
      console.log('post', post);
      var like = new Likes({ post: post._id });
      post.ngLike = true;
      post.likes.push($scope.authentication.user);
      like.create(post._id);
    };
    $scope.find = function () {
      $scope.posts = Posts.query();
      $scope.posts.$promise.then(function (posts) {
        for (var i = posts.length - 1; i >= 0; i--) {
          $scope.posts[i].ngLike = false;
          for (var j = posts[i].likes.length - 1; j >= 0; j--) {
            if (posts[i].likes[j].user === $scope.authentication.user._id) {
              $scope.posts[i].ngLike = true;
              break;
            }
          }
        }
      });
    };
    $scope.findOne = function () {
      $scope.post = Posts.get({ postId: $stateParams.postId });
      $scope.post.$promise.then(function (post) {
        $scope.post.ngLike = false;
        for (var i = post.likes.length - 1; i >= 0; i--) {
          if (post.likes[i].user === $scope.authentication.user._id) {
            $scope.post.ngLike = true;
            // te gusta 
            return;
          }
        }
      });
    };
    $scope.findByStore = function () {
      getPostsPerStore.getPosts($stateParams.storeId).then(function (posts) {
        for (var i = posts.length - 1; i >= 0; i--) {
          posts[i].ngLike = false;
          for (var j = posts[i].likes.length - 1; j >= 0; j--) {
            if (posts[i].likes[j].user === $scope.authentication.user._id) {
              posts[i].ngLike = true;
              break;
            }
          }
        }
        $scope.posts = posts;
      });
    };
    $scope.canRemove = function (post) {
      if (post.$resolved)
        return !!~$scope.authentication.user.roles.indexOf('admin') || $scope.authentication.user._id === post.user._id;
    };
    $scope.remove = function (post) {
      if (post) {
        post.$remove();
        for (var i in $scope.posts) {
          if ($scope.posts[i] === post) {
            $scope.posts.splice(i, 1);
          }
        }
      } else {
        $scope.post.$remove(function () {
          $location.path('posts');
        });
      }
    };
    $scope.removeFromProfile = function (post) {
      if (post) {
        getPostsPerUser.delete(post._id);
        for (var i in $scope.posts) {
          if ($scope.posts[i] === post) {
            $scope.posts.splice(i, 1);
          }
        }
      }
    };
  }
]);'use strict';
angular.module('posts').directive('confirmClick', [
  '$window',
  function ($window) {
    return {
      link: function (scope, element, attr) {
        var msg = attr.confirmClick || '\xbfEst\xe1s seguro?';
        var clickAction = attr.confirmedClick;
        element.bind('click', function () {
          if ($window.confirm(msg)) {
            scope.$eval(clickAction);
          }
        });
      }
    };
  }
]);'use strict';
angular.module('posts').directive('lazySrc', [
  '$window',
  '$document',
  function ($window, $document) {
    var lazyLoader = function () {
        var images = [];
        var renderTimer = null;
        var renderDelay = 100;
        var win = $($window);
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;
        var isWatchingWindow = false;
        function addImage(image) {
          images.push(image);
          if (!renderTimer) {
            startRenderTimer();
          }
          if (!isWatchingWindow) {
            startWatchingWindow();
          }
        }
        function removeImage(image) {
          for (var i = 0; i < images.length; i++) {
            if (images[i] === image) {
              images.splice(i, 1);
              break;
            }
          }
          if (!images.length) {
            clearRenderTimer();
            stopWatchingWindow();
          }
        }
        function checkDocumentHeight() {
          if (renderTimer) {
            return;
          }
          var currentDocumentHeight = doc.height();
          if (currentDocumentHeight === documentHeight) {
            return;
          }
          documentHeight = currentDocumentHeight;
          startRenderTimer();
        }
        function checkImages() {
          console.log('Checking for visible images...');
          var visible = [];
          var hidden = [];
          var windowHeight = win.height();
          var scrollTop = win.scrollTop();
          var topFoldOffset = scrollTop;
          var bottomFoldOffset = topFoldOffset + windowHeight;
          for (var i = 0; i < images.length; i++) {
            var image = images[i];
            if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
              visible.push(image);
            } else {
              hidden.push(image);
            }
          }
          for (var j = 0; j < visible.length; j++) {
            visible[j].render();
          }
          images = hidden;
          clearRenderTimer();
          if (!images.length) {
            stopWatchingWindow();
          }
        }
        function clearRenderTimer() {
          clearTimeout(renderTimer);
          renderTimer = null;
        }
        function startRenderTimer() {
          renderTimer = setTimeout(checkImages, renderDelay);
        }
        function startWatchingWindow() {
          isWatchingWindow = true;
          win.on('resize.lazySrc', windowChanged);
          win.on('scroll.lazySrc', windowChanged);
          documentTimer = setInterval(checkDocumentHeight, documentDelay);
        }
        function stopWatchingWindow() {
          isWatchingWindow = false;
          win.off('resize.lazySrc');
          win.off('scroll.lazySrc');
          clearInterval(documentTimer);
        }
        function windowChanged() {
          if (!renderTimer) {
            startRenderTimer();
          }
        }
        return {
          addImage: addImage,
          removeImage: removeImage
        };
      }();
    function LazyImage(element) {
      var source = null;
      var isRendered = false;
      var height = null;
      function isVisible(topFoldOffset, bottomFoldOffset) {
        if (!element.is(':visible')) {
          return false;
        }
        if (height === null) {
          height = element.height();
        }
        var top = element.offset().top;
        var bottom = top + height;
        return top <= bottomFoldOffset && top >= topFoldOffset || bottom <= bottomFoldOffset && bottom >= topFoldOffset || top <= topFoldOffset && bottom >= bottomFoldOffset;
      }
      function render() {
        isRendered = true;
        renderSource();
      }
      function setSource(newSource) {
        source = newSource;
        if (isRendered) {
          renderSource();
        }
      }
      function renderSource() {
        element[0].src = source;
      }
      return {
        isVisible: isVisible,
        render: render,
        setSource: setSource
      };
    }
    function link($scope, element, attributes) {
      var lazyImage = new LazyImage(element);
      lazyLoader.addImage(lazyImage);
      attributes.$observe('lazySrc', function (newSource) {
        lazyImage.setSource(newSource);
      });
      $scope.$on('$destroy', function () {
        lazyLoader.removeImage(lazyImage);
      });
    }
    return {
      link: link,
      restrict: 'A'
    };
  }
]);'use strict';
angular.module('posts').directive('ngThumb', [
  '$window',
  function ($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
          return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
          var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      };
    return {
      restrict: 'A',
      template: '<canvas/>',
      link: function (scope, element, attributes) {
        if (!helper.support)
          return;
        var params = scope.$eval(attributes.ngThumb);
        if (!helper.isFile(params.file))
          return;
        if (!helper.isImage(params.file))
          return;
        var canvas = element.find('canvas');
        var reader = new FileReader();
        var onLoadFile = function (event) {
          var img = new Image();
          img.onload = onLoadImage;
          img.src = event.target.result;
        };
        var onLoadImage = function () {
          var width = params.width || this.width / this.height * params.height;
          var height = params.height || this.height / this.width * params.width;
          canvas.attr({
            width: width,
            height: height
          });
          canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
        };
        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);
      }
    };
  }
]);'use strict';
angular.module('posts').filter('imageFilter', function () {
  return function (input) {
    return input !== 'assets/img/posts-placeholder.png' ? true : false;
  };
});'use strict';
angular.module('posts').factory('AWS', [
  '$http',
  function ($http) {
    var AWS = {};
    AWS.getCredentials = function () {
      return $http.get('/aws/s3-signature/').then(function (res) {
        return res;
      });
    };
    return AWS;
  }
]);'use strict';
angular.module('posts').factory('Posts', [
  '$resource',
  function ($resource) {
    return $resource('posts/:postId', { postId: '@_id' }, { update: { method: 'PUT' } });
  }
]).factory('getPostsPerUser', [
  '$http',
  function ($http) {
    var postsPerUser = {};
    postsPerUser.getPosts = function (userId) {
      return $http.get('/users/' + userId + '/posts').then(function (res) {
        return res.data;
      });
    };
    postsPerUser.delete = function (postId) {
      return $http.delete('/posts/' + postId).then(function (res) {
        return res.data;
      });
    };
    return postsPerUser;
  }
]).factory('getPostsPerStore', [
  '$http',
  function ($http) {
    var getPostsPerStore = {};
    getPostsPerStore.getPosts = function (storeId) {
      return $http.get('/stores/' + storeId + '/posts').then(function (res) {
        return res.data;
      });
    };
    getPostsPerStore.delete = function (postId) {
      return $http.delete('/posts/' + postId).then(function (res) {
        return res.data;
      });
    };
    return getPostsPerStore;
  }
]);'use strict';
//Setting up route
angular.module('stores').config([
  '$stateProvider',
  function ($stateProvider) {
    // Stores state routing
    $stateProvider.state('listStores', {
      url: '/stores',
      templateUrl: 'modules/stores/views/list-stores.client.view.html'
    }).state('newStore', {
      url: '/stores/new',
      templateUrl: 'modules/stores/views/new-store.client.view.html'
    }).state('storeWall', {
      url: '/stores/:storeId/wall',
      templateUrl: 'modules/stores/views/store-wall.client.view.html'
    }).state('viewStore', {
      url: '/stores/:storeId',
      templateUrl: 'modules/stores/views/view-store.client.view.html'
    }).state('editStore', {
      url: '/stores/:storeId/edit',
      templateUrl: 'modules/stores/views/edit-store.client.view.html'
    });
  }
]);'use strict';
// Stores controller
angular.module('stores').controller('StoresController', [
  '$scope',
  '$stateParams',
  '$location',
  '$http',
  'Authentication',
  'Stores',
  'LocationService',
  function ($scope, $stateParams, $location, $http, Authentication, Stores, LocationService) {
    $scope.authentication = Authentication;
    // Create new Store
    $scope.create = function () {
      // Create new Store object
      var store = new Stores({
          name: this.name,
          address: this.address,
          region: this.region.region,
          district: this.district
        });
      // Redirect after save
      store.$save(function (response) {
        $location.path('stores/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Store
    $scope.remove = function (store) {
      if (store) {
        store.$remove();
        for (var i in $scope.stores) {
          if ($scope.stores[i] === store) {
            $scope.stores.splice(i, 1);
          }
        }
      } else {
        $scope.store.$remove(function () {
          $location.path('stores');
        });
      }
    };
    // Update existing Store
    $scope.update = function () {
      var store = $scope.store;
      store.$update(function () {
        $location.path('stores/' + store._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Stores
    $scope.find = function () {
      $scope.stores = Stores.query();
    };
    // Find existing Store
    $scope.findOne = function () {
      $scope.store = Stores.get({ storeId: $stateParams.storeId });
    };
    // Get locations
    $scope.getLocations = function () {
      LocationService.getLocations().then(function (res) {
        $scope.locations = res.data;
        console.log('locations', $scope.locations);
      });
      console.log('locations', $scope.locations);
    };
    $scope.updateRegion = function () {
      $scope.availableDistricts = $scope.region.districts;
    };
  }
]);'use strict';
angular.module('stores').factory('LocationService', [
  '$http',
  function ($http) {
    var LocationService = {};
    LocationService.getLocations = function () {
      return $http.get('/locations').then(function (data) {
        return data;
      });
    };
    return LocationService;
  }
]);'use strict';
//Stores service used to communicate Stores REST endpoints
angular.module('stores').factory('Stores', [
  '$resource',
  function ($resource) {
    return $resource('stores/:storeId', { storeId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('public-profile', {
      url: '/users/:userId',
      templateUrl: 'modules/users/views/public-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('first-change-password', {
      url: '/settings/first-change-password',
      templateUrl: 'modules/users/views/settings/first-change-password.client.view.html'
    }).state('first-update-profile', {
      url: '/settings/first-update-profile',
      templateUrl: 'modules/users/views/settings/first-update-profile.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('firstsignin', {
      url: '/firstsignin',
      templateUrl: 'modules/users/views/authentication/firstsignin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invalid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    }).state('edit', {
      url: '/settings/edit/:field',
      templateUrl: 'modules/users/views/settings/edit_form_fields/edit.client.view.html'
    }).state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('listBirthdays', {
      url: '/birthdays',
      templateUrl: 'modules/users/views/birthdays/list-birthdays.client.view.html'
    }).state('showBirthday', {
      url: '/birthdays/birthday',
      templateUrl: 'modules/users/views/birthdays/show-birthday.client.view.html'
    });  // .state('update-email', {
         // 	url: '/settings/edit-email',
         // 	templateUrl: 'modules/users/views/settings/edit_form_fields/user.email.client.view.html'
         // });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $scope.credentials.username = $scope.credentials.personal.DNI;
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/posts');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        if ($scope.authentication.user.isRegistered) {
          //$location.path('/');
          $location.path('/posts');  //ruta provicional para la presentacion con Hana
        } else {
          $location.path('/settings/first-change-password');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.firstsignin = function () {
      if (!$scope.credentials.acceptTerms) {
        $scope.error = 'Lo sentimos. No podr\xe1s registrarte en Somos Tottus si no aceptas los t\xe9rminos y condiciones expuestos anteriormente.';
      } else {
        $http.post('/auth/firstSignin', $scope.credentials).success(function (response) {
          // If successful we assign the response to the global user model
          $scope.authentication.user = response;
          if ($scope.authentication.user.isRegistered) {
            $location.path('/posts');
          } else {
            $location.path('/settings/first-change-password');
          }
        }).error(function (response) {
          $scope.error = response.message;
        });
      }
    };
  }
]);'use strict';
angular.module('users').controller('BirthdaysController', [
  '$scope',
  '$http',
  '$location',
  '$stateParams',
  'Users',
  'Authentication',
  'getUsersBirthdays',
  function ($scope, $http, $location, $stateParams, Users, Authentication, getUsersBirthdays) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    $scope.getBirthdays = function () {
      getUsersBirthdays.getBirthdays().then(function (usersBirthday) {
        $scope.usersBirthday = usersBirthday;
        console.log(usersBirthday);
      });
    };
  }
]);'use strict';
angular.module('users').controller('ModalController', [
  '$scope',
  '$modal',
  '$log',
  function ($scope, $modal, $log) {
    $scope.modalChangePassword = function () {
      $modal.open({
        templateUrl: 'modules/users/views/modals/change-password-modal.client.view.html',
        backdrop: 'static',
        controller: function ($scope, $modalInstance) {
          $scope.ok = function () {
            $modalInstance.close();
          };
        }
      });
    };
    $scope.modalFirstProfileUpdate = function () {
      $modal.open({
        templateUrl: 'modules/users/views/modals/first-profile-update-modal.client.view.html',
        backdrop: 'static',
        controller: function ($scope, $modalInstance) {
          $scope.ok = function () {
            $modalInstance.close();
          };
        }
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  'AWS',
  'FileUploader',
  'getPostsPerUser',
  function ($scope, $http, $location, Users, Authentication, AWS, FileUploader, getPostsPerUser) {
    $scope.user = Authentication.user;
    $scope.uploader = new FileUploader({
      url: 'https://s3.amazonaws.com/tottus/',
      method: 'POST',
      queueLimit: 1
    });
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Update a user profile
    $scope.showUserProfile = function () {
      $scope.showProfile = {
        statePosts: false,
        statePersonalInfo: true,
        personalInfo: 'active',
        userPosts: ''
      };
      getPostsPerUser.getPosts($scope.user._id).then(function (posts) {
        for (var i = posts.length - 1; i >= 0; i--) {
          posts[i].ngLike = false;
          for (var j = posts[i].likes.length - 1; j >= 0; j--) {
            if (posts[i].likes[j].user === $scope.user._id) {
              posts[i].ngLike = true;
              break;
            }
          }
        }
        $scope.posts = posts;
      });
    };
    $scope.switchPublicProfile = function (option) {
      if (option === 'posts') {
        if ($scope.showProfile.userPosts === '') {
          $scope.showProfile.personalInfo = '';
          $scope.showProfile.userPosts = 'active';
          $scope.showProfile.statePosts = true;
          $scope.showProfile.statePersonalInfo = false;
        }
      }
      if (option === 'profile') {
        if ($scope.showProfile.personalInfo === '') {
          $scope.showProfile.personalInfo = 'active';
          $scope.showProfile.userPosts = '';
          $scope.showProfile.statePosts = false;
          $scope.showProfile.statePersonalInfo = true;
        }
      }
    };
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        var uploadItem = $scope.uploader.queue[0];
        var user = new Users($scope.user);
        $scope.success = $scope.error = null;
        if ($scope.uploader.queue[0]) {
          user.$update(function (response) {
            $scope.success = true;
            Authentication.user = response;
            uploadItem.formData = [{
                key: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
                AWSAccessKeyId: $scope.credentials.access_key,
                acl: 'private',
                policy: $scope.credentials.policy,
                signature: $scope.credentials.signature,
                'Content-Type': 'application/octet-stream',
                filename: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop()
              }];
            uploadItem.onSuccess = function () {
              $scope.detail = '';
              $location.path('/users/' + Authentication.user._id);
            };
            uploadItem.upload();
            response.assets.profilePicURL = 'https://s3.amazonaws.com/tottus/user_' + user._id + '.' + uploadItem.file.name.split('.').pop();
            response.$update();
          }, function (response) {
            $scope.error = response.data.message;
          });
        } else {
          user.$update(function (response) {
            $scope.success = true;
            Authentication.user = response;
            $location.path('/users/' + Authentication.user._id);
          }, function (response) {
            $scope.error = response.data.message;
          });
        }
      } else {
        $scope.submitted = true;
      }  // if (isValid){
         // 	$scope.success = $scope.error = null;
         // 	var user = new Users($scope.user);
         // 	user.$update(function(response) {
         // 		$scope.success = true;
         // 		Authentication.user = response;
         //                  $location.path('/users/' + Authentication.user._id);
         // 	}, function(response) {
         // 		$scope.error = response.data.message;
         // 	});
         // } else {
         // 	$scope.submitted = true;
         // }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.firstchangeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        //$scope.success = true;
        $scope.passwordDetails = null;
        $location.path('/settings/first-update-profile');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Inicio de métodos parar upload image en AWS S3
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
    $scope.getCredentials = function () {
      AWS.getCredentials().then(function (res) {
        $scope.credentials = res.data;
      });
    };
    // Fin de métodos parar upload image en AWS S3
    $scope.firstupdateUserProfile = function (isValid) {
      var bday = new Date($scope.user.personal.yearString, $scope.user.personal.monthString - 1, $scope.user.personal.dayString);
      var user = new Users($scope.user);
      /*var bday = new Date($scope.user.personal.yearString, $scope.user.personal.monthString -1, $scope.user.personal.dayString);
			$scope.success = $scope.error = null;
			var user = new Users($scope.user);
			user.personal.dateOfBirth = bday;
			//user.isRegistered = true;

			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
				//$location.path('/');
				$location.path('/posts'); //ruta provicional para la presentacion con Hana
			}, function(response) {
				$scope.error = response.data.message;
			});*/
      if ($scope.uploader.queue[0]) {
        var uploadItem = $scope.uploader.queue[0];
        $scope.success = $scope.error = null;
        user.personal.dateOfBirth = bday;
        user.isRegistered = true;
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
          uploadItem.formData = [{
              key: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop(),
              AWSAccessKeyId: $scope.credentials.access_key,
              acl: 'private',
              policy: $scope.credentials.policy,
              signature: $scope.credentials.signature,
              'Content-Type': 'application/octet-stream',
              filename: 'user_' + response._id + '.' + uploadItem.file.name.split('.').pop()
            }];
          uploadItem.onSuccess = function () {
            $scope.detail = '';
            $location.path('/posts');  //ruta provicional para la presentacion con Hana
          };
          uploadItem.upload();
          response.assets.profilePicURL = 'https://s3.amazonaws.com/tottus/user_' + user._id + '.' + uploadItem.file.name.split('.').pop();
          console.log(response);
          response.$update();
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.success = $scope.error = null;
        user.personal.dateOfBirth = bday;
        user.isRegistered = true;
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
          //$location.path('/');
          $location.path('/posts');  //ruta provicional para la presentacion con Hana
        }, function (response) {
          $scope.error = response.data.message;
        });
      }
    };  /*
			=================================
			USER SETTINGS FIELDS
			=================================
		*/
        // Pass the field to be edited to the edit-field view
        //$scope.requestField = $state.params.field;
        // Render the correspondent form to the edit-field view
  }
]);'use strict';
angular.module('users').controller('UsersController', [
  '$scope',
  '$http',
  '$location',
  '$stateParams',
  'Users',
  'Authentication',
  'Posts',
  'getUser',
  'getPostsPerUser',
  function ($scope, $http, $location, $stateParams, Users, Authentication, Posts, getUser, getPostsPerUser) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    $scope.canEdit = function () {
      if ($scope.userProfile)
        return $scope.user._id === $scope.userProfile._id;
    };
    // Update a user profile
    $scope.find = function () {
      $scope.showProfile = {
        statePosts: false,
        statePersonalInfo: true,
        personalInfo: 'active',
        userPosts: ''
      };
      getUser.getProfile($stateParams.userId).then(function (user) {
        $scope.userProfile = user;
      });
      getPostsPerUser.getPosts($stateParams.userId).then(function (posts) {
        for (var i = posts.length - 1; i >= 0; i--) {
          posts[i].ngLike = false;
          for (var j = posts[i].likes.length - 1; j >= 0; j--) {
            if (posts[i].likes[j].user === $scope.user._id) {
              posts[i].ngLike = true;
              break;
            }
          }
        }
        $scope.posts = posts;
      });
    };
    $scope.switchPublicProfile = function (option) {
      if (option === 'posts') {
        if ($scope.showProfile.userPosts === '') {
          $scope.showProfile.personalInfo = '';
          $scope.showProfile.userPosts = 'active';
          $scope.showProfile.statePosts = true;
          $scope.showProfile.statePersonalInfo = false;
        }
      }
      if (option === 'profile') {
        if ($scope.showProfile.personalInfo === '') {
          $scope.showProfile.personalInfo = 'active';
          $scope.showProfile.userPosts = '';
          $scope.showProfile.statePosts = false;
          $scope.showProfile.statePersonalInfo = true;
        }
      }
    };
  }
]);'use strict';
angular.module('users').directive('requestField', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('click', function (e) {
        e.preventDefault();
      });
    }
  };
});'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
angular.module('posts').factory('AWS', [
  '$http',
  function ($http) {
    var AWS = {};
    AWS.getCredentials = function () {
      return $http.get('/aws/s3-signature/').then(function (res) {
        return res;
      });
    };
    return AWS;
  }
]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]).factory('getUser', [
  '$http',
  function ($http) {
    var profile = {};
    profile.getProfile = function (userId) {
      return $http.get('/users/' + userId).then(function (res) {
        return res.data;
      });
    };
    return profile;
  }
]).factory('getUsersBirthdays', [
  '$http',
  function ($http) {
    var UsersBirthdays = {};
    UsersBirthdays.getBirthdays = function () {
      return $http.get('/users/birthdays').then(function (res) {
        return res.data;
      });
    };
    return UsersBirthdays;
  }
]);'use strict';
// Setting up route
angular.module('vacancies').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('listVacancies', {
      url: '/vacancies',
      templateUrl: 'modules/vacancies/views/list-vacancies.client.view.html'
    }).state('newVacancy', {
      url: '/vacancies/new',
      templateUrl: 'modules/vacancies/views/new-vacancy.client.view.html'
    }).state('showVacancy', {
      url: '/vacancies/vacancy',
      templateUrl: 'modules/vacancies/views/show-vacancy.client.view.html'
    });
  }
]);