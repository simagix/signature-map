var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'Application/json');
    var colors = [];
    for(var attr in app.colorsUsage) {
        colors.push({'key': attr, 'color': attr, 'count': app.colorsUsage[attr]});
    }
    colors.sort(function(a, b) {if(a.count >= b.count) return -1; else return 1});
    if(colors.length > 5) {
        colors = colors.slice(0, 5);
    }
    res.json(colors);
});

module.exports = router;
