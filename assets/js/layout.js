$(function() {

  var current_scrollY_start = $(window).scrollTop();

  function preSetScript(){

    // スクロール + ウィンドウサイズ系の対策処理
    function scrollAnimationSet(target) {
      const scButtonWrap = $('#scrollTopWrap');
      const fixedButton = $('#fixedButton');
      const header = $('header');
      const position = document.documentElement;
      let pageHeight;
      let wHeight = window.innerHeight;
      let preSetWidth = window.innerWidth;
      let scrollCount = 0;

      function setHeightProperty() {
        wHeight = window.innerHeight;
        pageHeight = $('body').innerHeight();
        position.style.setProperty('--wHeight', window.innerHeight);
        position.style.setProperty('--wHeightPx', window.innerHeight + 'px');
        position.style.setProperty('--scroll', window.scrollY);
        requestAnimationFrame(setProperties);
      }

      function setProperties() {
        setHeightProperty();
      }

      function init() {
        var timer = false;
        setProperties();
        position.style.setProperty('--wHeightFixedPx', window.innerHeight + 'px');
      }

      init();

    }

    scrollAnimationSet($('article'));

    //トップスライドショー
    function mainSliderShow(target, number) {
      var duration = 1000;
      var sliderLength = target.find('li').length;
      var current = -1;

      function changeState() {
        if (current < sliderLength - 1) {
          current++;
        } else {
          current = 0;
        }

        slideChange(current)
      }

      function backState() {
        if (current != 0) {
          current--;
        } else {
          current = sliderLength - 1;
        }

        slideChange(current)
      }

      function clickTn(num) {
        if (num == 1) {
          changeState();
        } else {
          backState();
        }
      }

      function slideChange(e) {
        console.log('number:' + number + '/' + 'e:' + e);
        setTimeout(function() {
          $('.main0').css({'opacity': '0'});
          $('.display_slide').removeClass('display_slide').addClass('display_slide2');
          $('.main' + e).addClass('display_slide');
          current = e;
          setTimeout(function() {
            $('.display_slide2').removeClass('display_slide2');
          }, 500);
          $('body').animate({
            'opacity': 1
          }, duration, function() {
            clickTn(1);
          });
        }, 5);
      };

      function init() {
        target.find('li').each(function(index) {
          if (index == 0) {
            $(this).addClass('display_slide');
          }
          $(this).addClass('main' + index);
        });
        changeState();
      };

      init();

    }

    mainSliderShow($('#mainSlider01'), 0);
    mainSliderShow($('#mainSlider02'), 1);


    function locationSlideShow(target, number){
      var duration = 1000;
      var sliderLength = target.find('li').length;
      var current = -1;

      function changeState() {
        if (current < sliderLength - 1) {
          current++;
        } else {
          current = 0;
        }

        slideChange(current)
      }

      function backState() {
        if (current != 0) {
          current--;
        } else {
          current = sliderLength - 1;
        }

        slideChange(current)
      }

      function clickTn(num) {
        if (num == 1) {
          changeState();
        } else {
          backState();
        }
      }

      function slideChange(e) {
        setTimeout(function() {
          $('.slideshow0').css({'opacity': '0'});
          $('.display_slideshow').removeClass('display_slideshow').addClass('display_slideshow2');
          $('.slideshow' + e).addClass('display_slideshow');
          current = e;
          setTimeout(function() {
            $('.display_slideshow2').removeClass('display_slideshow2');
          }, 500);
          $('body').animate({
            'opacity': 1
          }, duration, function() {
            clickTn(1);
          });
        }, 5);
      };

      function init() {
        target.find('li').each(function(index) {
          if (index == 0) {
            $(this).addClass('display_slideshow');
          }
          $(this).addClass('slideshow' + index);
        });
        changeState();
      };

      init();
    }

    locationSlideShow($('#locationSlider'), 2);


    //アンカーリンク
    function hummenuAnker(target){
      var scrollObj = [];
      var scrollHref = [];

      function windowMove(e) {
        var w = $(window).width();
        var scrollHeight = $(scrollHref[e]).offset().top;
        if (w > 1100) {
          var adScroll = scrollHeight - 60;
        } else {
          var adScroll = scrollHeight - 60;
        }
        $("html, body").stop().animate({scrollTop: adScroll}, 400);
      }

      function init() {
        $.each(target.find('button'), function(index) {
          scrollObj[index] = $(this);
          scrollHref[index] = $(this).attr("scrollhref");
          scrollObj[index].on({
            'click': function() {
              windowMove(index);
            }
          });
        });
      }

      init();

    }

    hummenuAnker($('#mainNavigation'));



    //FAQの、トグル制御
    function faqToggle(target) {
      var toggleItem = [];
      var toggleButton = [];
      var toggleContents = [];
      var toggleHeight = [];
      var toggleState = [];
      var toggleTitleTxt = [];
      var toggleContentsTxt = [];
      var faqSearch = $('#faqSearch');
      var faqFlex = $('#faqFlex');
      var windowW = window.innerWidth;

      function toggleMove(e) {
        if ( toggleState[e] == 0 ) {
          toggleItem[e].addClass('active');
          var buttonHeight = toggleButton[e].outerHeight();
          var targetHeight = toggleHeight[e].outerHeight();
          toggleItem[e].css({
            'height': buttonHeight + targetHeight + 'px'
          });
          toggleContents[e].css({
            'height': targetHeight + 'px'
          });
          toggleState[e] = 1;
        } else {
          toggleItem[e].removeClass('active');
          var buttonHeight = toggleButton[e].outerHeight();
            toggleItem[e].css({
              'height': buttonHeight + 'px'
            });
            toggleContents[e].css({
              'height': '0px'
            });
          toggleState[e] = 0;
        }
      }

      function setToggleHeight(){
        $.each(target.find('.toggle_item'), function(index) {
          toggleItem[index].removeClass('active');
          toggleItem[index] = $(this);
          toggleButton[index] = $(this).find('.toggle_button');
          toggleContents[index] = $(this).find('.toggle_contents');
          toggleHeight[index] = $(this).find('.contents_inner');
          toggleContents[index].css({'height': 0 + 'px'});
          $(this).css({'height': toggleButton[index].outerHeight() + 2 + 'px'});
          toggleState[index] = 0;
        });
      }

      function init() {
        $.each(target.find('.toggle_item'), function(index) {
          toggleItem[index] = $(this);
          toggleButton[index] = $(this).find('.toggle_button');
          toggleContents[index] = $(this).find('.toggle_contents');
          toggleHeight[index] = $(this).find('.contents_inner');
          $(this).css({'height': toggleButton[index].outerHeight() + 2 + 'px'});
          toggleState[index] = 0;
          toggleTitleTxt[index] = toggleButton[index].text();
          toggleContentsTxt[index] = toggleContents[index].text();
          toggleButton[index].on({
            'click': function() {
              toggleMove(index);
            }
          });
        });


        $(window).on(
          'resize', function() {
            setToggleHeight();
          }
        );
      }

      init();

    }

    if (document.getElementById('faqWrap')) {
      faqToggle($('body'));
    }

  }

  preSetScript();

});
