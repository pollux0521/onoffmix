const conn      = require('./conndb');
const emailfunc = require('./email');
const crypto    = require('crypto');
const { resolve } = require('path');

// [ Select Login => 1 : 성공, 0 : 데이터 없음, err:err ]
async function LoginFunc(email, pw){
    let sql = "SELECT * FROM users WHERE email=? and pw=?";
    let params = [email, crypto.createHash("sha512").update(pw).digest('hex')];

    conn.query(sql, params, (err, row, fields)=>{
        if(err){
            console.log(err);
            return {'err':err};
        }
        else if(row.length == 0){
            console.log(row);
            return 0;
            }
        else{
            return 1;
        }
    })
};

// [ Insert Register => 0 : 비밀번호 일치 x, 2 : 이메일 형식 x, 3 : 이미 가입된 이메일 ]
async function RegisterFunc(email, pw, pw2, name){
    let sql = "INSERT INTO users(email, pw, name)VALUES(?,?,?)";
    let params = [email, crypto.createHash("sha512").update(pw).digest('hex'), name];

    if(pw != pw2){
        return 0;
    }
    else if(!emailfunc.isEmailForm(email)){
        return 2;
    }
    else if(emailfunc.isRegisteredEmail(email)){
        return 3;
    }
    else{
        conn.query(sql, params, (err, row, fields)=>{
            if(err) return {'err':err};
            else return 0;
        })
    }
};

// [ Select Email ]



// [ Select Class List use openclass grouplist ]
async function GetClasses(){
    let nowTime = new Date();
    let sql = "";
    sql += "select openclass.classname, openclass.uid, headcount, viewcount, register_time from openclass ";
    sql += "inner join grouplist on openclass.classname = grouplist.classname and grouplist.sign_end_time > ?";
    conn.query(sql, nowTime, (err, row, params)=>{
        if(err) return err;
        else return row;
    });
};

// [ Select Find Class use classname ]
async function FindClass(classname){
    let ocSQL = "select * from openclass where classname=?"
    conn.query(ocSQL, classname, (err, ocrow, fields)=>{
        if(err) return  err;
        else return row;
    })
};

// [ Select Find openclass use uid ]
async function FindClasses(uid){
    let sql = "select * from openclass where uid=?";
    conn.query(sql, uid, (err, row, fields)=>{
        if(err) return  err;
        else if(row.length == 0) {
            console.log("length - 0");
            return 0;
        }
        else{

            return 0;

        } 
    });
};

// [ Select Find Groups use classname ]
async function FindGrouplist(classname){
    let sql = "select * from grouplist where classname=?";
    conn.query(sql, classname, (err, row, fields)=>{
        if(err) return  err;
        else return row;
    })
};

// [ Select Find Group use groupname ]
async function FindGroup(groupname){
    let sql ="select * from grouplist where groupname=?"
    conn.query(sql, classname, (err, row, fields)=>{
        if(err) return err;
        else return row;
    })
};

// [ Insert reqclass ]
async function InsertReqclass(classname, uid, reasons){
    let sql = "insert into reqclass(classname, uid, reasons, approval_status)value(?,?,?,?)";
    let params = [classname, uid, reasons, 0];
    conn.query(sql, params, (err,row,fields)=>{
        if(err) return err;
        else return 1;
    })
};

// [ Insert openclass ]
async function makeClass(classname, uid, classcontent){
    let sql = "INSERT INTO openclass(classname, uid, classcontent, headcount, viewcount, register_time)VALUE(?,?,?,?,?,?)";
    let params = [classname, uid, classcontent, 0, 0, new Date()];
    conn.query(ocSQL, params, (err, row, fields)=>{
        if(err) return err;
        else return 1;
    });
};

// [ Insert grouplist ]
async function grouplist(params){
    let sql = "INSERT INTO grouplist(groupname, uid, sign_start_time, sign_end_time, class_start_time, class_end_time, limit_headcount, Approval_type, classname)VALUE(?,?,?,?,?,?,?,?,?)"
    conn.query(sql, params, (err, row, fields)=>{
        if(err) return  err;
        else return 1;
    });
};

// [ Select reqclass Use uid ]
async function FindReqclass(uid){
    let sql = "select * from reqclass where uid=?";
    
    conn.query(sql, uid, (err, row, fields)=>{
        if(err) return  err;
        else if(row.length == 0){
            console.log("reqlength - 0");
            return 0;
        } 
        else{
            console.log("err");
            return row;
        } 
    });
}

module.exports = { LoginFunc, RegisterFunc, GetClasses, FindClass, FindClasses, FindGrouplist, 
    FindGroup, InsertReqclass, makeClass, grouplist, FindReqclass };