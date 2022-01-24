const conn      = require('./conndb');
const emailfunc = require('./email');
const crypto    = require('crypto');
const { resolve } = require('path');
const { response } = require('express');
const { promiseImpl } = require('ejs');

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
function FindClass(classname, uid){
    return new Promise((resolve, reject)=>{
        let ocSQL = "select * from openclass where classname=? and uid=?"
        conn.query(ocSQL, [classname, uid], (err, row, fields)=>{
            if(err) 
                resolve(err);

            else if(row.length == 0)  {
                resolve(0);
            }

            else{
                resolve(row);
            }
               
        })
    })
};

function FindClass(classname){

    return new Promise((resolve, reject)=>{
        let ocSQL = "select * from openclass where classname=?"
        conn.query(ocSQL, [classname], (err, row, fields)=>{
            if(err) 
                resolve(err);

            else if(row.length == 0){
                resolve(0);
            }
            else
                resolve(row);
        })
    })
};

// [ Select Find openclass use uid ]
function FindClasses(uid){
    return new Promise((resolve, reject)=>{
        let sql = "select * from openclass where uid=?";
        conn.query(sql, uid, (err, row, fields)=>{
            if(err) 
                resolve(err);

            else if(row.length == 0)  
                resolve(0);

            else
                resolve(row);
        });
    })
};

// [ Select Find Groups use classname ]
function FindGrouplist(classname){
    return new Promise((resolve, reject)=>{
        let sql = "select * from grouplist where classname=?";
        conn.query(sql, classname, (err, row, fields)=>{
            if(err) resolve("err");
            else 
                resolve(row);
        })
    })
};

// [ Select Find Group use groupname ]
function FindGroup(classname, groupname){
    return new Promise((resolve, reject)=>{
        let sql ="select * from grouplist where classname=? and groupname=?";
        conn.query(sql, [classname, groupname], (err, row, fields)=>{
            if(err) {
                console.log(err);
                resolve ("err");
            }
            else if(row == null){
                console.log(row);
                resolve(0);
            }
            else {
                resolve (row);
            }
        })
    })
};

function FindReqclassList(classname, groupname){
    return new Promise((resolve, reject)=>{
        let sql = "select * from reqclass where classname=? and groupname=?";
        conn.query(sql, [classname, groupname], (err, row, fields)=>{
            if(err) resolve(err);
            else resolve(row);
        })
    })
}
// [ Insert reqclass ]
function InsertReqclass(classname, groupname, uid, reasons, name){
    return new Promise((resolve, reject)=>{
        resolve(FindGroup(classname, groupname))
    }).then((row)=>{
        let sql = "insert into reqclass(classname, groupname, uid, reasons, approval_status, name)value(?,?,?,?,?,?)";
        let params = [classname, groupname, uid, reasons, row[0].Approval_type, name];
        conn.query(sql, params, (err,row,fields)=>{
            if(err){
                console.log(err);
                resolve(err);
            } 
            else resolve(1);
        })
    })
};

// [ Insert openclass ]
function makeClass(classname, uid, classcontent){
    return new Promise((resolve, reject)=>{
        let sql = "INSERT INTO openclass(classname, uid, classcontent, headcount, viewcount, register_time)VALUE(?,?,?,?,?,?)";
        let params = [classname, uid, classcontent, 0, 0, new Date()];
        conn.query(sql, params, (err, row, fields)=>{
            if(err ){
                console.log(err)
                resolve("err");

            } 
            else resolve(1);
        })
    })
};

// [ Insert grouplist ]
function makeGrouplist(params){
    return new Promise((resolve, reject)=>{
        let sql = "INSERT INTO grouplist(groupname, classname, uid, sign_start_time, sign_end_time, class_start_time, class_end_time, limit_headcount, Approval_type, Approval_headcount)VALUE(?,?,?,?,?,?,?,?,?,?)"
        conn.query(sql, params, (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve(err);
            } 
            else{
                console.log(row);
                resolve (1);
            } 
        });
    })
};
function makeGroups(params){
    return new Promise((resolve, reject)=>{
        console.log(params);
        let sql = "insert into grouplist(groupname, classname, uid, sign_start_time, sign_end_time, class_start_time, class_end_time, limit_headcount, Approval_type, Approval_headcount) values ?;";
        conn.query(sql, [params], (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve("err");
            } 
            else{
                console.log(row);
                resolve (1);
            } 
        });
    })
};
// [ Select reqclass Use uid ]
function FindReqclass(uid){
    return new Promise((resolve, reject)=>{
        let sql = "select * from reqclass where uid=?";
        conn.query(sql, uid, (err, row, fields)=>{
            if(err) 
                resolve(err);

            else if(row.length == 0)
                resolve (0);
            
            else
                resolve (row);
        });
    })
}
function FindClasses(uid){
    return new Promise((resolve, reject)=>{
        let sql = "select * from openclass where uid=?";
        conn.query(sql, uid, (err, row, fields)=>{
            if(err) 
                resolve(err);

            else if(row.length == 0)  {
                console.log(row);
                resolve(0);
            }
            else
                resolve(row);
        });
    })
};
//수정필요
function UpdateUserStatus(uid, classname, groupname){
    console.log(uid);
    return new Promise((resolve, reject)=>{
        let sql = "update reqclass set approval_status= NOT approval_status where classname=? and groupname=? and uid=?"
        conn.query(sql, [classname, groupname, uid], (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve(err);
            }
            else{
                console.log("is right?");
                resolve(1);
            }
        });
    });
}

