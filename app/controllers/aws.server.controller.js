'use strict';
var crypto = require('crypto'),
    util = require('util'),
    config = require('../../config/config');

var s3 = {
    access_key_id: config.s3.access_key,
    secret_key: config.s3.secret_key,
    bucket: 'tottus',
    acl: 'private',
    pad: function(n) {
        if ((n+'').length === 1) {
            return '0' + n;
        }
        return '' + n;
    }, 
    expiration_date: function() {
        var now = new Date();
        var date = new Date( now.getTime() + (3600 * 1000 * 24));
        var ed = date.getFullYear() + '-' + this.pad(date.getMonth()+1) + '-' + this.pad(date.getDate());
            ed += 'T' + this.pad(date.getHours()) + ':' + this.pad(date.getMinutes()) + ':' + this.pad(date.getSeconds()) + '.000Z';
        return ed;
    }
};

// signature text example
// https://gist.githubusercontent.com/radekg/2163005/raw/de12ddb0cb6403a3d3207fa5f1f93a0f659fb340/gistfile1.js
// {
//   'expiration': '2020-01-01T00:00:00Z',
//   'conditions': [
//     {'bucket': 'angular-file-upload'},
//     ['starts-with', '$key', ''],
//     {'acl': 'private'},
//     ['starts-with', '$Content-Type', ''],
//     ['starts-with', '$filename', ''],
//     ['content-length-range', 0, 524288000]
//   ]
// }

exports.signature = function(req, res) {
    var expiry_date = s3.expiration_date();
    var signatureString = [ '{\n      "expiration": "' + expiry_date + '",\n',
                            '     "conditions": [\n',
                            '             {"bucket": "' + s3.bucket + '"},',
                            '             ["starts-with", "$key", ""],',
                            '             {"acl": "' + s3.acl + '"},',
                            '             ["starts-with", "$Content-Type", ""],',
                            '             ["starts-with", "$filename", ""],',
                            '             ["content-length-range", 0, 524288000]\n   ]\n}'
                            ].join('');

    var policy = new Buffer(signatureString).toString('base64').replace(/\n|\r/, '');
    var hmac = crypto.createHmac('sha1', s3.secret_key);
    var hash2 = hmac.update(policy);
    var signature = hmac.digest('base64');

    res.jsonp({
        policy: policy,
        signature: signature,
        access_key: s3.access_key_id
    });
};