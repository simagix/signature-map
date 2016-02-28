process.env.MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://test.mosquitto.org';
console.log('connecting to ' + process.env.MQTT_BROKER);

var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var colors = require('./routes/Colors');
var images = require('./routes/Images');
var io = require('socket.io')(http);
exports.io = io;
var mqtt = require('mqtt');
var queue_simagix = 'simagix';
var queue_simagix_color = 'simagix_color';
var queue_color = 'simagix_color';
var client  = mqtt.connect(process.env.MQTT_BROKER);
var signatures = {};
var colorsUsage = {};
exports.colorsUsage = colorsUsage;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', images);
app.use('/colors', colors);

http.listen(3301, function(){
  console.log('listening on *:3301');
});

client.on('connect', function () {
    client.subscribe(queue_simagix);
    client.subscribe(queue_simagix_color);
});
 
client.on('message', function (topic, message) {
    if(topic == queue_simagix) {
        processImage(message);
    } else if(topic == queue_simagix_color) {
        aggregateColorDate(message);
    }
});

function processImage(message) {
    try {
        var doc = {'data': message.toString()};
        var num = randomInt(0, 63);
        doc.row = Math.floor(num / 8);
        doc.col = num % 8;
        var tag = doc.row + '-' + doc.col;
        doc.time = new Date().getTime();
        signatures[tag] = doc;
        io.emit('base64 image', doc);
    } catch(e) {
        console.log(e);
    }
}

function aggregateColorDate(message) {
    var doc = JSON.parse(message.toString());
    for(var attr in doc) {
        console.log(attr);
        if(! colorsUsage[attr]) {
        console.log('1 ' + attr);
            colorsUsage[attr] = doc[attr];
        } else {
        console.log('2 ' + attr);
            colorsUsage[attr] += doc[attr];
        }
    }
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

exports.emitSignatures = function() {
    var t = new Date().getTime();
    for(var attr in signatures) {
        var diff = t - signatures[attr].time;
        if(diff < 30*60e3) {
            io.emit('base64 image', signatures[attr]);
        }
    }
}