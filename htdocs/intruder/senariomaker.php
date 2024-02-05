<?php 
  $content['main_message'] = '目的地を順に選択してください';
  $content['main'] = '<div class="boxlist" id="sequencelist"></div><div class="sequence_destination_list"></div><div class="button_tr clear" onclick="clearSequence()">クリア</div><div class="gobutton"></div>';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  const senarionumber = <?=$_GET['senario']?>
  //起動時スクリプト
  viewDestinationList('putSenario', 'sequencebox')
  showSenario(senarionumber)
  //ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>