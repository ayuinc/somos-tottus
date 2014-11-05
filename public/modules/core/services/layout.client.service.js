'use strict';

angular.module('core').service('Layout', [
  function() {
   	// NAVIGATION CONTROL
    var pageContentHash = {
      // POSTS
      'listPosts': {
        navViewActionBar: {
          hasThis: true,
          actionButtonText: 'Publicar',
          actionButtonAction: '/#!/posts/new',
          isURL: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Muro'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'newPost': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/posts'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Nueva publicación'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'showPost': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/posts'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Publicación'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },

      // COMMENTS
      'listComments': {},
      'newComment': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar',
          // actionButtonAction: '/#!/posts/new',
          previousPage: '/posts',
          isURL: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Escribe un comentario'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },

      // USERS
      'public-profile': {},
      'profile': {},
      'password': {},
      'first-change-password': {
        navViewActionBar: {
          hasThis: false
        },
        navViewIndicator: {
          hasThis: false
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'first-update-profile': {
        navViewActionBar: {
          hasThis: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Confirma tus datos'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'accounts': {},
      'signup': {
        navViewActionBar: {
          hasThis: false
        },
        navViewIndicator: {
          hasThis: false
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'signin': {
        navViewActionBar: {
          hasThis: false
        },
        navViewIndicator: {
          hasThis: false
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'firstsignin': {
        navViewActionBar: {
          hasThis: false
        },
        navViewIndicator: {
          hasThis: false
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'forgot': {},
      'reset-invalid': {},
      'reset-success': {},
      'reset': {},

      // MENU
      'navigationDrawer': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar',
          // actionButtonAction: '/#!/posts/new',
          isURL: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Menú'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
    };
    this.getPageContent = function(stateObj){
    	var pageContent = {};
    	var state = stateObj.state;
      // var isAuth = stateObj.isAuth;
      // var previousPage = pageContentHash[state].navViewActionBar.previousPage;
      pageContent = pageContentHash[state];
      
      return pageContent;
    };
  }   
]);