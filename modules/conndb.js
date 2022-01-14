const mysql     = require('mysql');
const MySQLOption = {
    host : 'localhost',
    port : '3306',
    user : 'root',
    password : 'root',
    database : 'onoffmix'
};
const conn = mysql.createConnection(MySQLOption);
conn.connect((err)=>{
    if(err) console.log(err);
    else console.log("conn database");
});

module.exports = conn;