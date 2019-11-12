
let mysql = require('mysql');

function sqlQuery(query, values, callback){
    var connection = mysql.createConnection({
    host     : '167.99.6.143',
    user     : 'hydroconnect',
    password : 'hydroconnectPassword123.',
    database : 'hydroconnectApp'
    });
    
    connection.connect();
    connection.query(query, values, callback);
    connection.end();
}

module.exports = sqlQuery;