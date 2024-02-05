<?php $main = '<div id="sequencecontainer"></div>
<div id="sequencepannel"></div>
<div id="sequencego"></div>'?>
<?php $mainmessage = 'シナリオ変更'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
  initSenario();

  function initSenario() {
    var senarionum = getParam('param')
    senario = JSON.parse(getVariable('senario'))[senarionum]
    console.log(senario)
    setMainMessage('シナリオ変更:'+senario.name)
    setTimeout(function(){set_destination_list_sequence_making(1)},100)
  }

  function setSenario() {
    map_id = getVariable('current_map_id')
    senarionum = getParam('param')
    senario = JSON.parse(getVariable('senario'))
    sequencearray =  JSON.parse(getVariable('sequencearray'+map_id))
    senario[senarionum].destination_id_array = sequencearray;
    setVariable('senario', JSON.stringify(senario));
    transScreen('senario')
    writeVariable()
  }
  
</script>