<!--
  【要件】
・自分の目的地のURLを表示しておけば到着した時に到着アナウンスが流せる
 -->
 <!-- 
  【実装】
　・
  ・一般的にアクセス画面　index.phpは固定（輩を3秒間隔でAjaxで読みなおす）
  -->
<?php 
  include('component/com.php');
  $content['main_message'] = 'BUDDY 目的地コンソール';
  $content['under_message'] = '';
  $content['main'] = '<div class="boxlist" id="selectlist"></div>';
  $basename = basename(__FILE__, ".php");
  $destination = '';
  if(isset($_GET['destination'])) {
    $destination = $_GET['destination'];
    $content['main_message'] = $destination.'コンソール';
  } 

  $filename = 'asset/json/destination_name.json';
  //echo($filename);
  $destination_name = file_get_contents($filename);
  // print_r($destination_name);
  // include('component/template.php');
?>
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="asset/css/com.css?<?=time()?>">
    <link rel="stylesheet" href="asset/css/remote.css?<?=time()?>">
    <script>
      const mylocal = location.href;
      const appname = '<?=APP?>';
      const basename = '<?=$basename?>';
      const destination_name = <?=$destination_name?>;
      // console.log(destination_name)
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
  console.log('where')
  const channel = new BroadcastChannel('tab');
  channel.postMessage('another-tab');
  channel.addEventListener('message', (event) => {
      if (event.data === 'another-tab') {
          document.body.innerHTML = `新しいタブが開かれたためクローズしました。`;
      }
  });

  let mystate = 0;
  ip = window.location.hostname;
  iphead = 'http://'+ip+'/'
  current_location = '<?=$destination?>'
  setUnderMessage(mainversion)
  clearWrapper ()
  // setTimeout(function(){playAnnounce('wakeup')}, 1000)
  //ループスクリプト
  function countup() {
    state = readRemoteJson();
    if (state == 'fail_to_get_JSON') {
      return
    }
    console.log(state)
    console.log(mystate)
    _st = JSON.parse(state.status)
    work = JSON.parse(state.work)
    if (isTrue(_st.move)) {
      // console.log(work.to)
      if (mystate != 'onmove') {
        if (work.to == current_location) {
          console.log('coming')
          showOnmove(state)
          return 
        } else {
          if (mystate != 'default') {
            mystate = 'default'
            console.log('default')
            showDefault()
          }
        }
        return
      }
      return
    } else {
      console.log(_st.autostart)
      // 現在地でAutostart待ちなら
      if (isTrue(_st.autostart)) {
        if (mystate != 'arrival') {
          if (state.current_location == current_location) {
            console.log('arrival')
            showArrival(state)
          }
        }
        return
      }
    }
    if (mystate != 'default') {
      mystate = 'default'
      console.log('default')
      showDefault()
    }
  }

  function precountup() {
    // state = readRemoteJson();
    showSelect(readRemoteJson())
  }

  <?php if($destination):?>
    playDestination("<?=$destination?>")
    setInterval(countup, timer.remote);
  <?php else:?>
    $('.under_message').empty();
    $('.under_message').append(mainversion);
    setInterval(precountup, timer.remote);
  <?php endif;?>  
  // 移動中の時　→　移動中画面
  // 停止中の時　→　目的地一覧
  // dispatchAlert →　エラーの表示

  // 目的地一覧の表示
  function showSelect(state) {
    console.log(state)
    clearWrapper ()
    // 目的地リスト描画
    var order = JSON.parse(state.order)
    current_location = state.current_location

    $('.boxlist').empty()
    Object.keys(order).forEach(function(key) {
      $('.boxlist').append('<div class="selectbox" onclick="setDestinationDestination(\''+order[key]+'\')" data="'+order[key]+'" >'+order[key]+'</div>')
    });
    string = '現在地を選択してください'
    setMainMessage(string)

    mystate = 'select'
  }

  function setDestinationDestination(destination_name) {
    window.location.href = mylocal +'?destination='+destination_name
  }

  // 移動中画面の表示
  function showOnmove(state) {
    $('#selectlist').empty()
    $('#selectlist').append('<div class="contentLarge flash"><img src="asset/image/buddychar.png"><br>まもなく<br>ロボットが<br>到着いたします</div>')
    playSE('message.mp3');
    mystate = 'onmove'
  }

  // 到着画面の表示
  function showArrival(state) {
    $('#selectlist').empty()
    $('#selectlist').append('<div class="contentLarge">お待たせしました<br><br>お取りになりましたら<br>ロボットの<br><br>ディスプレイの[戻る]を<br>押してください</div>')
    // playSE('message.mp3');
    playDestination("<?=$destination?>");
    setTimeout(playMe(), 2500);
    mystate = 'arrival'
  }

  // エラーの表示
  function showError(state) {
    clearWrapper ()
    $('.wrapper').addClass('error')
    mystate = 'error'
  }

  // 画面クリア
  function clearWrapper () {
    $('.wrapper').removeClass('error')
    $('.wrapper').removeClass('face')
    $('.wrapper').removeClass('halt')
    setMainMessage('<?=$content['main_message']?>')
    setUnderMessage('')
    $('#selectlist').empty()
    stopBall()
  }

  function showDefault() {
    $('#selectlist').empty()
    $('#selectlist').append('<div class="contentLarge"><img src="asset/image/buddychar.png"><br>当店では ロボットが<br>お料理を運んでまいります</div>')
    mystate = 'default'
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

  function playSE(file) {
    url = iphead+appname+'/asset/se/'+file
    setLog(url);
    var se = new Audio(url);
    vol = 1
    se.volume = vol;
    se.play();
  }

  function playDestination(destination) {
    // json = readJson('destination_name');
    if (destination in destination_name) {
      file = destination_name[destination]

      url = iphead+appname+'/asset/announce/'+file
      setLog(url);
      var destannounce = new Audio(url);
      vol = 1
      destannounce.volume = vol;
      destannounce.play();
    }
  }

  function playMe() {
    url = iphead+appname+'/asset/announce/20240127_001.wav'
    setLog(url);
    var destannounce = new Audio(url);
    vol = 1
    destannounce.volume = vol;
    destannounce.play();
  }
</script>
