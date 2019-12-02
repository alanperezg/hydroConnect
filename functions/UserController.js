let sqlQuery = require('../DBConnection');
let jwt = require('jsonwebtoken');

class UserController{
    static login(body, callback){
        sqlQuery(`SELECT * FROM User WHERE email = ? AND password = ?`, [body.email, body.password], (err, rows, fields) => {
            if(rows.length > 0){
                let token = jwt.sign({ id: rows[0].id}, "hydroconnectToken", { algorithm: 'HS256' });
                callback({status: 200, res: {token}});
            }else{
                callback({status: 401, res: {token: null}});
            }
        });
    }
}

module.exports = UserController;