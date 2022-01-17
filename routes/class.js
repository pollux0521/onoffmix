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
const session = require('express-session');
const { resolve } = require('path');


router.get('/:classname', (req, res)=>{
    res.sendFile(rootPath + "classname.html");
    
})

router.post('/:classname', (req, res)=>{
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
        console.log(ocrow[0].classname);
        glSQL = "select * from grouplist where classname=?"
        conn.query(glSQL, ocrow[0].classname, (err, glrows, fields)=>{
            if(err){
                console.log(err);
                res.end();
            }
            else{
                console.log([ocrow, glrows]);
                res.send([ocrow[0], glrows[0]]);
            }
        })
    })
});

router.get('/reqclass/:classname/:groupname', (req, res)=>{
    console.log(req.params.classname + req.params.groupname);
    res.end();
})



router.get('/openclass', (req, res)=>{
    console.log(req.session.name);
    if(loginfunc.islogin(req.session.name) == 0){
        res.redirect('/login');
    }
    else  res.sendFile(rootPath + "openclass.html");
})

// insert into openclass, grouplist
router.post('/openclass', (req, res)=>{
    console.dir(new Date(req.body.sign_start_time));
    console.log(new Date());
    res.end();
    let ocParams = [req.body.classname, req.session.uid, req.body.classcontent, 0, 0, new Date()];
    let glParams = [];
    let result = 0;
    if(makeclass.makeClass(ocParams)){
        glParams = [
            req.body.groupname, 
            req.session.uid, 
            new Date(req.body.sign_start_time),
            new Date(req.body.sign_end_time), 
            new Date(req.body.class_start_time), 
            new Date(req.body.class_end_time), 
            req.body.limit_headcount, 
            req.body.Approval_type, 
            req.body.classname];
        if(makeclass.makeGroupList(glParams) == 0){
            res.send("<script>alert('그룹 제작 오류입니다 .다시시도해주세요');location.href='/class/openclass';</script>");
        }

    }
    else{
        res.send("<script>alert('모임 제작 오류입니다 .다시시도해주세요');location.href='/class/openclass';</script>");
    }

});

router.get('/success', (req, res)=>{
    res.sendFile(rootPath + "success.html");
})

router.post('/')
module.exports = router;




// for(let i=0; req.body.groupname[i] != null; i++){
    //     glParams = [
    //         req.body.groupname[i], 
    //         req.session.uid, 
    //         new Date(req.body.sign_start_time[i]),
    //         new Date(req.body.sign_end_time[i]), 
    //         new Date(req.body.class_start_time[i]), 
    //         new Date(req.body.class_end_time[i]), 
    //         req.body.limit_headcount[i], 
    //         req.body.Approval_type[i], 
    //         req.body.classname];
    //     if(makeclass.makeGroupList(glParams)){
    //     }
    //     else{
    //         res.send("<script>alert('그룹 제작 오류입니다 .다시시도해주세요');location.href='/class/openclass';</script>");
    //     }
    // }