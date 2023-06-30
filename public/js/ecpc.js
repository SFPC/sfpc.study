






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
  var contentAboutCredits = $('#content-aboutCredits').html();
  var contentAboutContact = $('#content-aboutContact').html();
  var contentCalendar = $('#content-calendar').html();
  var contentVisit = $('#content-visit').html();
  var contentVisitAccess = $('#content-visitAccess').html();
  var contentVisitCovid = $('#content-visitCovid').html();
  var contentVisitTech = $('#content-visitTech').html();
  var contentVisitLibrary = $('#content-visitLibrary').html();
  var contentVisitStore = $('#content-visitStore').html();
  var contentGuestbook = $('#content-guestbook').html();
  var contentHelp = $('#content-help').html();
  var contentPrint = $('#content-print').html();

  var lastDiv = $('.terminal .page').last();
  var lastDivHeight = $(lastDiv).height();
  var goToLast = $(document).height() - lastDivHeight;




  $(document).on("click", ".link-about" , function() {
      $(".terminal").append(contentAbout);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-aboutCredits" , function() {
      $(".terminal").append(contentAboutCredits);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-aboutContact" , function() {
      $(".terminal").append(contentAboutContact);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-calendar" , function() {
      $(".terminal").append(contentCalendar);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");

  });

  $(document).on("click", ".link-visit" , function() {
      $(".terminal").append(contentVisit);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitAccess" , function() {
      $(".terminal").append(contentVisitAccess);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitCovid" , function() {
      $(".terminal").append(contentVisitCovid);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitTech" , function() {
      $(".terminal").append(contentVisitTech);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitLibrary" , function() {
      $(".terminal").append(contentVisitLibrary);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitStore" , function() {
      $(".terminal").append(contentVisitStore);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-guestbook" , function() {
      $(".terminal").append(contentGuestbook);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-help" , function() {
      $(".terminal").append(contentHelp);
          $("html, body").animate({ scrollTop:$('.terminal .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-print" , function() {
      $(".terminal").append(contentPrint);
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
