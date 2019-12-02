var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let mqtt = require('mqtt');
let DeviceController = require('./functions/DeviceController');
let jwt = require('jsonwebtoken');

let client  = mqtt.connect('mqtt://157.245.233.250');

let linkRequests = {};
client.on('connect', function () {
    client.subscribe('linkRequest');
});

client.on('message', function (topic, message) {
    if(topic == "linkRequest"){
        let expire = new Date();
        expire.setSeconds(expire.getSeconds() + 10);
        let deviceId = JSON.parse(message.toString()).deviceId;
        linkRequests[deviceId] = expire;
    }
});

io.on('connection', function(socket){
    socket.on('syncrequest', function(message){
        console.log(linkRequests);
        let json = JSON.parse(message);
        new Promise((resolve, reject)=>{
            let date = new Date();
            let sync = false;
            let loopCount = 0;
            jwt.verify(json.token, 'hydroconnectToken', { algorithm: 'HS256' }, function(err, decoded) {
                DeviceController.getDevices(decoded.id, (res)=>{
                    let devices = res.res.devices;
                    let repeated = false;
                    for(let device of devices){
                        if(device.deviceId == json.deviceId){
                            repeated = true;
                        }
                    }
                    if(!repeated){
                        let checkLoop = function(){
                            setTimeout(() => {
                                if(loopCount < 5 && sync == false){
                                    loopCount++;
                                    if(linkRequests[json.deviceId] != null){
                                        if(linkRequests[json.deviceId].getTime() >= date.getTime()){
                                            sync = true;
                                            resolve(1);
                                        }else{
                                            checkLoop();
                                        }
                                    }else{
                                        checkLoop();
                                    }
                                }else{
                                    resolve(0);
                                }
                            }, 1000);
                        }
                        checkLoop();
                    }else{
                        resolve(2); 
                    }
                });
            });
        }).then((response)=>{
            delete linkRequests[json.deviceId];
            new Promise((resolve, reject)=>{
                if(response == 1){
                    jwt.verify(json.token, 'hydroconnectToken', { algorithm: 'HS256' }, function(err, decoded) {
                        DeviceController.checkDeviceExist(json.deviceId, (res) => {
                            if(res){
                                DeviceController.getDeviceId(json.deviceId, (res)=>{
                                    if(res != null){
                                        DeviceController.newUserDevice(decoded.id, res, json.name, ()=>{
                                            client.publish("linkResponse", JSON.stringify({deviceId: json.deviceId, linked: true}));
                                            resolve(response);
                                        });
                                    }else{
                                        resolve(response);
                                    }
                                });
                            }else{
                                DeviceController.newDevice(json.deviceId, (id)=>{
                                    DeviceController.newUserDevice(decoded.id, id, json.name, ()=>{
                                        client.publish("linkResponse", JSON.stringify({deviceId: json.deviceId, linked: true}));
                                        resolve(response);
                                    });
                                });
                            }
                        });
                    });
                }else{
                    resolve(response);
                }
            }).then((response)=>{
                console.log(response);
                let resJson = JSON.stringify({token:json.token, deviceId:json.deviceId, sync: response});
                io.emit('syncresponse', resJson); 
            });
        });
    });
});

http.listen(4200, function(){
    console.log('listening on *:4200');
});