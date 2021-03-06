var express = require('express');
var router = express.Router();
var app = require('../app.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var images = [];
    for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
            images.push('/images/map-' + i + '-' + j + '.jpeg');
        }
    }
    res.setHeader('Content-Type', 'Application/json');
    res.json(images);
    app.emitSignatures();
});

module.exports = router;
