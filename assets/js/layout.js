$(function() {
  var amountNum = 0;
  var dateVariation = [];
  var selectedVariation;
  var curryNumDisplay = 0;
  var stewNumDisplay = 0;

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
        if(window.scrollY > pageHeight - wHeight * 1.5){
          fixedButton.removeClass('display');
        }else{
          fixedButton.addClass('display');
        }
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

    if (document.getElementById('booking')) {
      mainSliderShow($('#mainSlider01'), 0);
      mainSliderShow($('#mainSlider02'), 1);
    }


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

    // 予約フォームの開閉

    function displaySpBookingForm(){
      var contentsBooking = $('#contentsBooking');
      var fixedButton = $('#fixedButton').find('button');
      var bookingClose = $('#bookingClose');

      function init(){
        fixedButton.on({
          'click': function() {
            contentsBooking.addClass('display');
          }
        });
        bookingClose.on({
          'click': function() {
            contentsBooking.removeClass('display');
          }
        });
      }

      init()

    }

    if (document.getElementById('booking')) {
      displaySpBookingForm();
    }


    // 商品詳細ページ 数量インプットの操作
    function controllBuyingQuantity(){
      var minusButton = [];
      var plusButton = [];
      var quantityInput = [];
      var quantityMin = [];
      var quantityMax = [];
      var quantityNum;
      var adlutNum = $('#adlutNum');
      var childNum = $('#childNum');
      var curryNum = $('#curryNum');
      var stewNum = $('#stewNum');
      var amountPrice = $('#amountPrice');
      var calendarStock = [];


      function controllQuantity(vactor,num){
        quantityNum = quantityInput[num].val();
        if(vactor == 1){
          console.log('Max:' + quantityMax[num]);
          if(quantityNum < quantityMax[num]){
            quantityInput[num].attr('value', Number(quantityNum) + 1);
          }
        }else{
          if(quantityNum != quantityMin[num]){
            quantityInput[num].attr('value', Number(quantityNum) - 1);
          }
        }
        if(Number(adlutNum.val()) > 1){
          $('#alert01').remove();
        }
        amountNum = Number(curryNum.val()) + Number(stewNum.val());
        amountPeople = Number(adlutNum.val()) + Number(childNum.val());
        curryNumDisplay = Number(curryNum.val());
        stewNumDisplay = Number(stewNum.val());
        var displayPrice = amountNum * 2500;
        amountPrice.html(displayPrice.toLocaleString() + '円(税込)');
        if(amountNum >= Number(adlutNum.val())){
          $('#alert02').remove();
        }

        $('#calendarTable').find('button').each(function(index) {
          calendarStock[index] = Number($(this).attr('stock'));
          if(calendarStock[index] < amountPeople){
            $(this).addClass('soldout');
          }else{
            $(this).removeClass('soldout');
          }
        });
      }

      function init(){

        $('article').find('.comp-number-input').each(function(index) {
          minusButton[index] = $(this).find('.minus');
          plusButton[index] = $(this).find('.plus');
          quantityInput[index] = $(this).find('input[type=text]');
          quantityMin[index] = Number(quantityInput[index].attr('min'));
          quantityMax[index] = Number(quantityInput[index].attr('max'));
          minusButton[index].on({
            'click': function() {
              event.preventDefault();
              controllQuantity(-1,index);
            }
          });

          plusButton[index].on({
            'click': function() {
              event.preventDefault();
              controllQuantity(1,index);
            }
          });

        });
      }

      init();

    }

    if (document.getElementById('booking')) {
      controllBuyingQuantity();
    }

    //予約カレンダーの制御
    function calendarControll(){
      var calendarState = 0;
      var prevButton = $('#prevButton');
      var nextButton = $('#nextButton');
      var calendarTable = $('#calendarTable');
      var dateDisplay = $('#dateDisplay');
      var monthDisplay = $('#monthDisplay');
      var dateButton = [];
      var dateY = [];
      var dateM = [];
      var dateD = [];

      function calendarShifter(vector){
        if(vector == 1){
          $('#table202210').removeClass('disnone');
          $('#table202209').addClass('disnone');
          nextButton.addClass('disable');
          prevButton.removeClass('disable');
          monthDisplay.html('2022年10月');
        }else{
          $('#table202210').addClass('disnone');
          $('#table202209').removeClass('disnone');
          nextButton.removeClass('disable');
          prevButton.addClass('disable');
          monthDisplay.html('2022年9月');
        }
      }

      function init(){
        calendarTable.find('button').each(function(index) {
          dateButton[index] = $(this);
          dateVariation[index] = $(this).attr('value');
          dateY[index] = $(this).attr('dateY');
          dateM[index] = $(this).attr('dateM');
          dateD[index] = $(this).attr('dateD');
          dateButton[index].on({
            'click': function() {
              dateDisplay.html(dateY[index] + '年' + dateM[index] + '月' + dateD[index] + '日');
              $('.selected_date_button').removeClass('selected_date_button');
              $(this).addClass('selected_date_button');
              selectedVariation = dateVariation[index];
              $('#alert03').remove();
            }
          });
        });

        prevButton.on({
          'click': function() {
            calendarShifter(-1);
          }
        });

        nextButton.on({
          'click': function() {
            calendarShifter(1);
          }
        });

      }


      init();
    }

    if (document.getElementById('booking')) {
      calendarControll();
    }


    function itemDetailThumbnail(target) {
      var thumbBox = $('#thumbBox');
      var caption = $('#caption');
      var imgthumb = $('#imgthumb');
      var currentThumb = $('#currentThumb');
      var allThumb = $('#allThumb');
      var slideNextButton = $('#slideNext');
      var slidePrevButton = $('#slidePrev');
      var thumbButton = [];
      var currentSlide = 0;
      var imgObj = [];
      var time = 300;
      var thumbLength = target.children("button").length;

      function thumbChange(num){
        thumbBox.stop().animate({ opacity: 0 }, time, function() {
          thumbBox.attr('src', imgObj[num]);
          $('.active_thumb').removeClass('active_thumb');
          thumbButton[num].addClass('active_thumb');
          currentThumb.text(num + 1);
          currentSlide = num;
          thumbBox.stop().animate({ opacity: 1 }, time);
      });
    }

    function slideChange() {
      targetSlide = target.find('.slide' + currentSlide);
      target.find('.active_slide').removeClass('active_slide');
      targetSlide.addClass('active_slide');
      target.find('.current').text(currentSlide);
    };

    function slideNext(){
      if (currentSlide < thumbLength - 1) {
        currentSlide = currentSlide + 1;
      } else {
        currentSlide = 0;
      }
      thumbChange(currentSlide);
    };

    function slidePrev(){
      if (currentSlide == 0) {
        currentSlide = thumbLength - 1;
      } else {
        currentSlide = currentSlide - 1;
      }
      thumbChange(currentSlide);
    };

    function tabTouch(){
      if(startTouchX - endTouchX > 50){
        slideNext();
      }else if(startTouchX - endTouchX < - 50){
        slidePrev();
      }
    };

    function windowDrag() {
      if (startDragX - endDragX > 100) {
        slideNext();
      } else if (startDragX - endDragX < -100) {
        slidePrev();
      }
    };

      function init(){
        allThumb.text(thumbLength);
        $.each(target.find('button'), function(index) {
          thumbButton[index] = $(this);
          imgObj[index] = $(this).children('img').attr("src");

          thumbButton[index].on({
            'click': function() {
              thumbChange(index);
            }
          });

        });

        slideNextButton.on({
          'click': function() {
            slideNext();
          }
        });

        slidePrevButton.on({
          'click': function() {
            slidePrev();
          }
        });

        imgthumb.on({
          'dragstart': function(e) {
            startDragX = event.pageX;
          },
          'dragend': function(e) {
            endDragX = event.pageX;
            windowDrag();
          }
        });

        imgthumb.on({
          'touchstart' : function(e){
            startTouchX = event.changedTouches[0].pageX;
          },
          'touchend' : function(e){
            endTouchX = event.changedTouches[0].pageX;
            tabTouch();
          }
        });

      }

      init();
    }

    if (document.getElementById('booking')) {
      itemDetailThumbnail($('#thumbList'));
    }


    function bookingSubmit(){
      var submitButton = $('#submitButton');
      var errorCount = 0;
      var errorMessage = '';

      function checkoutProcess(){
        errorCount = 0;
        errorMessage = '';
        $('#alert01').remove();
        $('#alert02').remove();
        $('#alert03').remove();
        var adlutNum =  Number($('#adlutNum').val());
        var childNum =  Number($('#childNum').val());
        var selectDate = $('#dateDisplay').text();
        var amuountPeople = adlutNum + childNum;
        console.log('amuountPeople:' + amuountPeople);
        if(amuountPeople < 2){
          errorCount = errorCount + 1;
          errorMessage = errorMessage + '\n・2名以上でご予約ください。'
          $('#formItem01').append('<p id="alert01" class="alert">2名以上でご予約ください。</p>');
        }
        if(amountNum < adlutNum){
          errorCount = errorCount + 1;
          errorMessage = errorMessage + '\n・大人お一人につき、お一つ以上ご注文下さい。'
          $('#formItem02').append('<p id="alert02" class="alert">大人お一人につき、お一つ以上ご注文下さい。</p>');
        }

        if(selectDate == '未選択'){
          errorCount = errorCount + 1;
          errorMessage = errorMessage + '\n・予約日時を選択してください。'
          $('#formItem03').append('<p id="alert03" class="alert">※予約日時を選択してください。</p>');
        }

        if(errorCount == 0){
          location.href = 'https://bokuya.jp/cart/'+ selectedVariation +':'+ amountNum +'?attributes[カレー]=' + curryNumDisplay +'セット&[シチュー]=' + stewNumDisplay + 'セット';
        }else{
          alert('予約内容に不備があります。お手数ですが、予約内容をご確認ください。' + errorMessage);
          $("#contentsBooking .form_inner").animate({scrollTop: 0});
          window.scroll({top: 0, behavior: 'smooth'});
        }
      }

      function init(){
        submitButton.on({
          'click': function() {
            checkoutProcess();
          }
        });
      }

      init();
    }


    if (document.getElementById('booking')) {
      bookingSubmit();
    }





  }

  preSetScript();

});
