
// ROTATE TOPICS

(function($) {
$( document ).ready(function() {
    $('.topic').each(function( index ) {
        var a = Math.random() * 40 - 20;
        $(this).css('transform', 'rotate(' + a + 'deg)');})
    });
})(jQuery);




$(document).ready(function() {

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


});
