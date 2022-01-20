


$(document).ready(()=>{

    // [ classinfo ]
    $.ajax({
        url: '/senddata/mypage/classes',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(classData) {
            const classinfo= $(".classinfo");
            let appendClassData = "";
            if(classData.length == null){
                appendClassData += "<div><h3>"+classData.classname+"</h3>";
                appendClassData += "<button type=\"button\"><a href=\"/mypage/manage/" + classData.classname +"\">이동하기</a></div></div>";
            }
            else if(classData.length > 1){
                for(let i=0; i<classData.length; i++){
                    appendClassData += "<div><h3>"+classData.classname[i]+"</h3>";
                    appendClassData += "<button type=\"button\"><a href=\"/mypage/manage/" + classData.classname[i] +"\">이동하기</a></div></div>";
                }
            }
            else if(classinfo==false){
                appendClassData += "<div><h3>개설한 모임이 없습니다.</h3></div>";
            }
            classinfo.append(appendClassData);
        },
        cache: false
    });


    // [ req-class-info ]
    $.ajax({
        url: '/senddata/mypage/reqclass',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(reqClassData) {
            const ReqClassInfo= $(".req-class-info");
            let status = ["대기중", "승인됨"];
            let appendReqData = "";
            if(reqClassData.length == null){
                appendReqData += "<div><h3>모임이름 : " + reqClassData.classname +"</h3>";
                appendReqData += "<br><h3>그룹이름 : " +  reqClassData.groupname +"</h3>";
                appendReqData += "<br><h3>상태 : " +  status[reqClassData.approval_status] + "</h3></div>";
            }
            else if(reqClassData.length > 1){
                for(let i=0; i<reqClassData.length; i++){
                    appendReqData += "<div><h3>모임이름 : " + reqClassData.classname[i] +"</h3>";
                    appendReqData += "<br><h3>그룹이름 : " +  reqClassData.groupname[i] +"</h3>";
                    appendReqData += "<br><h3>상태 : " +  status[reqClassData.approval_status[i]] + "</h3></div>";
                }
            }
            else if(classinfo==false){
                appendReqData += "<div><h3>신청한 모임이 없습니다.</h3></div>";
            }
            ReqClassInfo.append(appendReqData);
        },
        cache: false
    });
})