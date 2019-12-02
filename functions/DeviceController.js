let sqlQuery = require('../DBConnection');

class DeviceController{
    static checkDeviceExist(deviceId, callback){
        sqlQuery(`SELECT * FROM Device WHERE deviceId = ?`, [deviceId], (err, rows, fields) => {
            let response;
            if(rows.length > 0){
                 response = true;
            }else{
                response = false;
            }
            callback(response);
        });
    }

    static updateConnectionStatus(deviceId, connected){
        sqlQuery(`UPDATE Device SET connected = ? WHERE deviceId = ?`, [connected, deviceId], (err, rows, fields) => {
            
        });
    }
    
    static newUserDevice(userId, deviceId, name, callback){
        sqlQuery(`INSERT INTO User_Device (User_id, Device_Id, name) VALUES (?, ?, ?)`, [userId, deviceId, name], (err, result) => {
            callback(result.insertId);
        });
    }
    static getDeviceId(deviceId, callback){
        sqlQuery(`SELECT id FROM Device WHERE deviceId = ?`, [deviceId], (err, rows, fields) => {
            if(rows.length > 0){
                callback(rows[0]['id']);
            }else{
                callback(null);
            }
        });
    }
    
    static newDevice(deviceId, callback){
        sqlQuery(`INSERT INTO Device (deviceId, connected, lastConnection, requiredPH, requiredCE, requiredWaterLevel) VALUES (?, 1, NOW(), 4.7, 0.001, 80)`, [deviceId], (err, result) => {
            callback(result.insertId);
        });
    }

    static getDevices(userId, callback){
        sqlQuery(`SELECT ud.id, ud.name, d.deviceId as deviceId, d.connected FROM User_Device ud INNER JOIN Device as d ON d.id = ud.Device_id WHERE ud.User_id = ?`, [userId], (err, rows, fields) => {
            let devices = [];
            devices = rows;
            callback({status: 200, res: {devices}});
        });
    }

    static deleteDevice(deviceId, callback){
        sqlQuery(`DELETE FROM User_Device WHERE id = ?`, [deviceId], (err, rows, fields) => {
            callback({status: 200, deleted: true});
        });
    }
}

module.exports = DeviceController;