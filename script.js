$(function () {
    getPlayersScores();
    range=0;
});


function getPlayersScores() {
    $.get("http://cdn.55labs.com/demo/api.json", function (data) {
        var players = getPlayers(data);
        var dates = getDates(data, range);

        for (dateIndex in dates) {
            var i = 0;
            for (var player in players) {
                i++;
                var score = players[player].points[dateIndex];
                if (score !== null) {
                    var percentage = Math.floor(score * 100 / 1000);
                    var date = dates[dateIndex]
                    date = date.slice(6, 8) + "-" + date.slice(4, 6) + "-" + date.slice(0, 4);
                    $(".chart").append("<div class='bar bar-" +
                        percentage + "'><span class='date'>"+date+"</span></div>");
                    var playerBarColor = "#" + intToRGB(hashCode(player));
                    $(".chart > div:nth-child("+ i +"n+1)").css("background-color", playerBarColor);
                }
            }
            var playersNumber = Object.keys(players).length;
            $(".chart > div:nth-child("+ playersNumber +"n+1)").css("margin-bottom", "10px");
        }

        $('div.bar').hover(function(){
            $(this).find(".date").css('visibility', 'visible');
        },    
        function(){
            $(this).find(".date").css('visibility', 'hidden');
        });
    });

    
}

function getPlayers(data) {
    var players = data.data.DAILY.dataByMember.players;
    return players;
}

function getDates(data, range) {
    var dates = data.data.DAILY.dates;
    var len = Object.keys(dates).length;
    dates = dates.slice(range*5, Math.min((range+1)*5, len) + 1);
    return dates;
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