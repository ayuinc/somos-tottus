'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	LDAPStrategy = require('passport-ldapauth').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller'),
	ldapConfig = require('../env/ldap');

module.exports = function() {
	// Use LDAP strategy
	passport.use(new LDAPStrategy({
		  server: {
				url: ldapConfig.url,
				bindDn: ldapConfig.bindDn,
				bindCredentials: ldapConfig.bindCredentials,
				searchBase: ldapConfig.searchBase,
				searchFilter: ldapConfig.searchFilter
			},
			passReqToCallback: true
		},
		function(req, user, done) {
			console.log(user);
			console.log('this gets processed FIRST on success, NEVER on error');

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: user.givenName,
				lastName: user.sn,
				username: user.sAMAccountName,
				displayName: user.cn,
				email: user.mail,
				provider: 'ldap',
				providerIdentifierField: 'id'
			};

			users.ldapauthSaveUserProfile(req, providerUserProfile, done);
		}

	));
};