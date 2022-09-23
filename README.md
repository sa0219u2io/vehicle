# APP NAME : vehicle
# Author S.Asano
This Application is based on Social Robotics Middleware Package. It is a standard GUI for the Mobile Robot 'BUDDY'. On buddy, this WEB Application works in iframe set by 'SysUI' which is commonly set for all applications. SysUI offeres function such as sending API, receiving API of Notices, showing battery and Wi-Fi status, and power options. iframes window size is 1148px x 644px.

## Strict Rules
set 'debug' = 1 in your browser localstorage
debug = 1 means every API call of the app uses debug function which read JSONs in local debug folder, not calling APIs. Debug mode enables you to feed the app with any responses by altering JSONs in debug folders.


## Structure
htdocs
 |- _temp/               //Data file directory which you set on RCS.
 |- cache/               //Stored robot setting
 |- vehicle/             //App root
    |- asset/
      |- announce/       //announce mp3
      |- css/            
      |- image/
      |- js/
      |- json/          //jsons used in app
    |- component/       //php component
    |- debug/           //jsons used in debug mode (API responses)
    |- service_event_dispatch_setting.json  //Push notice url
    |- *                //PHPs


##設定値
1. /component/template.php
    APP :　JS等で参照する本アプリの基本的なディレクトリ名兼アプリ名称
2. /asset/js/main.js
    Debug :  開発環境での動作か、本番環境での動作化を決定**仕様廃止
    webroot : サーバーホスト名
    variablefilename : 設定系を永続保存するファイル名
    defaultlooptimer : 各ページで使用するループカウンターのデフォルト値
3. 開発環境のlocalstorageにdebug=1をいれると、デバック環境で動作

##ロボットMWとの通信
#コマンド送信
SysUIの関数を利用して送信する。API一覧は別途参照のこと。vehicleではsendAPI関数を使用する。この関数は、送信内容を引数としており、本番環境ではMWにAPIを送信するが、デバッグ環境においては定められたJSONを応答として返すような挙動をする。
#通知の受信
通知の受信には二通りの手法があり、本項目は、通常の受信について述べる。ロボットとの通信はWEBSOCKETを通じて行われるため基本的には非同期通信であるため、responseObsereverを起動して、MWからの送信を待ち内容に応じてコールバック関数を呼ぶ形となる。このため、コマンド送信時にはかならずresponseObserverを立上げて、応答が着次第、停止する処理が必要となるが、この処理は上記sendAPI関数の中で自動的に行われるため、vehicleを改造する際は、callback関数の振り分け処理から行えばよい。
#イベント通知の受信
通知の二種類目はMWからのプッシュ通知である。例えば、障害物検知停止した場合や目的地に到着した場合はvehicleからのコマンド送信（ポーリング）なしに通知を受信したい。該当イベントをvehicleディレクトリルートにおかれたservice_event_dispatch_setting.jsonに記述することで、該当イベント発生時に強制的にページを遷移させることができる。この処理はSysUIがiframe内をリダイレクトさせることで実現される。適用できるイベントは、API一覧に規定されるMWからの通知の全てである。

##機能
#index.php
起動ページ。変数の初期化とcacheフォルダからの復元により、前回起動時の設定関連を引き継ぐ。そのほか、ロボットから地図一覧を取得し、現在地図を特定するなど。
#map.php
地図選択ページ。地図一覧から地図を選択し、ロボットに該当地図をセットする。
#select.php
目的地選択ページ。選択された地図の一覧に従って、目的地の一覧を表示する。
#onmove.php
移動中画面。移動中には定められた音楽と顔画面を表示する。
#complete.php
移動完了ページ。定められたメッセージのみをのべて、目的地選択画面に自動で遷移する。
#halt.php
障害物検知停止。





##更新履歴
#2-2-1　2022-09-23 00:30 Asano
USBデバッグ機能追加
発話変更機能追加
