const conn      = require('./conndb');

function isRegisteredEmail(email){
    let sql = "SELECT * FROM users WHERE email=?";
    let params = email;
    conn.query(sql, params, (err, row, fields)=>{
        if(err){
            console.log(err);
            return false;
        } 
        //중복 아닐 시
        else if(row.length==0)  return false;
        else return true;
    })
}

function isEmailForm(email){
    let emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if(emailRegex.test(email) == false)  return false;
    else    return true;
}
module.exports = { isRegisteredEmail, isEmailForm };