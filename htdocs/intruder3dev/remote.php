<!-- 
  【要件】
・モードに合わせた目的地一覧が表示される
・目的地一覧から、ロボットを遠隔でどこかに送れる
・到着すると、自己位置がわかる
・電源の状態も表示される
 -->
 <!-- 
  【実装】
  ・本ディレクトリ内に、PUSH　API受取・記録する輩を　receive.php
  ・データをためておく、remote.jsonに記録
  ・本ディレクトリ内に、APIを処理し、画面描画を変更するajax.php
  ・一般的にアクセス画面　index.phpは固定（輩を3秒間隔でAjaxで読みなおす）
  -->
<?php 
  include('component/com.php');
  include('component/error.php');
  $em = new EM();
  $em_string = json_encode($em);
  // var_dump($em_string);

  $content['main_message'] = 'BUDDY リモートコンソール';
  $content['under_message'] = '';
  $content['main'] = '<div class="boxlist" id="selectlist"></div><div class="altericon" id="altermode" onclick="alterMode()"></div>';
  $basename = basename(__FILE__, ".php");
  // include('component/template.php');
?>
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="asset/css/com.css?<?=time()?>">
    <link rel="stylesheet" href="asset/css/remote.css?<?=time()?>">
    <script>
      const appname = '<?=APP?>';
      const basename = '<?=$basename?>';
      const myip = '<?=$_SERVER["REMOTE_ADDR"]?>';
    </script>
    <?php $jslist = ['jquery', 'driver', 'api', 'frame', 'main']?>
    <?php foreach($jslist as $obj):?>
      <script type="text/javascript" src="asset/js/<?=$obj?>.js?<?=time()?>"></script>
    <?php endforeach;?>
  </head>
  <body>
    <div class="wrapper">
      <!-- 共通 -->
      <div class="right_nav"></div>
      <!-- コンテンツ -->
      <?php foreach($content as $key => $value):?>
        <div class="<?=$key?>"><?=$value?></div>
      <?php endforeach;?>
      <!-- 共通のモーダル表示部分 -->
      <div class="left_nav modal-opener" id="menu"></div>
      <!-- ローディングボール -->
      <div class="loading hid">
        <?php for ($i=1; $i < 9; $i++):?>
          <span class="ball ball-<?=$i?>"></span>
        <?php endfor?>
      </div>
      <div id="loadingwall" class="hid"></div>
      
    </div>
  </body>
