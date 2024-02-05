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
<div class="modal" id="modal-music">
  <p class="modaltitle">移動時音楽設定</p>
  <div id="music" class="modalchild"></div>
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
  <p class="modaltitle">拠点位置設定</p>
  <div id="hublist" class="modalchild"></div>
  <p class="modaltitle">目的地待機時間</p>
  <div class="flexbox">
    <div class="inbox"><p id="hubdown"> ◀</p></div>
    <div class="inbox"><div id="hubnum">20</div>秒</div>
    <div class="inbox"><p id="hubup">▶ </p></div>
    <div class="inbox"><button id="hubset">セット</button></div>
  </div>
  <p>拠点（パントリー等）を選択して頂くと、<br>それ以外の目的地では「拠点に戻る」しか表示されないモード<br>配膳等に最適なモードです<br>一番最初に選んだ緑反転の拠点に常に戻るようになります。<br>それ以外にも選択すると、ピンク色になりますが、<br>この拠点では、自動で戻らない設定となります。<br>色のついた拠点をもう一度タップすると選択が外れます。</p>
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
  <p class="modaltitle">音量設定</p>
  <div class="flexbox">
    <div class="inbox"><button id="announcevolclear">初期化</button></div>
    <div class="inbox"><p id="announcedown"> ◀</p></div>
    <div class="inbox"><div id="announcenum">100</div></div>%
    <div class="inbox"><p id="announceup">▶ </p></div>
    <div class="inbox"><button id="announcevolset">セット</button></div>
  </div>
  <hr>
</div>
<?php $array=['autostart','complete','face','halt','map','onmove','relocate','select','sequence','turnaround', 'wakeup']?>
<?php foreach($array as $obj):?>
  <div class="modal" id="modal-announce-<?=$obj?>">
    <p class="modaltitle">発話設定</p>
    <hr>
    <div id="<?=$obj?>" class="modalchild"></div>
    <hr>
  </div>
<?php endforeach?>
<!-- 共通 -->
