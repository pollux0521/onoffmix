const path      = require('path');
const crypto    = require('crypto');
const express   = require('express');
const alert     = require('alert');
const router    = express.Router();
const rootPath  = path.join(__dirname, '../src/html/');
const conn      = require('../modules/conndb');
const email     = require('../modules/email');
const dbmodule  = require('../modules/dbmodule');

router.post("/getclass", (req, res)=>{
    let nowTime = new Date();
    let sql = "select distinct openclass.classname, openclass.uid, headcount, viewcount, register_time from openclass inner join grouplist on openclass.classname = grouplist.classname and grouplist.sign_end_time > ?";
    conn.query(sql, nowTime, (err, row, params)=>{
        console.log(row);
        res.send(row);
    });
});

router.post("/change", (req, res)=>{
    let path = req.body.path.split('/').reverse();
    let groupname = path[0];
    let classname = path[1];
    let uid = req.body.uid;

    let promise = dbmodule.UpdateUserStatus(uid, classname, groupname);
    promise.then((senddata)=>{
        if(senddata.err){
            res.send("err");
        }
        else if(senddata == 0) 
            res.send(false);

        else if(senddata == 1){
            res.send({"success": "success"});
        }
    });
})
router.post("/mypage/editgroup/:classname/:groupname", (req, res)=>{
    let promise = dbmodule.FindGroup(req.params.classname, req.params.groupname);
    promise.then((senddata)=>{
        if(senddata.err){
            console.log(senddata.err);
            res.send("err");
        }
        else if(senddata == 0) {
            console.log(senddata);
            res.send(false);
        }
        else{
            console.log(senddata);
            res.send(senddata); 
        }
    });
})

// [ Send Mypage Class Data ]
router.post("/mypage/classes", (req, res)=>{
    let promise = dbmodule.FindClasses(req.session.uid);
    promise.then((senddata)=>{
        if(senddata.err)
            res.send("err");
        
        else if(senddata == 0) 
            res.send(false);
    
        else
            res.send(senddata);
        
    })
});

// [ Send Mypage Request Class Data ]
router.post("/mypage/reqclass", (req, res)=>{
    let promise = dbmodule.FindReqclass(req.session.uid);
    promise.then((senddata)=>{
        if(senddata.err){
            console.log(senddata.err);
            res.send("err");
        }
        else if(senddata == 0) {
            console.log(senddata);
            res.send(false);
        }
        else{
            console.log(senddata);
            res.send(senddata); 
        }
    })
})

router.post("/mypage/class/:classname", (req, res)=>{
    let promise = dbmodule.FindClass(req.params.classname, req.session.uid);
    promise.then((senddata)=>{
        if(senddata.err){
            console.log(senddata.err);
            res.send("err");
        }
        else if(senddata == 0) {
            console.log(senddata);
            res.send(false);
        }
        else{
            console.log(senddata);
            res.send(senddata); 
        }
    })
})

router.post("/mypage/class/:classname/grouplist", (req, res)=>{
    let promise = dbmodule.FindGrouplist(req.params.classname);
    promise.then((senddata)=>{
        if(senddata.err){
            console.log(senddata.err);
            res.send("err");
        }
        else if(senddata == 0) {
            console.log(senddata);
            res.send(false);
        }
        else{
            console.log(senddata);
            res.send(senddata); 
        }
    })
})

router.post("/mypage/manage/:classname", (req, res)=>{
    let promise = dbmodule.FindClass(req.params.classname, req.session.uid);
    promise.then((senddata)=>{
        if(senddata.err){
            console.log(senddata.err);
            res.send("err");
        }
        else if(senddata == 0) {
            console.log(senddata);
            res.send(false);
        }
        else{
            console.log(senddata);
            res.send(senddata); 
        }
    })
})

router.post("/mypage/manage/:classname/:groupname", (req, res)=>{
    let promise = dbmodule.FindGroup(req.params.classname, req.params.groupname);
    promise.then((senddata)=>{
        if(senddata.err){
            console.log(senddata.err);
            res.send("err");
        }
        else if(senddata == 0) {
            console.log(senddata);
            res.send(false);
        }
        else{
            console.log(senddata);
            res.send(senddata); 
        }
    });
});

router.post("/mypage/manage/:classname/:groupname/approval", (req, res)=>{
    let promise = dbmodule.FindReqclassList(req.params.classname, req.params.groupname);
    promise.then((senddata)=>{
        if(senddata.err){
            console.log(senddata.err);
            res.send("err");
        }
        else if(senddata == 0) {
            console.log(senddata);
            res.send(false);
        }
        else{
            console.log(senddata);
            res.send(senddata); 
        }
    })
})

router.post('/class/:classname', (req, res)=>{
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
        console.log(ocrow[0]);
        glSQL = "select * from grouplist where classname=?"
        conn.query(glSQL, req.params.classname, (err, glrows, fields)=>{
            if(err){
                console.log(err);
                res.end();
            }
            else{

                res.send([ocrow[0], glrows]);
            }
        })
    })
});

router.post("/cancel/:classname/:groupname", (req,res)=>{
    let promise = dbmodule.deleteReqclass(req.session.uid, req.params.classname, req.params.groupname);
    promise.then((row)=>{
        if(row=="err"){
            return "Err";
        }
        else{
            return dbmodule.decHeadcount( req.params.classname);
        }
    }).then((row2)=>{
        if(row2 =="err"){
            return "err";
        }
        else{
            dbmodule.decApprovalHeadcount( req.params.classname, req.params.groupname);
        }
    }).then((row3)=>{
        if(row3 == "err"){
            res.send({"success" : 0});
        }
        else{
            res.send({"success" : 1});
        }
    })
})
module.exports = router;