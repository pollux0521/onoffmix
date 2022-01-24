$(document).ready(()=>{
    $.ajax({
        url: '/senddata/getclass',
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