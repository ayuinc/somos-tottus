'use strict';

angular.module('core').service('Layout', ['Stores',
  function(Stores) {
    // A private function for rendering decision 
    var shouldRender = function(user) {
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
      // POSTS
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
          indicatorText: 'Muro',
          hasFilter: true,
          filterCategory: 'posts'
        },
        navSubnavTabs: {
          hasThis: true,
          isActive: true
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
      'public-profile': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar',
          // actionButtonAction: '/#!/posts/new',
          isURL: true,
          // previousPage: '/settings/profile'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Perfil'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'profile': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar',
          // actionButtonAction: '/#!/posts/new',
          isURL: true,
          // previousPage: '/settings/profile'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Mi perfil'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'search': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar',
          // actionButtonAction: '/#!/posts/new',
          isURL: true,
          // previousPage: '/settings/profile'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Busca a tus compañeros'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
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
      /*
        =================================
        USER SETTINGS FIELDS
        =================================
      */
      'edit-field': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar',
          // actionButtonAction: '/#!/posts/new',
          isURL: true,
          previousPage: '/settings/profile'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Editar información'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },

      // MENU
      'navigationDrawer': {
        navViewActionBar: {
          hasThis: true,
          actionButtonText: 'Buscar',
          actionButtonAction: '/#!/users/search',
          isURL: true
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Menú'
        },
        navSubnavTabs: {
          hasThis: true,
          isActive: true
        }
      },

      // BENEFITS
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
      'menuBenefit': {
        navViewActionBar: {
          hasThis: true,
          //actionButtonText: 'Publicar evento',
          //actionButtonAction: '/#!/events/new',
          isURL: true,
          previousPage: '/menu'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Tipos de Beneficios'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'viveloBenefit': {
        navViewActionBar: {
          hasThis: true,
          //actionButtonText: 'Publicar evento',
          //actionButtonAction: '/#!/events/new',
          isURL: true,
          previousPage: '/benefits/menu'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Tipos de Beneficios'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'disfrutaloBenefit': {
        navViewActionBar: {
          hasThis: true,
          //actionButtonText: 'Publicar evento',
          //actionButtonAction: '/#!/events/new',
          isURL: true,
          previousPage: '/benefits/menu'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Tipos de Beneficios'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'comparteloBenefit': {
        navViewActionBar: {
          hasThis: true,
          //actionButtonText: 'Publicar evento',
          //actionButtonAction: '/#!/events/new',
          isURL: true,
          previousPage: '/benefits/menu'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Tipos de Beneficios'
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
          isURL: true,
          shouldRender: shouldRender,
          roles: ['admin']
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Eventos',
          hasFilter: true,
          filterCategory: 'events'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'createEvent': {
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
      'viewEvent': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/events'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Evento'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'listAttendees': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          // actionButtonAction: '',
          isURL: true,
          previousPage: '/events'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Asistentes'
        },
        navSubnavTabs: {
          hasThis: true
        }
      },

      // STORES
      'listStores': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Nueva tienda',
          // actionButtonAction: '/#!/stores/new',
          isURL: true,
          shouldRender: shouldRender,
          roles: ['admin']
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Tiendas',
          hasFilter: false,
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'newStore': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Opciones',
          actionButtonAction: '',
          isURL: true,
          previousPage: '/stores'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Nueva tienda'
        },
        navSubnavTabs: {
          hasThis: false
        }
      },

      'storePosts': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Stores',
          // actionButtonAction: '/stores',
          isURL: true,
          previousPage: '/stores?category=posts'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Publicaciones por tienda',
          getStore: function(storeId){
            return Stores.get({storeId: storeId});
          }
        },
        navSubnavTabs: {
          hasThis: true
        }
      },
      'storeEvents': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Stores',
          // actionButtonAction: '/stores',
          isURL: true,
          previousPage: '/stores?category=events'
        },
        navViewIndicator: {
          hasThis: true,
          indicatorText: 'Eventos por tienda',
          getStore: function(storeId){
            return Stores.get({storeId: storeId});
          }
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
      },

      // NOTIFICATIONS
      'listNotifications': {
        navViewActionBar: {
          hasThis: true,
          // actionButtonText: 'Publicar notificaciones',
          // actionButtonAction: '/#!/notifications/new',
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
