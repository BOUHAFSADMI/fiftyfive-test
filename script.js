$(function () {
    getPlayerScores();
});

function getPlayerScores() {
    $.get("http://cdn.55labs.com/demo/api.json", function (data) {
        $("#title").html(data.settings.label);
        for (var player in data.data.DAILY.dataByMember.players) {
            var score = data.data.DAILY.dataByMember.players[player].points[0];
            if (score != null) {
                var percentage = Math.floor(score * 100 / 1000);
                var date = data.data.DAILY.dates[0]
                date = date.slice(0, 4) + "-" + date.slice(5, 6) + "-" + date.slice(7, 8);
                $("#graph").append("<dd class='percentage percentage-"
                    + percentage + "'><span class='text'>" + player + " " + date + "</span></dd>");
             }
        }
    });
}


function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}