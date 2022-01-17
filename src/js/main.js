$(document).ready(()=>{
    $.ajax({
        url: '/logininfo',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data) {
            const topMenu= $(".top-service-menu");
            let name = data.name;

            if(name == null){
                topMenu.append("<li class=\"list-item\"><a href=\"/login\">로그인</a></li>");
                topMenu.append("<li class=\"list-item\"><a href=\"/register\">회원가입</a></li>");
            }
            else{
                topMenu.append("<li class=\"list-item\"><a href=\"/login\">"+name +"님</a></li>");
                topMenu.append("<li class=\"list-item\"><a href=\"/logout\">로그아웃</a></li>");
            }
        },
        cache: false
    });

    $.ajax({
        url: '/getclass',
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function(data){
            const openclass = $(".open-class");
            let classinfo = "";
            let info = data;
            
            for(let i=0; i<info.length; i++){

                classinfo += "<div><a href='/class/" + info[i].classname + "'>" + info[i].classname + "</a></div>";

            }
            openclass.append(classinfo);
            
        }
    })

})