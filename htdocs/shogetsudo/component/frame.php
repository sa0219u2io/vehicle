<?php $url = 'http://localhost/shogetsudo/asset/image/pictgram/'?>
<!-- 共通 -->
<div id="frame">
  <!-- 共通のモーダル表示部分 -->
  <div class="left_nav">
    <div class="modalclose"><img src="<?=$url?>close.png"></div>
    <menu>
      <div class="menurow">
        <!-- 目的地選択 -->
        <div class="menuicon" id="modal-select-open"><img src="<?=$url?>select.png"><p>目的地選択</p></div>
        <!-- 目的地選択 -->
        <div class="menuicon" id="modal-changemap-open"><img src="<?=$url?>select.png"><p>地図選択</p></div>
        <!-- 再設置 -->
        <div class="menuicon" id="modal-relocate-open"><img src="<?=$url?>relocate.png"><p>再設置</p></div>
        <!-- 速度設定 -->
        <div class="menuicon" id="modal-velocity-open"><img src="<?=$url?>velocity.png"><p>速度設定</p></div>
        <!-- 走行音楽選択 -->
        <div class="menuicon" id="modal-media-open"><img src="<?=$url?>media.png"><p>音楽選択</p></div>
        <!-- 発話設定 -->
        <div class="menuicon" id="modal-announce-open"><img src="<?=$url?>announce.png"><p>発話設定</p></div>
        <!-- 単純顔画面 -->
        <div class="menuicon" id="modal-face-open"><img src="<?=$url?>face.png"><p>顔画面表示</p></div>
      </div>
      <div class="menurow child">
        <!-- 移動モード設定 -->
        <div class="menuicon" id="modal-single-open"><img src="<?=$url?>single.png"><p>通常走行</p></div>
        <!-- 移動モード設定 -->
        <div class="menuicon" id="modal-turnaround-open"><img src="<?=$url?>turnaround1.png"><p>往復走行</p></div>
        <!-- 移動モード設定 -->
        <div class="menuicon" id="modal-sequence-open"><img src="<?=$url?>sequence.png"><p>連続走行</p></div>
        <!-- 移動モード設定 -->
        <div class="menuicon" id="modal-hub-open"><img src="<?=$url?>hub.png"><p>拠点走行</p></div>
        <!-- 移動モード設定 -->
        <div class="menuicon" id="modal-round-open"><img src="<?=$url?>turnaround.png"><p>巡回走行</p></div>
        <!-- 移動モード設定 -->
        <div class="menuicon" id="modal-senario-open"><img src="<?=$url?>turnaround.png"><p>シナリオ設定</p></div>
      </div>
      <div class="menurow">
        <!-- トレース -->
        <div class="menuicon" id="modal-trace-open"><img src="<?=$url?>trace.png"><p>トレース</p></div>
        <!-- 再起動 -->
        <div class="menuicon" id="modal-reboot-open"><img src="<?=$url?>reboot.png"><p>再起動</p></div>
        <!-- 地図確認 -->
        <div class="menuicon" id="modal-map-open"><img src="<?=$url?>map.png"><p>地図確認</p></div>
        <!-- 移動ログ -->
        <div class="menuicon" id="modal-log-open"><img src="<?=$url?>log.png"><p>移動ログ</p></div>
        <!-- 衝突防止ログ -->
        <div class="menuicon" id="modal-collision-open"><img src="<?=$url?>collision.png"><p>衝突防止ログ</p></div>
        <!-- 設定削除 -->
        <div class="menuicon" id="modal-erase-open"><img src="<?=$url?>erase.png"><p>設定削除</p></div>
      </div>
    </menu>
  </div>
  <div class="right_nav">
  </div>
  <!-- 共通のモーダル表示部分 -->
  <div class="modal" id="modal-turnaround">
    <p class="modaltitle">往復走行設定</p><hr><br>
    <div class="flexbox">
      <div class="inbox"><button id="turnaroundclear">解除</button></div>
      <div class="inbox"><p id="tadown"> ◀</p></div>
      <div class="inbox"><div id="tanum">10</div></div>回
      <div class="inbox"><p id="taup">▶ </p></div>
      <div class="inbox"><button id="turnaroundset">セット</button></div>
    </div><br>
    <p>現在地と選択した目的地の間を<br>
    この画面で設定した回数だけ往復します<br>通常走行モードしか御利用になれません</p>
  </div>
  <div class="modal" id="modal-map">
    <p class="modaltitle">登録MAP確認</p><hr>
    <div id="map" class="modalchild"></div>
  </div>
  <div class="modal" id="modal-velocity">
    <p class="modaltitle">速度変更</p><hr><br>
    <div class="flexbox">
      <div class="inbox"><button id="velclear">初期値</button></div>
      <div class="inbox"><p id="veldown"> ◀</p></div>
      <div class="inbox"><div id="velnum">100</div>％</div>
      <div class="inbox"><p id="velup">▶ </p></div>
      <div class="inbox"><button id="velset">セット</button></div>
    </div><br>
    <p>MAPで設定した基本速度から指定した割合で加速・減速します<br>
    旋回速度・スタート・ゴール地点での速度等は指定できません</p>
    <!-- <p>Under Constraction</p> -->
  </div>
  <div class="modal" id="modal-message">
    <p class="modaltitle">到着時画面設定</p>
    <div id="message" class="modalchild"></div>
  </div>
  <div class="modal" id="modal-media">
    <p class="modaltitle">移動時音楽設定</p>
    <div id="media" class="modalchild"></div>
    <p class="modaltitle">音量設定</p>
    <div class="flexbox">
      <div class="inbox"><button id="musicvolclear">初期化</button></div>
      <div class="inbox"><p id="musicdown"> ◀</p></div>
      <div class="inbox"><div id="musicnum">100</div></div>%
      <div class="inbox"><p id="musicup">▶ </p></div>
      <div class="inbox"><button id="musicvolset">セット</button></div>
    </div>
  </div>
  <div class="modal" id="modal-trace">
    <p class="modaltitle">トレースモード</p>
    <div id="tracemode">
      <div id="startlist"><div id="titlerow">始点</div></div>
      <div id="middlelist">▶</div>
      <div id="goallist"><div id="titlerow">終点</div></div>
    </div>
    <button id="trace">RFIDトレース開始</button>
  </div>
  <div class="modal" id="modal-log">
    <p class="modaltitle">移動ログ</p>
    <hr>
    <div id="log" class="modalchild"></div>
  </div>
  <div class="modal" id="modal-collision">
    <p class="modaltitle">衝突防止ログ</p>
    <hr>
    <div id="collision" class="modalchild"></div>
  </div>
  <div class="modal" id="modal-single">
    <p class="modaltitle">通常走行モード設定</p><hr><br>
    <div class="flexbox">
      <div class="inbox"><button id="singleset">セット</button></div>
    </div>
    <p>デフォルトの走行モードです。<br>
      指定された目的地に行き、次の操作があるまで待機します。
    </p>
  </div>
  <div class="modal" id="modal-sequence">
    <p class="modaltitle">連続走行モード設定</p><hr>
    <p class="modaltitle">目的地待機時間</p>
    <div class="flexbox">
      <div class="inbox"><p id="sequencedown"> ◀</p></div>
      <div class="inbox"><div id="sequencenum">20</div>秒</div>
      <div class="inbox"><p id="sequenceup">▶ </p></div>
      <div class="inbox"><button id="sequenceset">セット</button></div>
    </div>
    <p>複数の目的地を選択して頂くことで、<br>その順番に目的地を移動するモードです
    </p>
  </div>
  <div class="modal" id="modal-hub">
    <p class="modaltitle">拠点走行モード設定</p><hr>
    <p class="modaltitle">目的地待機時間</p>
    <div id="hublist" class="modalchild"></div>
    <div class="flexbox">
      <div class="inbox"><p id="hubdown"> ◀</p></div>
      <div class="inbox"><div id="hubnum">20</div>秒</div>
      <div class="inbox"><p id="hubup">▶ </p></div>
      <div class="inbox"><button id="hubset">セット</button></div>
    </div>
    <p>拠点（パントリー等）を選択して頂くと、<br>それ以外の目的地では「拠点に戻る」しか表示されないモード<br>配膳等に最適なモードです</p>
  </div>
  <div class="modal" id="modal-round">
    <p class="modaltitle">巡回走行モード設定</p><hr>
    <p class="modaltitle">目的地待機時間</p>
    <div id="round" class="modalchild"></div>
    <div class="flexbox">
      <div class="inbox"><p id="rounddown"> ◀</p></div>
      <div class="inbox"><div id="roundnum">20</div>秒</div>
      <div class="inbox"><p id="roundup">▶ </p></div>
      <div class="inbox"><button id="roundset">セット</button></div>
    </div>
    <p>全ての目的地を決められた順番で巡回します<br>順番は地図で設定された順番です
    </p>
  </div>
  <div class="modal" id="modal-announce">
    <p class="modaltitle">発話設定</p>
    <hr>
    <div id="announce" class="modalchild"></div>
    <div class="flexbox">
      <div class="inbox"><button id="announcevolclear">初期化</button></div>
      <div class="inbox"><p id="announcedown"> ◀</p></div>
      <div class="inbox"><div id="announcenum">100</div></div>%
      <div class="inbox"><p id="announceup">▶ </p></div>
      <div class="inbox"><button id="announcevolset">セット</button></div>
    </div>
  </div>
  <!-- 共通 -->
</div>
<script>
// var countup = function(){
//   checktimer();
// }
// setInterval(countup, 10000);
</script>
