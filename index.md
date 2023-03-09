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
<h2 id = "id_area" style="margin-top:-12px; margin-bottom:8px;">Forgotten Forest</h2>
<h2 id = "id_subtitle" style="margin:-12px; font-size:20px;">∙&nbsp;&nbsp;∙&nbsp;&nbsp;∙</h2>
<p style="margin:14px;"></p>

<div class="card">
<h1 id = "id_emoji" style="margin-top:4px; margin-bottom:8px;"/>
<h2 id = "id_name"/>
<h3 id = "id_stats" style="line-height:24px; margin-bottom:8px;"/>
<h4 id = "id_desc" style="padding-right:24px; padding-left:24px; margin-bottom:12px; line-height:165%"/>
<h5 id = "id_team"/>
</div>

<p style="margin:9px;"></p>
<h3 style="margin:-0px; font-size:14px">· VS ·</h3>
<p style="margin:6px;"></p>

<div class="toolbar" style="padding-bottom:10px;">
<h3 id = "id_player_name" style="font-weight:bold; margin-bottom:8px; margin-top:4px;"/>
<h3 id = "id_player_status" style="margin-bottom:0px; display:inline;"/>
<h4 id = "id_log" style="margin-top:6px; margin-bottom:0px; padding-left:8px; padding-right:6px; margin-bottom:4px; text-align:left;"/>
<h4 id = "id_player_party_loot" style="margin-bottom:0px; display:inline;"/>
</div>

<p style="margin:16px;"></p>
<button type = "button" id = "button_attack">🎯&nbsp;&nbsp;Attack</button>&nbsp;&nbsp;
<button type = "button" id = "button_roll">🌀&nbsp;&nbsp;Roll</button>&nbsp;&nbsp;
<button type = "button" id = "button_block">🛡&nbsp;&nbsp;Block</button>
<p style="margin:12px;"></p>
<button type = "button" id = "button_grab">✋&nbsp;&nbsp;Grab</button>&nbsp;&nbsp;
<button type = "button" id = "button_speak">💬&nbsp;&nbsp;Speak</button>&nbsp;&nbsp;
<button type = "button" id = "button_sleep">💤&nbsp;&nbsp;Rest</button>

<p style="margin:24px"></p>
<h4 style="font-size:12px; opacity:0.85;">Made with 💚 by <a href="https://github.com/IGPenguin/webcrawler/">IGPenguin</a></h4><h4 id="id_version" style="font-size:10px; margin-top:-12px; opacity:0.6;"/>
</center>
