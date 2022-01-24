//모임 수정 페이지




$(document).ready(()=>{
    // [ classinfo ] mypage/manage/classname
    $.ajax({
        url: '/senddata'+ window.location.pathname,
        type: 'POST',
        async: false,
        dataType: 'json',

        success: function(classData) {
            const classname= $(".classname");
            const sendform=$("#editClass");
            sendform.append("<input type=\"hidden\" name=\"classname\" value=" +classData[0].classname +"></input>");
            classname.append("<div><h3>제목"+classData[0].classname+"</h3>");
            const classcontent = $(".classcontent");
            classcontent.append("<div>내용 : " + classData[0].classcontent + "</div>");

        },
        cache: false
    });

})
