let mosca = require('mosca');
let mqtt = require('mqtt')

let settings = { port:1883 }
let server = new mosca.Server(settings);
let client  = mqtt.connect('mqtt://127.0.0.1');

server.on('ready', function(){
    client.subscribe('connectionCheckRequest');
    client.subscribe('linkRequest');
    client.subscribe('sensedData');
});

client.on('message', function (topic, message) {
    if(topic == "connectionCheckRequest"){
        let json = JSON.parse(message.toString());
        let device = json.device;
        let DeviceController = require('./functions/DeviceController');
        /*DeviceController.checkDeviceExist(device, (response) => {
            if(response){
                client.publish("connectionCheckResponse", JSON.stringify({device , connection: true}));
                console.log("Se conecto");
            }else{
                client.publish("connectionCheckResponse", JSON.stringify({device , connection: false}));
                console.log("No se conecto");
            }
        });*/
        client.publish("connectionCheckResponse", JSON.stringify({device , connection: true}));
    }else if(topic == "linkRequest"){
        let json = JSON.parse(message.toString());
        let device = json.device;
        console.log("linkRequest");
        client.publish("connectionCheckResponse", JSON.stringify({device , linked: true}));

    }else if(topic == "sensedData"){
        let SensorDataController = require('./functions/SensorDataController');
        let json = JSON.parse(message.toString());
        console.log(json);
        //SensorDataController.saveData(json)
    }
});