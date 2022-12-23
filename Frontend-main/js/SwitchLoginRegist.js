function Switch_login_regist(name){
    switch (name) {
        case "regist":
            document.getElementById("form_login").style.display = "none";
            document.getElementById("form_regist").style.display = "block";
            document.getElementById("form_login").style.height = "380px";
            document.querySelectorAll('.errors').forEach(element => element.style.color = "rgb(249, 248, 248)");
            clear_input();
            break;
        case "login":
            document.getElementById("form_regist").style.height = "490px";
            document.getElementById("form_login").style.display = "block";
            document.getElementById("form_regist").style.display = "none";
            document.getElementById("access_regist").style.display = "none";
            document.querySelectorAll('.errors').forEach(element => element.style.color = "rgb(249, 248, 248)");
            clear_input();
            break;    
    }
}

function clear_input(){
    let input = document.getElementsByTagName("input");

    for (let i = 0; i < input.length; i++){
        input[i].value = "";
    }
}