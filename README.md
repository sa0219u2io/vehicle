# APP NAME : vehicle
# Author S.Asano
## 概要
本アプリケーションは、SOCIALROBOTICS株式会社のミドルウェアパッケージに基づく移動ロボットBUDDYの操作UIアプリケーションである。WEBアプリケーションであり、ロボット上では'SysUI'と呼称する全アプリに共通の機能をくくりだしたフレームワーク内で、iframe上で呼び出される。SysUIはAPIの送受信やバッテリ残量表示、Wi-Fiステータスの表示、電源関連機能などをつかさどっており、これらを各アプリで実装しなくてもよいようにラップアップしている。iframeのwindowサイズは1148px x 644pxであり、このサイズで本アプリは製造する。

## 開発環境
開発環境はdockerc-compose2にて起動する。windows環境で、dockerおよびdocker-composeがインストール済みであればstart.batの実行で起動する。dockerの起動後、localhost/vehicleでアクセスすればアプリが起動する

### 開発環境のルール
上記アクセス前に、ブラウザのlocalstorageに、'debug' = 1　を書き込んでください。chromeであれば、chromeデバッグツールのアプリケーションタブからlocalstorage->localhostにキー'debug'で値1で登録してください。　本アプリでは、この値を参照して、ロボット本番での動作か、開発環境での動作かを切り分けて動きます。この設定を行うことで、本来ロボットMWにAPIを送信して結果を受信するところを、debugディレクトリに格納されているJSONファイルを戻り値として読むようになり、MWとの接続なしに各種でバッグが可能となります。

また、環境構築時に、htdocs/cacheディレクトリを権限777に設定してください。

## 本番環境配備
### 新規アプリを製造する場合
新規アプリを製造する場合、重要なのが、内部の相対パスの起点となるディレクトリを設定することであり、以下の設定が必要。また、APP名vhicleは本番環境には同名では配備できない。
まずは、新しいアプリのappnameを決定し、htdocs/のvehicleフォルダをコピーしてappnameのフォルダとして同じ改装に配置する。以降、新アプリはlocalhost/appnameにてアクセスする。
1.  aopname/component/template.php l2
      defineにて規定しているAPPの名称をappnameに変更する
2.  appname/service_event_dispatch_setting.json
      ここで、vehicleとなっている個所を全ヶ所appnameに変更する。
3.  RCSにて、アプリを新規登録し、アプリ識別子にappnameを登録する。

### アプリの本番環境への配備
RCS上のアプリページからzip化したアプリをアップロードし、ロボットを再起動（Wi-Fi経由かUSBメモリ経由でのアップデートが必須）を行えば配備できる。
注意する点として、zip化する際はvehicleディレクトリをzip化してはならず、中身のみをzip化する必要がある。つまり、解凍した際に、vehicleフォルダの中身のみが解凍される状態になる必要があり、vehicleフォルダが生成される状態では正常に動作しない。

## Structure
<pre>
htdocs
 ├── _temp/                                   //Data file directory which you set on RCS.
 ├── cache/                                   //Stored robot setting
 └── vehicle/                                 //App root
    ├── asset/
    │    ├── announce/                        //announce mp3
    │    ├── css/            
    │    ├── image/
    │    ├── js/
    │    ├── json/                           //jsons used in app
    ├── component/                           //php component
    ├── debug/                               //jsons used in debug mode (API responses)
    ├── service_event_dispatch_setting.json  //Push notice url
    └── php files                            //PHPs
</pre>

## 各ディレクトリの説明
### _temp
音楽や、ムービーなどを格納する。

### cache
設定値の2でファイル名を指定する設定系を永続保存するファイルが生成されるディレクトリ。この設定系には、移動速度や、再生されるアナウンス、移動モードなど、ロボットがマシンごと再起動しても保存されていてほしい設定値をjson形式で保存する。本来、localstorageは永続性があるが、シークレットモードなどで起動されるとこの機能が使えないために製造した機能。

### vehicle
アプリ本体のディレクトリ。

### vehicle/asset
アプリ内で使用する各種外部リソースの保管場所。ロボット本体は常時ネット接続を担保しないため、jqueryなどはダウンロードして使用すること。

### vehicle/component
phpでインクルードする各種コンポーネント。phpは実質、このインクルードする機能と、設定値をjsonで書き出し、読み込みするajaxのみで使用している。template.phpが基本的に使用されるフレームワークであり、その中でmodal.phpを呼び出しており、modal.phpはモーダルとして呼び出されるメニューを生成している。

### vehicle/debug
デバッグモードの時に呼び出される応答系のjsonを格納する。

