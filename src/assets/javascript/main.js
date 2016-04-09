(function() {

  // visual grid: use 'g' key to toggle body class
  var k = new Kibo();
  k.down(['g'], function() {
    $('body').addClass('grid');
  }).up('g', function() {
    $('body').removeClass('grid');
  });

  // enquire: media queries, but for javascript
  enquire.register("screen and (max-width: 48em)", {
    match : function() {
      console.log('up to 768px wide')
    },
    unmatch : function() {
    }
  })
  .register("screen and (min-width: 48.1em)", {
    match : function() {
      console.log('over 768px wide')
    },
    unmatch : function() {
    }
  });

  // mobile nav button
    $(document).ready(function() {
  var menuToggle = $('#js-mobile-menu').unbind();
  $('#js-navigation-menu').removeClass("show");

  menuToggle.on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });
});

})();