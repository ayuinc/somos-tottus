'use strict';

angular.module('core').service('Layout', [
  function() {
   	// NAVIGATION CONTROL
    var pageContentHash = {
      // POSTS
      'listPosts': {
        navViewActionBar: {
          actionButtonText: 'Publicar',
          actionButtonAction: '/#!/posts/new',
          isURL: true
        },
        navViewIndicator: {
          indicatorText: 'Muro'
        }
      },
      'newPost': {
        navViewActionBar: {
          // actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/posts'
        },
        navViewIndicator: {
          indicatorText: 'Nueva publicación'
        }
      },
      'showPost': {
        navViewActionBar: {
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/posts'
        },
        navViewIndicator: {
          indicatorText: 'Publicación'
        }
      },
      // COMMENTS
      'listComments': {},
      'newComment': {
        navViewActionBar: {
          // actionButtonText: 'Publicar',
          // actionButtonAction: '/#!/posts/new',
          previousPage: '/posts',
          isURL: true
        },
        navViewIndicator: {
          indicatorText: 'Escribe un comentario'
        }
      },
      // USERS
      'public-profile': {},
      'profile': {},
      'password': {},
      'first-change-password': {},
      'first-update-profile': {},
      'accounts': {},
      'signup': {},
      'signin': {},
      'firstsignin': {},
      'forgot': {},
      'reset-invalid': {},
      'reset-success': {},
      'reset': {}
    };
    this.getPageContent = function(stateObj){
    	var pageContent = {};
    	var state = stateObj.state;
      var isAuth = stateObj.isAuth;
      // var previousPage = pageContentHash[state].navViewActionBar.previousPage;
      
      if (!isAuth) {
        pageContent = pageContentHash[state];
      }
      return pageContent;
    };
  }   
]);