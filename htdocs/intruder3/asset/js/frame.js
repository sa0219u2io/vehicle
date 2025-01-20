///////////////////////////////////////////////////////////////
//メニュー・モーダル用イベント監視用関数
///////////////////////////////////////////////////////////////
// モーダル監視関数
$(function(){
  // モーダルオープン処理共通発火部
  $('.modal-opener').click(function() {
    if (!$(this).hasClass("no-menu")) {
      nav($(this).attr('id'))
    }
  });
  // モーダル内部処理共通発火部
  $('.modal-button').click(function() {
    modal($(this).attr('id'))
  });
  // モーダル内部数値関連処理
  var touched = false;
  var touch_time = 0;
  var touch_judge = 500
  var touch_interval = 100

  $(".number-alter").bind({
    'touchstart mousedown': function(e) {
      touched = true;
      touch_time = 0;

      target = $(this).attr('data-target')
      touch = parseInt($(this).attr('data-touch'))
      hold = parseInt($(this).attr('data-hold'))
      min = parseInt($(this).attr('data-min'))
      max = parseInt($(this).attr('data-max'))

      document.interval = setInterval(function(){
        touch_time += touch_interval;
        // console.log(touch_time%touch_interval)
        if ((touch_time % touch_interval) == 0) {
          var number = parseInt($('#'+target).text());
          if(number >= min && number <= max) {
            number += touch;
            $('#'+target).text(number);
            $('#'+target).attr('data', number);
          }
        } 

        if (touch_time > touch_judge) {
          // console.log('touch_judge:'+touch_time)
          var number = parseInt($('#'+target).text());
          if (hold > 0) {
            // 増加
            if (number < (max - hold)) {
              number += hold;
            } else {
              number = max;
            }
            $('#'+target).text(number);
            $('#'+target).attr('data', number);
          } else {
            // 減少
            if (number > (min - hold)) {
              number += hold;
            } else {
              number = min;
            }
            $('#'+target).text(number);
            $('#'+target).attr('data', number);
          }
        }
      }, touch_interval);
    },
    'touchend mouseup mouseout': function(e) {
      // マウスが領域外に出たかどうかも拾うと、より自然
      
      touched = false;
      clearInterval(document.interval);
      //e.preventDefault();
    }
  });

  // パネルオープン処理共通発火部
  $('.panel-opener').click(function() {
    if (!$(this).hasClass("no-menu")) {
      modalNumbers()
      $('#modal-bg').removeClass('hid')
      $("#modal-bg").fadeIn("slow");
      $("#panel-info").removeClass('hid')
      $("#panel-info").fadeIn("slow");
      viewInfo();
    }
  });
});
// モーダルオープン切り分け処理
function nav(id) {
  // console.log('openModal:('+id+')')
  // 単純移動
  var trans = ['map' ,'index', 'relocate', 'face', 'debug']
  if ($.inArray(id, trans) >= 0) {transScreen(id)}
  if (id == 'select') {
    setVariable('cutin', false)
    transScreen(id)
    return
  }
  // 単純オープン
  var open = ['normal', 'turnaround', 'sequence', 'menu']
  if ($.inArray(id, open) >= 0) {openModal(id)}

  // 特殊処理
  if (id == 'music') {
    openModal('music')
    viewMusic();
  }
  if (id == 'announce') {
    openModal('announce')
    viewAnnounce();
  }
  if (id == 'movie') {
    openModal('movie')
    viewMusic();
  }
  if (id == 'hub') {
    openModal('hub')
    // 拠点走行の拠点リスト・適用外リストの表示生成
    viewHublist()
    viewHubexlist()
  }
  if (id == 'tolerance') {
    openModal('tolerance')
    // 誤差許容リストの表示生成
    viewTolerancelist()
    // viewHubexlist()
  }
  if (id == 'order') {
    openModal('order')
    // 誤差許容リストの表示生成
    viewOrderlist()
    // viewHubexlist()
  }
  if (id == 'erase') {
    wipeVariable()
    // closeModal()
  }
  if (id == 'senario') {
    openModal('senario')
    viewSenarioList()
  }
  if (id == 'reserve') {
    openModal('reserve')
    viewReserveList()
  }
  if (id == 'multiple') {
    openModal('multiple')
    viewMultipleSetting()
  }
}
//モーダルオープン
function openModal(string = false) {
  // console.log('openmodal:'+string)
  modalNumbers()
  $('#modal-bg').removeClass('hid')
  $("#modal-bg").fadeIn("slow");
  if (string) {
    $("#modal-"+string).removeClass('hid')
    $("#modal-"+string).fadeIn("slow");
  }
}
// モーダル用内部変数のセット
function modalNumbers() {
  // 往復回数
  // console.log('modalNumbers')
  var wait_keys = ['wait-sequence', 'wait-hub']
  var target = {'number-turnaround':50, 'wait-sequence': 0, 'wait-hub': 0, 'music_volume' : 100, 'announce_volume': 100, 'turnaround_wait': 25, 'tolerancenum' : 110, 'reserve-hour' : 12, 'reserve-minute': 30}
  turnaround = getVariable('turnaround','obj')
  target.turnaround = 
  target.turnaround_wait = 

  Object.keys(target).forEach(function(key) {
    if ($.inArray(key, wait_keys) >= 0) {
      // console.log(key)
      tripmode = key.slice(5) ;
      number = getWait(tripmode)
    } else {
      number = getVariable(key)
    }
    if (number == undefined) number = target[key]
    $('#'+key).text(number)
    $('#'+key).attr('data', number);
  });

}
//モーダルクローズ
function closeModal(music='stopmusic') {
  $(".modal,#modal-bg").fadeOut("slow",function(){
    // $('.modalchild').children().remove();
    $('#modal-bg').addClass('hid')
    $('.modal').addClass('hid')
    $('.panel').addClass('hid')
  });
  current_map = getVariable('current_map')
  writeVariable(current_map)
  if (music='estopmusicnd') {
    stopMusic()
  }
  $('.modalnum').addClass('hid')
}
// モーダル内部処理
function modal(id) {
  // console.log(id)
  if (id == 'set-tripmode-normal') {
    setVariable('trip_mode', 'normal')
    transScreen('select')
  }
  if (id == 'set-tripmode-senario') {
    setVariable('trip_mode', 'senario')
    transScreen('select')
  }
  set = ['set-music_volume', 'set-announce_volume']
  if ($.inArray(id, set) >= 0) {
    target = $('#'+id).attr('data-target')
    number = $('#'+target).attr('data')
    setVariable(target, number)
  }
  turnaround = ['set-turnaround']
  if ($.inArray(id, turnaround) >= 0) {
    turnaround = getVariable('turnaround','obj')
    turnaround.number = parseInt($('#number-turnaround').attr('data'))
    turnaround.wait = parseInt($('#turnaround_wait').attr('data'))
    setVariable('turnaround',turnaround,'obj')

    transScreen('select')
  }
  clear = ['clear-turnaround']
  if ($.inArray(id, clear) >= 0) {
    turnaround = getVariable('turnaround','obj')
    turnaround.number = 0
    setVariable('turnaround',turnaround,'obj')
    transScreen('select')
  }
  mode = ['set-sequence', 'set-hub']
  if ($.inArray(id, mode) >= 0) {
    tripmode = id.slice(4)
    target = $('#'+id).attr('data-target')
    number = $('#'+target).attr('data')
    setVariable('trip_mode', tripmode)
    clearSequence()
    setWait(tripmode, number)
    transScreen('select')
  }
  tolerance = ['set-tolerancenum']
  if ($.inArray(id, tolerance) >= 0) {
    target = $('#'+id).attr('data-target')
    tolerance = getVariable('tolerance','obj')
    destination_name = $('#set-tolerancenum').attr('data-destination')
    tolerancenum = $('#'+target).attr('data')
    tolerance.destination_settings[destination_name] = tolerancenum

    setVariable('tolerance',tolerance,'obj')
  }
  reserve = ['set-reserve_time']
  if ($.inArray(id, reserve) >= 0) {
    senarionumber = $('#set-reserve_time').attr('data-reserve-senarionumber')
    senarioname = $('#set-reserve_time').attr('data-reserve-senarioname')
    hour = $('#reserve-hour').attr('data')
    minute = $('#reserve-minute').attr('data')
    if (senario == null) {
      return
    }
    addReserve(senarionumber, senarioname, hour, minute)
    return
  }
  if (id == 'set-multiple') {
    setMultiple()
  }
  if (id == 'clear-multiple') {
    clearMultiple()
  }
  closeModal()
}
// 情報パネル処理
function viewInfo() {
  $('.panel-info').empty()
  current_map = getVariable('current_map')
  current_location = getVariable('current_location')
  $('#info-current_location').append('['+current_map+']'+current_location)
  showTripmode(false)
    
  if (isTrue(getVariable('multiple_flg'))) {
    multiple = getVariable('multiple','obj')
    multiple_status = getMeMultiple()
    Object.keys(multiple_status).forEach(function(key) {
      if (isInArray(key, multiple.iplist)){
        if (multiple_status[key] != null) {
          text = key+':['+multiple_status[key].current_location+'] => ['+multiple_status[key].work.to+']<br>'
        }
        $('#info-multiple_status').append(text)
      }
    })
    multiple_judgement = getMultipleJudgement(multiple);
    text = JSON.stringify(multiple_judgement)
    $('#info-multiple_judgement').append(text)
  }
}

