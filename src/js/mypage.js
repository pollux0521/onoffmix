


$(document).ready(()=>{

    // [ classinfo ]
    $.ajax({
        url: '/senddata/mypage/classes',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(classData) {
            console.log(classData);
            const classinfo= $(".classinfo");
            let appendClassData = "";
            if(classData==false){
                appendClassData += "<div><h3>개설한 모임이 없습니다.</h3></div>";
            }
            else if(classData.length > 1){
                for(let i=0; i<classData.length; i++){
                    appendClassData += "<div><h3>"+classData[i].classname+"</h3>";
                    appendClassData += "<button type=\"button\"><a href=\"/mypage/class/" + classData[i].classname +"\">관리페이지 이동하기</a></div></div>";
                }
            }
           
            else{
                appendClassData += "<div><h3>"+classData[0].classname+"</h3>";
                appendClassData += "<button type=\"button\"><a href=\"/mypage/class/" + classData[0].classname +"\">관리페이지 이동하기</a></div></div>";
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
            console.log(reqClassData);
            const ReqClassInfo= $(".req-class-info");
            let status = ["대기중", "승인됨"];
            let appendReqData = "";

            if(reqClassData.length > 1){
                for(let i=0; i<reqClassData.length; i++){
                    appendReqData += "<div><h3>모임이름 : " + reqClassData[i].classname +"</h3>";
                    appendReqData += "<br><h3>그룹이름 : " +  reqClassData[i].groupname +"</h3>";
                    appendReqData += "<br><h3>상태 : " +  status[reqClassData[i].approval_status] + "</h3></div>";
                }
            }
            else if(reqClassData==false){
                appendReqData += "<div><h3>신청한 모임이 없습니다.</h3></div>";
            }
            else {
                appendReqData += "<div><h3>모임이름 : " + reqClassData[0].classname +"</h3>";
                appendReqData += "<br><h3>그룹이름 : " +  reqClassData[0].groupname +"</h3>";
                appendReqData += "<br><h3>상태 : " +  status[reqClassData[0].approval_status] + "</h3></div>";
                appendReqData += "<button type=\"button\" id=\"cancel-button\" value=\"/cancel/"+reqClassData[0].classname+"/"+reqClassData[0].groupname + "\">취소하기</button>";
            }
            ReqClassInfo.append(appendReqData);
        },
        cache: false
    });

    $("#cancel-button").click(function(e){
        console.log("/senddata"+this.value);
        $.ajax({
            type:"POST",
            url: "/senddata"+ this.value,
            dataType: 'json',
            success: function(data){
                if(data.success == 1){
                    alert('취소하였습니다.');
                    location.href="/mypage";
                }
                else{
                    alert('다시시도해주세요');
                }

            },
            error: function(data){
                console.log(data);
                alert('알수없는오류입니다..')
            }
        })
    })
})