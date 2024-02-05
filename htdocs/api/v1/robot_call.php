<?php
 
$url = "https://eu4jdo0lul.execute-api.ap-northeast-1.amazonaws.com/api/v1/robot_info";
 
//cURLセッションを初期化する
$ch = curl_init();
// $param = '{"type": "info_robot_available","result": {"result_cd": "","error_cd": "","error_msg": ""}}';
$param = [
  'type' => 'info_robot_available',
  'result' => [
    'result_cd' => '',
    'error_cd' => '',
    'error_msg' => ''
  ]
];
 
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
var_dump($res);
 
//セッションを終了する
curl_close($conn);
 
?>