<?php 
  $pictgram_url = 'asset/image/pictgram/';
  $icons = [
    '1' => [
      'select' => '目的地選択',
      'relocate' => '再設置',
      'map' => '地図選択',
      'music' => '音楽設定',
      'announce' => '発話設定',
    ],
    '2' => [
      'normal' => '通常走行',
      'turnaround' => '往復走行',
      'sequence' => '連続走行',
      'hub' => '拠点走行',
      'senario' => 'シナリオ',
      'reserve' => '予約'
    ],
    '3' => [
      'tolerance' => '誤差許容値',
      'order' => '目的地並替',
      'face' => '顔画面',
      'index' => 'APP再起動',
      'erase' => '工場出荷設定',
    ]
  ];
?>
<!-- 共通のモーダル表示部分 -->
<div id="modal-bg" onclick="closeModal('stopmusic')" class="hid">
  <div class="modalclose" onclick="closeModal()">
    <img src="<?=$pictgram_url?>close.png">
  </div>
</div>
<!-- メニューの描画 -->
<div class="modal hid" id="modal-menu">
  <?php foreach ($icons as $key => $value):?>
    <div class="menurow <?=($key%2==0)?"child":"";?>">
      <?php foreach ($value as $subkey => $subvalue):?>
        <div class="menuicon modal-opener" id="<?=$subkey?>"><img src="<?=$pictgram_url?><?=$subkey?>.png"><p><?=$subvalue?></p></div>
      <?php endforeach;?>
    </div>
  <?php endforeach;?>
</div>
<!-- 往復走行モード設定 -->
<div class="modal hid" id="modal-turnaround">
  <div class="modaltitle">往復走行設定</div>
  <div class="modalcontent">
  <div class="modalsubtitle">往復待機秒数</div>
  <div class="flexbox">
      <div class="inbox"><p data-target="turnaround_wait" data-touch="-1" data-hold ="-5" class="number-alter" data-min="1" data-max="100">◀</p></div>
      <div class="inbox"><div id="turnaround_wait" data=""></div></div>秒
      <div class="inbox"><p data-target="turnaround_wait" data-touch="1" data-hold ="5" class="number-alter" data-min="1" data-max="100">▶</data-target=></div>
    </div>
    <button class="modal-button" data-target="turnaround_wait" id="set-turnaround_wait">セット</button>
    <div class="modalsubtitle">往復回数</div>
    <div class="flexbox">
      <div class="inbox"><p data-target="number-turnaround" data-touch="-1" data-hold ="-5" class="number-alter" data-min="1" data-max="100">◀</p></div>
      <div class="inbox"><div id="number-turnaround" data=""></div></div>回
      <div class="inbox"><p data-target="number-turnaround" data-touch="1" data-hold ="5" class="number-alter" data-min="1" data-max="100">▶</data-target=></div>
    </div>
    <button class="modal-button" data-target="number-turnaround" id="set-turnaround">セット</button>
    <button class="modal-button" data-target="number-turnaround" id="clear-turnaround">解除</button>
  </div>
  <div class="modelhelp">現在地と選択した目的地の間を<br>
  この画面で設定した回数だけ往復します<br>各目的地では、指定した待機秒数だけ待機して折り返します。<br>通常走行モードしか御利用になれません</div>
</div>
<!-- 移動時音楽設定 -->
<div class="modal hid" id="modal-music">
  <div class="modaltitle">移動時音楽設定</div>
  <div class="modalcontent">
    <div id="musiclist" class="modalchild"></div><br>
    <div class="modalsubtitle">音量設定</div>
    <div class="flexbox">
      <div class="inbox"><p data-target="music_volume" data-touch="-1" data-hold ="-5" class="number-alter" data-min="1" data-max="100">◀</p></div>
      <div class="inbox"><div id="music_volume" data=""></div></div>%
      <div class="inbox"><p data-target="music_volume" data-touch="1" data-hold ="5" class="number-alter" data-min="1" data-max="100">▶</data-target=></div>
    </div>
  </div>
  <button class="modal-button" data-target="music_volume" id="set-music_volume">セット</button>
</div>

<div class="modal hid" id="modal-movie">
  <p class="modaltitle">移動時動画設定</p>
  <div id="movie" class="modalchild"></div>
