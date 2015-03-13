'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								Authentication.user = null;

								if($location.url() != '/firstsignin' && $location.url() != '/signup') {
									$location.path('signin');
								}
								break;
							case 403:
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);