$(function(){
    getPlayerScores();
});

function getPlayerScores() {
    $.get( "http://cdn.55labs.com/demo/api.json", function( data ) {
        $( "#title" ).html( data.settings.label );
        $("#graph").append("<dd class='percentage percentage-"+Math.floor(601*100/1000)+"'><span class='text'>SADMI</span></dd>");
        alert( "Load was performed."+ Math.floor(601*100/1000));
      });
}