






var d = new Date();

function formatDate(d){
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[d.getDay()] + ", " + months[d.getMonth()] + " " + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + ", " + d.getFullYear();
}

function calcTime(offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

    // return time as a string
    return nd.toLocaleString();
}





$(document).ready(function() {


  $(document).on("click", ".accordionTitle" , function() {
  		$(this).siblings('.accordionContent').slideToggle();
  		$(this).toggleClass('contentOpen');
  	});


  var contentAbout = $('#content-about').html();
  var contentCalendar = $('#content-calendar').html();
  var contentVisit = $('#content-visit').html();
  var contentGuestbook = $('#content-guestbook').html();
  var contentHelp = $('#content-help').html();
  var contentPrint = $('#content-print').html();

  var lastDiv = $('.terminal .page').last();
  var lastDivHeight = $(lastDiv).height();
  var goToLast = $(document).height() - lastDivHeight;

  $(".link-about").click(function() {
      $(".terminal").append(contentAbout);
      $("#content-about.load-content").remove();
      $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");



  });

  $(".link-calendar").click(function() {
      $(".terminal").append(contentCalendar);
      $(".hide-content #content-calendar").remove();
      $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");

  });

  $(".link-visit").click(function() {
      $(".terminal").append(contentVisit);
      $("#content-visit").removeClass("load-content").addClass("show-content");
      $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(".link-guestbook").click(function() {
      $(".terminal").append(contentGuestbook);
      $("#content-guestbook").removeClass("load-content").addClass("show-content");
      $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(".link-help").click(function() {
      $(".terminal").append(contentHelp);
      $("#content-help").removeClass("load-content").addClass("show-content");
      $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(".link-print").click(function() {
      $(".terminal").append(contentPrint);
      $("#content-print").removeClass("load-content").addClass("show-content");
      $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });



var time = calcTime('0');

$('#date').html(formatDate(d));


});

//
// $(document).bind('keydown', function(e) {
//
//   var contentAbout = $('#content-about').html();
//   var contentCalendar = $('#content-calendar').html();
//   var contentVisit = $('#content-visit').html();
//   var contentGuestbook = $('#content-guestbook').html();
//   var contentHelp = $('#content-help').html();
//   var contentPrint = $('#content-print').html();
//
//   if (e.keyCode == 72) {
//       // press the letter H
//       $(".terminal").append(contentAbout);
//   } else if (e.keyCode == 74) {
//       //press the letter J
//       $(".terminal").append(contentVisit);
//   }
//   return false;
// });​
