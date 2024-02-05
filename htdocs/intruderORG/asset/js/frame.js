/////////////////////////////////////////////////////////////////////////////////////////
//メニュー・モーダル用イベント監視用関数
/////////////////////////////////////////////////////////////////////////////////////////
$(function nav(){
  //メニューの引き出し
  $('.left_nav').click(function(){
    if ($('.left_nav').hasClass('left_nav_hov')) {
      $('.left_nav').removeClass('left_nav_hov');
      current_map = getVariable('current_map')
      //writeVariable(current_map)
    } else {
      $('.left_nav').addClass('left_nav_hov');
      closeModalwithoutMusic();
    }
  });
  //目的地選択
  $('#modal-select-open').click(function(){
    transScreen('select')
  });
  //再起動
  $('#modal-reboot-open').click(function(){
    transScreen('index')
  });
  //再設置
  $('#modal-relocate-open').click(function(){
    // req_move_status_reset()
    transScreen('relocate')
  });
  //単純顔画面
  $('#modal-face-open').click(function(){
    transScreen('face')
  });
  //単純顔画面
  $('#modal-kiosk-open').click(function(){
    var kiosk = getVariable('kiosk')
    if (kiosk == 'on') {
      setVariable('kiosk', 'off')
      setUnderMessage('KIOSKモードをOFFにしました')
    } else if (kisok = 'off') {
      setVariable('kiosk', 'on')
      setUnderMessage('KIOSKモードをONにしました')
    } else {
      setVariable('kiosk', 'on')
      setUnderMessage('KIOSKモードをONにしました')
    }
    writeVariable()
  });
  //再起動
  $('#modal-qbittest-open').click(function(){
    transScreen('qbittest')
  });

  //往復運動設定モーダル
  $("#modal-turnaround-open").click(function(){
    openModalBG('turnaround')
    $('#tanum').text(getVariable('turnaround'));
  });

  //登録MAP確認モーダル
  $("#modal-map-open").click(function(){
    transScreen('map')
  });

  //移動時音楽設定モーダル
  $("#modal-music-open").click(function(){
    openModalBG('music')
    viewMusic();
  });

  //発話設定モーダル
  $("#modal-announce-open").click(function(){
    openModalBG('announce')
    $('#announcenum').text(getVariable('announce_volume'));
    announcelist()
  });

  //トレースモードモーダル
  $("#modal-trace-open").click(function(){
    setVariable('tracestart', -1);
    setVariable('tracegoal', -1);
    openModalBG('trace')
    req_move_status_reset()
    setPartialTrace()
  });

  //トレース_セット
  $("#trace").click(function(){
    do_trace();
    closeModal();
  });

  //ログ確認モーダル
  $("#modal-log-open").click(function(){
    $("body").append('<div id="modal-bg"></div>');
    $("#modal-bg,#modal-log").fadeIn("slow");
    $("#modal-bg").click(closeModal);
    getLog();
  });

  //衝突防止ログ確認モーダル
  $("#modal-collision-open").click(function(){
    openModalBG('collision')
    getCollisionLog();
  });

  //速度設定モーダル
  $("#modal-velocity-open").click(function(){
    openModalBG('velocity')
    $('#velnum').text(getVariable('velocity'));
  });

  //通常走行モードモーダル
  $("#modal-single-open").click(function(){
    openModalBG('single')
  });

  //連続走行モードモーダル
  $("#modal-sequence-open").click(function(){
    openModalBG('sequence')
    $('#sequencenum').text(getWait('sequence'));
  });

  //拠点走行モードモーダル
  $("#modal-hub-open").click(function(){
    openModalBG('hub')
    viewHubList();
    $('#hubnum').text(getWait('hub'));
  });

  //巡回走行モードモーダル
  $("#modal-round-open").click(function(){
    openModalBG('round')
    viewRoundList();
    $('#roundnum').text(getWait('round'));
  });

  //設定削除
  $("#modal-erase-open").click(function(){
    wipeVariable()
    closeModal()
  });

  //USB通信
  $('#modal-usbdebug-open').click(function(){
    transScreen('usbdebug');
  });
})

