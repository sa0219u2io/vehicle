<?php
  $list = $_POST;
  header("Content-type: application/json; charset=UTF-8");
  $filename = '../../cache/'.base64_decode($_GET['file']);
  //chmod($filename, 0777);
  echo($filename);
  if (!file_exists($filename)) {
    if (!file_exists('../../cache')) {
      mkdir('../../cache', 0777);
    }
    touch($filename);
  }
  file_put_contents($filename, json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
  echo json_encode($list);
  return;
