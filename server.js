let express = require('express');
let bodyParser = require('body-parser');
let UserController = require('./functions/UserController');
let DeviceController = require('./functions/DeviceController');
let SensorDataController = require('./functions/SensorDataController');
let jwt = require('jsonwebtoken');

let app = express();
var cors = require('cors');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/alexastats', (req, res) => {
    res.send({ph: 8, ce: 400, waterLevel: 80, lux: 1000, temp: 32});
});


//WEB APP
app.post('/login', (req, res) => {
    UserController.login(req.body, (qRes) => {
        res.status(qRes.status).send(qRes.res);
    });
});

app.get('/devices' , (req, res) => {
    let token = req.header('x-Auth');
    jwt.verify(token, 'hydroconnectToken', { algorithm: 'HS256' }, function(err, decoded) {
        if(err){
            res.status(401).send();
        }else{
            DeviceController.getDevices(decoded.id, (qRes) => {
                res.status(qRes.status).send(qRes.res);
            });
        }
    });
});
app.delete('/devices/:deviceId' , (req, res) => {
    let token = req.header('x-Auth');
    jwt.verify(token, 'hydroconnectToken', { algorithm: 'HS256' }, function(err, decoded) {
        if(err){
            res.status(401).send();
        }else{
            DeviceController.deleteDevice(req.params.deviceId, (qRes) => {
                res.status(qRes.status).send(qRes.res);
            });
        }
    });
});
app.get('/dashboard/devices/:deviceId', (req, res) => {
    let token = req.header('x-Auth');
    jwt.verify(token, 'hydroconnectToken', { algorithm: 'HS256' }, function(err, decoded) {
        if(err){
            res.status(401).send();
        }else{
            SensorDataController.getDashboardData(req.params.deviceId, (qRes) => {
                res.status(qRes.status).send(qRes.res);
            });
        }
    });
});


app.listen(3000, function () {});