let emailCheckClick = false;

function validateCheck(email){
    let emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if(emailRegex.test(email)== false)  return false;
    else    return true;
}

function doubleCheck(email) {
    let result;
    $.ajax({
        url: '/emailCheck',
        type: 'POST',
        async: false,
        dataType: 'json',
        data:{email:email},
        success: function(isDouble) {
            if(isDouble == true)    result = false;
            else  result = true;
        },
        cache: false
    });
    return result;
}

$(document).ready(()=>{
    document.getElementById("emailcheck").onclick = ()=>{
        email = document.getElementById('email').value;
        if(validateCheck(email) == false)  alert("이메일 형식이 올바르지 않습니다.");
        else if(doubleCheck(email) == false)  alert("중복된 이메일입니다.");
        else {
            alert("사용가능한 이메일입니다.");
            emailCheckClick = true;
        }
    }   
});