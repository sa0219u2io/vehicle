<?php $main = ''?>
<?php $mainmessage = ''?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  var autostart = 10;
  var i = 0;

  //走行モードの取得
  function automove() {
    trip_mode = getVariable('trip_mode');
    current_destination_id = getVariable('current_destination_id');

    deslist = JSON.parse(getVariable('dl_all_array'))[getVariable('current_map_id')]

    turnaround_count = getVariable('turnaround_count')
    max = turnaround*2

    setLog(0, trip_mode);
    var nextid
    switch (trip_mode) {
      case '1': //連続走行モード
      setLog(0,'連続走行')
      sequencearray = getVariable('sequencearray')
      array = JSON.parse(sequencearray);
      i = getVariable('sequencei')
      i++
      count = Object.keys(array).length;

      //連続走行スタックに目的地がスタックされているか確認
      if (i == count) {
        //最終目的の場合
        //シングルモードなら
        setVariable('sequencei', 1)
        transScreen('select')
      } else {
        //次の目的地がある場合
        autostart = getWait('sequence')
        //setLog(0,time)
        setMainMessage(time + '秒後に自動で移動を開始します(連続走行)');
        var time = autostart*1000
        nextid = array[i]
        setLog(0,nextid)
        setUnderMessage(deslist[nextid]+'へ向かいます')
        setVariable('sequencei', i)
        setVariable('move_from', current_destination_id)
        setVariable('move_to', nextid)
        playAnnounce('autostart')
        setTimeout(function(){req_move(nextid)}, time)
      }
      break;

      case '2': //拠点走行モード
        setLog(0,'拠点走行')
        nextid = getVariable('hub_destination_id');
        if (current_destination_id == nextid) {
          transScreen('select')
        }
        playAnnounce('autostart')
        autostart = getWait('hub')
        setUnderMessage(deslist[nextid]+'へ向かいます(拠点走行)')
        var time = autostart*1000
        setVariable('move_from', current_destination_id)
        setVariable('move_to', nextid)
        setTimeout(function(){req_move(nextid)}, time)
      break;

      case '3': //巡回走行モード
        setLog(0,'巡回走行')
        roundarray = getVariable('roundarray')
        array = JSON.parse(roundarray);
        i = getVariable('roundi')
        i++
        count = Object.keys(array).length;

        //連続走行スタックに目的地がスタックされているか確認
        if (i == count) {
          //最終目的の場合
          if (turnaround > 0) {
            //往復モードなら
            setVariable('roundi', 1)
            transScreen('select')
            playAnnounce('autostart')
          } else {
            //シングルモードなら
            setVariable('roundi', 1)
            transScreen('select')
            playAnnounce('autostart')
          }
        } else {
          //次の目的地がある場合
          autostart = getWait('round')
          setUnderMessage(deslist[nextid]+'へ向かいます(巡回走行)')
          var time = autostart*1000
          nextid = array[i]
          setLog(0,nextid)
          setVariable('roundi', i)
          setVariable('move_from', current_destination_id)
          setVariable('move_to', nextid)
          playAnnounce('autostart')
          setTimeout(function(){req_move(nextid)}, time)
        }
      break;
      default:
        setVariable('sequencei', 1)
        setVariable('roundi', i)
        setVariable('trip_mode', 0)
        transScreen('select')
      break;
    }
    $('.main').append('<div class="autostart" onclick="move(\''+nextid+'\')">'+deslist[nextid]+'へ移動する</div>')
    setInterval(countup, defaultlooptimer);
  }
  setTimeout(automove, 2000)
//タイマースクリプト
  //setTimeout(function(){}, 1500)

//ループスクリプト
  function countup() {
    if (i <= autostart) {
      setMainMessage(autostart-i+'秒後に移動開始します')
    }
    i++
  }

</script>
