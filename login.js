function onLogin() {
    var usr = $("#userName").val();
    var pass = $("#pass").val();
    $.post("/login", { "userName": usr, "password": pass, "isDriver": true }, function (data, status, xhr) {
        var now = new Date();
        now = now.getTime();
        now += 3600000;
        localStorage.setItem("session", now.toString());
        localStorage.setItem("userName", usr);
        localStorage.setItem("userData", data);
        window.location.href = "../";
    }).fail(function (xhr, status, error) {
        console.log(xhr.statusText);
    });
}