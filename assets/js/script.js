var range = 0;
var data;

$(() => {
    drawBarChart();
});

/**
 * @function
 * draws a bar chart
 */
async function drawBarChart() {
    data = await getData();
    drawPlayersScores();
    var len = getDataLenght();
    onNextClicked(len);
    onPreviousClicked();
}

/**
 * @function
 * draw the players scores over time
 */
function drawPlayersScores() {
    var playersScores = getPlayersScores();
    var playersInfo = getPlayersInfo();
    var dates = getDates(range);
    drawChartBars(playersScores, playersInfo, dates);
    drawPlayersColors(playersScores);
}


/**
 * @class
 * @attribute {Object} player - object containing disrname and last name
 * @attribute {string} date - date of the game tour
 * @attribute {string} score - score of the player in this date
 * @attribute {integer} index - index of the score or the date
 */
class Tour {
    constructor(player, date, score, index) {
        this.date = date;
        this.player = player;
        this.score = score;
        this.index = index;

        // create the elemnt in the DOM
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
    document.location.hash = "index=" + this.index + "&user=" + this.player.firstname;
}

/**
 * @function
 * @returns {JSON} data - json object of palyers scores in each date
 */
async function getData() {
    var data = await $.get("http://cdn.55labs.com/demo/api.json");
    return data;
}


/**
 * @function
 * @param {Array} players - arrayy of players 
 */
function drawPlayersColors(players) {
    for (player in players) {
        showPalyerColor(player);
    }
}

/**
 * @function
 * @returns {Integer} len - Number of scores/dates
 */
function getDataLenght() {
    var dates = data.data.DAILY.dates;
    var len = Object.keys(dates).length;
    return len;
}

/**
 * @function 
 * shows the next 5 scores
 * @param {Integer} len - the lenght of data to show
 */
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

/**
 * @function
 * shows the previous 5 scores
 */
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

/**
 * 
 * @param {Array} playersScores - array of players scores 
 * @param {Array} playersInfo - array of players infomation
 * @param {Array} dates - array of dates
 */
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
                var thePlayer = playersInfo[player];
                new Tour(thePlayer, date, score, index);
                // create a color from player username
                var playerBarColor = "#" + intToRGB(hashCode(player));
                $(".chart > div:nth-child(" + i + "n)").css("background-color", playerBarColor);
            }
        }
        var playersNumber = Object.keys(playersScores).length;
        $(".chart > div:nth-child(" + playersNumber + "n)").css("margin-bottom", "10px");
    }
}

/**
 * @function
 * clean the chart, players list, details and url hash
 */
function cleanChartBars() {
    $(".chart").empty();
    $(".playersList").empty();
    $(".details h4").empty();
    document.location.hash = "";
}

/**
 * 
 * @param {Object} player - player object contains first/last name 
 * @param {string} date - date when the score is gotten
 * @param {Integer} score - score of the player
 */
function showBarDetails(player, date, score) {
    $(".details h4").empty();
    $("#name").html("Player: " + player.firstname + " " + player.lastname);
    $("#date").html("Date: " + date);
    $("#score").html("Score: " + score);
}

/**
 * @function
 * @returns {Array} - array of players scores 
 */
function getPlayersScores() {
    var playersScores = data.data.DAILY.dataByMember.players;
    return playersScores;
}

/**
 * @function
 * get players informations
 * @returns {Array} - array of player objects
 */
function getPlayersInfo() {
    var playersInfo = data.settings.dictionary;
    return playersInfo;
}

/**
 * @function
 * @returns {Array} - array of dates of scores
 */
function getDates() {
    var dates = data.data.DAILY.dates;
    var len = getDataLenght(data);
    dates = dates.slice(range * 5, Math.min((range + 1) * 5, len));
    return dates;
}

/**
 * @function
 * @param {string} player - name of the player
 */
function showPalyerColor(player) {
    var playerBarColor = "#" + intToRGB(hashCode(player));
    $(".playersList").append("<li><span id='" + player + "'>" + player + "</span></li><br>");
    $("#" + player).css("background", playerBarColor);
}

/**
 * @function
 * @param {string} str - the string to transform to a hash
 * @returns {Integer} - hash of the string
 */
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

/**
 * @function
 * @param {Integer} i - hash of a string
 * @returns {string} - the color hexa  code
 *  
 */
function intToRGB(i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}