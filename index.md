---
layout: default
---
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="{{ page.title }}" />
<meta name="twitter:title" content="{{ page.title }}" />
<meta name="twitter:image" content="{{ page.title_image }}" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="js/game_loop.js"></script>

<center>
<h2 style="margin-top:-8px;">Forgotten Forest</h2>
<h2 id = "id_subtitle" style="margin:-12px; font-size:24px;"> </h2>
<p style="margin:18px;"></p>

<div class="card">
<h1 id = "id_emoji" style="margin-top:8px;"/>
<h2 id = "id_name"/>
<h3 id = "id_stats" style="line-height:24px; margin-bottom:12px;"/>
<h4 id = "id_desc" style="padding-right:24px; padding-left:24px; margin-bottom:12px;"/>
<h5 id = "id_team"/>
</div>

<p style="margin:9px;"></p>
<h3 style="margin:-2px">· VS ·</h3>
<p style="margin:9px;"></p>

<div class="toolbar">
<h4 id = "id_player_name" style="font-weight:bold; margin-bottom:4px;"/>
<h3 id = "id_player_status" style="margin-bottom:0px; display:inline;"/>
<h4 id = "id_log" style="margin-top:6px; margin-bottom:0px; padding-left:8px; padding-right:8px;" align="left"/><h4 style="margin-bottom:0px;">...</h4>
</div>

<p style="margin:14px;"></p>
<button type = "button" id = "button_attack">🎯&nbsp;&nbsp;Attack</button>&nbsp;
<button type = "button" id = "button_roll">🌀&nbsp;&nbsp;Roll</button>&nbsp;
<button type = "button" id = "button_block">🛡&nbsp;&nbsp;Block</button>&nbsp;
<p style="margin:10px;"></p>
<button type = "button" id = "button_grab">✋&nbsp;&nbsp;Grab</button>&nbsp;
<button type = "button" id = "button_speak">💬&nbsp;&nbsp;Speak</button>&nbsp;
<button type = "button" id = "button_sleep">💤&nbsp;&nbsp;Wait</button>&nbsp;
</center>
