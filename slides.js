$(document).ready(function() {
    var slideNum = $('.page').length,
      wrapperWidth = 100 * slideNum,
      slideWidth = 100 / slideNum;
    $('.container').width(wrapperWidth + '%');
    $('.page').width(slideWidth + '%');
  
    $('a.scrollitem').click(function() {
      $('a.scrollitem').removeClass('selected');
      $(this).addClass('selected');
  
      var slideNumber = $($(this).attr('href')).index('.page'),
        margin = slideNumber * -100 + '%';
  
      $('.container').animate({
        marginLeft: margin
      }, 700);
      return false;
    });
    $('.bar').mouseover(function() {
      $('.bar').css("background-color", "rgb(61, 61, 61)");
      $('.bar').css("width", "110px");
    });

    $('.bar').mouseout(function(){
      $('.bar').css("background-color", "black");
      $('.bar').css("width", "100px");
    });
  });