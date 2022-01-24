/*

1. 그룹들 가져오기, 클래스 가져오기, 신청인원 가져오기
select * from openclass where classname=?
select * from grouplist where classname=?
select * from reqclass where classname=?

2. 출력 하기

클래스 : 제목, 내용, 그룹추가. 삭제

그룹 :  제목, 신청기간, 행사기간, 정원, 승인방식(개설자, 선착순)

* 클래스 내용 옆에 수정하기 버튼 추가.
* 그룹 출력에 참가자 관리하기로 이동 버튼 추가.

그룹 추가 페이지
그룹 삭제 페이지
모임 수정 페이지
*/


$(document).ready(()=>{

    // [ classinfo ]
    $.ajax({
        url: '/senddata'+ window.location.pathname,
        type: 'POST',
        async: false,
        dataType: 'json',

        success: function(classData) {
            const classinfo= $(".classinfo");
            let appendClassData = "";
            appendClassData += "<div><h3>"+classData[0].classname+"</h3>";
            appendClassData += "<div>내용 : " + classData[0].classcontent + "</div>"; 
            appendClassData += "<button type=\"button\"><a href=\"/mypage/manage/" + classData[0].classname +"\">수정하기</a></button></div>";
            classinfo.append(appendClassData);
        },
        cache: false
    });

    $.ajax({
        url: '/senddata'+ window.location.pathname +'/grouplist',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(groupData) {
            const groupinfo= $(".groupinfo");
            let appendgroupData = "";
            let Approval_type = ["개설자", "선착순"];
            //그룹 :  제목, 신청기간, 행사기간, 정원, 승인방식(개설자, 선착순)

            for(let i=0; i<groupData.length; i++){
                appendgroupData += "<div><h3>"+groupData[i].groupname+"</h3>";
                appendgroupData += "<div>신청기간 : "+ groupData[i].sign_start_time +" ~ " + groupData[i].sign_end_time +"</div>";
                appendgroupData += "<div>모임기간 : "+ groupData[i].class_start_time +" ~ " + groupData[i].class_end_time +"</div>";
                appendgroupData += "<div>정원 : "+ groupData[i].limit_headcount +"</div>";
                appendgroupData += "<div>승인방식 : "+ Approval_type[groupData[i].Approval_type]+"</div>";
                appendgroupData += "<button type=\"button\"><a href=\"/mypage/manage/" + groupData[i].classname + "/" +groupData[i].groupname +"\">관리페이지 이동하기</a></button></div>";
            }
            appendgroupData +="<button type=\"button\"><a href=\"/mypage/manage/groupadd/" + groupData[0].classname +"\">그룹 추가하기</a></button>";

            groupinfo.append(appendgroupData);
        },
        cache: false
    });
})



//     appendgroupData += "<div><h3>"+groupData[0].groupname+"</h3>";
//     appendgroupData += "<div>신청기간 : "+ groupData[0].sign_start_time +" ~ " + groupData[0].sign_end_time +"</div>";
//     appendgroupData += "<div>모임기간 : "+ groupData[0].class_start_time +" ~ " + groupData[0].class_end_time +"</div>";
//     appendgroupData += "<div>정원 : "+ groupData[0].limit_headcount +"</div>";
//     appendgroupData += "<div>승인방식 : "+ Approval_type[groupData[0].Approval_type]+"</div>";
//     appendgroupData += "<button type=\"button\"><a href=\"/mypage/manage/" + groupData[0].groupname +"\">관리페이지 이동하기</a></button></div>";