/////////////////////////////////////////////////////////////////////////////////////////
//モーダル内部監視関数
/////////////////////////////////////////////////////////////////////////////////////////
$(function modal(){
  //往復運動設定_数字減少ボタン
  var touched = false;
  var touch_time = 0;
  $("#tadown").bind({
    'touchstart mousedown': function(e) {
      touched = true;
      touch_time = 0;
      document.interval = setInterval(function(){
        touch_time += 100;
        if (touch_time == 500) {
          var dom = document.getElementById('tanum')
          var num = $("#tanum").text();
          if(num > 5) {
            num = 1;
            dom.innerphp = num;
            $("#tanum").text(num);
          }
        }
      }, 100)
      //e.preventDefault();
    },
    'touchend mouseup mouseout': function(e) { // マウスが領域外に出たかどうかも拾うと、より自然
      if (touched) {
        if (touch_time < 500 ) {
          var dom = document.getElementById('tanum')
          var num = $("#tanum").text();
          if(num > 1) {
            num--;
            dom.innerphp = num;
            $("#tanum").text(num);
          }
        }
      }
      touched = false;
      clearInterval(document.interval);
      //e.preventDefault();
    }
  });
 // 往復運動設定_数字増加ボタン
 $("#taup").bind({
   'touchstart mousedown': function(e) {
     touched = true;
     touch_time = 0;
     document.interval = setInterval(function(){
       touch_time += 100;
       if (touch_time == 500) {
         var dom = document.getElementById('tanum')
         var num = $("#tanum").text();
         if(num <= 19) {
           num=30;
           dom.innerphp = num;
           $("#tanum").text(num);
         }
       }
     }, 100)
     //e.preventDefault();
   },
   'touchend mouseup mouseout': function(e) { // マウスが領域外に出たかどうかも拾うと、より自然
     if (touched) {
       if (touch_time < 500 ) {
         var dom = document.getElementById('tanum')
         var num = $("#tanum").text();
         if(num <= 29) {
           num++;
           dom.innerphp = num;
           $("#tanum").text(num);
         } else if(num == 30) {
           num =999;
           dom.innerphp = num;
           $("#tanum").text(num);
         }
       }
     }
     touched = false;
     clearInterval(document.interval);
     e.preventDefault();
   }
 });

  //往復運動設定_往復中止
  $("#turnaroundclear").click(function(){
    setVariable('turnaround', 0);
    setVariable('turnaround_count', 1)
    closeModal();
    setUnderMessage('往復運転をキャンセルしました')
  });

  //往復運動設定_往復セット
  $("#turnaroundset").click(function turnaroundset(){
    var num = $("#tanum").text();
    // 現在地が存在しない場合は、登録不可
    current_location = getVariable('current_location');
    console.log(current_location)
    if (current_location == "") {
      setVariable('turnaround', 0);
      setVariable('turnaround_count', 1)
      closeModal();
      setUnderMessage('現在地が目的地以外のため、往復運転はご利用頂けません')
      return
    }
    setVariable('turnaround', num);
    setVariable('turnaround_count', 1)
    setVariable('trip_mode', 0);
    closeModal();
    setUnderMessage(num+'回の往復運転をセットしました')
  });

  //速度設定_数字減少ボタン
  $("#veldown").click(function(){
    var dom = document.getElementById('velnum')
    var num = $("#velnum").text();
    num =parseInt(num);
    if(num > 50) {
      num -=10;
      dom.innerphp = num;
      $("#velnum").text(num);
    }
  });

  //速度設定_数字増加ボタン
  $("#velup").click(function(){
    var dom = document.getElementById('velnum')
    var num = $("#velnum").text();
    num =parseInt(num);
    if(num <= 300) {
      num +=10;
      dom.innerphp = num;
      $("#velnum").text(num);
    }
  });

  //速度設定_往復セット
  $("#velset").click(function(){
    var num = $("#velnum").text();
    setVariable('velocity', num);
    closeModal();
    setUnderMessage('移動速度を'+num+'％にセットしました')
    setLog(0,'移動速度を'+num+'％にセットしました')
    writeVariable()
  });

  //速度設定_セット
  $("#velclear").click(function(){
    var num = '100';
    setVariable('velocity', num);
    closeModal();
    setLog(0,'移動速度を'+num+'％にセットしました')
    writeVariable()
  });

  //走行音楽再生音量_数字減少ボタン
  $("#musicdown").click(function(){
    var dom = document.getElementById('musicnum')
    var num = $("#musicnum").text();
    num =parseInt(num);
    if(num > 10) {
      num -=10;
      dom.innerphp = num;
      $("#musicnum").text(num);
    }
  });

  //走行音楽再生音量_数字増加ボタン
  $("#musicup").click(function(){
    var dom = document.getElementById('musicnum')
    var num = $("#musicnum").text();
    num =parseInt(num);
    if(num <= 90) {
      num +=10;
      dom.innerphp = num;
      $("#musicnum").text(num);
    }
  });

  //走行音楽再生音量_セット
  $("#musicvolset").click(function(){
    var num = $("#musicnum").text();
    setVariable('music_volume', num)
    stopOnmoveAudio()
    playOnmoveAudio()
    setUnderMessage('走行音楽再生音量を'+num+'％にセットしました')
    writeVariable()
  });

  //走行音楽再生音量_セット
  $("#musicvolclear").click(function(){
    var num = '100';
    setVariable('music_volume', num);
    stopOnmoveAudio();
    setOnmoveAudio()
    setUnderMessage('走行音楽再生音量を'+num+'％にセットしました')
    writeVariable()
  });

  //発話再生音量_数字減少ボタン
  $("#announcedown").click(function(){
    var dom = document.getElementById('announcenum')
    var num = $("#announcenum").text();
    num =parseInt(num);
    if(num > 10) {
      num -=10;
      dom.innerphp = num;
      $("#announcenum").text(num);
    }
  });

  //発話音楽再生音量_数字増加ボタン
  $("#announceup").click(function(){
    var dom = document.getElementById('announcenum')
    var num = $("#announcenum").text();
    num =parseInt(num);
    if(num <= 90) {
      num +=10;
      dom.innerphp = num;
      $("#announcenum").text(num);
    }
  });

  //発話音楽再生音量_セット
  $("#announcevolset").click(function(){
    var num = $("#announcenum").text();
    setVariable('announce_volume', num);
    playAnnounce('wakeup')
    setUnderMessage('発話再生音量を'+num+'％にセットしました')
    writeVariable()
  });

  //発話音楽再生音量_セット
  $("#announcevolclear").click(function(){
    var num = '100';
    setVariable('announce_volume', num);
    playAnnounce('turnaround')
    setUnderMessage('発話再生音量を'+num+'％にセットしました')
    writeVariable()
  });

  //通常走行モード_セット
  $("#singleset").click(function(){
    setVariable('trip_mode', 0);
    setUnderMessage('通常走行モードをセットしました')
    setLog('0', '走行モード切替:通常')
    closeModal();
    writeVariable()

    mode = getVariable('trip_mode')
    if (mode == 1) {
      transScreen('sequence')
    } else {
      transScreen('select')
    }
  });

  //連続走行モード_数字減少ボタン
  $("#sequencedown").click(function(){
    var dom = document.getElementById('sequencenum')
    var num = $("#sequencenum").text();
    num =parseInt(num);
    if(num > 1) {
      num -=1;
      dom.innerphp = num;
      $("#sequencenum").text(num);
    }
  });

  //連続走行モード_数字増加ボタン
  $("#sequenceup").click(function(){
    var dom = document.getElementById('sequencenum')
    var num = $("#sequencenum").text();
    num =parseInt(num);
    if(num <= 299) {
      num +=1;
      dom.innerphp = num;
      $("#sequencenum").text(num);
    }
  });
  //巡回走行モード_数字減少ボタン
  $("#rounddown").click(function(){
    var dom = document.getElementById('roundnum')
    var num = $("#roundnum").text();
    num =parseInt(num);
    if(num > 1) {
      num -=1;
      dom.innerphp = num;
      $("#roundnum").text(num);
    }
  });

  //巡回走行モード_数字増加ボタン
  $("#roundup").click(function(){
    var dom = document.getElementById('roundnum')
    var num = $("#roundnum").text();
    num =parseInt(num);
    if(num <= 299) {
      num +=1;
      dom.innerphp = num;
      $("#roundnum").text(num);
    }
  });
  //拠点走行モード_数字減少ボタン
  $("#hubdown").click(function(){
    var dom = document.getElementById('hubnum')
    var num = $("#hubnum").text();
    num =parseInt(num);
    if(num > 1) {
      num -=1;
      dom.innerphp = num;
      $("#hubnum").text(num);
    }
  });

  //拠点走行モード_数字増加ボタン
  $("#hubup").click(function(){
    var dom = document.getElementById('hubnum')
    var num = $("#hubnum").text();
    num =parseInt(num);
    if(num <= 299) {
      num +=1;
      dom.innerphp = num;
      $("#hubnum").text(num);
    }
  });

  //連続走行モード_セット
  $("#sequenceset").click(function(){
    setVariable('trip_mode', 1);
    var num = $("#sequencenum").text();
    setWait('sequence', num);
    setVariable('sequencei', 1);
    deleteturnaround ()
    setUnderMessage('連続走行モードをセットしました')
    closeModal();
    writeVariable()
    setLog(0, '走行モード切替:連続走行')

    mode = getVariable('trip_mode')
    if (mode == 1) {
      transScreen('sequence')
    } else {
      transScreen('select')
    }
  });

  //拠点走行モード_セット
  $("#hubset").click(function(){
    setVariable('trip_mode', 2);
    var num = $("#hubnum").text();
    setWait('hub', num);
    deleteturnaround ()
    setUnderMessage('拠点走行モードをセットしました')
    closeModal()
    writeVariable()
    setLog(0, '走行モード切替:拠点走行')

    mode = getVariable('trip_mode')
    if (mode == 1) {
      transScreen('sequence')
    } else {
      transScreen('select')
    }
  });

  //巡回走行モード_セット
  $("#roundset").click(function(){
    setVariable('trip_mode', 3);
    var num = $("#roundnum").text();
    setWait('round', num);
    setVariable('roundi', 1);
    deleteturnaround ()
    setUnderMessage('巡回走行モードをセットしました')
    closeModal()
    writeVariable()
    setLog(0, '走行モード切替:巡回走行')

    mode = getVariable('trip_mode')
    if (mode == 1) {
      transScreen('sequence')
    } else {
      transScreen('select')
    }
  });

});

