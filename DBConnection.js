
let mysql = require('mysql');

function sqlQuery(query, values, callback){
    var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'Cocacola123.',
    database : 'hydroconnectApp'
    });
    
    connection.connect();
    connection.query(query, values, callback);
    connection.end();
}

module.exports = sqlQuery;