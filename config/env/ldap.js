'use strict';

module.exports = {
  "url": "ldap://ldap.forumsys.com:389",
  "adminDn": "cn=read-only-admin,dc=example,dc=com",
  "adminPassword": "password",
  "searchBase": "dc=example,dc=com",
  "searchFilter": "(uid={{username}})"
};