</div>
<!-- 通常走行 -->
<div class="modal hid" id="modal-normal">
  <div class="modaltitle">通常走行モード設定</div>
  <button id="set-tripmode-normal" class="modal-button">セット</button>
  <div class="modalhelp">
    デフォルトの走行モードです。<br>指定された目的地に行き、<br>次の操作があるまで待機します。
  </div>
</div>
<!-- 連続走行 -->
<div class="modal hid" id="modal-sequence">
  <div class="modaltitle">連続走行モード設定</div>
  <div class="modalcontent">
    <div class="modalsubtitle">目的地待機時間</div>
    <div class="flexbox">
      <div class="inbox"><p data-target="wait-sequence" data-touch="-1" data-hold ="-5" class="number-alter" data-min="1" data-max="100">◀</p></div>
      <div class="inbox"><div id="wait-sequence" data=""></div></div>秒
      <div class="inbox"><p data-target="wait-sequence" data-touch="1" data-hold ="5" class="number-alter" data-min="1" data-max="100">▶</data-target=></div>
    </div>
    <button class="modal-button" data-target="wait-sequence" id="set-sequence">セット</button>
  </div>
  <div class="modelhelp">
    複数の目的地を選択して頂くことで、<br>その順番に目的地を移動するモードです<br>各目的地で上で設定した時間待機します。
  </div>
</div>
<!-- 拠点走行 -->
<div class="modal hid" id="modal-hub">
  <div class="modaltitle">拠点走行モード設定</div>
  <div class="modalcontent">
    <div class="modalsubtitle">拠点位置設定</div>
    <div id="hublist" class="modalchild"></div>
    <div class="modalsubtitle">適用外位置設定</div>
    <div id="hubexlist" class="modalchild"></div>
    <div class="modalsubtitle">目的地待機時間</div>
    <div class="flexbox">
      <div class="inbox"><p data-target="wait-hub" data-touch="-1" data-hold ="-5" class="number-alter" data-min="1" data-max="100">◀</p></div>
      <div class="inbox"><div id="wait-hub" data=""></div></div>秒
      <div class="inbox"><p data-target="wait-hub" data-touch="1" data-hold ="5" class="number-alter" data-min="1" data-max="100">▶</data-target=></div>
    </div>
    <button class="modal-button" data-target="wait-hub" id="set-hub">セット</button>
  </div>
  <div class="modelhelp">
    拠点（パントリー等）を選択して頂くと、<br>それ以外の目的地では「拠点に戻る」しか表示されないモード<br>配膳等に最適なモードです<br>拠点位置に選んだ拠点に常に戻るようになります。<br>適用外位置にも選択した拠点では、自動で戻らない設定となります。<br>色のついた拠点をもう一度タップすると選択が外れます。
  </div>
</div>
<!-- 許容誤差 -->
<div class="modal hid" id="modal-tolerance">
  <div class="modaltitle">目的地誤差許容値設定</div>
  <div class="modalcontent">
    <div class="modalsubtitle">誤差許容目的地</div>
    <div id="tolerancelist" class="modalchild"></div>
  </div>
  <div class="modelhelp">
    通常、目的地付近の自己位置ずれの許容値は10cm程度に設定してあります。広い場所や狭い場所で、首を振ったり位置補正を繰り返す場合、その目的地をここで選択することで、許容誤差を大きくすることができ、位置補正行動を減らすことができます。
  </div>
</div>
<!-- 許容誤差 -->
<div class="modal hid" id="modal-order">
  <div class="modaltitle">目的地並替設定</div>
  <div class="modalcontent">
    <div class="modalsubtitle">目的地リスト</div>
    <div id="orderlist" class="modalchild"></div>
  </div>
  <div class="modelhelp">
    目的地の並べ替えが可能です。設定がなければ地図で作成された順番となります。
  </div>
