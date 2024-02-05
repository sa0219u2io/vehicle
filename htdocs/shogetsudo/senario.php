<?php $main = '<div id="senariocontaier"></div>'?>
<?php $mainmessage = 'シナリオを選択してください'?>
<?php $undermessage = ''?>
<?php include('component/template.php'); ?>

<script>
  initSenario();

  function initSenario() {
    var currentsernario = getVariable('senario');
    if (currentsernario) {
      currentsernario = JSON.parse(currentsernario);
      viewSenario('senario', currentsernario)
    } else {
      readJson('senario',"99");
    }
  }

  function viewSenario(type, senario) {
    console.log(senario)
    dl_all_array = getVariable('dl_all_array');
    current_map_id = getVariable('current_map_id');
    deslist = JSON.parse(dl_all_array)[current_map_id];
    list = JSON.stringify(senario);
    setVariable('senario', list);
    i = 0;
    senario.forEach(element => {
      var child = '';
      element.destination_id_array.forEach(id => {
        child = child+'<div class="senariodestination">'+deslist[id]+'</div>';
      });
      $('#senariocontaier').append('<div class="senario"><div class="senarioclickzone" onclick=setSenario("'+i+'")><div class="senariotittle">'+element.name+'</div><div class="senariocontent">'+child+'</div></div><div class="senariochange" onclick="transScreen(\'senariomaking\', \''+i+'\')\">シナリオを変更する</div></div>');
      i++;
    });
  }

  function setSenario(i) {
    console.log('setSenario');
    current_map_id = getVariable('current_map_id');
    var list = ''
    console.log(i);
    senario = getVariable('senario');
    currentsenario = JSON.parse(senario)[i];
    setVariable('trip_mode', 1)
    setVariable('currentsenario', i)
    setVariable('currentsenarioname', currentsenario.name)
    setVariable('sequencearray'+current_map_id, JSON.stringify(currentsenario.destination_id_array));
    writeVariable()
    setTimeout(function(){transScreen('sequence')}, 500)
    
  }
  
</script>