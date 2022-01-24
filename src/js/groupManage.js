

$(document).ready(()=>{


    $.ajax({
        url: '/senddata'+window.location.pathname,
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(groupData){
            const groupinfo = $('.group-info');
            let Approval_type = ["개설자", "선착순"];
            let appendgroupData= "";
            appendgroupData += "<div><h3>"+groupData[0].groupname+"</h3>";
            appendgroupData += "<div>신청기간 : "+ groupData[0].sign_start_time +" ~ " + groupData[0].sign_end_time +"</div>";
            appendgroupData += "<div>모임기간 : "+ groupData[0].class_start_time +" ~ " + groupData[0].class_end_time +"</div>";
            appendgroupData += "<div>정원 : "+ groupData[0].limit_headcount +"</div>";
            appendgroupData += "<div>승인방식 : "+ Approval_type[groupData[0].Approval_type]+"</div>";
            appendgroupData += "<button type=\"button\"><a href=\"/mypage/editgroup/"+ groupData[0].classname +"/" + groupData[0].groupname +  "\">수정하기</a></button></div>";
            groupinfo.append(appendgroupData);
        }
    })

    $.ajax({
        url: '/senddata'+window.location.pathname + '/approval',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(userlist){
            const manageReqUsers = $('.manage-req-users');
            let appenduserData = "";
            let ApprovalStatus = ["대기중", "승인됨"];
            for(let i = 0; i < userlist.length; i++){
                appenduserData += "<div><div>이름 : " + userlist[i].name + "</div>";
                appenduserData += "<div> 신청사유 : " + userlist[i].reasons + "</div>";
                appenduserData += "<div> 상태 : " + ApprovalStatus[userlist[i].approval_status] + "</div>";
                appenduserData += "<button type=\"button\" id=\"change-button\" value="+userlist[i].uid+"> 변경하기</button>" 
            }
            manageReqUsers.append(appenduserData);
        }
        
    })

    $("#change-button").click(function(e){
        $.ajax({
            type:"POST",
            url: "/senddata/change",
            data: {'uid':this.value, 'path': window.location.pathname },
            dataType: 'json',
            success: function(data){
                alert('변경하였습니다.');
            },
            error: function(data){
                alert('오류입니다.')
            }
        })
    })
});