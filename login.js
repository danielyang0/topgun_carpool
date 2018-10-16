function onLogin(){
    var usr = $("#userName").val();
    var pass = $("#pass").val();
    console.log("testt");
    $.post("/login", {"userName":usr, "password":pass, "isDriver":true}, function(data, status, xhr){
        console.log(data);
    }).fail(function(xhr, status, error){
        console.log(xhr.statusText);
    });
}