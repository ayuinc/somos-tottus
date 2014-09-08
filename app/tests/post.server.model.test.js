'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post');

/**
 * Globals
 */
var user, post;

/**
 * Unit tests
 */
describe('Post Model Unit Tests:', function() {
    beforeEach(function(done) {
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

        user.save();

        post = new Post({
            detail:     'test',
            userId:     user._id
        });

        done();
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            post.save(done);
        });
    });

    afterEach(function(done) { 
        Post.remove().exec();
        User.remove().exec();

        done();
    });
});