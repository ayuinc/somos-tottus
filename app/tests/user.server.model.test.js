'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;
var localURL = 'http://localhost:3000';

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			companyId: 'test@test.com',
			tottusId: 'test@test.com',
			password: 'password',
			username: 'username1232',
			provider: 'local',
			email: 'test@test.com',
			isRegistered: 'false',
			assets: {
					profilePicURL       : 'http://sadasdsa.com'
			},
			contact: {
					phoneNumHome       : '95823453'
			},
			demographic: {
					maritalStatus       : 'single',
					children       : '0'
			},
			address: {
					city       : 'Lima',
					address          : 'Av. Flora Trista 433'
			},
			personal: {
			    firstName       : 'Carmen',
			    lastName        : 'Perez',
			    DNI     : '54784931',
			    dateOfBirth    : '12/4/1992',
			    gender : 'M',
			    educationLevel    : 'B. S.',
			    carnetCONADIS    : '421323435',
			    interests : 'Music, Dota2'
			},
			organizational: {
					currentJobPosition       : 'Reponedor',
					area        : 'Pasillo',
					branch    : 'Atencion al Publico',
					branchId    : 'E12',
					jobType    : 'Atencion al Publico',
					jobPositionHistory: {
						name: 'Panadero',
						startDate: '12/1/2014',
						endDate: '10/5/2014',
						location: 'Atocongo',
					},
					phoneNumTottus : '013458395'
			}
		});
		user2 = new User({
			companyId: 'test@test.com',
			tottusId: 'test@test.com',
			password: 'password',
			username: 'username1252',
			provider: 'local',
			email: 'test@test.com',
			isRegistered: 'false',
			assets: {
					profilePicURL       : 'http://sadasdsa.com'
			},
			contact: {
					phoneNumHome       : '95823453'
			},
			demographic: {
					maritalStatus       : 'single',
					children       : '0'
			},
			address: {
					city       : 'Lima',
					address          : 'Av. Flora Trista 433'
			},
			personal: {
			    firstName       : 'Carmen',
			    lastName        : 'Perez',
			    DNI     : '54784931',
			    dateOfBirth    : '12/4/1992',
			    gender : 'M',
			    educationLevel    : 'B. S.',
			    carnetCONADIS    : '421323435',
			    interests : 'Music, Dota2'
			},
			organizational: {
					currentJobPosition       : 'Reponedor',
					area        : 'Pasillo',
					branch    : 'Atencion al Publico',
					branchId    : 'E12',
					jobType    : 'Atencion al Publico',
					jobPositionHistory: {
						name: 'Panadero',
						startDate: '12/1/2014',
						endDate: '10/5/2014',
						location: 'Atocongo',
					},
					phoneNumTottus : '013458395'
			}
		});

		done();
	});

	describe('Method Save', function() {
		/*it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});*/

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.personal.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should return a list of all the users in JSON format', function(done) {
            request(localURL)
                .get('/users')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('username');
                    res.body[0].created.should.not.equal(null);
                    done();
                });
        });
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});