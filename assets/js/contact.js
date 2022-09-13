$(function() {
  /* お問い合わせフォームのGAS連動とバリデーション */
  function setContactForm(target){
    var ERROR_MESSAGE_CLASSNAME = 'errorMsg'; //エラー時のメッセージ要素のclass名
    var ERROR_INPUT_CLASSNAME = 'errorInput'; //エラー時のinput要素のclass名
    var errorCount = 0;
    var submitWrap = $('#submit');
    var submitButton = $('#submitButton input');
    var items = []; //チェック対象となるテキスト入力要素を格納した配列

    //項目チェックする
    var checkAll = function(){
      errorCount = 0;

      //input,textareaのチェック
      for( var i=0; i<items.length; i++ ){
        if( items[i].prop('isSuccess') == false ){
          errorCount++;
        };
      };

      console.log('errorCount:' + errorCount);

      if( errorCount == 0 ){
        submitButton.removeClass('disabled');
      }else{
        submitButton.addClass('disabled');
      };
    };

    //エラーメッセージの追加
    var addErrorMessage = function(selector, msg){
      removeErrorMessage(selector);
      selector.parent('div').append('<span class="attention '+ERROR_MESSAGE_CLASSNAME+'">'+msg+'</span>');
      selector.addClass(ERROR_INPUT_CLASSNAME);
    };

    //エラーメッセージの削除
    var removeErrorMessage = function(selector){
      var msgSelector = selector.parent().parent('div').find('.'+ERROR_MESSAGE_CLASSNAME);
      if( msgSelector.length != 0 ){
        msgSelector.remove();
        selector.removeClass(ERROR_INPUT_CLASSNAME);
      };
    };

    //input,textareaの未入力チェック
    var checkEmptyText = function(selector, msg){
      if( selector.val() == '' ||  selector.val() == null){
        addErrorMessage(selector, msg);
        selector.prop('isSuccess', false);
      }else{
        removeErrorMessage(selector);
        selector.prop('isSuccess', true);
      };
    };

    var emptyThrough = function(selector){
      if( selector.val() == '' ||  selector.val() == null){
        removeErrorMessage(selector);
        selector.prop('isSuccess', true);
      }
    };

    //radioの未入力チェック
    var checkRadioBox = function(selector, msg){
      if( selector.prop("checked")){
        removeErrorMessage(selector);
        selector.prop('isSuccess', true);
      }else{
        addErrorMessage(selector, msg);
        selector.prop('isSuccess', false);
      };
    };

    //文字列のフォーマットチェック
    function checkFormatText(selector, _mode, msg){
      var value = selector.val();
      switch(_mode){
        //全角のみ
        case 0:
          if(value.match(/^[^ -~｡-ﾟ]*$/)){
            selector.prop('isSuccess', true);
            removeErrorMessage(selector);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //ふりがなのみ
        case 1:
          if(value.match(/^[\u3040-\u309F]+$/)){
            selector.prop('isSuccess', true);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //半角数字のみ
        case 2:
          if(value.match(/^[0-9\-]+$/) || value.length < 1){
            selector.prop('isSuccess', true);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //メールアドレスかどうか
        case 3:
          if(value.match(/^[a-zA-Z0-9!$&*.=^`|~#%'+\/?_{}-]+@([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,6}$/)){
            selector.prop('isSuccess', true);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
      };
      if( selector.prop('isSuccess') == false ){
        addErrorMessage(selector, msg);
      }else{
        removeErrorMessage(selector);
      };
    };

    //初期設定
    var init = function(){
      target.find('input[type=button]').attr('disabled', false);
      //submitイベントの設定
      target.on({
        'submit': function(){
          checkAll();
        }
      });
      //input要素を配列に格納
      items = [
        target.find('input[name="username"]'), //0 お名前
        target.find('input[name="useremail"]'), //1 メールアドレス
        target.find('select[name="category"]'), //2 お問い合わせ種別
        target.find('textarea[name="content"]'), //3 お問い合わせ内容
      ];
      //input要素のプロパティを設定
      $.each(items, function(index){
        items[index].prop('isSuccess', false);
      });

      items[2].prop('isSuccess', true);

      //enterキーでsubmitしてしまうのを防止する
      target.find('input[type=text]').on({
        'keypress': function(e){
          if( (e.keyCode == 13) ) return false;
        }
      });
      //0 お名前
      items[0].on({
        'blur': function(){
          checkEmptyText( items[0], '※お名前は必須です。');
          checkAll();
        }
      });
      //1 メールアドレス
      items[1].on({
        'blur': function(){
          checkEmptyText( items[1], '※メールアドレスは必須です。');
          if( items[1].prop('isSuccess') ) checkFormatText( items[1], 3, '※メールアドレスの形式をご確認ください' );
          checkAll();
        }
      });
      //2 お問合せ種別
      items[2].on({});

      //3 お問い合わせ内容
      items[3].on({
        'blur': function(){
          checkEmptyText( items[3], '※お問い合わせ内容は必須です。');
          checkAll();
        }
      });

      submitButton.on({
        'click': function(){
          checkEmptyText( items[0], '※お名前は必須です。');
          checkEmptyText( items[1], '※メールアドレスは必須です。');
          if( items[1].prop('isSuccess') ) checkFormatText( items[1], 3, '※メールアドレスの形式をご確認ください' );
          checkEmptyText( items[3], '※お問い合わせ内容は必須です。');
          checkAll();
          if( errorCount == 0 ){
            processOrderContent();
          }else{
            alert('入力内容に不備があります。入力内容を確認いただき、再度送信ボタンを押してください。');
            var offset = $('header').outerHeight();
            var scrollHeight = $('#contactWrap').offset().top;
            $("html, body").animate({
              scrollTop: scrollHeight - offset
            }, 300);
          };
        }
      })
    };

    function processOrderContent(){
      $('#ajaxLoader').addClass('loading');
      var userName = target.find("input[name=username]").val();
      //0 お名前
      var userMail = target.find("input[name=useremail]").val();
      //1 メールアドレス
      var category = target.find("select[name=category]").val();
      //2 お問い合わせ種別
      var content = target.find("textarea[name=content]").val();
      //3 お問合せ内容
      event.preventDefault();
      $.ajax({
        url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc69LfZ2qfMuFSJIzGIs9E2DWVbRFBNhSsArTayT-HWyiFNbg/formResponse",
        data: {
          "entry.996656715": userName,
          "entry.629785117": userMail,
          "entry.1050069156": category,
          "entry.1653754708": content,
        },
        type: "POST",
        dataType: "xml",
        statusCode: {
          0: function () {
            setTimeout(function() {
              $('#ajaxLoader').removeClass('loading');
              $('#submitButton').addClass('completed');
              $('#statusMessage').addClass('complete').html('<span class="text">メッセージは送信されました。自動返信メールをご確認ください。</span>');
              /*location.href = 'https://' + location.hostname + '/pages/completed'*/
            }, 500);
          },
          200: function () {
            $('#ajaxLoader').removeClass('loading');
            $('#submitButton').addClass('completed');
            $('#statusMessage').addClass('error').html('<span class="text">メッセージ送信に失敗しました。お手数ではございますが、時間を置いてもう一度お試しください。</span>');
            setTimeout(function() {
              location.href = 'https://' + location.hostname + '/'
            }, 3000);
          }
        }
    });
  }

    init();

  };

  if (document.getElementById('contact')) {
    setContactForm($('#contactWrap'));
  }
});