///////////////////////////////////////
//モーダル処理
///////////////////////////////////////
//モーダルBGオープン
function openModalBG(string) {
  $("body").append('<div id="modal-bg"></div>');
  $("body").append('<div class="modalclose" onclick="closeModal()"><img src="'+webroot+appname+'/asset/image/pictgram/close.png"></div>');
  $("#modal-bg,#modal-"+string).fadeIn("slow");
  $("#modal-bg").click(closeModal);
}

//モーダルクローズ
function closeModalwithoutMusic() {
  $(".modal,#modal-bg").fadeOut("slow",function(){
    $('.modalchild').children().remove();
    $('#modal-bg').remove()
    $('.modalclose').remove()
  });
  //stopOnmoveAudio()
}
function closeModal() {
  $(".modal,#modal-bg").fadeOut("slow",function(){
    $('.modalchild').children().remove();
    $('#modal-bg').remove()
    $('.modalclose').remove()
  });
  stopOnmoveAudio()
}

//移動時音楽設定画面
function viewMusic() {
  musiclist = readJson("music")
  setLog(musiclist)
  current_music = getVariable('music');
  $('#music').empty()
  $('#music').append('<div id="musicnow">'+musiclist[current_music].name+'</div><hr>');
  $('#music').append('<div id="modalselect"><div>');
  $('#musicnum').text(getVariable('music_volume'));
  for (i=0; i<musiclist.length; i++) {
    $('#modalselect').append('<div onclick= setMusic('+ i +')>'+ musiclist[i].name+'</div>');
  }
}

