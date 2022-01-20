const path      = require('path');
const crypto    = require('crypto');
const express   = require('express');
const alert     = require('alert');
const router    = express.Router();
const rootPath  = path.join(__dirname, '../src/html/');
const conn      = require('../modules/conndb');
const email     = require('../modules/email');
const dbmodule  = require('../modules/dbmodule');


// [ Send Mypage Class Data ]
router.post("/mypage/classes", (req, res)=>{
    console.log(dbmodule.FindClasses(req.session.uid));
    if(senddata.err){
        console.log(senddata.err);
        res.send("err");
    }
    else if(senddata.length == 0) {

        res.send(false);
    }

    else{
        console.log(senddata);

        res.send(senddata);
    }
});

// [ Send Mypage Request Class Data ]
router.post("/mypage/reqclass", (req, res)=>{
    let senddata = dbmodule.FindReqclass(req.session.uid);
    if(senddata.err){
        console.log(senddata.err);
        res.send("err");
    }
    else if(senddata.length == 0) {

        res.send(false);
    }

    else{
        console.log(senddata);
        res.send(senddata); 
    }
})

module.exports = router;