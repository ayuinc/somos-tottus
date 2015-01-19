'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

/**
 * Create a Geographic
 */

var locations =
[
    {
        region: 'Lima',
        districts : [
        'Ancón', 'Santa Rosa', 'Ventanilla', 'Callao', 'La Punta', 'Carmen de La Legua-Reynoso', 'Bellavista',
        'La Perla', 'Carabayllo', 'Puente Piedra', 'San Martín de Porres', 'Los Olivos', 'Comas', 'Independencia',
        'San Juan de Lurigancho', 'Lima', 'Breña', 'Rímac', 'El Agustino', 'San Miguel', 'Pueblo Libre',
        'Jesús María', 'Magdalena del Mar', 'Lince', 'La Victoria', 'San Luis', 'San Isidro', 'Miraflores',
        'Surquillo', 'Barranco', 'San Borja', 'Santiago de Surco', 'Chorrillos', 'Santa Anita', 'Ate',
        'La Molina', 'Lurigancho-Chosica', 'Chaclacayo', 'Cieneguilla', 'Pachacámac', 'San Juan de Miraflores',
        'Villa María del Triunfo', 'Villa El Salvador', 'Lurín', 'Punta Hermosa', 'Punta Negra', 'San Bartolo',
        'Santa María del Mar','Pucusana'].sort()
    },
    {
        region: 'Chiclayo',
        districts: ['Chiclayo']
    },
    {
        region: 'Trujillo',
        districts: ['Trujillo']
    },
    {
        region: 'Ica',
        districts: ['Ica']
    },
    {
        region: 'Piura',
        districts: ['Piura']
    },
    {
        region: 'Arequipa',
        districts: ['Arequipa']
    },
    {
        region: 'Ancash',
        districts: ['Ancash']
    },
    {
        region: 'Cañete',
        districts: ['Cañete']
    },
    {
        region: 'Ucayali',
        districts: ['Ucayali']
    },
    {
        region: 'Cajamarca',
        districts: ['Cajamarca']
    },
    {
        region: 'Huánuco',
        districts: ['Huánuco']
    }
];

exports.list = function(req, res) {
    res.jsonp(_.sortBy(locations, 'region'));
};

