var userData = {};
var days = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri."];
var runTimeData = { "days": [false, false, false, false, false], "selectedPost": -1 };

function isLogin() {
    var timeStamp = (new Date()).getTime();
    var sessionTime = localStorage.getItem("sessionTime");
    if (sessionTime != null) {
        sessionTime = parseInt(sessionTime);
        return timeStamp < sessionTime;
    }
    return false;
}

function refreshData() {
    if (!isLogin()) {
        return;
    }
    $.post("/refresh", { "sessionID": localStorage.getItem("sessionID"), "userName": localStorage.getItem("userName") }, function (data, s, xhr) {
        userData = JSON.parse(data);
        var refreshMatch = false;
        refreshPostList();
        if (runTimeData.selectedPost < 0) {
            if (userData.post.length > 0) {
                onClickPost(0);
                refreshMatch = true;
            }
        }
        if (!refreshMatch) {
            refreshMatchList();
        }
        setTimeout(refreshData, 10000);
    }).fail(function (xhr, error, s) {
        setTimeout(refreshData, 10000);
    });
}

function onLoad() {
    var now = new Date();
    $("#driver").prop("checked", true);
    $("#number").val("1");
    onTypeChanged();
    onNumberChanged();
    var login = isLogin();
    $("#login").text(login ? "Logout" : "Login");
    if (login) {
        $("#userLabel").text("Welcome " + localStorage.getItem("userName"));
    }
    appendTimeSelection(now);
    var min = now.toISOString().substr(0, 10);
    now.setMonth(now.getMonth() + 1);
    var max = now.toISOString().substr(0, 10);
    var dl = $("#date");
    dl.val(min);
    dl.prop("min", min);
    dl.prop("max", max);
    refreshData();
}

function onDayBtn(i) {
    runTimeData.days[i] = !runTimeData.days[i];
}

function refreshPostList() {
    runTimeData.displayPost = [];
    var node = $("#postList");
    node.empty();
    for (p in userData.post) {
        p = userData.post[p];
        if (p.userName == userData.userName) {
            createPostCell(p, node);
        }
    }
}

function onPostBtn() {
    var days = 0;
    for (var i = 0; i < runTimeData.days.length; ++i) {
        if (runTimeData.days[i]) {
            days = days | (1 << i);
        }
    }
    if (days <= 0) {
        alert("Please select a day");
        return;
    }
    var latlng = markers[0].getPosition();
    // alert(latlng.lat());
    // alert(latlng.lng());
    var data = {};
    data.userName = userData.userName;
    data.latitude = latlng.lat();
    data.longitude = latlng.lng();
    data.number = $("#number").val();
    data.available = data.number;
    data.time = $("#time").val();
    data.isDriver = $("#driver").prop("checked");
    data.days = days;
    $.post("/post", data, function (d, s, xhr) {
        data = JSON.parse(d);
        userData.post.push(data.post)
        userData.match[data.post.id] = data.match;
        localStorage.setItem("userData", JSON.stringify(userData));
        refreshPostList();
    }).fail(function (xhr, error, status) {
        console.log(error);
    });
}

function search(id) {
    $.post("/match", { "post": [id] }, function (data, s, xhr) {
        data = JSON.parse(data);
        for (var k in data) {
            userData.match[k] = data[k];
        }
    });
}

function onClickPost(i) {
    if (runTimeData.selectedPost >= 0) {
        $("#postList :nth-child(" + (runTimeData.selectedPost + 1) + ")").removeClass("bg-primary text-white");
    }
    runTimeData.selectedPost = i;
    $("#postList :nth-child(" + (i + 1) + ")").addClass("bg-primary text-white");
    refreshMatchList();
}

function refreshMatchList() {
    runTimeData.displayMatch = [];
    var node = $("#matchList");
    node.empty();
    if (runTimeData.selectedPost >= 0) {
        var post = runTimeData.displayPost[runTimeData.selectedPost];
        var list = userData.match[post.id];
        for (var i in list) {
            createSearchCell(post, list[i], node);
        }
    }
}

