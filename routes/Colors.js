var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'Application/json');
    var colors = [];
    var sums = {};
    app.colorsUsage.forEach(function(doc) {
        for(var attr in doc) {
            if(! sums[attr]) {
                sums[attr] = doc[attr];
            } else {
                sums[attr] += doc[attr];
            }
        }
    });
    
    for(var attr in sums) {
        colors.push({'key': attr, 'color': attr, 'count': sums[attr]});
    }
    colors.sort(function(a, b) {if(a.count >= b.count) return -1; else return 1});
    if(colors.length > 5) {
        colors = colors.slice(0, 5);
    }
    res.json(colors);
});

module.exports = router;
