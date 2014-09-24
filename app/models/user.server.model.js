'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
// users
//  personal
//      name
//      surname
//      dateOfBirth
//      placeofBirth
//  role
//      superAdmin
//      admin
//      employee

var UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Por favor, ingrese su email'],
        match: [/.+\@.+\..+/, 'Por favor, ingrese una dirección de email válida']
    },
    username: {
        type: String,
        unique: 'El nombre de usuario ya existe',
        required: 'Por favor, ingrese un nombre de usuario',
        trim: true
    },
    isRegistered: {
        type: Boolean,
        default: false,
        //unique: 'testing error message',
        //required: 'Please fill in a username',
    },
    isActive: {
        type: Boolean,
        default: false,
        //unique: 'testing error message',
        //required: 'Please fill in a username',
    },
    tottusId: {
        type: String,
        //unique: 'testing error message',
        //required: 'Please fill in a username',
        trim: true
    },
    companyId: {
        type: String,
        //unique: 'testing error message',
        //required: 'Please fill in a username',
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'El password debe ser más largo']
    },
    salt: {
        type: String
    },
    provider: {
        type: String
        //required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
        type: [{
            type: String,
            enum: ['superAdmin', 'admin', 'employee']
        }],
        default: ['employee']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    personal: {
        DNI: {
            type: String,
            trim: true,
            required: 'Por favor, ingrese su DNI',
            default: ''
        },
        displayName: {
            type: String,
            trim: true,
            default: ''
        },
        firstName: {
            type: String,
            trim: true,
            required: 'Por favor, ingrese su nombre',
            default: ''
        },
        lastName: {
            type: String,
            trim: true,
            required: 'Por favor, ingrese su apellido',
            default: ''
        },
        dateOfBirth: {
            type: String,
            trim: true,
            required: 'Por favor, ingrese su fecha de nacimiento',
            default: null
        },
        educationLevel: {
            type: String,
            trim: true,
            required: '',
            //required: true,
            default: ''
        },
        interests: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        },
        gender: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        }
    },
    assets: {
        profilePicURL: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        }
    },
    address: {
        city: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        },
        address: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        }
    },
    organizational: {
        currentJobPosition: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        },
        area: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        },
        branch: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        },
        branchId: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        },
        jobType: {
            type: String,
            trim: true,
            //required: true,
            default: ''
        },
        phoneNumTottus: {
            type: String,
            //required: true,
            default: ''
        },
        jobPositionHistory: {
            name: {
                type: String,
                //required: true,
                default: ''
            },
            startDate: {
                type: String,
                //required: true,
                default: ''
            },
            endDate: {
                type: String,
                //required: true,
                default: ''
            },
            location: {
                type: String,
                //required: true,
                default: ''
            }
        }
    },
    demographic: {
        maritalStatus: {
            type: String,
            //required: true,
            default: ''
        },
        children: {
            type: String,
            //required: true,
            default: ''
        }
    },
    contact: {
        phoneNumHome: {
            type: String,
            //required: true,
            default: ''
        }    
    }  
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};



mongoose.model('User', UserSchema); 
