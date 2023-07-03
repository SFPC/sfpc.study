




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

  // $(document).keypress(function(e) {
  //   if(e.which == 72) {
  //     console.log("hey")
  //   }
  // });

  // $("input").keypress(function() {
  // alert("hello.");
  // });



  $(document).on("click", ".accordionTitle" , function() {
  		$(this).siblings('.accordionContent').slideToggle();
  		$(this).toggleClass('contentOpen');
      $(this).children('.img').toggleClass('hide');
  	});


    $(document).on("click", ".line img" , function() {
        $(this).toggleClass('zoom');
    });
    // $(document).on("click", ".line img.zoom" , function() {
    //     $(".line img.zoom").removeClass('zoom');
    // });


           // $('.line img').click(function(){
           //      $(this).toggleClass('zoom');
           // });
           //

      // $( ".line img" ).each(function(index) {
      //   $(this).on("click", function(){
      //       $(this).toggleClass('zoom');
      //       });
      //
      //   });


    // $( ".line img.zoom" ).each(function(index) {
    // $(this).on("click", function(){
    //     $(this).removeClass('zoom');
    //     });
    // });





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


//   $(document).keypress(function(e) {
//   $(".terminal-content").append(contentAbout);
//   $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
//
//   if(e.which == 72) {
//
// alert("You pressed the \"Any\"-key.");
//     }
//
//
//   });

  $(document).keyup(function (e){

    if (e.keyCode == 65) { //A
      $(".terminal-content").append(contentAbout);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 49) { //1
      $(".terminal-content").append(contentAboutCredits);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 50) { //2
      $(".terminal-content").append(contentAboutContact);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 67) { //C
      $(".terminal-content").append(contentCalendar);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 86) { //V
      $(".terminal-content").append(contentVisit);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 51) { //3
      $(".terminal-content").append(contentVisitAccess);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }
    if (e.keyCode == 52) { //4
      $(".terminal-content").append(contentVisitCovid);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }
    if (e.keyCode == 53) { //5
      $(".terminal-content").append(contentVisitTech);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }
    if (e.keyCode == 54) { //6
      $(".terminal-content").append(contentVisitLibrary);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }
    if (e.keyCode == 55) { //7
      $(".terminal-content").append(contentVisitStore);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 71) { //G
      $(".terminal-content").append(contentGuestbook);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 72) { //H
      $(".terminal-content").append(contentHelp);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 80) { //P
      $(".terminal-content").append(contentPrint);
        $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
    }

    if (e.keyCode == 56) { //8
      print();
    }


  })



  $(document).on("click", ".link-about" , function() {
      $(".terminal-content").append(contentAbout);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-aboutCredits" , function() {
      $(".terminal-content").append(contentAboutCredits);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-aboutContact" , function() {
      $(".terminal-content").append(contentAboutContact);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-calendar" , function() {
      $(".terminal-content").append(contentCalendar);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");

  });

  $(document).on("click", ".link-visit" , function() {
      $(".terminal-content").append(contentVisit);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitAccess" , function() {
      $(".terminal-content").append(contentVisitAccess);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitCovid" , function() {
      $(".terminal-content").append(contentVisitCovid);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitTech" , function() {
      $(".terminal-content").append(contentVisitTech);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitLibrary" , function() {
      $(".terminal-content").append(contentVisitLibrary);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-visitStore" , function() {
      $(".terminal-content").append(contentVisitStore);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-guestbook" , function() {
      $(".terminal-content").append(contentGuestbook);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-help" , function() {
      $(".terminal-content").append(contentHelp);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
  });

  $(document).on("click", ".link-print" , function() {
      $(".terminal-content").append(contentPrint);
          $("html, body").animate({ scrollTop:$('.terminal-content .page').last().position().top  }, "slow");
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
