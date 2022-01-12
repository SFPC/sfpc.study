
// CHECK MOBILE
let mobileBrowser = checkMobile()


// MODES CONTENT

let inCRT = 'you are in cathode-ray mode. switch to liquid crystal mode.'
let inLCD = 'you are in liquid crystal mode. switch to cathode-ray mode.'

if (checkMobile()) {
  inCRT = 'switch to liquid crystal mode'
  inLCD = 'switch to cathode-ray mode'
}

// var inCRT = 'switch to liquid crystal mode.'
// var inLDC = 'switch to cathode-ray mode.'
//
// if checkMobile() {
//   inCRT = 'switch to liquid crystal mode.'
//   inLDC = 'switch to cathode-ray mode.'
// } else {
//   inCRT = 'you are in cathode-ray mode. switch to liquid crystal mode.'
//   inLDC = 'you are in liquid crystal mode. switch to cathode-ray mode.'
// }






// CLOSE WEBSITE ON WEEKEND
function closed() {
  var currentTime = new Date();
  var currentHour = currentTime.getHours();
  var isWeekend = currentTime.getDay()%6==0;

  if ((currentHour < 9) || (currentHour > 19) || isWeekend) {
    window.location.replace("closed.html");
  }
}

var isClosed = window.location.href.indexOf('closed') == -1;
var notClosed = window.location.href.indexOf('closed') == 1;

if (isClosed) {
   // closed();
} else {
  $('.mobile-menu').addClass('hide-menu');
}




// ENTITY ACCORDION
(function($) {

  var allPanels = $('.accordion > .entity > dd').hide();

  $('.accordion > .entity > dt > h3, .accordion > .entity > dt > h4').click(function() {
      $this = $(this);
      $target =  $this.parent().next();

      $(this).addClass('active');
      $(this).parent().addClass('active');

      if(!$target.hasClass('active')){
         // allPanels.removeClass('active').slideUp();
         $target.addClass('active').slideDown();
      }

      $this.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });

    return false;
  });

})(jQuery);


// RANDOM CAROUSEL IMAGES (PARTICIPATE + SPACE)

let participateImages = [];
let participateImagesFeatured = [];
let spaceImages = [];
let spaceImagesFeatured = [];

for (let i = 0; i <= 4; i += 1) {
    participateImagesFeatured.push("images/community/featured/" + i.toString() + ".jpg");
}

for (let i = 0; i <= 2; i += 1) {
    spaceImagesFeatured.push("images/space/featured/" + i.toString() + ".jpg");
}

var pi1 = participateImagesFeatured[Math.floor( Math.random() * participateImagesFeatured.length )];
var si1 = spaceImagesFeatured[Math.floor( Math.random() * spaceImagesFeatured.length )];

for (var a=[],i=0;i<121;++i) a[i]=i; //community images
for (var b=[],i=0;i<17;++i) b[i]=i; //space images

function shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

a = shuffle(a);
b = shuffle(b);

for (let i = 0; i <= 9; i += 1) {
    spaceImages.push("images/space/" + b[i].toString() + ".jpg");
}

for (let i = 0; i <= 19; i += 1) {
    participateImages.push("images/community/" + a[i].toString() + ".jpg");
}

var c1 = participateImages[Math.floor( Math.random() * participateImages.length )];


$(".pi1 img").attr("src", pi1);
$(".pi2 img").attr("src", participateImages[2]);
$(".pi3 img").attr("src", participateImages[3]);
$(".pi4 img").attr("src", participateImages[4]);
$(".pi5 img").attr("src", participateImages[5]);
$(".pi6 img").attr("src", participateImages[6]);
$(".pi7 img").attr("src", participateImages[7]);
$(".pi8 img").attr("src", participateImages[8]);
$(".pi9 img").attr("src", participateImages[9]);
$(".pi10 img").attr("src", participateImages[10]);
$(".pi11 img").attr("src", participateImages[11]);
$(".pi12 img").attr("src", participateImages[12]);
$(".pi13 img").attr("src", participateImages[13]);
$(".pi14 img").attr("src", participateImages[14]);
$(".pi15 img").attr("src", participateImages[15]);
$(".pi16 img").attr("src", participateImages[16]);
$(".pi17 img").attr("src", participateImages[17]);
$(".pi18 img").attr("src", participateImages[18]);
$(".pi19 img").attr("src", participateImages[19]);

$(".si1 img").attr("src", si1);
$(".si2 img").attr("src", spaceImages[2]);
$(".si3 img").attr("src", spaceImages[3]);
$(".si4 img").attr("src", spaceImages[4]);
$(".si5 img").attr("src", spaceImages[5]);
$(".si6 img").attr("src", spaceImages[6]);
$(".si7 img").attr("src", spaceImages[7]);
$(".si8 img").attr("src", spaceImages[8]);
$(".si9 img").attr("src", spaceImages[9]);
$(".si10 img").attr("src", spaceImages[10]);


$("img.c1").attr("src", c1);



// ROTATE HEADERS

