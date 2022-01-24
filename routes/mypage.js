const path      = require('path');
const crypto    = require('crypto');
const express   = require('express');
const alert     = require('alert');
const router    = express.Router();
const rootPath  = path.join(__dirname, '../src/html/');
const conn      = require('../modules/conndb');
const email     = require('../modules/email');
const dbmodule  = require('../modules/dbmodule');
const e = require('express');

// [ My Page ]
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

// [ Manage Class ]
router.get('/class/:classname', (req, res)=>{
    if(req.session.name == null)
        res.redirect("/login");
    else{
        let promise = dbmodule.FindClass(req.params.classname, req.session.uid);
        promise.then((row)=>{
            if(row[0].uid != req.session.uid){

                res.send("<script>alert('잘못된 접근입니다.');location.href='/mypage';</script>");
            }
            else{
                res.sendFile(rootPath + "classManage.html", (err)=>{
                    if(err){
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("succeess");
                    }
                });
            }
        });
    }
});

router.get('/manage/:classname', (req, res)=>{
    if(req.session.name == null)
        res.redirect("/login");
    else{
        let promise = dbmodule.FindClass(req.params.classname, req.session.uid);
        promise.then((row)=>{
            if(row[0].uid != req.session.uid){

                res.send("<script>alert('잘못된 접근입니다.');location.href='/mypage';</script>");
            }
            else{
                res.sendFile(rootPath + "editClass.html", (err)=>{
                    if(err){
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("succeess");
                    }
                });
            }
        });
    }
});

router.get('/manage/:classname/:groupname', (req, res)=>{
    if(req.session.name == null)
        res.redirect("/login");
    else{
        let promise = dbmodule.FindGroup(req.params.classname, req.params.groupname);
        promise.then((row)=>{
            if(row[0].uid != req.session.uid)
                res.send("<script>alert('잘못된 접근입니다.');location.href='/mypage';</script>");
            
            else{
                res.sendFile(rootPath + "groupManage.html", (err)=>{
                    if(err){
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("succeess");
                    }
                });
            }
        });
    }
})
// [ Update Classinfo ]
router.post('/editClass', (req, res)=>{
    if(req.body.editClassname != ""){
        let promise2 = dbmodule.FindClass(req.body.editClassname);
        promise2.then((row)=>{
            if(row == 0)
                return dbmodule.UpdateAllClassname(req.body.classname, req.body.editClassname);
            else
                return 3;
        }).then((value1)=>{
            if(value1 == 1){
                if(req.body.editClasscontent != "")
                    return dbmodule.UpdateClasscontent(req.body.editClassname, req.body.editClasscontent);
                else 
                    return 1;
            }
            else if(value == 3){
                return 3;
            }

        }).then((value2)=>{
            if(value2 == 1){
                res.send("<script>alert('변경되었습니다..');location.href='/mypage';</script>");
            }

            else if(value3 == 3){
                res.send("<script>alert('오류입니다.');location.href='/mypage';</script>");
            }
                
        });
    }

    else{
        if(req.body.editClasscontent != ""){
            let promise1 = dbmodule.UpdateClasscontent(req.body.classname, req.body.editClasscontent);
            promise1.then((row)=>{
                if(row == 1){
                    res.send("<script>alert('변경되었습니다.');location.href='/mypage';</script>");
                }
            })
        }
        else{
            res.send("<script>alert('뭐라도 적어주세요.');location.href='/mypage';</script>");
        }
    }
});

router.get("/editgroup/:classname/:groupname", (req, res)=>{
    if(req.session.name == null)
        res.redirect("/login");
    else{
        let promise = dbmodule.FindGroup(req.params.classname, req.params.groupname);
        promise.then((row)=>{
            if(row[0].uid != req.session.uid)
                res.send("<script>alert('잘못된 접근입니다.');location.href='/mypage';</script>");
            
            else{
                res.sendFile(rootPath + "editGroup.html", (err)=>{
                    if(err){
                        console.log(err);
                        res.end();
                    }
                    else{
                        console.log("succeess");
                    }
                });
            }
        });
    }
});
/* 해야될것
1. 같은 classname 중 이름이 겹치지 않는지

2. 정원이 1 이상인지
3. 신청시작시간이 오늘날짜 이하인지.
4. 신청끝나는 시간이 신청시작시간 이하인지
5. 모임시간이 신청날짜 끝나는 타임 이하인지
6. 모임끝나는시간이 모임시간 이하인지

*/
router.post("/editgroup", (req, res)=>{
    let timeErr = false;
    let headcountErr = false;
    let timenow = new Date()
    sign_start_time = new Date(req.body.sign_start_time);
    sign_end_time = new Date(req.body.sign_end_time);
    class_start_time = new Date(req.body.class_start_time);
    class_end_time = new Date(req.body.class_end_time);
    if(sign_start_time < timenow)
        timeErr = true;
    else if(sign_end_time < sign_start_time)
        timeErr = true;
    else if(class_start_time < sign_end_time)
        timeErr = true;
    else if(class_end_time < class_start_time)
        timeErr = true;
    else if(req.body.limit_headcount < 1)
        headcountErr = true;

    let params = [req.body.groupname, sign_start_time, sign_end_time, class_start_time, class_end_time, 
        req.body.limit_headcount, req.body.Approval_type, req.body.classname, req.body.beforegroupname];
    let promise = dbmodule.FindGroup(req.body.classname, req.body.groupname);
    promise.then((row)=>{
        if(row == "err"){
            console.log("err");
            return 0;
        }
        else if(timeErr || headcountErr){
            console.log("headcount");
            return 0;
        }
        else{
            return dbmodule.UpdateGroup(params)
        }
    }).then((value)=>{
        if(value == 0 || value == "err"){
            res.send("<script>alert('오류입니다. 다시시도해주세요.');location.href='/mypage';</script>");
        }
        else{
            res.send("<script>alert('그룹정보가 변경되었습니다.');location.href='/mypage';</script>");
        }
    })
})


module.exports = router;