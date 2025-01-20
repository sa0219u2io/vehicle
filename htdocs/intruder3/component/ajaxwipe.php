<?php
  header("Content-type: application/json; charset=UTF-8");
  $filename = '../../cache/'.base64_decode($_GET['file']);
  unlink($filename);
  echo('erase');
  return;
