'use strict';

module.exports = {
	db: 'mongodb://root:root@proximus.modulusmongo.net:27017/r7ewoniW',
	// db: 'mongodb://root:root@proximus.modulusmongo.net:27017/qI8piduh',
	// db: 'mongodb://root:root@23.96.9.6:27017/tottus',
	// db: 'mongodb://localhost:27017/smstts',
	// db: 'mongodb://localhost:27017/r7ewoniW',
	app: {
		title: 'somos-tottus - Development Environment'
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
	},
	s3: {
		access_key: 'AKIAJX35ISJYQIF2UHGQ',
		secret_key: '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'
	},
	elasticSearch: {
		host: 'localhost'
	}
};