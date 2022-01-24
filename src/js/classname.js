$(document).ready(()=>{

    function formatDate(date){
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    }
    $.ajax({
        url: '/senddata'+window.location.pathname,
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            const classname = $(".classname");
            let classinfo = "";
            let info = data;
            console.log(info[1].length);
            classinfo += "<div><h1>제목 :"+ info[0].classname +"</h1></div>";
            classinfo += "<div> 내용 :"+ info[0].classcontent+ "</div>";
            classinfo += "<div> 모임기간 " + info[1][0].class_start_time + " ~ " + info[1][0].class_end_time + "</div>";

            if (info[1].length == 1){
                classinfo += "<div class=\"grouplist\"><div clas=\"groupname\"><div> 그룹이름:" + info[1].groupname + "</div></div>";
                if(info[1].Approval_type == true) classinfo += "<div class=\"Approval-type\"> 개발자선정 </div>";
                else classinfo += "<div class=\"Approval-type\"> 선착순 </div>"
                classinfo += "<div class=\"limit-headcount\"> 정원 " + info[1].limit_headcount + "명</div>"
                classinfo += "<div class=\"sign-end-time\">" + info[1].sign_end_time + "까지</div></div>";
                classinfo += "<button type=\"button\"><a href=\"/class/reqclass/"+info[0].classname +"/" + info[1].groupname+"\">신청하기</a></button></div>"
               
            }
            else{
                for(let i=0; i<info[1].length; i++){
                    classinfo += "<div class=\"grouplist\"><div clas=\"groupname\"><div>그룹이름:" + info[1][i].groupname + "</div></div>";
                    if(info[1][i].Approval_type == true) classinfo += "<div class=\"Approval-type\"> 개발자선정 </div>";
                    else classinfo += "<div class=\"Approval-type\"> 선착순 </div>"
                    classinfo += "<div class=\"limit-headcount\"> 정원 " + info[1][i].limit_headcount + "명</div>"
                    classinfo += "<div class=\"sign-end-time\">" + info[1][i].sign_end_time + "까지</div>"
                    classinfo += "<button type=\"button\"><a href=\"/class/reqclass/"+info[0].classname +"/" + info[1][i].groupname+"\">신청하기</a></button></div>";
                }
            }
            classname.append(classinfo);
        }
    })
})