///////////////////////////////////////////////////////////////
// 拠点設定
///////////////////////////////////////////////////////////////
// 拠点リストの表示
function viewHublist() {
  hub = getVariable('hub','obj')
  destination_list = getVariable('destination_list','obj')
  $('#hublist').empty()
  Object.keys(destination_list).forEach(function(key) {
    if (destination_list[key] == hub.hub) {
      $('#hublist').append('<div class="row modal-selected">'+destination_list[key]+'</div>')
    } else {
      $('#hublist').append('<div class="row" onclick="setHub(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    }
    
  })

  $('#hubexlist').empty()
  Object.keys(destination_list).forEach(function(key) {
    if (destination_list[key] == hub.hub) {
      $('#hubexlist').append('<div class="row modal-selected">'+destination_list[key]+'</div>')
    } else if ($.inArray(destination_list[key], hub.destination_settings) >= 0) {
      $('#hubexlist').append('<div class="row modal-selected" onclick="delHubEx(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    } else {
      $('#hubexlist').append('<div class="row" onclick="setHubEx(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    }
    
  })
}
// 拠点の上書き
function setHub(destination_name) {
  hub = getVariable('hub','obj')
  hub.hub = destination_name
  setVariable('hub',hub,'obj')
  viewHublist()
}
// 適用外拠点の上書
function setHubEx(destination_name) {
  hub = getVariable('hub','obj')
  if (hub.destination_settings == null) {
    hub.destination_settings = [];
  }
  if ($.inArray(destination_name, hub.destination_settings) < 0) {
    hub.destination_settings.push(destination_name)
  }
  setVariable('hub',hub,'obj')
  viewHublist()
}
// 適用外拠点の削除
function delHubEx(destination_name) {
  hub = getVariable('hub','obj')
  if (hub.destination_settings == null) {
    hub.destination_settings = [];
  }
  hub = JSON.parse(getVariable('hub'))
  if (hub == destination_name) {
    setUnderMessage('その目的地は「拠点」ですので、削除できません')
    return
  }
  if ($.inArray(destination_name, hub.destination_settings) >= 0) {
    hub.destination_settings.splice($.inArray(destination_name, hub.destination_list), 1)
  }
  setVariable('hub',hub,'obj')
  viewHublist()
}

///////////////////////////////////////////////////////////////
//目的地設定（許容誤差・表示順）
///////////////////////////////////////////////////////////////
// 拠点リストの表示
function viewTolerancelist() {
  tolerance = getVariable('tolerance','obj')
  console.log(tolerance)
  if (tolerance.destination_settings == null) {
    initDestinationListTorelance()
  }
  $('#tolerancelist').empty()
  Object.keys(tolerance.destination_settings).forEach(function(key) {
    $('#tolerancelist').append('<div class="row" onclick="openTolerance(\''+key+'\')">'+key+' ('+tolerance.destination_settings[key]+')</div>')
  })
}
// 許容誤差数値設定画面
function openTolerance(destination_name) {
  $('#tolerance_numset').removeClass('hid')
  $('#set-tolerancenum').attr('data-destination', destination_name)
}
// 表示順用拠点リストの表示
function viewOrderlist() {
  order = JSON.parse(getVariable('order'))
  destination_list = JSON.parse(getVariable('destination_list'))
  $('#orderlist').empty()

  console.debug(order)

  if (order == null ||order == [] || order == 'undefined' || order.length == 0) {
    //新規
    order = destination_list
  }
  // console.log(order)
  setVariable('order', JSON.stringify(order))

  Object.keys(order).forEach(function(key) {
    $('#orderlist').append('<div class="row">'+'<span onclick="upOrder(\''+order[key]+'\')">△</span>&emsp;'+order[key]+'&emsp;<span onclick="downOrder(\''+order[key]+'\')">▽</span>'+'</div>')
  })
}
// 表示順上昇
function upOrder(destination_name) {
  order = JSON.parse(getVariable('order'))
  // 入れ替える要素のindex
  const index = order.indexOf(destination_name);
  if (index == undefined || index == 0) {return}
  order.splice(index-1, 2, order[index], order[index-1]);
  console.log(order)
  setVariable('order', JSON.stringify(order))
  viewOrderlist()
}
// 表示順下降
function downOrder(destination_name) {
  order = JSON.parse(getVariable('order'))
  // 入れ替える要素のindex
  const index = order.indexOf(destination_name);
  if (index == undefined || index >= (order.length - 1)) {return}
  order.splice(index, 2, order[index+1], order[index]);
  console.log(order)
  setVariable('order', JSON.stringify(order))
  viewOrderlist()
}

///////////////////////////////////////////////////////////////
// 音楽・アナウンス
///////////////////////////////////////////////////////////////
// 音楽再生リストの表示
function viewMusic() {
  musiclist = readJson("music")
  setLog(musiclist)
  current_music = getVariable('music');
  $('#musiclist').empty()
  Object.keys(musiclist).forEach(function(key) {
    if (key == current_music) {
      $('#musiclist').append('<div class="row modal-selected">'+musiclist[key].name+'</div>')
    } else {
      $('#musiclist').append('<div class="row" onclick="setMusic(\''+key+'\')">'+musiclist[key].name+'</div>')
    }
  });
}
// 音楽の設定
function setMusic(number) {
  setVariable('music', number)
  stopMusic()
  playMusic(number)
  viewMusic()
}
// アナウンスリストの表示
function viewAnnounce() {
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
  var announce = JSON.parse(getVariable('announce'))
  setLog(announce)
  Object.keys(announce).forEach(function (key) {
    $('#announcelist').append('<div class="row" onclick="viewEachAnnounce(\''+key+'\')">'+anlist[key]+'</div>')
  });
}
// 個別アナウンスリストの表示
function viewEachAnnounce(mode) {
  console.log(mode)
  var announcelist = readJson('announce')
  openModal('announce-'+mode);
  console.log(announcelist)

  var announce = JSON.parse(getVariable('announce'))
  var current_announce = announce[mode];
  // console.log(current_announce)
  $('#child-'+mode).empty()

  Object.keys(announcelist[mode]).forEach(function (key) {
    console.log(key)
    console.log(announcelist[mode][key])
    if (key == current_announce) {
      $('#child-'+mode).append('<div class="row selected">'+announcelist[mode][key].name+'</div>')
    } else {
      $('#child-'+mode).append('<div class="row" onclick="setAnnounce(\''+mode+'\', \''+key+'\')">'+announcelist[mode][key].name+'</div>')
    }
  });

  $('#child-'+mode).append('<hr><br>')
  $('#child-'+mode).append('<div class="row" onclick="closeChildModal(\'modal-announce-'+mode+'\')">閉じる</div>')
}

function closeChildModal (id) {
  $("#"+id).fadeOut("slow");
  $("#"+id).addClass("hid");
  $('.modalnum').addClass('hid')
}

function setAnnounce(mode ,key) {
  announce = JSON.parse(getVariable('announce'))
  announce[mode] = key
  console.log(announce)
  setVariable('announce', JSON.stringify(announce))
  playAnnounce(mode)
  viewEachAnnounce(mode)
}

///////////////////////////////////////////////////////////////
//各画面特有処理
///////////////////////////////////////////////////////////////
// 初期化画面、地図関連状況確認、表示順確認、複数台設定確認
function init_map_check() {
  destination_list =getVariable('destination_list')
  current_map =getVariable('current_map')
  if (destination_list == undefined || current_map == undefined) {
    transScreen('error', '?error=nomap')
  }
  initDestinationListOrder(current_map)
  initDestinationListTorelance(current_map)
  operatedFlg(false)
  // setMultiple(count = 0)
  // setVariable('multiple_flg',false)

  transScreen('select')

}
// 地図選択画面での地図描画
function viewMapList() {
  stopBall()
  var current_map = getVariable('current_map')
  var map_list = getVariable('map_list','obj')
  if (map_list == undefined) {
    transScreen('error', '?error=nomap')
  }
  $('.boxlist').empty()
  Object.keys(map_list).forEach(function(key) {
    if (map_list[key].map_name == current_map) {
      $('.boxlist').append('<div class="selectbox selected" onclick="setMap(\''+map_list[key].map_name+'\')">'+map_list[key].map_name+'</div>')
    } else {
      $('.boxlist').append('<div class="selectbox" onclick="setMap(\''+map_list[key].map_name+'\')">'+map_list[key].map_name+'</div>')
    }
  });
}
// 地図の変更セット
function setMap(map_id) {
  loadBall()
  req_change_map(map_id)
}
// 目的地リスト描画
function viewDestinationList(func = 'makeWork', target = 'selectbox') {
  var order = getVariable('order','obj')
  if (order == 'undefined') {
    var current_map = getVariable('current_map')
    getDestinationListOrder(current_map)
  }
  current_location = getVariable('current_location')
  setLog(order)

  $('.boxlist').empty()
  Object.keys(order).forEach(function(key) {
    $('.boxlist').append('<div class="'+target+'" onclick="'+func+'(\''+order[key]+'\')" data="'+order[key]+'" >'+order[key]+'</div>')
  });
  // 連続走行モードで、シーケンスがある場合
  if (func='putSequence') {
    showSequence()
  }
}
// 走行モードの表示
function showTripmode(target = true) {
  tripmode = getVariable('trip_mode')
  map_name = getVariable('current_map')
  turnaround = getVariable('turnaround','obj')
  multiple_flg = getVariable('multiple_flg')
  opereted = getVariable('operated')

  modename = {'normal':'通常走行','hub':'拠点走行','multiple-hub':'拠点走行-複数','sequence':'連続走行','senario': 'シナリオ走行'}
  text = modename[tripmode]
  if (turnaround.number > 0) {
    text = '['+turnaround.number+'回往復]'+text+'モード'
  }
  if (target) {
    setUnderMessage(text)
  } else {
    if (isTrue(multiple_flg)) {
      text = text + '[複数台稼働ON('+ opereted +')]'
    }
    $('#info-trip_mode').append(text)
  }
  
}

function showWork() {
  work = getWork()
  current_location = getVariable('current_location')
  $('.current_location').removeClass('current_location')
  $('[data="'+current_location+'"]').addClass('current_location')
  $('.move_to').removeClass('move_to')
  $('[data="'+work.to+'"]').addClass('move_to')
}

///////////////////////////////////////////////////////////////
// 連続走行画面
///////////////////////////////////////////////////////////////
// 連続走行クリア関数
function clearSequence() {
  sequence = getVariable('sequence','obj')
  sequence.destination_settings = []
  setVariable('sequence',sequence,'obj')
  // シナリオメーカーなら、シナリオを削除
  if (basename == 'senariomaker') {
    senario = getVariable('senario','obj')
    senario[senarionumber].destination_settings = []
    setVariable('senario',senario,'obj')
  }
  showSequence()
}
// 連続走行追加関数
function putSequence(destination) {
  sequence = getVariable('sequence','obj')
  senario_edit = getVariable('senario_edit')
  if (sequence.destination_settings == '') {
    sequence.destination_settings = [];
  } else if (sequence.destination_settings == undefined) {
    sequence.destination_settings = [];
  }

  if (sequence.destination_settings.length == 0) {
    if (isFalse(senario_edit) && getVariable('current_location') == destination) {
      setUnderMessage('最初の目的地は現在地にできません')
    } else {
      sequence.destination_settings.push(destination);
    }
  } else if (sequence.destination_settings[sequence.destination_settings.length-1] != destination) {
    sequence.destination_settings.push(destination);
  } else {
    setUnderMessage('連続で同じ場所を選択はできません')
  }
  setVariable('sequence',sequence,'obj')
  showSequence()
}
// 連続走行削除関数
function delSequence(arraynum) {
  sequence = getVariable('sequence','obj')
  if (sequence.destination_settings == '') {
    sequence.destination_settings = [];
  }
  if (arraynum == 0 ) {
    setUnderMessage('最初の目的地は削除できません')
  } else if (sequence.destination_settings[arraynum - 1] == sequence.destination_settings[arraynum + 1]) {
    setUnderMessage('目的地が連続してしまうため、削除できません')
  } else {
    sequence.destination_settings.splice(arraynum,1);
  }
  setVariable('sequence',sequence,'obj')
  showSequence()
}
// 連続走行表示関数
function showSequence() {
  sequence = getVariable('sequence','obj')
  // console.log(sequence_array)
  if (sequence.destination_settings == '') {
    sequence.destination_settings = [];
  }
  
  $('.sequence_destination_list').empty()
  Object.keys(sequence.destination_settings).forEach(function(key) {
    $('.sequence_destination_list').append('<div class="sequence_viewlist" onclick="delSequence('+key+')">'+sequence.destination_settings[key]+'</div>')
  });
  count = sequence.destination_settings.length
  if (count > 4) {
    $('.sequence_destination_list').scrollTop((count + 1) * 75)
  }
  // console.log(sequence_array.length)
  $('.gobutton').empty()
  if (sequence.destination_settings.length > 0) { 
    senario_edit = getVariable('senario_edit')
    if (getStatus('interval') == true || getStatus('interval') == 'true') {
      $('.gobutton').append('<div class="button_go" onclick="makeWork()">移動再開</div>')
    } else if (!isFalse(senario_edit)){
      $('.gobutton').append('<div class="button_go" onclick="updateSenario(\''+ senario_edit +'\')">更新</div>')
    } else {
      $('.gobutton').append('<div class="button_go" onclick="makeWork()">発進</div>')
    }
    
  }
}

///////////////////////////////////////////////////////////////
// シナリオ関連
///////////////////////////////////////////////////////////////
// シナリオ画面用一覧描画
function viewSenario() {
  senario = getVariable('senario','obj')
  if (senario.length < 2) {
    setVariable('trip_mode', 'normal')
    transScreen('select')
    setUnderMessage('シナリオが登録されていません')
    return
  }
  $('.boxlist').empty()
  Object.keys(senario).forEach(function(key) {
    if (key >0 && senario[key].destination_settings != null) {
      $('.boxlist').append('<div class="selectbox" onclick="makeWork('+key+')">'+senario[key].name+'</div>')
    }
  });
}
// モーダルシナリオ一覧
function viewSenarioList() {
  senario = getVariable('senario','obj')
  $('#senariolist').empty()
  $('#senariolist').append('<div class="row"><input id="newsenarioname"></input><div class="sumbit" onclick="newSenario()">新規作成</div></div>')
  Object.keys(senario).forEach(function(key) {
    if (key > 0) {
      $('#senariolist').append('<div class="row"><input id="'+key+'" value="'+senario[key].name+'"></input><div class="sumbit" onclick="changeSenarioName('+key+')">変更</div><div class="sumbit" onclick="deleteSenario('+key+')">削除</div></div>')
    }
  });
}
// 新規シナリオ作成
function newSenario() {
  newsenarioname = $('#newsenarioname').val()
  senario = getVariable('senario','obj')
  count = senario.length
  senario[count] = $.extend(true,{},senario[0])
  senario[count].name = newsenarioname
  setVariable('senario',senario,'obj')
  editSenario(count)
}
// シナリオ名変更
function changeSenarioName(count) {
  newsenarioname = $('#'+count).val()
  senario = getVariable('senario','obj')
  senario[count].name = newsenarioname
  setVariable('senario',senario,'obj')
  viewSenarioList()
}
// シナリオ削除
function deleteSenario(count) {
  senario = getVariable('senario','obj')
  senario.splice(count,1);
  setVariable('senario',senario,'obj')
  viewSenarioList()
}
// シナリオ内容変更
function editSenario(count) {
  setVariable('senario_edit', count)
  transScreen('sequence')
}
// シナリオ内容更新
function updateSenario(count) {
  console.log(count)
  senario = getVariable('senario','obj')
  sequence = getVariable('sequence','obj')
  senario[count].destination_settings = sequence.destination_settings
  setVariable('senario',senario,'obj')
  sequence.destination_settings = []
  setVariable('sequence',sequence,'obj')
  setVariable('trip_mode', 'senario')
  setVariable('senario_edit',false)
  transScreen('senario')
}

///////////////////////////////////////////////////////////////
// 予約関連
///////////////////////////////////////////////////////////////
// 予約用一覧
function viewReserveList() {
  reserve = getVariable('reserve','obj')
  $('#reservelist').empty()
  Object.keys(reserve).forEach(function(key) {
    if (key > 0 && reserve[key].enable == true) {
      $('#reservelist').append('<div class="row" onclick="delReserve(\''+key+'\')">'+reserve[key].senario_name+'('+reserve[key].time+')'+'</div>')
    }
  });

  senario = getVariable('senario','obj')
  $('#reservesenariolist').empty()
  Object.keys(senario).forEach(function(key) {
    if (key > 0) {
      $('#reservesenariolist').append('<div class="row" onclick="reserveTemp(\''+key+'\')" id="senario'+key+'">'+senario[key].name+'</div>')
    }
  });
}

// 予約シナリオ待機
function reserveTemp(key) {
  senario = getVariable('senario','obj')
  $('#set-reserve_time').attr('data-reserve-senarioname', senario[key].name)
  $('#set-reserve_time').attr('data-reserve-senarionumber', key)
  $('.row').removeClass('selected')
  $('#senario'+key).addClass('selected')
}

// 予約追加
function addReserve(senarionumber,senarioname, hour, minute) {
  reserve = getVariable('reserve','obj')
  i = reserve.length
  reserve[i] = Object.assign({},reserve[0]);
  // reserve[i] = reserve[0]
  if (senarioname == '') {
    return
  }
  reserve[i].senario_number = senarionumber
  reserve[i].senario_name = senarioname
  reserve[i].time = zeroPadding(hour,2)+zeroPadding(minute,2)
  reserve[i].enable = true
  setVariable('reserve',reserve,'obj')
  viewReserveList()
}

// 予約削除
function delReserve(key) {
  reserve = getVariable('reserve','obj')
  reserve[key].enable = false
  setVariable('reserve',reserve,'obj')
  viewReserveList()
}

///////////////////////////////////////////////////////////////
// 複数稼働設定
///////////////////////////////////////////////////////////////
// 拠点リストの表示
function viewMultipleSetting () {
  multiple = getVariable('multiple','obj')
  destination_list = getVariable('destination_list','obj')
  $('#multiplehublist').empty()
  //回避リストの生成
  Object.keys(destination_list).forEach(function(key) {
    if ($.inArray(destination_list[key],multiple.hublist) > -1) {
      $('#multiplehublist').append('<div class="row modal-selected" onclick="unsetMultipleHub(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    } else {
      $('#multiplehublist').append('<div class="row" onclick="setMultipleHub(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    }
  })
  //除外リストの生成
  $('#multipleexceptionlist').empty()
  Object.keys(destination_list).forEach(function(key) {
    if ($.inArray(destination_list[key],multiple.exceptionlist) > -1) {
      $('#multipleexceptionlist').append('<div class="row modal-selected" onclick="unsetMultipleException(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    } else {
      $('#multipleexceptionlist').append('<div class="row" onclick="setMultipleException(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    }
  })
  // MyIPの表示
  $('#multiplemyip').empty()
  $('#multiplemyip').append('<div class="row">'+multiple.myip+'</div>')
  $('#multiplemyip').append('<div class="row"><input id="myip"></input><div class="sumbit" onclick="updatemyip()">更新</div></div>')
  // 他社IPの表示
  $('#multipleiplist').empty()
  Object.keys(multiple.iplist).forEach(function(key) {
    $('#multipleiplist').append('<div class="row" onclick="deleteIplist(\''+multiple.iplist[key]+'\')">'+multiple.iplist[key]+'</div>')
  });
  $('#multipleiplist').append('<div class="row"><input id="newiplist"></input><div class="sumbit" onclick="addIplist()">追加</div></div>')

}

// 回避先リストに追加
function setMultipleHub(destination) {
  multiple = getVariable('multiple','obj')
  multiple.hublist.push(destination)
  setVariable('multiple',multiple,'obj')
  viewMultipleSetting ()
}
// 回避先リストから削除
function unsetMultipleHub(destination) {
  multiple = getVariable('multiple','obj')
  multiple.hublist.splice(multiple.hublist.indexOf(destination), 1)
  setVariable('multiple',multiple,'obj')
  viewMultipleSetting ()
}
// 除外リストに追加
function setMultipleException(destination) {
  multiple = getVariable('multiple','obj')
  multiple.exceptionlist.push(destination)
  setVariable('multiple',multiple,'obj')
  viewMultipleSetting ()
}
// 除外リストから削除
function unsetMultipleException(destination) {
  multiple = getVariable('multiple','obj')
  multiple.exceptionlist.splice(multiple.exceptionlist.indexOf(destination), 1)
  setVariable('multiple',multiple,'obj')
  viewMultipleSetting ()
}
// MYIP更新
function updatemyip(destination) {
  multiple = getVariable('multiple','obj')
  newip = $('#myip').val()
  multiple.myip = newip
  setVariable('multiple',multiple,'obj')
  viewMultipleSetting ()
}
function deleteIplist(ip) {
  multiple = getVariable('multiple','obj')
  multiple.iplist.splice(multiple.iplist.indexOf(ip), 1)
  setVariable('multiple',multiple,'obj')
  viewMultipleSetting ()
}
function addIplist() {
  multiple = getVariable('multiple','obj')
  newip = $('#newiplist').val()
  multiple.iplist.push(newip)
  setVariable('multiple',multiple,'obj')
  viewMultipleSetting ()
}

function setMultiple() {
  multiple = getVariable('multiple','obj')
  multiple.count = count
  setVariable('multiple_flg',true)
  setUnderMessage('複数台稼働モードをONにしました')
  setVariable('multiple',multiple,'obj')
}

function clearMultiple() {
  multiple = getVariable('multiple','obj')
  multiple.count = count
  setVariable('multiple_flg',false)
  setUnderMessage('複数台稼働モードをOFFにしました')
  setVariable('multiple',multiple,'obj')
}
