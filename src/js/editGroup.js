$(document).ready(()=>{
    $.ajax({
        url: '/senddata'+window.location.pathname,
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(groupData){
            const editgroup = $('.edit-this-group');
            let Approval_type = ["개설자", "선착순"];
            let appendgroupData= "";
            appendgroupData += "<form id=\"editgroup\" action=\"/mypage/editgroup\" method=\"post\">";
            appendgroupData += "<div><h3>"+groupData[0].groupname+"</h3>";
            appendgroupData += "<input type=\"hidden\" name=\"classname\" value=" + groupData[0].classname + "></input>"
            appendgroupData += "<input type=\"hidden\" name=\"beforegroupname\" value=" + groupData[0].groupname + "></input>" 
            appendgroupData += '그룹이름 <input type="text" name="groupname">';
            appendgroupData += "<br><div>신청기간 : "+ groupData[0].sign_start_time +" ~ " + groupData[0].sign_end_time +"</div>";
            appendgroupData += '<br> 신청 시작시간 <input type="date" name="sign_start_time">신청 마감시간 <input type="date" name="sign_end_time">';
            appendgroupData += "<br><div>모임기간 : "+ groupData[0].class_start_time +" ~ " + groupData[0].class_end_time +"</div>";
            appendgroupData += '<br> 모임 시작시간 <input type="date" name="class_start_time">모임 마감시간<input type="date" name="class_end_time">' ;
            appendgroupData += "<br><div>정원 : "+ groupData[0].limit_headcount +"</div>";
            appendgroupData += '<br>정원 <input type="number" name="limit_headcount">';
            appendgroupData += "<br><div>승인방식 : "+ Approval_type[groupData[0].Approval_type]+"</div>";
            appendgroupData += '<br>승인방식<br> <br>개설자승인 <input type="radio" name="Approval_type" value="0">';   
            appendgroupData += '<br>선착순 <input type="radio" name="Approval_type" value="1"><br>';    
            appendgroupData += "<button id=\"submit-button\"type=\"button\">제출하기</button></div></form>";
            editgroup.append(appendgroupData);
        }
    })  

    $("#submit-button").click((e)=>{

        let empty=false;
        $('#editgroup').find('input').each(function(){
            if(!$(this).val()){

                empty = true;
            }
        });
        if(empty){
            alert('전부 입력해주세요');
        }
        else{
            $('#editgroup').submit();
        }
    })
})