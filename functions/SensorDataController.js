let sqlQuery = require('../DBConnection');

class SensorDataController{
    static saveData(data){
        sqlQuery(`INSERT INTO SensorData (Device_id, time, temp, ph, ce, lux, waterLevel) VALUES ((SELECT id FROM Device WHERE deviceId = ? LIMIT 1), NOW(), ?, ?, ?, ?, ?) `, [data.deviceId, data.temp, data.ph, data.ce, data.lux, data.waterLevel], (err, rows, fields) => {
        });
    }

    static getDashboardData(id, callback){
        let promises = [];
        let dashboard = {
            deviceConnected: 0,
            temp:{
                actual: 0,
                prom: 0,
                history: []
            },
            ph: {
                actual: 0,
                prom: 0,
                required: 0,
                history: []
            },
            ce: {
                actual: 0,
                prom: 0,
                required: 0,
                history: []
            },
            lux: {
                actual: 0,
                prom: 0,
                history: []
            },
            waterLevel: {
                actual: 0,
                prom: 0,
                required: 0,
                history: []
            }

        }
        promises.push(new Promise((resolve, reject)=>{
            sqlQuery(`SELECT d.connected, d.requiredPH, d.requiredCE, d.requiredWaterLevel FROM Device as d INNER JOIN User_Device as ud ON d.id = ud.Device_id WHERE ud.id = ?`, [id], (err, rows, fields) => {
                if(rows.length > 0){
                    dashboard.deviceConnected = rows[0]['connected'];
                    dashboard.ph.required = rows[0]['requiredPH'];
                    dashboard.ce.required = rows[0]['requiredCE'];
                    dashboard.waterLevel.required = rows[0]['requiredWaterLevel'];
                }else{
                    dashboard.deviceConnected = "-";
                    dashboard.ph.required =  "-";
                    dashboard.ce.required =  "-";
                    dashboard.waterLevel.required =  "-";
                }
                resolve();
            });
        }));

        promises.push(new Promise((resolve, reject)=>{
            sqlQuery(`SELECT ROUND(AVG(sd.temp),2) as 'temp', ROUND(AVG(sd.ph),2) as 'ph', ROUND(AVG(sd.ce),2) as 'ce', ROUND(AVG(sd.lux),2) as 'lux', ROUND(AVG(sd.waterLevel),2) as 'waterLevel', DATE_FORMAT(sd.time, "%Y-%m-%d %H:%i:00")  as 'roundTime'
            FROM SensorData as sd INNER JOIN User_Device as ud ON sd.Device_id = ud.Device_id WHERE ud.id = ? GROUP BY (roundTime) limit 24`, [id], (err, rows, fields) => {
                let tempProm = 0;
                let phProm = 0;
                let ceProm = 0;
                let luxProm = 0;
                let waterLevelProm = 0;
                for(let row of rows){
                    tempProm+=row['temp'];
                    phProm+=row['ph'];
                    ceProm+=row['ce'];
                    luxProm+=row['lux'];
                    waterLevelProm+=row['waterLevel'];
                    dashboard.temp.history.push({time: row['roundTime'], value: row['temp']});
                    dashboard.ph.history.push({time: row['roundTime'], value: row['ph']});
                    dashboard.ce.history.push({time: row['roundTime'], value: row['ce']});
                    dashboard.lux.history.push({time: row['roundTime'], value: row['lux']});
                    dashboard.waterLevel.history.push({time: row['roundTime'], value: row['waterLevel']});
                }
                dashboard.temp.prom = (tempProm/rows.length).toFixed(2);
                dashboard.ph.prom = (phProm/rows.length).toFixed(2);
                dashboard.ce.prom = (ceProm/rows.length).toFixed(2);
                dashboard.lux.prom = (luxProm/rows.length).toFixed(2);
                dashboard.waterLevel.prom = (waterLevelProm/rows.length).toFixed(2);
                resolve();
            });
        }));

        promises.push(new Promise((resolve, reject)=>{
            sqlQuery(`SELECT temp, ph, ce, lux, waterLevel FROM SensorData WHERE Device_id = (SELECT Device_id FROM User_Device WHERE id = ? LIMIT 1) ORDER BY id DESC LIMIT 1`, [id], (err, rows, fields) => {
                if(rows.length > 0){
                    dashboard.temp.actual = rows[0]['temp'];
                    dashboard.ph.actual = rows[0]['ph'];
                    dashboard.ce.actual = rows[0]['ce'];
                    dashboard.lux.actual = rows[0]['lux'];
                    dashboard.waterLevel.actual = rows[0]['waterLevel'];
                }else{
                    dashboard.temp.actual = "-";
                    dashboard.ph.actual = "-";
                    dashboard.ce.actual = "-";
                    dashboard.lux.actual = "-";
                    dashboard.waterLevel.actual = "-";
                }
                resolve();
            });
        }));
        Promise.all(promises).then((results) => {
            callback({status: 200, res: {dashboard}});
        });
    }
}

module.exports = SensorDataController;