function UpdateGrouplistClassname(classname, editClassname){
    return new Promise((resolve, reject)=>{
        let sql = "update grouplist set classname=? where classname=?";
        conn.query(sql, [editClassname, classname], (err, row, fields)=>{
            if(err) {
                console.log(err);
                resolve(err);
            }
            else {
                console.log("success");
                resolve(1);}
        })
    })
}

function UpdateReqclassClassname(classname, editClassname){
    return new Promise((resolve, reject)=>{
        let sql = "update reqclass set classname=? where classname=?";
        conn.query(sql, [editClassname, classname], (err, row, fields)=>{
            if(err){
                resolve(err);
            } 
            else {
                console.log("success");
                resolve(1);
            }
        })
    })
}

function UpdateClassname(classname, editClassname){
    return new Promise((resolve, reject)=>{
        let sql = "update openclass set classname=? where classname=?";
        conn.query(sql, [editClassname, classname], (err, row, fields)=>{
            if(err) {
                console.log(err);
                resolve(err);
            }
            else {
                console.log(111);
                resolve(1);
            }
        });
    });
}

function UpdateClasscontent(classname, classcontent){
    return new Promise((resolve, reject)=>{
        let sql = "update openclass set classcontent=? where classname=?";
        conn.query(sql, [classcontent, classname], (err, row, fields)=>{
            if(err) {
                console.log(err);
                resolve(err);
            }
            else {

                resolve(1);
            }
        });
    });
}

function UpdateApprovalStatus(classname, groupname, Approval_status){
    return new Promise((resolve, reject)=>{
        let sql ="update reqclass set Approval_status=? where classname=? and groupname=?";
        conn.query(sql, [Approval_status, classname, groupname], (err, row, fields)=>{
            if(err) resolve(err);
            else resolve(1);
        });
    });
}


function UpdateAllClassname(classname, editClassname){
    return new Promise((resolve, reject)=>{
        let sql = "update reqclass as a, grouplist as b, openclass as c "
        sql += "set a.classname=?, b.classname=?, c.classname=? "
        sql += "where a.classname=? and b.classname=? and c.classname=?";
        conn.query(sql, [editClassname,editClassname,editClassname, classname,classname,classname], (err, row, fields)=>{
            if(err){
                resolve(err);
            } 
            else {
                console.log("success");
                resolve(1);
            }
        })
    })
}
function UpdateGroup(params){
    return new Promise((resolve, reject)=>{
        let sql = "update grouplist set groupname=?, sign_start_time=?, sign_end_time=?, class_start_time=?, class_end_time=?, "
        sql += "limit_headcount=?, Approval_type=? where classname=? and groupname=?";
    
        conn.query(sql, params, (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve("err");
            } 
            else resolve(1);
        });
    });
}
function deleteReqclass(uid, classname, groupname){
    return new Promise((resolve, reject)=>{
        let sql = "delete from reqclass where uid=? and classname=? and groupname=?";
        conn.query(sql, [uid, classname, groupname], (err,row,fields)=>{
            if(err){
                console.log(err)
                resolve("err");
            }
            else{
                console.log(row);
                resolve(1);
            }
        })
    })
}

function increaseViewcount(classname){
    return new Promise((resolve, reject)=>{
        let sql = "update openclass set viewcount=viewcount+1 where classname=?"
        conn.query(sql, classname, (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve("err");
            }
            else{
                console.log(row);
                resolve(1);
            }
        })
    })
}

function incHeadcount(classname){
    return new Promise((resolve, reject)=>{
        let sql = "update openclass set headcount= headcount + 1 where classname=?"
        conn.query(sql, [classname], (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve("err");
            }
            else{
                resolve (1);
            }
        })
    })
}

function incApprovalHeadcount(classname, groupname){
    return new Promise((resolve, reject)=>{
        let sql = "update grouplist set Approval_headcount= Approval_headcount + 1 where classname=? and groupname=?";
        conn.query(sql, [classname, groupname], (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve("err");
            }
            else{
                resolve (1);
            }
        })
    })
}
function decHeadcount(classname){
    return new Promise((resolve, reject)=>{
        let sql = "update openclass set headcount= headcount - 1 where classname=?"
        conn.query(sql, [classname], (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve("err");
            }
            else{
                resolve (1);
            }
        })
    })
}

function decApprovalHeadcount(classname, groupname){
    return new Promise((resolve, reject)=>{
        let sql = "update grouplist set Approval_headcount= Approval_headcount - 1 where classname=? and groupname=?";
        conn.query(sql, [classname, groupname], (err, row, fields)=>{
            if(err){
                console.log(err);
                resolve("err");
            }
            else{
                resolve (1);
            }
        })
    })
}
module.exports = { LoginFunc, RegisterFunc, GetClasses, FindClass, FindClasses, FindGrouplist, 
    FindGroup, InsertReqclass, makeClass, makeGrouplist, FindReqclass, UpdateGrouplistClassname,
    UpdateReqclassClassname, UpdateClassname, UpdateClasscontent, UpdateApprovalStatus,
    UpdateAllClassname, FindReqclassList, UpdateUserStatus, UpdateGroup, deleteReqclass, makeGroups,
    increaseViewcount, incHeadcount, incApprovalHeadcount, decHeadcount, decApprovalHeadcount };