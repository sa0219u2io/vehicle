<?php
// $url = "http://localhost/ntt/calltest.php";
$url = "https://npkdsfa334.execute-api.ap-northeast-1.amazonaws.com/api/v1/robot_move";
$senddata = $_POST['destination'];
var_dump($senddata);
$url = $url.'?target='.$senddata;
//cURLセッションを初期化する
var_dump($url);
 
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
$res = curl_exec($ch);
curl_close($ch);

//結果を表示する
echo($res);
 
?>