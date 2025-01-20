<?php 
  $camera_id = $_GET['camera'];
  $json = file_get_contents('php://input');
  $data = json_decode($json, true);

  header("Content-type: application/json; charset=UTF-8; Access-Control-Allow-Origin: *");
  $filename = '../asset/json/autoReturn.json';
  if (!file_exists($filename)) {
    touch($filename);
    chmod($filename, 0777);
    // $varibale = camera
  } else {
    $variable = json_decode(file_get_contents($filename), true);
  }
  //echo($filename);

  $variable['camera'][$camera_id] = $data['data']['qr_flg'];

  file_put_contents($filename, json_encode($variable));

  $content = "Camera[".$camera_id."] QR[".$data['data']['qr_flg']."]";
  require_once("./logger.php");
  Logger::getInstance()->info($content);

  echo(json_encode($variable));
  // echo($return);
  return;
?>