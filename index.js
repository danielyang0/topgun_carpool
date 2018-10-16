function onLoad() {
    $("#driver").prop("checked", true);
    $("#number").val("1");
    onTypeChanged();
    onNumberChanged();
    var now = new Date();
    appendTimeSelection(now);
    var min = now.toISOString().substr(0, 10);
    now.setMonth(now.getMonth() + 1);
    var max = now.toISOString().substr(0, 10);
    var dl = $("#date");
    dl.val(min);
    dl.prop("min", min);
    dl.prop("max", max);
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
    sel.val(op);
}

function onTypeChanged() {
    $("#numberType").text($("#driver").prop("checked") ? "Seat number:" : "Passenger number");
}

function onNumberChanged() {
    $("#numberLabel").text($("#number").val());
}