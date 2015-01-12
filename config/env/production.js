'use strict';

module.exports = {
	db: 'mongodb://root:root@proximus.modulusmongo.net:27017/qI8piduh',
	assets: {
		lib: {
			css: [
				'public/assets/stylesheets/main.css',
				'public/assets/stylesheets/ebm.css',
				'public/assets/stylesheets/lazy-loading.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/moment/moment.js',
				'public/lib/moment/locale/es.js',
				'public/lib/angular-moment/angular-moment.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	s3: {
		access_key: 'AKIAJX35ISJYQIF2UHGQ',
		secret_key: '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'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};