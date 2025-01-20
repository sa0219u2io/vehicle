<?php 
  require_once("./logger.php");
  if($_SERVER["REQUEST_METHOD"] != "POST"){
    $level = $_GET['level'];
    $content = base64_decode($_GET['content']);
  }else{
    $level  = 'debug';
    // $content = implode(',', $_POST);
    $content = $_POST;
    if (is_array($_POST)) {
      $content = json_encode($_POST,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    }
  }

  echo($content);
  
  $log = Logger::getInstance();

  if ($level ="error") {
    $log->error($content);
  } else if ($level ="warn") {
    $log->warn($content);
  } else if ($level ="info") {
    $log->info($content);
  } else if ($level ="debug") {
    $log->debug($content);
  } else {
    $log->debug($content);
  }

  // echo($content);
  


  
// $log->error('error log.');
// $log->warn('warn log.');
// $log->info('info log.');
// $log->debug('debug log.');

?>