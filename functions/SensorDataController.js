let sqlQuery = require('../DBConnection');

class SensorDataController{
    static saveData(data){
        sqlQuery(`INSERT INTO SensorData (Device_id, time, temp, ph, ce, lux, waterLevel) VALUES (?, NOW(), ?, ?, ?, ?, ?) `, [data.deviceId, data.temp, data.ph, data.ce, data.lux, data.waterLevel], (err, rows, fields) => {});
    }
}

module.exports = SensorDataController;