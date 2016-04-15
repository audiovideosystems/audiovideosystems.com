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

  // for flickity: this belongs in a partial

    var utils = window.fizzyUIUtils;
    var flkty = new Flickity( '.main-carousel', {
      imagesLoaded: true,
      percentPosition: false,
      prevNextButtons: false,
      autoPlay: true
    });

  var caption = document.querySelector('.caption');
  flkty.on( 'cellSelect', function() {
    // set image caption using img's alt
    utils.setText( caption, flkty.selectedElement.alt );
  });


  // centered nav
  // $(window).resize(function() {
  //   var more = document.getElementById("js-centered-more");
  //   var windowWidth = $(window).width();
  //   var moreLeftSideToPageLeftSide = $(more).offset().left;
  //   var moreLeftSideToPageRightSide = windowWidth - moreLeftSideToPageLeftSide;

  //   if (moreLeftSideToPageRightSide < 330) {
  //     $("#js-centered-more .submenu .submenu").removeClass("fly-out-right");
  //     $("#js-centered-more .submenu .submenu").addClass("fly-out-left");
  //   }

  //   if (moreLeftSideToPageRightSide > 330) {
  //     $("#js-centered-more .submenu .submenu").removeClass("fly-out-left");
  //     $("#js-centered-more .submenu .submenu").addClass("fly-out-right");
  //   }
  // });

  // $(document).ready(function() {
  //   $(window).trigger("resize");
  //   var menuToggle = $("#js-centered-navigation-mobile-menu").unbind();
  //   $("#js-centered-navigation-menu").removeClass("show");

  //   menuToggle.on("click", function(e) {
  //     e.preventDefault();
  //     $("#js-centered-navigation-menu").slideToggle(function(){
  //       if($("#js-centered-navigation-menu").is(":hidden")) {
  //         $("#js-centered-navigation-menu").removeAttr("style");
  //       }
  //     });
  //   });
  // });


})();