</div>
<!-- 各画面アナウンス設定 -->
<div class="modal hid" id="modal-announce">
  <div class="modaltitle">発話設定</div>
  <div class="modalcontent">
  <div id="announcelist" class="modalchild"></div>
    <div class="modalsubtitle">音量設定</div>
    <div class="flexbox">
      <div class="inbox"><p data-target="announce_volume" data-touch="-1" data-hold ="-5" class="number-alter" data-min="1" data-max="100">◀</p></div>
      <div class="inbox"><div id="announce_volume" data=""></div></div>%
      <div class="inbox"><p data-target="announce_volume" data-touch="1" data-hold ="5" class="number-alter" data-min="1" data-max="100">▶</p></div>
    </div>
  </div>
  <button class="modal-button" data-target="announce_volume" id="set-announce_volume">セット</button>
</div>
<!-- シナリオ走行 -->
<div class="modal hid" id="modal-senario">
  <div class="modaltitle">シナリオ走行モード設定</div>
  <div id="senariolist" class="modalchild"></div><br>
  <button id="set-tripmode-senario" class="modal-button">セット</button>
  <div class="modalhelp">
    事前に決められたシナリオで走行するモードです。<br>シナリオは編集画面から編集することができます。<br>いくつでも登録することが可能です。
  </div>
</div>
<!-- シナリオ走行 -->
<div class="modal hid" id="modal-reserve">
  <div class="modaltitle">予約走行モード設定</div>
  <div class="modalsubtitle">予約リスト</div>
  <div id="reservelist" class="modalchild"></div><br>
  <div class="modalcontent">
    <div class="modalsubtitle">シナリオリスト</div>
    <div id="reservesenariolist" class="modalchild"></div><br>
    <div class="modalsubtitle">時刻設定</div>
    <div class="flexbox">
      <div class="inbox"><p data-target="reserve-hour" data-touch="-1" data-hold ="-5" class="number-alter" data-min="0" data-max="23">◀</p></div>
      <div class="inbox"><div id="reserve-hour" data=""></div></div>時
      <div class="inbox"><p data-target="reserve-hour" data-touch="1" data-hold ="5" class="number-alter" data-min="0" data-max="23">▶</p></div>
      <div class="inbox"><p data-target="reserve-minute" data-touch="-1" data-hold ="-5" class="number-alter" data-min="0" data-max="59">◀</p></div>
      <div class="inbox"><div id="reserve-minute" data=""></div></div>分
      <div class="inbox"><p data-target="reserve-minute" data-touch="1" data-hold ="5" class="number-alter" data-min="0" data-max="59">▶</p></div>
    </div>
  </div>
  <button class="modal-button" data-target="reserve_time" id="set-reserve_time" data-reserve-senario="">セット</button>
  <div class="modalhelp">
    規定された時刻に実行するシナリオを登録できます。<br>実行するシナリオは、シナリオ走行モードの画面で作成してください。<br>予約リストをタップすると消えます。
  </div>
</div>
<!-- 第二段階目モーダル -->
<?php $array=['autostart','complete','face','halt','map','onmove','relocate','select','sequence','turnaround', 'wakeup']?>
<?php foreach($array as $obj):?>
  <div class="modal hid" id="modal-announce-<?=$obj?>">
    <p class="modaltitle">発話設定</p>
    <hr>
    <div id="child-<?=$obj?>" class="modalchild"></div>
    <hr>
  </div>
<?php endforeach?>
<div id="tolerance_numset" class="modalnum hid">
  <div class="modalsubtitle">最大許容誤差</div>
    <div class="flexbox">
      <div class="inbox"><p data-target="tolerancenum" data-touch="-1" data-hold ="-5" class="number-alter" data-min="1" data-max="500">◀</p></div>
      <div class="inbox"><div id="tolerancenum" data=""></div></div>mm
      <div class="inbox"><p data-target="tolerancenum" data-touch="1" data-hold ="5" class="number-alter" data-min="1" data-max="500">▶</data-target=></div>
    </div>
    <button class="modal-button" data-target="tolerancenum" id="set-tolerancenum">セット</button>
  </div>
</div>


<!-- 共通 -->
<div class="modal hid" id="modal-battery-remain">
  <p class="modaltitle">バッテリ残量警告</p>
  <hr>
  <p>バッテリーの残量が残りわずかです。至急充電してください。
  </p>
</div>
<div class="modal hid" id="modal-battery-status">
  <p class="modaltitle">充電中</p>
  <hr>
  <p>BUDDYを充電中です<br>ご使用になる際は、コンセントを抜き、BUDDY周囲の安全を確認してください。
  </p>
</div>