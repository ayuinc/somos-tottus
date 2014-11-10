'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

/**
 * Create a Geographic
 */

var districts = [
'Ancón', 'Santa Rosa', 'Ventanilla', 'Callao', 'La Punta', 'Carmen de La Legua-Reynoso', 'Bellavista',
'La Perla', 'Carabayllo', 'Puente Piedra', 'San Martín de Porres', 'Los Olivos', 'Comas', 'Independencia',
'San Juan de Lurigancho', 'Lima', 'Breña', 'Rímac', 'El Agustino', 'San Miguel', 'Pueblo Libre',
'Jesús María', 'Magdalena del Mar', 'Lince', 'La Victoria', 'San Luis', 'San Isidro', 'Miraflores',
'Surquillo', 'Barranco', 'San Borja', 'Santiago de Surco', 'Chorrillos', 'Santa Anita', 'Ate',
'La Molina', 'Lurigancho-Chosica', 'Chaclacayo', 'Cieneguilla', 'Pachacámac', 'San Juan de Miraflores',
'Villa María del Triunfo', 'Villa El Salvador', 'Lurín', 'Punta Hermosa', 'Punta Negra', 'San Bartolo',
'Santa María del Mar','Pucusana'];

exports.districts = function(req, res) {
    res.jsonp({
        districts: districts
    });
};