//移動時音楽設定
function setMusic(num) {
  stopOnmoveAudio();
  setVariable('music', num);
  setMusicPlay(num);
  //closeModal();
  viewMusic();
}

//移動時音楽テスト再生
function setMusicPlay(num) {
  stopOnmoveAudio();
  playOnmoveAudio(num);
}

//往復運動
function turnaround() {
  var prevstat = getVariable("turnaround", 0)
  if (prevstat == "true") {
    console.log("往復運動中止")
    setVariable("turnaround", "false")
    setVariable("move_from", "false")
    setVariable("move_to", "false")
    if(document.getElementById)
    {
      document.getElementById("turnaround").style.color = "black";
    }
  } else {
    console.log('往復運動命令')
    setVariable("turnaround", "true")
    whereami()
    if(document.getElementById)
    {
      document.getElementById("turnaround").style.color = "red";
    }
  }
}

//ログ表示画面
function getLog() {
  var logs = getVariable('log');
  ary = logs.split(',');
  for (i=0; i<ary.length; i++) {
    $('#log').append('<div>'+ ary[i]+'</div>');
  }
}
//ログ表示画面
function getCollisionLog() {
  res = '['+getVariable('sensorlog')+']'
  collog = JSON.parse(res)
  //console.log(collog);
  for (i=0; i<collog.length; i++) {
    //console.log(collog[i].data.ids.detection_distance)
    $('#collision').append('<div>T:'+ collog[i].data.ids.detection_distance+',U:'+collog[i].data.uls.detection_distance+'</div>');
  }
}

