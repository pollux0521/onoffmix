$(document).ready(()=>{
    document.getElementById('add-group').onclick = function addGroup(){
        const openclass = $("#openclass");
        grouplist = '그룹이름 <input type="text" name="groupname"><br><div class="input-box" id="grouplist">그룹이름 <input type="text" name="groupname"><br> 신청 시작시간 <input type="date" name="sign_start_time">신청 마감시간 <input type="date" name="sign_end_time"><br> 모임 시작시간 <input type="date" name="class_start_time">모임 마감시간<input type="date" name="class_end_time"><br>정원 <input type="number" name="limit_headcount"><br>선정방법<input type="radio" name="Approval_type" value="0">개설자승인 <input type="radio" name="Approval_type" value="1">선착순 </div>'
        openclass.append(grouplist);
    }
})