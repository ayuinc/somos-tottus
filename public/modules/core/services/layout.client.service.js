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

      // BENEFITS
      'listBenefits': {
        navViewActionBar: {
          hasThis: true,
          actionButtonText: 'Publicar beneficio',
          actionButtonAction: '/#!/benefits/new',
          isURL: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Beneficios'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'newBenefit': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/benefits'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Nuevo beneficio'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'showBenefit': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/benefits'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Beneficio'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },

      // EVENTS
      'listEvents': {
        navViewActionBar: {
          hasThis: true,
          actionButtonText: 'Publicar evento',
          actionButtonAction: '/#!/events/new',
          isURL: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Eventos'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'newEvent': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/events'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Nuevo evento'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'showEvent': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/benefits'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Evento'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },

      // VACANCIES
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
        navSubnavTabs: {
          hasThis: true
        }
      },
      'newVacancy': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/vacancies'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Nueva oportunidad'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },
      'showVacancy': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/vacancies'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Oportunidad de cambio interno'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },

      // BIRTHDAYS
      'listBirthdays': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar cumpleaños',
          // actionButtonAction: '/#!/birthdays/new',
          isURL: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Cumpleaños'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'showBirthday': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/birthdays'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Cumpleaños'
        },
        navSubnavTabs: {
          hasThis: true
        }
      }
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