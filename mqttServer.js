var mosca = require('mosca');
var mqtt = require('mqtt')

var settings = { port:1883 }
var server = new mosca.Server(settings);
var client  = mqtt.connect('mqtt://127.0.0.1');

server.on('ready', function(){
    client.subscribe('connectionCheckRequest');
});

client.on('message', function (topic, message) {
    if(topic == "connectionCheckRequest"){
        let json = JSON.parse(message.toString());
        let device = json.device;
        //busqueda en Base de datos
        console.log(message.toString());
        client.publish("connectionCheckResponse", JSON.stringify({device , connection: "true"}));
    }
});
