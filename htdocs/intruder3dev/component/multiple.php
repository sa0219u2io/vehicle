<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
  require_once("./logger.php");

  $list = json_decode(file_get_contents("php://input"),true);
  $filename = '../asset/json/multiple.json';

  $ip = base64_decode($_GET['ip']);
  if (!file_exists($filename)) {
    touch($filename);
    chmod($filename, 0777);
  }
  
  if($_SERVER["REQUEST_METHOD"] == "POST"){
    // 書き込みの場合
    $variable = json_decode(file_get_contents($filename),true);

    $variable[$ip] = $list;

    $content = $ip.":".json_encode($variable, JSON_UNESCAPED_UNICODE);
    // $log = Logger::getInstance();
    // $log->debug($content);

    $string = json_encode($variable, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    // $log = Logger::getInstance();
    // $log->debug($string);

    $result = file_put_contents($filename, $string);
    // $log = Logger::getInstance();
    // $log->debug($result);
  
    if ($result === false) {
      echo "error" . PHP_EOL; 
      // $log = Logger::getInstance();
      // $log->debug('ERROR');
    }
  }
  $variable = file_get_contents($filename);

  $content = $_SERVER["REQUEST_METHOD"].":".$variable;
  $log = Logger::getInstance();
  $log->debug($content);

  echo $variable;
  return;