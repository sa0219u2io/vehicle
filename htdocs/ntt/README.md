### 仕様
## 立ち上がり時にイベント通知先のサーバーを設定のこと
## 到着時に該当サーバーにinfo_robot_availableを送信
## BUDDYが何らかの理由で「再設置」に移行（予期せぬ停止）をした場合、info_robot_relocatedを送信
## 画面で「受け取り完了」ボタンが押された場合、GET /api/v1/doneの待機状態通知を送信
## 画面で移動指示を送る場合、GET /api/v1/robot_move/{{destination}}の移動指示を送信
## 5秒おきに、POST /api/v1/robot_infoの状態通知を送信