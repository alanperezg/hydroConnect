let mosca = require('mosca');
let mqtt = require('mqtt');

let DeviceController = require('./functions/DeviceController');
let SensorDataController = require('./functions/SensorDataController');

let settings = { port:1883 }
let server = new mosca.Server(settings);
let client  = mqtt.connect('mqtt://157.245.233.250');

server.on('ready', function(){
    client.subscribe('connectionCheckRequest');
    client.subscribe('linkRequest');
    client.subscribe('linkResponse');
    client.subscribe('sensedData');
});

server.on('clientConnected', (client) => {
    console.log(client.id);
    DeviceController.updateConnectionStatus(client.id, 1);
});
server.on('clientDisconnected', function(client) {
    DeviceController.updateConnectionStatus(client.id, 0);
});

client.on('message', function (topic, message) {
    if(topic == "connectionCheckRequest"){
        let json = JSON.parse(message.toString());
        let deviceId = json.device;
        DeviceController.checkDeviceExist(deviceId, (response) => {
            if(response){
                client.publish("connectionCheckResponse", JSON.stringify({deviceId , connection: true}));
            }else{
                client.publish("connectionCheckResponse", JSON.stringify({deviceId , connection: false}));
            }
        });
    }else if(topic == "sensedData"){
        let json = JSON.parse(message.toString());
        SensorDataController.saveData(json)
    }else if(topic == "linkResponse"){
        console.log(message.toString());
    }
});