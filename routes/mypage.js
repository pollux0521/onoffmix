const path      = require('path');
const crypto    = require('crypto');
const express   = require('express');
const alert     = require('alert');
const router    = express.Router();
const rootPath  = path.join(__dirname, '../src/html/');
const conn      = require('../modules/conndb');
const email     = require('../modules/email');

router.get('/', (req, res)=>{
    if(req.session.name == null)    
        res.redirect("/login");
    
    else{
        res.sendFile(rootPath + "mypage.html", (err)=>{
            if(err){
                console.log("good?");
                console.log(err);
                res.end();
            }
        });
    }
})


module.exports = router;