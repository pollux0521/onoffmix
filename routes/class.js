const path      = require('path');
const crypto    = require('crypto');
const express   = require('express');
const alert     = require('alert');
const router    = express.Router();
const rootPath  = path.join(__dirname, '../src/html/');
const conn      = require('../modules/conndb');
const email     = require('../modules/email');
const loginfunc = require('../modules/loginfunc');
const makeclass = require('../modules/makeclass');
const dbmodule  = require('../modules/dbmodule');
const session = require('express-session');
const { resolve } = require('path');

router.post('/reqclass', (req, res)=>{
    console.log(req.body.groupname);
    let promise = dbmodule.FindGroup(req.body.classname, req.body.groupname);
    promise.then((row)=>{
        if(row=="err"){
            return 0;
        }
        else if(row == 0){
            return 0;
        }
        else if(row[0].Approval_headcount >= row[0].limit_headcount){
            return 2;
        }
        else{
            return dbmodule.incHeadcount(req.body.classname);
        }
    }).then((row2)=>{
        if(row2 =="err"){
            return 0;
        }
        else if(row2 == 0){
            return 0;
        }
        else if(row2 == 2){
            return 2;
        }
        else{
            dbmodule.incApprovalHeadcount(req.body.classname, req.body.groupname);
        }
    }).then((row3)=>{
        if(row3 =="err"){
            return 0;
        }
        else if(row3 == 0){
            return 0;
        }
        else if(row3 == 2){
            return 2;
        }
        else{
            dbmodule.InsertReqclass(req.body.classname, req.body.groupname, req.session.uid, req.body.reasons, req.session.name);
        }
    }).then((row4)=>{
        if(row4 == "err" || row4 == 0){
            res.send("<script>alert('오류입니다. 잠시 후 다시 시도해주세요.');location.href='/class/"+ req.body.classname+"';</script>");
        }
        else if(row4 == 2){
            res.send("<script>alert('남는 자리가 없습니다..');location.href='/class/"+ req.body.classname+"';</script>");
        }
        else{
            res.send("<script>alert('신청이 완료되었습니다.');location.href='/class/"+ req.body.classname+"';</script>");
        }
    })
});

router.get('/openclass', (req, res)=>{
    console.log(req.session.name);
    if(loginfunc.islogin(req.session.name) == 0){
        res.redirect('/login');
    }
    else  res.sendFile(rootPath + "openclass.html");
})

// insert into openclass, grouplist
router.post('/openclass', (req, res)=>{
    console.log(req.body.groupcount);
    let promise = dbmodule.makeClass(req.body.classname, req.session.uid, req.body.classcontent);
    promise.then((result)=>{
        if(result == 1){
            if(req.body.groupcount > 1){

                let insertGroups = [];
                for(let i=0; i<req.body.groupcount; i++){
                    let glparam = [
                        req.body.groupname[i], req.body.classname,
                        req.session.uid, 
                        new Date(req.body.sign_start_time[i]),
                        new Date(req.body.sign_end_time[i]), 
                        new Date(req.body.class_start_time[i]), 
                        new Date(req.body.class_end_time[i]), 
                        req.body.limit_headcount[i], 
                        req.body.Approval_type[i], 
                        0,
                    ];
                    insertGroups[i] = glparam;
                    console.log(insertGroups[0]);
                }
                return dbmodule.makeGroups(insertGroups);
            }
            else if(req.body.groupcount == 1){

                let glparam = [
                    req.body.groupname, req.body.classname,
                    req.session.uid, 
                    new Date(req.body.sign_start_time),
                    new Date(req.body.sign_end_time), 
                    new Date(req.body.class_start_time), 
                    new Date(req.body.class_end_time), 
                    req.body.limit_headcount, 
                    req.body.Approval_type, 
                    0,
                ];
                return dbmodule.makeGrouplist(glparam);
            }
            else{
                console.log("err");
                return "err";
            }
        }
        else{
            console.log("err");
            return 0;
        }
    }).then((result2)=>{
        if(result2 == 0){
            res.send("<script>alert('이미있는 모임이름입니다. 다시시도해주세요');location.href='/class/openclass';</script>");
        }
        else if(result2=="err"){
            res.send("<script>alert('모임제작 오류입니다. 다시시도해주세요');location.href='/class/openclass';</script>");
        }
        else{
            res.send("<script>alert('제작이 완료되었습니다.');location.href='/';</script>");
        }
    });
});

router.get('/:classname', (req, res)=>{
    let promise = dbmodule.increaseViewcount(req.params.classname);
    promise.then((value)=>{
        if(value == "err"){
            console.log("err");
        }
        else{
            res.sendFile(rootPath + "classname.html");
        }
    })
})



router.get('/reqclass/:classname/:groupname', (req, res)=>{
    if(req.session.name == null){
        res.redirect('/login');
    }
    else{
        res.sendFile(rootPath + "reqclass.html");
    }

})

router.post('/reqclass/:classname/:groupname', (req, res)=>{
    let resultData = new Promise((resolve, reject)=>{
        let ocSQL = "select * from openclass where classname=?"
        conn.query(ocSQL, req.params.classname, (err, ocrow, fields)=>{
            if(err){
                console.log(err);
                res.end();
            }
            else{
                resolve(ocrow);
            }
        })
    })
    resultData.then((ocrow)=>{
        glSQL = "select * from grouplist where groupname=?"
        conn.query(glSQL, req.params.groupname, (err, glrows, fields)=>{
            if(err){
                console.log(err);
                res.end();
            }
            else{
                res.send([ocrow[0], glrows[0]]);
            }
        })
    })
});

router.get('/success', (req, res)=>{
    res.sendFile(rootPath + "success.html");
})

module.exports = router;