(function($) {
$( document ).ready(function() {
    $('h1').each(function( index ) {
        var a = Math.random() * 10 - 5;
        $(this).css('transform', 'rotate(' + a + 'deg)');})
    });
})(jQuery);

(function($) {
$( document ).ready(function() {
    $('.mobile-menu').each(function( index ) {
        var a = Math.random() * 10 - 8;
        $(this).css('transform', 'rotate(' + a + 'deg)');})
    });
})(jQuery);

(function($) {
$( document ).ready(function() {
    $('.mobile-menu-content h2').each(function( index ) {
        var a = Math.random() * 10 - 5;
        $(this).css('transform', 'rotate(' + a + 'deg)');})
    });
})(jQuery);



// MOBILE WINDOW SIZE RESET

function resetHeight(){
    document.body.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resetHeight);
resetHeight();



/////////////////////// SCROLL //////////////////////////


// SMOOTH SCROLL TO TOP
$(".top").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});

$(window).scroll(function(){
      var scrollTop = $(window).scrollTop();
});


// SMOOTH SCROLL TO COST SECTION
$(".more-about-cost").click(function() {
  document.getElementById('section-cost').scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
});

// SMOOTH SCROLL TO CITATIONS

$(".cit-1").click(function() {
  document.getElementById('ref-1').scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
});

$(".cit-2").click(function() {
  document.getElementById('ref-2').scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
});

$(".cit-3").click(function() {
  document.getElementById('ref-3').scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
});

$(".cit-4").click(function() {
  document.getElementById('ref-4').scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
});


// SMOOTH SCROLL TO DROPDOWN SECTIONS
function sectionJump(value){
	document.getElementById(value).scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
}

// SHOW APPLY ON SCROLL
$('.shell').scroll(function () {
    var y = $(this).scrollTop();
    if (y > 800) {
      $('.fixed-apply').removeClass('hide-apply');
    } else {
      $('.fixed-apply').addClass('hide-apply');
    }

    if (y > 200 && !mobileBrowser) {
      $('.breadcrumb').addClass('fixed');
    } else {
      $('.breadcrumb').removeClass('fixed');
    }
  });




$('#shell').bind('scroll', function()
{

  // if (!$(this).hasClass("test")) {

  let mobileBrowser = checkMobile();

  if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight && !$(this).hasClass("home") && !mobileBrowser)
  {
    $('#allSections').addClass('hide-apply');
    $('.website-grid').removeClass('grid-hide');
    $('#inner-footer').addClass('hide-apply');
    // $('.fixed-apply').addClass('hide-apply');
    $('.breadcrumb').addClass('hide-apply');
  } else {
    $('#allSections').removeClass('hide-apply');
    $('.website-grid').addClass('grid-hide');
    $('#inner-footer').removeClass('hide-apply');
    // $('.fixed-apply').removeClass('hide-apply');
    $('.breadcrumb').removeClass('hide-apply');
  }
});


/////////////////////// ON LOAD //////////////////////////

$(window).on("load", function() {
});


$(document).ready(function() {
  $(".animsition").animsition({
    inClass: 'zoom-in',
    outClass: 'zoom-out',
    inDuration: 1500,
    outDuration: 800,
    linkElement: '.animsition-link',
    // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
    loading: true,
    loadingParentElement: 'body', //animsition wrapper element
    loadingClass: 'animsition-loading',
    loadingInner: '', // e.g '<img src="loading.svg" />'
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: [ 'animation-duration', '-webkit-animation-duration'],
    // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
    // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
    overlay : false,
    overlayClass : 'animsition-overlay-slide',
    overlayParentElement : 'body',
    transition: function(url){ window.location.href = url; }
  });
});

/////////////////////// DOCU READY //////////////////////////
// setTimeout("closed()", 1);