</html>
<script>
  //起動時スクリプト
  // setTimeout(init,2000)
  mystate = 0;
  ip = window.location.hostname;
  iphead = 'http://'+ip+'/'
  setUnderMessage(mainversion)
  state = {};
  // console.log(<?=$em_string?>)
  em = <?=$em_string?>;
  // console.log(em)
  // console.debug(em)
  // setTimeout(function(){playAnnounce('wakeup')}, 1000)
  //ループスクリプト
  function countup() {
    mode = getVariable('mode')
    if (mode == 'undefined') {
      setVariable('mode', 'normal')
    } else {
      showMode()
    }
    state = readRemoteJson();
    if (state == 'fail_to_get_JSON') {
      return
    }
    console.log(state)
    console.log(mystate)
    _st = JSON.parse(state.status)
    work = JSON.parse(state.work)

    if (isTrue(_st.move)) {
      if (mystate != 'onmove') {
        console.log(mystate)
        showOnmove(state,_st,work)
      }
      // return
    } else {
      console.log(isTrue(_st.error))
      console.log(isTrue(_st.halt))
      if (isTrue(_st.autostart)) {
        if (mystate != 'autostart') {
          showAutostart(state,_st,work)
        }
        return
      } else if (isTrue(_st.halt)) {
        console.log('halt')
        if (mystate != 'halt') {
          showHalt(state,_st,work)
        }
        return
      } else if (isFalse(_st.error)) {
        if (mystate != 'select') {
          showSelect(state,_st,work)
        }
        return
      } else {
        if (mystate != 'error') {
          showError(state,_st,work)
        }
        return
      }
    }
  }
  setInterval(countup, timer.remote);
  // 移動中の時　→　移動中画面
  // 停止中の時　→　目的地一覧
  // dispatchAlert →　エラーの表示

  // 移動中画面の表示
  function showOnmove(state,_st,work) {  
    showSelect(state,_st,work)
    $('.wrapper').addClass('warning')
    string = work.to +'へ移動しています'
    setMainMessage(string)
    mystate = 'onmove'
  }
  // 自動発進画面の表示
  function showAutostart(state,_st,work) {
    clearWrapper ()
    string = '自動発進待機中<br>操作をする際は安全確認を実施してください'
    $('.wrapper').addClass('caution')
    setMainMessage(string)

    // 目的地リスト描画
    var order = JSON.parse(state.order)
    current_location = state.current_location

    $('.boxlist').empty()
    Object.keys(order).forEach(function(key) {
      $('.boxlist').append('<div class="selectbox" onclick="remote_move(\''+order[key]+'\')" data="'+order[key]+'" >'+order[key]+'</div>')
    });

    mystate = 'autoreturn'
  }

  // 目的地一覧の表示
  function showSelect(state,_st,work) {
    clearWrapper ()
    // 目的地リスト描画
    console.log(state)
    var destination_list = JSON.parse(state.order)
    console.log(destination_list)
    current_location = state.current_location

    $('.boxlist').empty()
    moveto = work.move_to
    current_location = state.current_location
    Object.keys(destination_list).forEach(function(key) {
      if (destination_list[key] == state.current_location) {
        $('.boxlist').append('<div class="selectbox selected" onclick="remote_move(\''+destination_list[key]+'\')" data="'+destination_list[key]+'" >'+destination_list[key]+'</div>')
      } else if (destination_list[key] == state.status.to) {
        $('.boxlist').append('<div class="selectbox picked" onclick="remote_move(\''+destination_list[key]+'\')" data="'+destination_list[key]+'" >'+destination_list[key]+'</div>')
      } else {
        $('.boxlist').append('<div class="selectbox" onclick="remote_move(\''+destination_list[key]+'\')" data="'+destination_list[key]+'" >'+destination_list[key]+'</div>')
      }
      
    });
    string = '目的地を選択してください'
    setMainMessage(string)

    mystate = 'select'
  }

  // 一時停止の表示
  function showHalt(state,_st,work) {
    clearWrapper ()
    $('.wrapper').addClass('face')
    $('.wrapper').addClass('halt')
    // 目的地・移動モードの表示
    string = '障害物検知のため移動を中断しました<br>障害物がなくなると自動で復帰します'
    setMainMessage(string)
    mystate = 'halt'
  }

  // エラーの表示
  function showError(state,_st,work) {
    clearWrapper ()
    $('.wrapper').addClass('error')
    if (state.error in em.em) {
      console.log(em.em)
      $('.wrapper').append('<div class="error_message">'+em.em[_st.error]+'</div>')
    } else {
      console.log(em.remote)
      $('.wrapper').append('<div class="error_message">'+em.em.remote+'</div>')
    }
    mystate = 'error'
  }

  // 画面クリア
  function clearWrapper () {
    $('.wrapper').removeClass('error')
    $('.wrapper').removeClass('face')
    $('.wrapper').removeClass('halt')
    $('.wrapper').removeClass('caution')
    $('.wrapper').removeClass('warning')
    setMainMessage('')
    setUnderMessage('')
    $('#selectlist').empty()
    $('.error_message').remove()
    stopBall()
  }

  function remote_move(destination_name) {
    writeMoveJson(destination_name)
    loadBall(0)
  }

  // remote用状態書込
  function writeMoveJson(destination) {
    console.log('writeMoveJson')
    $.ajax({
      type: "POST",
      url: iphead+appname+'/component/writeMove.php',
      data: {'destination': destination, 'force' : getVariable('mode')},
      dataType: 'json'
    }).done(function _writeRemoteJson(data){
      // setLog('Remote設定保存完了');
      setLog(data);
    });
    setUnderMessage('移動予約中['+destination+']')
  }

  // remote用状態読取
  function readRemoteJson() {
    data = {}
    url= iphead+appname+'/component/scanRemote.php'
    var res = 'fail_to_get_JSON'
    $.ajaxSetup({async: false});
    $.getJSON(url, (data) => {
    }).done(function(data){
      res = data
    });
    return res
  }

  // モード切替
  function alterMode() {
    mode = getVariable('mode')
    console.log(mode)
    if (mode == 'normal')  {
      setVariable('mode', 'force')
    } else {
      setVariable('mode', 'normal')
    }
    showMode()
  }

  function showMode() {
    mode = getVariable('mode')
    if (mode == 'normal')  {
      if($('#altermode').hasClass('altermode') == true) {
        $('#altermode').removeClass('altermode')
        $('#altermode').empty()
        $('#altermode').append('予約優先')
      }
    } else {
      if($('#altermode').hasClass('altermode') == false) {
        $('#altermode').addClass('altermode')
        $('#altermode').empty()
        $('#altermode').append('強制割込')
      }
    }
  }
</script>

