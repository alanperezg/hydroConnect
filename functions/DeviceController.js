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
}

module.exports = DeviceController;