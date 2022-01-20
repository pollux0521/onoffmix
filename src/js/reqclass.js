$(document).ready(()=>{
    let sendinfo = [];
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            
            const classname = $(".classname");
            let classinfo = "";
            let info = data;
            sendinfo = [info[0].classname, info[1].groupname];
            classinfo += "<div><h1>제목 :"+ info[0].classname +"</h1></div>";
            classinfo += "<div> 모임기간 " + info[1].class_start_time + " ~ " + info[1].class_end_time + "</div>";
            classname.append(classinfo);

            const groupname = $(".groupname");
            let groupinfo ="";
            groupinfo += "<div class=\"grouplist\"><div clas=\"groupname\"><div> 그룹이름:" + info[1].groupname + "</div></div>";
            if(info[1].Approval_type == true) groupinfo += "<div class=\"Approval-type\"> 개발자선정 </div>";
            else groupinfo += "<div class=\"Approval-type\"> 선착순 </div>"
            groupinfo += "<div class=\"limit-headcount\"> 정원 " + info[1].limit_headcount + "명</div>"
            groupinfo += "<div class=\"sign-end-time\">" + info[1].sign_end_time + "까지</div></div>";
            groupname.append(groupinfo);
        } 
    })
    console.log(sendinfo);
    $("#req-class-button").on("click", ()=>{
        const sendform = $(".send");
        
        let sendappend = "<input type=\"hidden\" name=\"classname\" value=" + sendinfo[0] + "></input>";
        sendappend += "<input type=\"hidden\" name=\"groupname\" value=" +  sendinfo[1] + "></input>";
        sendform.append(sendappend);
        sendform.submit();
    })

})