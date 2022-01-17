const conn      = require('./conndb');

async function makeClass(params){
    let ocSQL = "INSERT INTO openclass(classname, uid, classcontent, headcount, viewcount, register_time)VALUE(?,?,?,?,?,?)";
    conn.query(ocSQL, params, (err, row, fields)=>{
        if(err){
            console.log(err);
            return 0;
        }
        else{
            console.log(row);
            return 1;
        }
    });
}

async function makeGroupList(params){
    let glSQL = "INSERT INTO grouplist(groupname, uid, sign_start_time, sign_end_time, class_start_time, class_end_time, limit_headcount, Approval_type, classname)VALUE(?,?,?,?,?,?,?,?,?)"
    conn.query(glSQL, params, (err, row, fields)=>{
        if(err){
            console.log(err);
            return 0;
        }
        else{
            console.log(row);
            return 1;
        }
    });
}

module.exports = {makeClass, makeGroupList};

