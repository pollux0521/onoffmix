$(document).ready(()=>{
    let groupcount = 1;
    document.getElementById('add-group').onclick = function addGroup(){
        groupcount++;
        const openclass = $("#classinfo");
        let grouplist = '<br><div class"input-box">그룹이름 <input type="text" name="groupname"><br>';
        grouplist += '<br> 신청 시작시간 <input type="date" name="sign_start_time">신청 마감시간 <input type="date" name="sign_end_time">';
        grouplist += '<br> 모임 시작시간 <input type="date" name="class_start_time">모임 마감시간<input type="date" name="class_end_time">' ;
        grouplist += '<br>정원 <input type="number" name="limit_headcount">';
        grouplist += '<select name="Approval_type"><option value="0">개설자승인</option><option value="1">선착순</option></select> </div>';     
        openclass.append(grouplist);
    }

    $("#makeClass").on("click", ()=>{
        const sendform = $("#openclass");
        
        let sendappend = "<input type=\"hidden\" name=\"groupcount\" value=" +  groupcount + "></input>";

        sendform.append(sendappend);
        sendform.submit();
    })
})