'use strict';

angular.module('core').service('Layout', [
  function() {
   	// NAVIGATION CONTROL
    var pageContentHash = {
      '/posts': {
        navViewActionBar: {
          actionButtonText: 'Publicar',
          actionButtonAction: '/#!/posts/new',
          isURL: true
        }
      },
      '/posts/new': {
        navViewActionBar: {
          actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/posts'
        }
      },
      '/posts/:stateId': {
        navViewActionBar: {
          actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/posts'
        }
      }
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