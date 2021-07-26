$(document).ready(function() {
    $('#Button').mouseover(function() {
        $('#Button').css("border", "solid");
        $('#Button').css("color", "grey");
      });
  
      $('#Button').mouseout(function(){
        $('#Button').css("border", "none");
        $('#Button').css("color", "lightgrey");
      });
});