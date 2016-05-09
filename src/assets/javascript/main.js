(function() {

  $('input,textarea').focus(function(){
     $(this).data('placeholder',$(this).attr('placeholder'))
            .attr('placeholder','');
  }).blur(function(){
     $(this).attr('placeholder',$(this).data('placeholder'));
  });

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
      console.log('up to 768px wide');
      var main = $('main');
      setTimeout(function(){
        $(main).fadeIn().removeClass('load').addClass('loaded');
      }, 250);
    },
    unmatch : function() {
    }
  })
  .register("screen and (min-width: 48.1em)", {
    match : function() {
      console.log('over 768px wide');

      var main = $('main');
      setTimeout(function(){
        $(main).fadeIn().removeClass('load').addClass('loaded');
      }, 250);

      var windowWidth = $(window).width(); // for resize function

      // on resize
        window.onresize = function(){
          // actual resize? http://tinyurl.com/qaoajzu
          if ($(window).width() != windowWidth) {
            unless (window.location !== window.parent.location) {
              console.log('not iframe');
              window.location.reload();
            }
          }
        };

    },
    unmatch : function() {
    }
  });

  // email signups
  var $emailList = $('#email-list');
  $emailList.submit(function(e) {
    e.preventDefault();
    $.ajax({
      url: '//formspree.io/test@test.com',
      method: 'POST',
      data: $(this).serialize(),
      dataType: 'json',
      beforeSend: function() {
        $emailList.append('<div class="alert alert--loading">Sending…</div>');
      },
      success: function(data) {
        $emailList.find('.alert--loading').hide();
        $emailList.find('button[type=submit]').prop('disabled', true);
        $emailList.append('<div class="alert alert--success">All set, you\'re subscribed!</div>');
      },
      error: function(err) {
        $contactForm.find('.alert--loading').hide();
        $contactForm.append('<div class="alert alert--error">Oops, there was an error. Try again?</div>');
      }
    });
  });

  // centered nav
  $(window).on("load resize",function(e) {
    var more = document.getElementById("js-centered-more");

    if ($(more).length > 0) {
      var windowWidth = $(window).width();
      var moreLeftSideToPageLeftSide = $(more).offset().left;
      var moreLeftSideToPageRightSide = windowWidth - moreLeftSideToPageLeftSide;

      if (moreLeftSideToPageRightSide < 330) {
        $("#js-centered-more .submenu .submenu").removeClass("fly-out-right");
        $("#js-centered-more .submenu .submenu").addClass("fly-out-left");
      }

      if (moreLeftSideToPageRightSide > 330) {
        $("#js-centered-more .submenu .submenu").removeClass("fly-out-left");
        $("#js-centered-more .submenu .submenu").addClass("fly-out-right");
      }
    }

    var menuToggle = $("#js-centered-navigation-mobile-menu").unbind();
    $("#js-centered-navigation-menu").removeClass("show");

    menuToggle.on("click", function(e) {
      e.preventDefault();
      $("#js-centered-navigation-menu").slideToggle(function(){
        if($("#js-centered-navigation-menu").is(":hidden")) {
          $("#js-centered-navigation-menu").removeAttr("style");
        }
      });
      // $('.home .centered-navigation').toggleClass('bg');
      // $('.centered-navigation').toggleClass('short');
      setTimeout(function(){
        $('.centered-navigation').toggleClass('short');
        $('.home .centered-navigation').toggleClass('bg');
        $('img.arrow').toggleClass('hide');
      }, 250);
    });
  });



})();