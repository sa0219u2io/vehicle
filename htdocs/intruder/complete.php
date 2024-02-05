<?php 
  $content['main'] = '';
  $basename = basename(__FILE__, ".php");
  include('component/template.php');
?>
<!-- 起動時スクリプト -->
<script>
  //起動時スクリプト
  setVariable('onmoverest', 0)
  get_current_location()
  setVariable('onmove', 0)
  setVariable('error', 0)
  loadBall(1);
  //ループスクリプト
  function countup() {

  }
  // 現在地取得指示の戻り関数
  function callback_GCL(res) {
    console.log(res.data.destination_name)
    if (res.data.destination_name) {
      setVariable('current_location', res.data.destination_name)
    }
    complete()
  }
  //setInterval(countup, defaultlooptimer);
</script>