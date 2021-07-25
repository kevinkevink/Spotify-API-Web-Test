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
      }, 1000);
      return false;
    });
  });