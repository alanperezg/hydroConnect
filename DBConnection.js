
let mysql = require('mysql');

function sqlQuery(query, values, callback){
    var connection = mysql.createConnection({
    host     : '157.245.233.250',
    user     : 'root',
    password : 'Cocacola123.',
    database : 'hydroconnectApp'
    });
    
    connection.connect();
    connection.query(query, values, callback);
    connection.end();
}

module.exports = sqlQuery;