### vehicle/service_event_dispatch_setting.json
ロボットMWとの通信のイベント通知の受信で説明するが、この強制遷移の紐づけを行う。

## 設定値
1. /component/template.php
    APP :　JS等で参照する本アプリの基本的なディレクトリ名兼アプリ名称
2. /asset/js/main.js
    webroot : サーバーホスト名
    variablefilename : 設定系を永続保存するファイル名
    defaultlooptimer : 各ページで使用するループカウンターのデフォルト値
3. 開発環境のlocalstorageにdebug=1をいれると、デバック環境で動作

## ロボットMWとの通信
### コマンド送信
SysUIの関数を利用して送信する。API一覧は別途参照のこと。vehicleではsendAPI関数を使用する。この関数は、送信内容を引数としており、本番環境ではMWにAPIを送信するが、デバッグ環境においては定められたJSONを応答として返すような挙動をする。
### 通知の受信
通知の受信には二通りの手法があり、本項目は、通常の受信について述べる。ロボットとの通信はWEBSOCKETを通じて行われるため基本的には非同期通信であるため、responseObsereverを起動して、MWからの送信を待ち内容に応じてコールバック関数を呼ぶ形となる。このため、コマンド送信時にはかならずresponseObserverを立上げて、応答が着次第、停止する処理が必要となるが、この処理は上記sendAPI関数の中で自動的に行われるため、vehicleを改造する際は、callback関数の振り分け処理から行えばよい。
### イベント通知の受信
通知の二種類目はMWからのプッシュ通知である。例えば、障害物検知停止した場合や目的地に到着した場合はvehicleからのコマンド送信（ポーリング）なしに通知を受信したい。該当イベントをvehicleディレクトリルートにおかれたservice_event_dispatch_setting.jsonに記述することで、該当イベント発生時に強制的にページを遷移させることができる。この処理はSysUIがiframe内をリダイレクトさせることで実現される。適用できるイベントは、API一覧に規定されるMWからの通知の全てである。

## 機能
### index.php
起動画面。変数の初期化とcacheフォルダからの復元により、前回起動時の設定関連を引き継ぐ。そのほか、ロボットから地図一覧を取得し、現在地図を特定するなど。
### map.php
地図選択画面。地図一覧から地図を選択し、ロボットに該当地図をセットする。
### select.php
目的地選択画面。選択された地図の一覧に従って、目的地の一覧を表示する。
### onmove.php
移動中画面。移動中には定められた音楽と顔画面を表示する。
### complete.php
移動完了画面。定められたメッセージのみをのべて、目的地選択画面に自動で遷移する。
### halt.php
障害物検知停止。
### autostart.php
自動発進画面。移動完了ページにて、拠点走行や連続走行、往復走行などの走行モードで時間が経過すれば自動で発進する機能を提供。
### relocate.php
再設置画面。ロボットがルートを外れ、あるいはバンパセンサが反応した場合、手動で再設置させる画面。
### sequence.php
連続走行選択画面。目的地選択画面の複数選択版。

## 処理系の簡単な説明
本アプリのほとんどの処理は以下に規定するjavascriptにて実装されている。なお下記ツリー図は読み込み順に表示されている。
<pre>
htdocs/vehicle/asset/js
 ├── jquery.js
 ├── driver.js
 ├── callback.js
 ├── api.js
 ├── frame.js
 ├── debug.js
 └── main.js
</pre>
### main.js
アプリに関連する設置値や特有の動きなどを規定するjs

### driver.js
jsonを読み書きしたり、画面遷移、ログに関連する挙動を実装。デバッグモード時の切り分け処理もこの内部で実装。

### frame.js
メニューやモーダル関連の関数群。

### api.js
APIの送受信を規定する関数群。受信をresponseObserverで受け取った後は、callbackに規定される関数に引き渡す。

### callback.js
callbackでAPIの受信等での切り分け処理を規定した関数群。

## 更新履歴
### 2-2-1　2022-09-23 00:30 Asano
USBデバッグ機能追加
発話変更機能追加

### 2-2-2 2022-09-25 15:33 Asano
アナウンス選択を大幅に変更し、相対パスでの呼び出し化、設定JSONを今後の拡張のために一本化

### 2-2-3 2022-09-27 22:56 Asano
拠点モードにて、複数の目的地を拠点として選択できるように変更。「戻る」先は必ず最初に選択した拠点であり、拠点選択画面にては緑反転にて表示され、ピンク反転の拠点は単に目的地選択画面を出し、自動帰宅しないようにできるに留まる。
