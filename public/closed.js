
// CLOSE WEBSITE ON WEEKEND
function closed() {
  var currentTime = new Date();
  var currentHour = currentTime.getHours();
  var isWeekend = currentTime.getDay()%6==0;


  if ((currentHour < 9) || (currentHour > 21) || isWeekend) {
    window.location.replace("/closed.html");
  }
}

var isClosed = window.location.href.indexOf('closed') == -1;
var notClosed = window.location.href.indexOf('closed') == 1;

if (isClosed) {
   closed();
} else {
  $('.mobile-menu').addClass('hide-menu');
}
