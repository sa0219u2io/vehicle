<?php
$url = "http://localhost:5555/api/service_app";
// $url = "https://eu4jdo0lul.execute-api.ap-northeast-1.amazonaws.com/api/v1/robot_info";
$endpoint = "https://npkdsfa334.execute-api.ap-northeast-1.amazonaws.com/api/v1/robot_info";
// $endpoint = "http://localhost/ntt/calltest.php";
// var_dump($url);
 
//cURLセッションを初期化する
$ch = curl_init();
// $param = '{"type": "info_robot_available","result": {"result_cd": "","error_cd": "","error_msg": ""}}';
$param = [
  'type' => 'set_message_destination',
  'data' => [
    "endpoint" => $endpoint
  ]
];
// var_dump($param);
 
//URLとオプションを指定する
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($param));
curl_setopt($ch,CURLOPT_HTTPHEADER,array (
        "Content-Type: application/json"
    ));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

//URLの情報を取得する
$res =  curl_exec($ch);
 
//結果を表示する
echo($res);
 
//セッションを終了する
curl_close($ch);

?>
