
// ROTATE TOPICS

(function($) {
$( document ).ready(function() {
    $('.topic').each(function( index ) {
        var a = Math.random() * 40 - 20;
        $(this).css('transform', 'rotate(' + a + 'deg)');})
    });
})(jQuery);




// var randomMoveRate = Math.random(500, 1000);
var moveRate = 70;

function startMoving(img, rate) {
    var img$ = $(img);
    var imgWidth = img$.width();
    var screenWidth = $(window).width();
    var amount = screenWidth - (parseInt(img$.css("left"), 10) || 0);
    // if already past right edge, reset to
    // just left of left edge
    if (amount <=0 ) {
        img$.css("left", -imgWidth);
        amount = screenWidth + imgWidth;
        randomMoveRate =  Math.random(500, 1000);

        $('img.mover').each(function () {
          var curSrc = $(this).attr('src');
          if ( curSrc === 'http://photos.smugmug.com/photos/344291068_HdnTo-Ti.jpg' ) {

              $(this).attr('src',
              'http://photos.smugmug.com/photos/344290962_h6JjS-Ti.jpg');
          }
        });

    }

    var moveRate = 70;
    var time = amount * screenWidth / moveRate;
    img$.stop(true)
        .animate({left: "+=" + amount}, time, "linear", function() {
            // when animation finishes, start over
            startMoving(this);
        })
}



$(document).ready(function() {

    $(".mover").removeClass('hide');

        // $("#shell").append(
        //   '<img class="mover mover-one" onload="startMoving(this)" src="/images/sessions/sex-ed/bg1.jpg" border="0">
        //   ');
        //
        //   $("#shell").append(
        //     '<img class="mover mover-two" onload="startMoving(this)" src="/images/sessions/sex-ed/bg2.jpg" border="0">
        //     ');
        //     $("#shell").append(
        //       '<img class="mover mover-three" onload="startMoving(this)" src="/images/sessions/sex-ed/bg3.jpg" border="0">
        //       ');



        $(".mover-one").each(function() {
            startMoving(this, 50);
        });

        $(".mover-two").each(function() {
            startMoving(this, 70);
        });

        $(".mover-three").each(function() {
            startMoving(this, 200);
        });

        // readjust if window changes size
        $(window).resize(function() {
            $(".mover-one").each(function() {
                startMoving(this, 50);
            });

            $(".mover-two").each(function() {
                startMoving(this, 70);
            });

            $(".mover-three").each(function() {
                startMoving(this, 200);
            });
        });


        // INTRO BIO EXPAND
        $(".question").click(function() {
          $(this).children("p").toggleClass('hide');
          // $(this).children(".full-question").removeClass('hide');
          // $(this).children(".excerpt").addClass('hide');
          // $(this).toggleClass('active');


          // $(".full-question").not(this).removeClass('hide');


          // $("question").not(this).removeClass('hide');
          // $("question").not(this).children("span").addClass('hide');

        });

        $(".response-field").click(function() {
          $(this).toggleClass("expanded");
        });




});


 