//区間トレース画面表示
function setPartialTrace() {
  $('#startlist').empty();
  $('#goallist').empty();
  setVariable("tracestart", -1)
  setVariable("tracegoal", -1)

  deslist = JSON.parse(getVariable('dl_all_array'))[getVariable('current_map_id')]
  Object.keys(deslist).forEach(function (key) {
    let stfuc = "setTraceStart('"+key+"')"
    let glfuc = "setTraceGoal('"+key+"')"
    $('#startlist').append('<div id="startrow" class="st'+key+'" onclick="'+stfuc+'">'+deslist[key]+'</div>');
    $('#goallist').append('<div id="goalrow" class="gl'+key+'" onclick="'+glfuc+'">'+deslist[key]+'</div>');
  })
}

//区間トレース始点設定
function setTraceStart(destination_id) {
  let start = getVariable("tracestart");
  let goal = getVariable("tracegoal");
  if (destination_id == goal) {
    return;
  }
  setVariable('tracestart', destination_id);
  let me = '.st'+destination_id;
  if (destination_id == start)  {
    $(me).removeClass("selected");
    setVariable('tracestart', -1);
    return;
  }
  $("[id=startrow]").removeClass("selected");
  $(me).addClass("selected");
}

//区間トレース終点設定
function setTraceGoal(destination_id) {
  let start = getVariable("tracestart");
  let goal = getVariable("tracegoal");
  if (destination_id == start) {
    return;
  }
  setVariable('tracegoal', destination_id);
  let me = '.gl'+destination_id;
  if (destination_id == goal)  {
    $(me).removeClass("selected");
    setVariable('tracegoal', -1);
    return;
  }
  $(me).addClass("selected");
}

//拠点設定画面生成
function setStartLocation() {
  res = getVariable('destination_list')
  if (res) {
    destination_list = JSON.parse(res)
    deslist = destination_list.data.list
  } else {
    //目的地リスト取得失敗したらアプリ再起動
    transScreen('index')
  }
  //一回リストを削除
  var mystart = getVariable('mystart');
  $("#startset").empty();
  $('#startset').append('<div id="modalselect"><div>');
  for (i=0; i<deslist.length; i++) {
    if (deslist[i].destination_id == mystart) {
      $('#modalselect').append('<div class="selected">'+ deslist[i].destination_name+'</div>');
      console.log(deslist[i]);
    } else {
      $('#modalselect').append('<div onclick= setStart("'+ deslist[i].destination_id +'","'+ deslist[i].destination_name +'")>'+ deslist[i].destination_name+'</div>');
      console.log(deslist[i]);
    }
  }
}

//自己位置を#myposにセット
function setStart(id, name) {
  setVariable('mystart', id);
  setVariable('mystartname', name);
  closeModal();
}

//往復運転解除
function deleteturnaround () {
  setVariable("turnaround", "false");
}

//自己位置を#myposにセット
function setStart(id, name) {
  setVariable('mystart', id);
  setVariable('mystartname', name);
  closeModal();
}

//巡回リストを生成表示
function viewRoundList() {
  destination_list = getVariable('destination_list')
  destination_list = destination_list.split(',');
  var obj = new Object();
  $('#round').empty()
  for (var i = 0; i < deslist.length; i++) {
    obj[i] = deslist[i].destination_id
    $('#round').append('<div>'+deslist[i].destination_name+'</div>')
  }
  obj[i] = deslist[0].destination_id
  $('#round').append('<div>'+deslist[0].destination_name+'</div>')
  setVariable('roundarray', JSON.stringify(obj))
}

