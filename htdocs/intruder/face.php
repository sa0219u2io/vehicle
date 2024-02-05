<?php 
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<script>
  // 起動時スクリプト
  $('.wrapper').addClass('face')
  setUnderMessage(myip)
  var announce = JSON.parse(getVariable('announce'))
  var list = [];
  Object.keys(announce).forEach(function(key) {
    list.push(key)
  });
  var i = 0
  //ループスクリプト
  function countup() {
    playAnnounce(list[i])
    i++;
    if (i >= list.length) {
      i = 0;
    }
  }
  setInterval(countup, facelooptimer);
</script>