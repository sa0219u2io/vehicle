<?php $main = '<div class="resetinstruction">
    <img src="asset/image/reset_1.png">
    <img src="asset/image/reset_2.png">
    <img src="asset/image/reset_3.png"><br><br><br>
    <div id="button"></div>
</div>'?>
<?php $mainmessage = 'マークが２個読める位置にロボットを移動し<br>【設置完了】ボタンを押してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<script>
//起動時スクリプト
  //clearMoveStatus()
  setVariable('onrelocate', 1)
  setTimeout(function(){playAnnounce('relocate')}, 200)
  setPinDefault()

//タイマースクリプト
  var countup = function(){
    $("#button").empty();
    $('#button').append('<a href="select.php?angle=99"><button class="reset">設置完了</button></a>&emsp;');
    $('#button').append('<button class="resume" onclick=resume_move()>元の経路に復帰</button>');
  }
  var mode = getParam('mode');
  let timespan = 20000;
  if (!mode||mode == 0||mode == 4) {
    timespan = defaultlooptimer;
  }
  setInterval(countup, timespan);
</script>
