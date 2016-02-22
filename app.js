var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt');
process.env.MQTT_QUEUE = 'mqtt://test.mosquitto.org';
var client  = mqtt.connect(process.env.MQTT_QUEUE);

app.use(express.static(path.join(__dirname, 'public')));

http.listen(3001, function(){
  console.log('listening on *:3001');
});

client.on('connect', function () {
    client.subscribe("simagix");
});
            
client.on('message', function (topic, message) {
    try {
        var doc = {'data': message.toString()};
        var num = randomInt(0, 63);
        doc.row = Math.floor(num / 8);
        doc.col = num % 8;
        io.emit('base64 image', doc);
    } catch(e) {
        console.log(e);
    }
});

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