//拠点画面表示
function viewHubList() {
  $('#hublist').empty();
  let current_map_settings = JSON.parse(getVariable("current_map_settings"))
  destination_list = getVariable('destination_list')
  destination_list = destination_list.split(',');
  console.log(destination_list)

  Object.keys(destination_list).forEach(function (key) {
    let stfuc = "setHubDest('"+key+"')"
    $('#hublist').append('<div id="hubrow" class="st'+key+'" onclick="'+stfuc+'">'+destination_list[key]+'</div>');
  });

  console.log(current_map_settings)
  Object.keys(current_map_settings.hub_array).forEach(function (key) {
    //console.log(key)
    var me = '.st'+key;
    if (key == 0) {
      $(me).addClass("powered");
    } else {
      $(me).addClass("selected");
    }
  });
}

//拠点設定
function setHubDest(destination_id) {
  let current_map_settings = JSON.parse(getVariable("current_map_settings"))
  // hub_array = current_map_settings.hub_array
  //拠点設定済みなら
  if (current_map_settings.hub_array.includes(destination_id)) {
    current_map_settings.hub_array = current_map_settings.hub_array.filter(n => n !== destination_id);
  } else {
    current_map_settings.hub_array.push(destination_id)
  }
  // console.log(current_map_settings.hub_array);
  setVariable('current_map_settings', JSON.stringify(current_map_settings));
  viewHubList();
  // 保存
  console.log('map_settings保存')
  current_map = getVariable("current_map")
  let map_settings = JSON.parse(getVariable("map_settings"))
  map_settings[current_map] = current_map_settings
  setVariable('map_settings', JSON.stringify(map_settings));

  writeVariable()
}

//連続走行配列に追加
function putSequenceArray(destid) {
  array = getVariable('sequencearray')
  sequencearray = JSON.parse(array)

  if (sequencearray[sequencearray.length - 1] == destid) {
    //最後の要素と同じ位置なら
    setUnderMessage('同じ位置を連続して選択することはできません')
    return
  }

  sequencearray.push(destid)
  json = JSON.stringify(sequencearray)
  setVariable('sequencearray', json)

  res = getVariable('dl_all_array')
  current_map_id = getVariable('current_map_id')
  deslist = JSON.parse(res)[current_map_id]
  move_to_name = deslist[destid]

  $('#sequencepannel').append('<div class="sequencepannel">'+move_to_name+'</div>')
  $('#sequencepannel').append('<div class="sequencearrow">▼</div>')

  if (sequencearray.length == 2) {
    $('#sequencego').append('<div id="sequencemove" onclick="move(\''+sequencearray[1]+'\')">移動開始</div>')
  }
}

//連続走行配列をクリア
function clearSequenceArray() {
  setVariable('sequencearray', '[]')
}

function announcelist() {
  var anlist =
  {
    'wakeup' : '起動時',
    'autostart' : '自動発進',
    'complete' : '目的地到着',
    'face' : '顔画面',
    'halt' : '障害物検知停止',
    'map' : '地図画面',
    'onmove' : '移動開始',
    'relocate' : '再設置',
    'select' : '目的地選択',
    'sequence' : '連続走行',
    'turnaround' : '往復走行'
  }
  console.log(anlist)
  var announce = JSON.parse(getVariable('announce'))
  setLog(announce)
  Object.keys(announce).forEach(function (key) {
    $('#modal-announce').append('<div class="flexbox" onclick="viewEachAnnounce(\''+key+'\')">'+anlist[key]+'</div><hr>')
  });
}

function viewEachAnnounce(key) {
  var announcelist = readJson('announce')
  openModalBG('announce-'+key);

  var announce = JSON.parse(getVariable('announce'))
  var current_announce = announce[key];

  $('#'+key).empty()
  $('#'+key).append('<div id="annouce_list" class="selected">'+announcelist[key][current_announce].name+'</div><hr>');
  $('#'+key).append('<div id="annouce_list_select"><div>');
  for (i=0; i<announcelist[key].length; i++) {
    $('#annouce_list_select').append('<div onclick= setAnnounce(\''+ key+'\','+ i +')>'+ announcelist[key][i].name+'</div>');
  }
}