$(document).ready(function() {

        // WEB GRID ASCII
        $('.chars1').html(makeChars(2000));
        $('.chars2').html(makeChars(2000));
        $('.chars3').html(makeChars(2000));
        $('.chars4').html(makeChars(2000));


        // INTRO BIO EXPAND
        $("span.expand").click(function() {
          $(this).children("span.expanded").toggleClass('hide-expanded');
          $(this).toggleClass('active');

          $("span.expand").not(this).removeClass('active');
          $("span.expand").not(this).children("span.expanded").addClass('hide-expanded');

        });



        // DO IF MOBILE
          // let mobileBrowser = checkMobile()
          // if(mobileBrowser){
          // }






        // RANDOM POETIC COMPUTATION

          var poeticcomputation = [
                 "Poetic computation is a relational practice organized around communal study."
               , "Poetic computation is an act of resistance against utilitarian notions of progress and efficiency."
               , "Poetic computation begins with the interfacing between two or more beings."
               , "Poetic computation engages the computer as a medium for critical and artistic expression."
               , "Poetic computation is both an aesthetic and affective experience of code."
               , "Poetic computation can’t be separated from its historical, political and social impact."
               , "Poetic computation is when technology is used for critical thinking and aesthetic inquiry."
               , "Poetic computation is a colorful theory of culpability."
          ];

          randDef = poeticcomputation[Math.floor( Math.random() * poeticcomputation.length )];
          $('#definition').text(randDef);
          $('#marquee-definition').text(randDef);

          $(".def-div").click(function() {
            $('#definition').text(poeticcomputation[Math.floor( Math.random() * poeticcomputation.length )]);
          });




          $(".expand-intro").click(function() {
              $(".expanded-intro").removeClass('hide-expanded');
              $(".expand-intro").addClass('hide-expanded');
          });




        // TESTIMONIALS + PHOTOS TOGGLE

          $(".testimonials").click(function() {
              $(".participate-img").addClass('hide').removeClass('show').addClass('hide-test').removeClass('show-test');
              $(".test").addClass('show-test').removeClass('hide-test');
              $("#test-text").addClass('hide-text');
              $("#photos-text").removeClass('hide-text');
              slider.scrollLeft = 0;
              slider2.scrollLeft = 0;
              slider3.scrollLeft = 0;

              document.getElementById('participate-archive').scrollIntoView({
                block: 'start',
                behavior: 'smooth',
              });

          });

          $(".participate-photos").click(function() {
              $(".participate-img").addClass('show').removeClass('hide').addClass('show-test').removeClass('hide-test');
              $(".test").addClass('hide-test').removeClass('show-test');
              $("#test-text").removeClass('hide-text');
              $("#photos-text").addClass('hide-text');
              slider.scrollLeft = 0;
              slider2.scrollLeft = 0;
              slider3.scrollLeft = 0;

              document.getElementById('participate-archive').scrollIntoView({
                block: 'start',
                behavior: 'smooth',
              });
          });



        // MOBILE MENU

          $(".mobile-menu").click(function() {
              // $(".shell").addClass('shell-halfsize').removeClass('shell-fullsize');
              $(".shell").toggleClass('shell-halfsize');
              $(".shell").toggleClass('shell-fullsize');
              $(".crt-overlay").toggleClass('crt-overlay-halfsize');
              $(".crt-overlay").toggleClass('crt-overlay--fullsize');
              $(".mobile-menu-content").toggleClass('mobile-menu-content-show');

              if ($(".mobile-menu").text() == "Menu") {
                $(".mobile-menu").text("Close");
            } else {
                $(".mobile-menu").text("Menu");
            };

          });



        // ADD UNDERLINE TO MENU BASED ON LINK


        if ($('.breadcrumb:contains("participate")').length > 0) {
            $('a#link-participate').addClass('underline');
        }

        if ($('.breadcrumb:contains("about")').length > 0) {
            $('a#link-about').addClass('underline');
        }
        //
        // if (window.location.href.indexOf("about") > -1) {
        //     $('#link-about').addClass('underline');
        // }
        //
        // if (window.location.href.indexOf("participate") > -1) {
        //     $('#link-participate').addClass('underline');
        // }




        // MODE TEXT

          if (modeStyles.href.includes('lcd')) {
            themeToggle.innerText = inLCD
            $('#current-mode').html('liquid crystal')
          } else {
            themeToggle.innerText = inCRT
            $('#current-mode').html('cathode-ray')
          }




        // FEATURED DIV LINK

            $(".featured").click(function() {
            window.location = $(this).find("a").attr("href");
            });

            $(".featured h2, .featured h6, .featured h4").click(function() {
            window.location = $(this).parent().closest('div').find("a").attr("href");
            });



        // SCROLL ON MOBILE

            $(window).scroll(function() {
                    let mobileBrowser = checkMobile();
                    if(mobileBrowser){
                    }
                    else{
                    }
            });




            // $("a.link-show-grid").click(function() {
            // $('body .website-grid').removeClass('grid-hide');
            // });
            //
            // $(".website-grid").click(function() {
            // $('.website-grid').addClass('grid-hide');
            // });


            $('.link-show-grid').hover(
                function(){
                   $('.website-grid').removeClass('grid-hide');
                },
                function(){
                    $('.website-grid').addClass('grid-hide');
               }
);



});









// RANDOM CHARACTERS

function makeChars(length) {
    var result           = '';
    var characters       = ',·*.◌▫◦........';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}





// CHECK MOBILE


function checkMobile(){
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}




// SIDE MODES

const modeStyles = document.getElementById('mode');
const storedTheme = localStorage.getItem('mode');
  if(storedTheme){
      modeStyles.href = storedTheme;
}
const themeToggle = document.getElementById('mode-toggle');
const currentMode = document.getElementById('current-mode');

document.addEventListener('DOMContentLoaded', () => {

  themeToggle.addEventListener('click', () => {
    if (modeStyles.href.includes('lcd')) {
      modeStyles.href = 'crt.css';
      // $('#shell').addClass('crt');
      themeToggle.innerText = inCRT;
    } else {
      modeStyles.href = 'lcd.css';
      themeToggle.innerText = inLCD;
    }
    localStorage.setItem('mode',modeStyles.href)
  })
});
