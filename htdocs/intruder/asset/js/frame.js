///////////////////////////////////////////////////////////////
//メニュー・モーダル用イベント監視用関数
///////////////////////////////////////////////////////////////
// モーダル監視関数
$(function(){
  // モーダルオープン処理共通発火部
  $('.modal-opener').click(function() {
    nav($(this).attr('id'))
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

});
// モーダルオープン切り分け処理
function nav(id) {
  // console.log('openModal:('+id+')')
  // 単純移動
  var trans = ['select', 'map' ,'index', 'relocate', 'face', 'usbdebug']
  if ($.inArray(id, trans) >= 0) {transScreen(id)}

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
  set = ['set-music_volume', 'set-announce_volume', 'set-turnaround_wait']
  if ($.inArray(id, set) >= 0) {
    target = $('#'+id).attr('data-target')
    number = $('#'+target).attr('data')
    setVariable(target, number)
  }
  turnaround = ['set-turnaround']
  if ($.inArray(id, turnaround) >= 0) {
    target = $('#'+id).attr('data-target')
    number = $('#'+target).attr('data')
    setVariable(target, number)
    setVariable('turnaround', true)
    setVariable('turnaround_i', 0)
    transScreen('select')
  }
  clear = ['clear-turnaround']
  if ($.inArray(id, clear) >= 0) {
    setVariable('turnaround', false)
    setVariable('turnaround_i', 0)
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
    tolerance = JSON.parse(getVariable('tolerance'))
    destination_name = $('#set-tolerancenum').attr('data-destination')
    tolerancenum = $('#'+target).attr('data')
    // console.log(destination_name)
    tolerance.destinations[destination_name] = tolerancenum

    setVariable('tolerance', JSON.stringify(tolerance))
  }
  reserve = ['set-reserve_time']
  if ($.inArray(id, reserve) >= 0) {
    senario = $('#set-reserve_time').attr('data-reserve-senario')
    hour = $('#reserve-hour').attr('data')
    minute = $('#reserve-minute').attr('data')
    if (senario == null) {
      return
    }
    addReserve(senario, hour, minute)
  }
  closeModal()
}
// 拠点リストの表示
function viewHublist() {
  hub = JSON.parse(getVariable('hub'))
  destination_list = JSON.parse(getVariable('destination_list'))
  $('#hublist').empty()
  Object.keys(destination_list).forEach(function(key) {
    if (destination_list[key] == hub.hub) {
      $('#hublist').append('<div class="row modal-selected">'+destination_list[key]+'</div>')
    } else {
      $('#hublist').append('<div class="row" onclick="setHub(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    }
    
  })
}
// 適用外リストの表示
function viewHubexlist() {
  hub = JSON.parse(getVariable('hub'))
  destination_list = JSON.parse(getVariable('destination_list'))
  $('#hubexlist').empty()
  Object.keys(destination_list).forEach(function(key) {
    if (destination_list[key] == hub.hub) {
      $('#hubexlist').append('<div class="row modal-selected">'+destination_list[key]+'</div>')
    } else if ($.inArray(destination_list[key], hub.destination_list) >= 0) {
      $('#hubexlist').append('<div class="row modal-selected" onclick="delHubEx(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    } else {
      $('#hubexlist').append('<div class="row" onclick="setHubEx(\''+destination_list[key]+'\')">'+destination_list[key]+'</div>')
    }
    
  })
}
// 拠点の上書き
function setHub(destination_name) {
  hub = JSON.parse(getVariable('hub'))
  hub.hub = destination_name
  setVariable('hub', JSON.stringify(hub))
  viewHublist()
  viewHubexlist()
}
// 適用外拠点の上書
function setHubEx(destination_name) {
  hub = JSON.parse(getVariable('hub'))
  if (hub.destination_list == null) {
    hub.destination_list = [];
  }
  if ($.inArray(destination_name, hub.destination_list) < 0) {
    hub.destination_list.push(destination_name)
  }
  setVariable('hub', JSON.stringify(hub))
  viewHubexlist()
}
// 適用外拠点の削除
function delHubEx(destination_name) {
  hub = JSON.parse(getVariable('hub'))
  if (hub.destination_list == null) {
    hub.destination_list = [];
  }
  hub = JSON.parse(getVariable('hub'))
  if (hub == destination_name) {
    setUnderMessage('その目的地は「拠点」ですので、削除できません')
    return
  }
  if ($.inArray(destination_name, hub.destination_list) >= 0) {
    hub.destination_list.splice($.inArray(destination_name, hub.destination_list), 1)
  }
  setVariable('hub', JSON.stringify(hub))
  viewHubexlist()
}
// 拠点リストの表示
function viewTolerancelist() {
  tolerance = JSON.parse(getVariable('tolerance'))
  destination_list = JSON.parse(getVariable('destination_list'))
  $('#tolerancelist').empty()
  console.log(tolerance)
  if (tolerance.destinations == null ||tolerance.destinations == [] || tolerance.destinations == 'undefined' || tolerance.destinations.length == 0) {
    tolerance.destinations = {}
    Object.keys(destination_list).forEach(function(key) {
      tolerance.destinations[destination_list[key]] = tolerance.tolerance
    })
  } else {
    Object.keys(destination_list).forEach(function(key) {
      if (tolerance.destinations[destination_list[key]] == null) {
        tolerance.destinations[destination_list[key]] = tolerance.tolerance
      }
    })
  }
  setVariable('tolerance', JSON.stringify(tolerance))

  Object.keys(destination_list).forEach(function(key) {
    $('#tolerancelist').append('<div class="row" onclick="openTolerance(\''+destination_list[key]+'\')">'+destination_list[key]+' ('+tolerance.destinations[destination_list[key]]+')</div>')
  })
}

// 拠点リストの表示
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

function initTorelanceList() {
  tolerance = JSON.parse(getVariable('tolerance'))
  destination_list = JSON.parse(getVariable('destination_list'))
  $('#tolerancelist').empty()
  console.log(tolerance)
  if (tolerance.destinations == null) {
    tolerance.destinations = {}
    Object.keys(destination_list).forEach(function(key) {
      tolerance.destinations[destination_list[key]] = tolerance.tolerance
    })
  }
  setVariable('tolerance', JSON.stringify(tolerance))
}

function openTolerance(destination_name) {
  $('#tolerance_numset').removeClass('hid')
  $('#set-tolerancenum').attr('data-destination', destination_name)
}

// 適用外拠点の上書
// function setTolerance(destination_name) {
//   tolerance = JSON.parse(getVariable('tolerance'))

//   // if (tolerance.destination_list == null) {
//   //   tolerance.destination_list = [];
//   // } else if (tolerance.destination_list == '') {
//   //   tolerance.destination_list = [];
//   // }

//   // if ($.inArray(destination_name, tolerance.destination_list) < 0) {
//   //   tolerance.destination_list.push(destination_name)
//   // }

//   tolerance.destinations[destination_name] = $('#set-tolerancenum').attr('tolerancenum')

//   setVariable('tolerance', JSON.stringify(tolerance))
//   viewTolerancelist()
// }
// 適用外拠点の上書
function delTolerance(destination_name) {
  tolerance = JSON.parse(getVariable('tolerance'))
  // if (tolerance.destination_list == null) {
  //   tolerance.destination_list = [];
  // }
  if ($.inArray(destination_name, tolerance.destination_list) >= 0) {
    tolerance.destination_list.splice($.inArray(destination_name, tolerance.destination_list), 1)
  }
  setVariable('tolerance', JSON.stringify(tolerance))
  viewTolerancelist()
}
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

function viewSenarioList() {
  senario = JSON.parse(getVariable('senario'))
  $('#senariolist').empty()
  $('#senariolist').append('<div class="row"><input id="newsenarioname"></input><div class="sumbit" onclick="newSenario()">新規作成</div></div>')
  Object.keys(senario).forEach(function(key) {
    if (key > 0) {
      $('#senariolist').append('<div class="row" onclick="editSenario(\''+key+'\')">'+senario[key].name+'</div>')
    }
  });
}

function newSenario() {
  newsenarioname = $('#newsenarioname').val()
  console.log(newsenarioname)
  senario = JSON.parse(getVariable('senario'))
  count = senario.length
  // console.log(count)
  senario[count] = JSON.parse(JSON.stringify(senario[0] ))
  senario[count].name = newsenarioname
  setVariable('senario', JSON.stringify(senario))
  editSenario(count)
}

function editSenario(count) {
  transScreen('senariomaker', '?senario='+count)
}

function viewReserveList() {
  reserve = JSON.parse(getVariable('reserve'))
  $('#reservelist').empty()
  Object.keys(reserve).forEach(function(key) {
    if (key > 0 && reserve[key].enable == true) {
      $('#reservelist').append('<div class="row" onclick="delReserve(\''+key+'\')">'+reserve[key].senario_name+'('+reserve[key].time+')'+'</div>')
    }
  });

  senario = JSON.parse(getVariable('senario'))
  $('#reservesenariolist').empty()
  Object.keys(senario).forEach(function(key) {
    if (key > 0) {
      $('#reservesenariolist').append('<div class="row" onclick="reserveTemp(\''+key+'\')" id="senario'+key+'">'+senario[key].name+'</div>')
    }
  });

}

function reserveTemp(key) {
  console.log(key)
  senario = JSON.parse(getVariable('senario'))
  $('#set-reserve_time').attr('data-reserve-senario', senario[key].name)
  $('.row').removeClass('selected')
  $('#senario'+key).addClass('selected')
}

function addReserve(senarioname, hour, minute) {
  console.log (senarioname)
  reserve = JSON.parse(getVariable('reserve'))
  i = reserve.length
  reserve[i] = Object.assign({},reserve[0]);
  // reserve[i] = reserve[0]
  reserve[i].senario_name = senarioname
  reserve[i].time = zeroPadding(hour,2)+zeroPadding(minute,2)
  reserve[i].enable = true
  setVariable('reserve', JSON.stringify(reserve))
}

function delReserve(key) {
  reserve = JSON.parse(getVariable('reserve'))
  reserve[key].enable = false
  setVariable('reserve', JSON.stringify(reserve))
  viewReserveList()
}


///////////////////////////////////////////////////////////////
//各画面特有処理
///////////////////////////////////////////////////////////////
// 初期化画面、地図関連状況確認
function init_map_check() {
  destination_list =getVariable('destination_list')
  current_map =getVariable('current_map')
  if (destination_list == undefined || current_map == undefined) {
    transScreen('error', '?error=nomap')
  }
  transScreen('select')
}
// 地図選択画面での地図描画
function viewMapList() {
  stopBall()
  var current_map = getVariable('current_map')
  var map_list = getVariable('map_list')
  if (map_list == undefined) {
    transScreen('error', '?error=nomap')
  }
  map_list = JSON.parse(map_list)
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
function viewDestinationList(func, target = 'selectbox') {
  var destination_list = getVariable('destination_list')
  var order = JSON.parse(getVariable('order'))
  if (destination_list == undefined) {
    transScreen('error', '?error=nomap')
  }

  current_location = getVariable('current_location')

  if (order.length > 0) {
    destination_list = order
  } else {
    destination_list = JSON.parse(destination_list);
  }
  $('.boxlist').empty()
  Object.keys(destination_list).forEach(function(key) {
    $('.boxlist').append('<div class="'+target+'" onclick="'+func+'(\''+destination_list[key]+'\')" data="'+destination_list[key]+'" >'+destination_list[key]+'</div>')
  });
}

// 目的地選択画面運搬モードチェック
function tripmode_check(target) {
  tripmode = getVariable('trip_mode')
  // setLog('tripmode:'+tripmode)
  // setLog('target:'+target)
  if (tripmode == 'sequence') {
    if (target != 'sequence') {
      transScreen('sequence')
    }
  } else if (tripmode == 'hub') {
    setVariable('turnaround', false)
    setVariable('turnaround_i', 0)
    if (target != 'normal') {
      transScreen('select')
    }
  } else if (tripmode == 'senario') {
    if (target != 'senario') {
      transScreen('senario')
    }
  } else if (tripmode == 'normal') {
    if (target != 'normal') {
      transScreen('select')
    }
  } else {
    transScreen('error', '?error=tripmode')
  }
  return
}
// 
function showTripmode() {
  tripmode = getVariable('trip_mode')
  turnaround = getVariable('turnaround')
  modename = {'normal':'通常走行', 'sequence':'連続走行', 'hub':'拠点走行', 'senario': 'シナリオ走行'}
  text = modename[tripmode]
  if (turnaround == 'true') {
    text = '[往復]'+text+'モード'
  }
  setUnderMessage(text)
}
// 連続走行クリア関数
function clearSequence() {
  setVariable('sequence_array', '')
  // シナリオメーカーなら、シナリオを削除
  if (basename == 'senariomaker') {
    senario = JSON.parse(getVariable('senario'))
    senario[senarionumber].destination_list = []
    setVariable('senario', JSON.stringify(senario))
  }
  showSequence()
}
// 連続走行追加関数
function putSequence(destination) {
  sequence_array = getVariable('sequence_array')
  if (sequence_array == '') {
    sequence_array = [];
  } else if (sequence_array == undefined) {
    sequence_array = [];
  } else {
    sequence_array = JSON.parse(sequence_array)
  }
  if (sequence_array.length == 0) {
    if (getVariable('current_location') == destination) {
      setUnderMessage('最初の目的地は現在地にできません')
    } else {
      sequence_array.push(destination);
    }
  } else if (sequence_array[sequence_array.length-1] != destination) {
    sequence_array.push(destination);
  } else {
    setUnderMessage('連続で同じ場所を選択はできません')
  }
  setVariable('sequence_array', JSON.stringify(sequence_array))
  showSequence()
}
// 連続走行削除関数
function delSequence(arraynum) {
  sequence_array = getVariable('sequence_array')
  if (sequence_array == '') {
    sequence_array = [];
  } else {
    sequence_array = JSON.parse(sequence_array)
  }
  if (arraynum == 0 ) {
    setUnderMessage('最初の目的地は削除できません')
  } else if (sequence_array[arraynum - 1] == sequence_array[arraynum + 1]) {
    setUnderMessage('目的地が連続してしまうため、削除できません')
  } else {
    sequence_array.splice(arraynum,1);
  }
  setVariable('sequence_array', JSON.stringify(sequence_array))
  showSequence()
}
// 連続走行表示関数
function showSequence() {
  sequence_array = getVariable('sequence_array')
  // console.log(sequence_array)
  if (sequence_array == '') {
    sequence_array = [];
  } else {
    sequence_array = JSON.parse(sequence_array)
  }
  $('.sequence_destination_list').empty()
  Object.keys(sequence_array).forEach(function(key) {
    $('.sequence_destination_list').append('<div class="sequence_viewlist" onclick="delSequence('+key+')">'+sequence_array[key]+'</div>')
  });
  count = sequence_array.length
  if (count > 4) {
    $('.sequence_destination_list').scrollTop((count + 1) * 75)
  }
  // console.log(sequence_array.length)
  $('.gobutton').empty()
  if (sequence_array.length > 0) { 
    $('.gobutton').append('<div class="button_go" onclick="move(\''+sequence_array[0]+'\')">発進</div>')
  }
}
// シナリオ一覧描画
function viewSenario() {
  senario = JSON.parse(getVariable('senario'))
  if (senario.length < 2) {
    setVariable('trip_mode', 'normal')
    console.log('no senario')
    transScreen('select')
    setUnderMessage('シナリオが登録されていません')
    return
  }
  $('.boxlist').empty()
  Object.keys(senario).forEach(function(key) {
    console.log(senario[key].destination_list)
    if (senario[key].destination_list != null) {
      $('.boxlist').append('<div class="selectbox" onclick="senario_move(\''+key+'\')" data="'+senario[key].destination_list[0]+'" >'+senario[key].name+'</div>')
    }
  });
}
// シナリオ描画
function showSenario(senarionumber) {
  senario = JSON.parse(getVariable('senario'))
  // console.log(senario)
  // console.log(senarionumber)
  current_senario = senario[senarionumber]
  // console.log(current_senario)
  $('.sequence_destination_list').empty()
  if (current_senario.destination_list != null) {
    Object.keys(current_senario.destination_list).forEach(function(key) {
      $('.sequence_destination_list').append('<div class="sequence_viewlist" onclick="delSequence('+key+')">'+current_senario.destination_list[key]+'</div>')
    });
    count = current_senario.destination_list.length
    if (count > 4) {
      $('.sequence_destination_list').scrollTop((count + 1) * 75)
    }
  }
  $('.gobutton').empty()
  $('.gobutton').append('<input id="currentsenarioname" value="'+current_senario.name+'"></input><div class="sumbit" onclick="changeCurrentSenarioName()">名称変更</div>')
}

function clearSenario() {
  setVariable('sequence_array', '')
  showSequence()
}
function putSenario(destination_name) {
  senario = JSON.parse(getVariable('senario'))
  if (senario[senarionumber].destination_list == '') {
    senario[senarionumber].destination_list = [];
  } else if (senario[senarionumber].destination_list == undefined) {
    senario[senarionumber].destination_list = [];
  }
  if (senario[senarionumber].destination_list[senario[senarionumber].destination_list.length-1] != destination_name) {
    senario[senarionumber].destination_list.push(destination_name);
  } else {
    setUnderMessage('連続で同じ場所を選択はできません')
  }

  
  console.log(senario)
  setVariable('senario', JSON.stringify(senario))
  showSenario(senarionumber)
}
// 連続走行削除関数
function delSenario(arraynum) {
  senario = JSON.parse(getVariable('senario'))
  if (senario[senarionumber].destination_list == '') {
    senario[senarionumber].destination_list = [];
  }
  if (arraynum == 0 ) {
    setUnderMessage('最初の目的地は削除できません')
  } else if (senario[senarionumber].destination_list[arraynum - 1] == senario[senarionumber].destination_list[arraynum + 1]) {
    setUnderMessage('目的地が連続してしまうため、削除できません')
  } else {
    senario[senarionumber].destination_list.splice(arraynum,1);
  }
  setVariable('senario', JSON.stringify(senario))
  showSequence()
}

function changeCurrentSenarioName() {
  newsenarioname = $('#currentsenarioname').val()
  senario = JSON.parse(getVariable('senario'))
  senario[senarionumber].name = newsenarioname
  setVariable('senario', JSON.stringify(senario))
}