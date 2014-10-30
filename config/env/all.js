'use strict';

module.exports = {
	app: {
		title: 'somos-tottus',
		description: 'Red Social para los empleados de tottus',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				// 'public/lib/bootstrap/dist/css/bootstrap.css',
				// 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				// 'public/lib/ng-file-upload/angular-file-upload-shim.js',
				'public/lib/angular/angular.js',
				// 'public/lib/ng-file-upload/angular-file-upload.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/es5-shim/es5-shim.min.js',
				'public/lib/es5-shim/es5-sham.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				// 'public/lib/b3/js/modal.js',
				// 'public/lib/b3/js/transition.js',
			]
		},
		css: [
			// 'public/modules/**/css/*.css',
			'public/assets/stylesheets/main.css',
			'public/assets/stylesheets/ebm-loops.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};