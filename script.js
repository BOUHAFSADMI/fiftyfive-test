var range = 0;
var data;

$(() => {
    drawPlayersScores();
    onNextClicked(30);
    onPreviousClicked();
});

class Score {
    constructor(date, value) {
        this.date = date;
        this.value = value;
    }
}

class Player {
    constructor(firstname, lastname, scores) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.scores = scores;
    }
}

async function getData() {
    var data = await $.get("http://cdn.55labs.com/demo/api.json");
    return data;
}

async function drawPlayersScores() {
    data = await getData();
    players = getPlayers(data);
    dates = getDates(data, range);
    drawPlayersColors(players);
    drawChartBars(players, dates);
    showBarDetails();
}


function drawPlayersColors(players) {
    for (player in players) {
        showPalyerColor(player);
    }
}

function getDataLenght(data) {
    var dates = data.data.DAILY.dates;
    var len = Object.keys(dates).length;
    return len;
}


function onNextClicked(len) {
    $("#next").click(() => {
        if ((range + 1) * 5 < len) {
            range++;
            $("#previous").css({ "background": "#dd3843", "color": "white" });
            if ((range + 1) * 5 >= len) {
                $("#next").css({ "background": "#f1f1f1", "color": "black" });
            }
            cleanChartBars();
            drawPlayersScores();
        }
    });
}

function onPreviousClicked() {
    $("#previous").click(() => {
        if (range - 1 >= 0) {
            range--;
            $("#next").css({ "background": "#dd3843", "color": "white" });
            if (range - 1 < 0) {
                $("#previous").css({ "background": "#f1f1f1", "color": "black" });
            }
            cleanChartBars();
            drawPlayersScores();
        }
    });
}

function drawChartBars(players, dates) {
    for (dateIndex in dates) {
        var date = dates[dateIndex];
        if (date != null) {
            date = date.slice(6, 8) + "-" + date.slice(4, 6) + "-" + date.slice(0, 4);
            console.log(dateIndex, date);
            var i = 0;
            for (var player in players) {
                i++;
                var index = parseInt(dateIndex) + 5 * range;
                var score = players[player].points[index];
                var scorePercentage = Math.floor(score * 100 / 1000);
                $(".chart").append("<div class='tooltip bar bar-" +
                    scorePercentage + "'><span class='tooltiptext'>" + date + "</span></div>");
                var playerBarColor = "#" + intToRGB(hashCode(player));
                $(".chart > div:nth-child(" + i + "n)").css("background-color", playerBarColor);
            }
        }
        var playersNumber = Object.keys(players).length;
        $(".chart > div:nth-child(" + playersNumber + "n)").css("margin-bottom", "10px");
    }
}

function cleanChartBars() {
    $(".chart").empty();
    $(".playersList").empty();
    $(".details h5").empty();
}

function showBarDetails() {
    $(".bar").click(() => {
        $("#name").html("Player: ");
        $("#date").html("Date: ");
        $("#score").html("Score: ");
        $("#rank").html("Rank: ");
    });
}

function getPlayers(data) {
    var players = data.data.DAILY.dataByMember.players;
    return players;
}

function getDates(data) {
    var dates = data.data.DAILY.dates;
    var len = getDataLenght(data);
    dates = dates.slice(range * 5, Math.min((range + 1) * 5, len));
    return dates;
}


function showPalyerColor(player) {
    var playerBarColor = "#" + intToRGB(hashCode(player));
    $(".playersList").append("<li><span id='" + player + "'>" + player + "</span></li><br>");
    $("#" + player).css("background", playerBarColor);
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