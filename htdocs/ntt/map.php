<?php $main = '<div id="selectcontaier"></div>'?>
<?php $mainmessage = '地図を選択してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>
<!-- 起動時スクリプト -->
<script>
//起動時スクリプト
viewMaps()
playAnnounce('map')
function changeMap(map) {
  loadBall()
  setVariable('current_map', map)
  writeVariable();
  setTimeout(function() {req_change_map(map)}, 1000)
}

function viewMaps () {
    map_list = getVariable('map_list')
    map_list = JSON.parse(map_list);
    setLog(map_list)

    $("#selectcontaier").empty();
    var current_map = getVariable('current_map')
    mode = getVariable('trip_mode')

    Object.keys(map_list).forEach(function(key) {
      map_name = map_list[key].map_name
      if (map_name == current_map) {
        $('#selectcontaier').append('<div class="select float" id="current_location" onclick="changeMap(\''+ map_name +'\')">'+ map_name +'</div>')
      } else {
        $('#selectcontaier').append('<div class="select float" onclick="changeMap(\''+ map_name +'\')">'+ map_name +'</div>')
      }
    }, map_list);
  }

//タイマースクリプト
  //setTimeout(function(){}, 1500)

//ループスクリプト
  function countup() {

  }
  //setInterval(countup, defaultlooptimer);
</script>
