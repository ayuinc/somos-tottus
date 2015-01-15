'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Benefit Schema
 */
var BenefitSchema = new Schema({
    post: {
        type: Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    subtitle: {
        type: String,
        trim: true,
        required: 'Ingresa el subtítulo del beneficio.'
    },
    start: {
        type: Date,
        // required: true
    },
    end: {
        type: Date,
        // required: true
    },
    category: {
        type: String,
        trim: true,
        required: 'Elíge una categoría.'
    },
    pdfUrl: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\.(pdf)$/, 'Por favor, ingresa una URL válida.']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

BenefitSchema.pre('save', function(next) {
    var now = new Date();
    this.updated = now;

    if (!this.created) this.created = now;
    next();
});


mongoose.model('Benefit', BenefitSchema);
