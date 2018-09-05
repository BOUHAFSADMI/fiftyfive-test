var range = 0;
var data;

$(() => {
    drawPlayersScores();
    onNextClicked(30);
    onPreviousClicked();
});


class Tour {
    constructor(player, date, score) {
        this.date = date;
        this.player = player;
        this.score = score;

        this.element = $("<div class='tooltip bar bar-" +
            this.calculatePercentage() + "'><span class='tooltiptext'>" +
            this.date + "</span></div>").appendTo(".chart").get(0);
        this.element.addEventListener("click", this, false);
    }

    calculatePercentage() {
        var percentage = Math.floor(this.score * 100 / 1000);
        return percentage;
    }
}


Tour.prototype.handleEvent = function (e) {
    switch (e.type) {
        case "click":
            this.click(e);
    }
}

Tour.prototype.click = function (e) {
    showBarDetails(this.player, this.date, this.score);
}


async function getData() {
    var data = await $.get("http://cdn.55labs.com/demo/api.json");
    return data;
}

async function drawPlayersScores() {
    data = await getData();
    playersScores = getPlayersScores(data);
    dates = getDates(data, range);
    playersInfo = getPlayersInfo(data);
    drawPlayersColors(playersScores);
    drawChartBars(playersScores, playersInfo, dates);
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

function drawChartBars(playersScores, playersInfo, dates) {
    for (dateIndex in dates) {
        var date = dates[dateIndex];
        if (date != null) {
            date = date.slice(6, 8) + "-" + date.slice(4, 6) + "-" + date.slice(0, 4);
            var i = 0;
            for (var player in playersScores) {
                i++;
                var index = parseInt(dateIndex) + 5 * range;
                var score = playersScores[player].points[index];
                new Tour(playersInfo[player], date, score);
                var playerBarColor = "#" + intToRGB(hashCode(player));
                $(".chart > div:nth-child(" + i + "n)").css("background-color", playerBarColor);
            }
        }
        var playersNumber = Object.keys(playersScores).length;
        $(".chart > div:nth-child(" + playersNumber + "n)").css("margin-bottom", "10px");
    }
}

function cleanChartBars() {
    $(".chart").empty();
    $(".playersList").empty();
    $(".details h4").empty();
}

function showBarDetails(player, date, score) {
    $(".details h4").empty();
    $("#name").html("Player: " + player.firstname + " " + player.lastname);
    $("#date").html("Date: " + date);
    $("#score").html("Score: " + score);
}

function getPlayersScores(data) {
    var playersScores = data.data.DAILY.dataByMember.players;
    return playersScores;
}

function getPlayersInfo() {
    var playersInfo = data.settings.dictionary;
    return playersInfo;
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