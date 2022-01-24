const path      = require('path');
const crypto    = require('crypto');
const express   = require('express');
const alert     = require('alert');
const router    = express.Router();
const rootPath  = path.join(__dirname, '../src/html/');
const conn      = require('../modules/conndb');
const email     = require('../modules/email');



router.get("/", (req, res)=>{
    res.sendFile(rootPath + "main.html", (err)=>{
        if(err){
            console.log(err);
            res.end();
        }
    });
});


/*

router.get("/", (req,res)=>{});
router.post("/", (req,res)=>{});

*/

/*  [ SIGN ] */
router.post("/logininfo",(req, res)=>{
    res.send({'name': req.session.name, 'email':req.session.email});
})

router.get("/login", (req,res)=>{
    res.sendFile(rootPath + "login.html", (err)=>{
        if(err){
            console.log(err);
            res.end();
        }
    })
});

router.post("/login", (req,res)=>{
    let sql = "SELECT * FROM users WHERE email=? and pw=?";
    let params = [req.body.email, crypto.createHash("sha512").update(req.body.pw).digest('hex')];
    conn.query(sql, params, (err, row, fields)=>{
        if(err){
            console.log(err);
            res.end(err);
        }
        else if(row.length == 0){
            console.log(row);
            res.send("<script>alert('존재하지 않는 아이디거나 아이디 혹은 비밀번호가 다릅니다..');location.href='/login';</script>");

        }
        else{
            req.session.name = row[0].name;
            req.session.uid = row[0].uid;
            req.session.save(()=>{
                res.redirect("/");
            });
        }
    });
});

router.get("/logout", async (req, res)=>{
    let session = req.session;
    try{
        if(session.name){
            await req.session.destroy((err)=>{
                if(err) console.log(err);
                else res.redirect('/');
            });
        }
    }catch(e){
        console.log(e);
    }
});

router.get("/register", (req,res)=>{
    res.sendFile(rootPath + "register.html", (err)=>{
        if(err){
            console.log(err);
            res.end();
        }
    })
});

router.post("/register", (req,res)=>{
    let sql = "INSERT INTO users(email, pw, name)VALUES(?,?,?)"
    let params = [req.body.email, crypto.createHash("sha512").update(req.body.pw).digest('hex'), req.body.name];

    if(req.body.pw != req.body.pw2){
        res.send("<script>alert('비밀번호가 일치하지 않습니다..');location.href='/login';</script>");
    }
    else if(!email.isEmailForm(req.body.email)){
        res.send("<script>alert('올바른 이메일 형식을 입력해 주세요');location.href='/login';</script>");
    }
    else if(email.isRegisteredEmail(req.body.email)){
        res.send("<script>alert('이미 가입된 이메일입니다.');location.href='/login';</script>");
    }
    else{
        conn.query(sql, params, (err, row, fields)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send("<script>alert('회원가입에 성공했습니다.');location.href='/login';</script>");
            }
        })
    }
});

// email validate
router.post("/emailcheck", (req,res)=>{
    res.send(email.isRegisteredEmail(req.body.email));
});

module.exports = router;