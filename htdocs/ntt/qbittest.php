<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="asset/css/com.css">
    <script type="text/javascript" src="asset/js/jquery.js"></script>
    <script type="text/javascript" src="asset/js/api.js"></script>
    <script type="text/javascript" src="asset/js/frame.js"></script>
    <script type="text/javascript" src="asset/js/main.js"></script>
    <script>
      const appname = '<?=APP?>'
    </script>
  </head>
  <body>
    <div class="wrapper">
      <div class="main">
        <div style="overflow: scroll; height:100%">
          <h1>ロボット状態通知API</h1>
          <form action="http://localhost/ntt/senddata_qbit.php" method="post" class="form-example">
            <div class="form-example">
              <textarea name="code" id="code" value="" wrap="soft" style="width:100%; height:300px">
"type":"info_buddy_status_for_qbit",	
"data":{	
  "current_location": {
    "map_name": map_name,
    "destination_name":destination_name,
    "point": {
      "point_x":1,
      "point_y":1,
      "point_z":0,
    },
    "stop_angle": {
      "point_x":0,
      "point_y":0,
      "point_z":0,
      "point_w":1
    }
  },
  "battery_level":90,
  "move_status":'ready',
  "charge_state":10
}	
              </textarea>
            </div>
            <input type="submit" value="送信!" onclick="funca()">
            <script>
            function funca() {
              let element = document.getElementById('code');
              console.log(element.value);
              req_move_qbit(element.value)
            }
            </script>
          </form>
 
          <h1>次の移動先通知API</h1>
          <input id="nextapi"></input>
          <input type="submit" value="送信!" onclick="func()">
          <script>
          function func() {
            let element = document.getElementById('nextapi');
            console.log(element.value);
            req_move_qbit(element.value)
          }
          </script>

          <h1>受け取り完了通知API</h1>
          <input type="submit" value="送信!" onclick="qbit_done()">

          <h1>再設置通知</h1>
          <a href="http://localhost/ntt/relocate_call.php">送信</a>
        </div>
      </div>
    </div>
  </body>
</html>