function onClickInvite(index) {
    var toPost = runTimeData.displayMatch[index];
    var sender = runTimeData.displayPost[runTimeData.selectedPost];
    $.post("/invite", { "sender": sender.id, "to": toPost.id }, function (data, s, xhr) {

    }).fail(function (xhr, error, s) {

    });
}

function createSearchCell(srcPost, post, node) {
    var index = runTimeData.displayMatch.length;
    runTimeData.displayMatch.push(post);
    var labels = createHtmlCell(post);
    var str = '<div class="list-group-item d-flex justify-content-between align-items-center">' +
        labels[0] + '<br/>' +
        labels[1] + '<br/>' +
        post.time + '    ' + labels[2];
    if (srcPost.match != "") {
        str += '<span class="badge badge-primary badge-pill">Matched</span></div>';
    } else {
        var state = 0;
        for (var k in userData.invites) {
            var inv = userData.invites[k];
            if (inv.receiver == post.id && inv.sender == srcPost.id) {
                state = 1;
                break;
            } else if (inv.sender == post.id && inv.receiver == srcPost.id) {
                state == 2;
                break;
            }
        }
        if (state == 0) {
            str += '<button class="btn btn-primary" onclick="onClickInvite(' + index + ')">invite</button></div>';
        } else if (state == 1) {
            str += '</div>';
        } else {
            str += '<div class="btn-group-vertical">\
                <button type="button" class="btn btn-success btn-sm" onclick="onClickYes(' + index + ')">Accept</button>\
                <button type="button" class="btn btn-danger btn-sm" onclick="onClickNo(' + index + ')">Reject</button>\
            </div>';
        }
    }
    node.append(str);
}

function createHtmlCell(post) {
    var driverLabel = post.isDriver ? "Driver: " : "Passenger: ";
    driverLabel += post.userName;
    var dayLabel = "";
    for (var i = 0; i < days.length; ++i) {
        var d = 1 << i;
        if ((post.days & d) > 0) {
            dayLabel += days[i] + " ";
        }
    }
    var numberLabel = post.isDriver ? " seat" : " passenger";
    numberLabel = post.availableNumber + numberLabel;
    if (post.availableNumber > 1) {
        numberLabel += "s";
    }
    return [driverLabel, dayLabel, numberLabel];
}

function createPostCell(post, node) {
    var index = runTimeData.displayPost.length;
    runTimeData.displayPost.push(post);
    var labels = createHtmlCell(post);
    var str = '<div class="list-group-item d-flex justify-content-between align-items-center" onclick="onClickPost('
        + index + ')">' +
        labels[0] + '<br />'
        + labels[1] + '<br />'
        + post.time + '   ' + labels[2]
        + '<span class="badge badge-primary badge-pill">1</span></div>';
    node.append(str);
}

function onLogin() {
    if (runTimeData.login) {
        userData = { "login": false };
        localStorage.removeItem("session");
        localStorage.removeItem("userData");
        location.reload();
    } else {
        window.location.href = "/login.html";
    }
}

function appendTimeSelection(now) {
    var hour = 6;
    var min = 0;
    var sel = $("#time");
    var currentTime = now.getHours() * 60 + now.getMinutes();
    var time = hour * 60 + min;
    var op = null;
    while (hour < 24) {
        let h = hour;
        let str = hour >= 12 ? " pm" : " am";
        str = (min > 0 ? min : "00") + str;
        if (hour > 12) {
            h = hour - 12;
        }
        var label = h + ":" + str;
        sel.append("<option>" + label + "</option>");
        if (op == null && time > currentTime) {
            op = label;
        }
        min += 30;
        time += 30;
        if (min >= 60) {
            ++hour;
            min = 0;
        }
    }
    if (op == null) {
        op = "6:00 am";
    }
    sel.val(op);
}

function onTypeChanged() {
    $("#numberType").text($("#driver").prop("checked") ? "Seat number:" : "Passenger number");
}

function onNumberChanged() {
    $("#numberLabel").text($("#number").val());
}

function onPost() {

}
