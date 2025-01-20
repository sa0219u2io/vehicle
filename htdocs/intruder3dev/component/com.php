<?php 
  define('APP', 'intruder3dev');
  if (!isset($content['main']))$content['main'] = '';
  if (!isset($content['main_message']))$content['main_message'] = '';
  if (!isset($content['under_message']))$content['under_message'] = '';
  define(
    'INFOLIST', [
      'current_location' => '現在地',
      'trip_mode' => '運用モード',
      'multiple_status' => '複数台稼働情報',
      'multiple_judgement' => '複数台稼働判定'
    ]
  )
?>