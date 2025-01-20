<?php 
  class EM {
    public $em = [
      'remote' => '原因不明のエラーです。再起動してください[default]',
      'low_battery' => '充電残量が10%以下です。<br>ただちに充電してください',
      'charging' => '充電中ケーブルが接続されました。<br>ご使用になるには、<br>充電コードを抜いたことをご確認ください',
      'nomap' => '地図取得に失敗しました<br>10秒後に自動でアプリを再起動します<br><br>この画面が変化しない場合には<br>電源を切って再起動してください',
    
      'move_failed' => '至近距離で障害物を検知したため移動を停止します。一定時間後にリトライします[move_fail]',
      'move_failed?data=undefined' => '至近距離で障害物を検知したため移動を停止します。一定時間後にリトライします[move_fail]',
    
      'info_move_error?data=undefined' => '至近距離で障害物を検知したため移動を停止します。一定時間後にリトライします。[info_move_error]',
    
      'info_motor_cmdexecution_error' => '目的地への到達へ失敗しました。ロボットを移動して再設置してください',
      'info_motor_cmdexecution_error?data=undefined' => '目的地への到達へ失敗しました。ロボットを移動して再設置してください',
      
      'info_stop_move_error' => '停止に失敗しました。ロボットを移動して再設置してください[info_stop_move_error]',
      'info_stop_move_error?data=undefined' => '停止に失敗しました。ロボットを移動して再設置してください[info_stop_move_error]'
    ];
  }
  ?>