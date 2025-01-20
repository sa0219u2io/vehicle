<?php 
  $content['main_message'] = '目的地を順に選択し発進させてください';
  $content['main'] = '<div class="boxlist" id="sequencelist"></div><div class="sequence_destination_list"></div><div class="button_tr clear" onclick="clearSequence()">クリア</div><div class="gobutton"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  senario_edit = getVariable('senario_edit')
  if (!isFalse(senario_edit)) {
    // シナリオ生成モードなら
    setWork('ready',false)
    senario = getVariable('senario','obj')
    sequence = getVariable('sequence','obj')
    console.log(sequence)

    sequence.destination_settings = senario[senario_edit].destination_settings
    setVariable('sequence',sequence,'obj')

    viewDestinationList('putSequence', 'sequencebox')
    setMainMessage(senario[senario_edit].name+'のシナリオを更新してください')
  } else if (tripmode_check('sequence')) {
    get_current_location()
    if (isFalse(getStatus('interval'))) {
      clearSequence()
      deleteWorkList()
      resetStatus()
    } else {
      // 一時停止の場合、連続走行は維持、ただし、リストは一時退避
      setWork('ready',false)
    }
    
    viewDestinationList('putSequence', 'sequencebox')
    checkMessage()
  }

  playAnnounce('sequence')
  //ループスクリプト
  function countup() {

  }

  //setInterval(countup, defaultlooptimer);
</script>