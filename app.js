var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var images = require('./routes/Images');
var io = require('socket.io')(http);
exports.io = io;
var mqtt = require('mqtt');
process.env.MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://test.mosquitto.org';
console.log('connecting to ' + process.env.MQTT_BROKER);
var queue = 'simagix';
var client  = mqtt.connect(process.env.MQTT_BROKER);
var signatures = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', images);

http.listen(3301, function(){
  console.log('listening on *:3301');
});

client.on('connect', function () {
    client.subscribe(queue);
});
 
client.on('message', function (topic, message) {
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
});

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