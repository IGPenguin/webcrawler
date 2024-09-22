---
layout: default
---
<meta http-equiv="Permissions-Policy" content="interest-cohort=()">
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="{{ page.title }}" />
<meta name="twitter:title" content="{{ page.title }}" />
<meta name="twitter:image" content="{{ page.title_image }}" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
<script src="js/game_loop.js"></script>

<div class= "curtain" id="id_fullscreen_curtain"></div>
<div class= "fullScreenText" id="id_fullscreen_text"></div>

<center class="animate__animated animate__fadeIn animate__fast">
<h2 id = "id_area" style="margin-top:-22px;
  margin-bottom:8px;
    font-size:22px;
    text-shadow: 0 2px 1px #000;
      letter-spacing: 1.5px;">Forgotten Forest</h2>
<!-- <h2 id = "id_subtitle" style="margin:-12px; font-size:20px;">∙&nbsp;&nbsp;∙&nbsp;&nbsp;∙</h2> -->
<p style="margin:6px;"></p>

<div class= "enemyOverlay" id="id_enemy_overlay" style="font-family:sans;"></div>
<div class="card" id="id_card">
<div id = "id_enemy_info">
  <div class="box-border-dynamic">
  <h2 id = "id_name" style="text-align:left;
    padding-left:10px;
    box-shadow:
      0px 0px 0px 3px rgba(0,0,0,0.5);"/>
<h3 id = "id_stats" style="float:left;
                            text-align:left;
                            padding-top:0px;
                            padding-left:12px;
                            padding-bottom:4px;
                            line-height:24px;
                            margin-bottom:0px;
                            font-family:sans;
                            display:inline;"/>
  </div>
<br style="clear:both" />
<div class="box-border-dynamic">
<h1 id = "id_emoji" style="margin-bottom:0px;
                            box-shadow:
                              0px 0px 0px 3px rgba(0,0,0,0.5);
                            padding-bottom:4px;
                            padding-top:10px;"/>
</div>
</div>
<div class="box-border">
<h4 id = "id_desc" style="float:left;
  text-align:left;
  padding-top:8px;
  padding-left:12px;
  padding-right:8px;
  margin-bottom:-10px;
  line-height:165%;
  width:95%;
  overflow: auto;"/>
<h5 id = "id_team" style="float:right;
  margin-top:16px;
  padding-right:10px;
  overflow: auto;"/>
</div>
</div>

<p style="margin:9px;"></p>
<h3 style="margin:-0px; font-size:14px">· VS ·</h3>
<p style="margin:6px;"></p>

<div class= "playerOverlay" id="id_player_overlay" style="font-family:sans;"></div>
<div class="toolbar" style="padding-bottom:10px;">
<div id = "id_player_info">
<h3 id = "id_player_name" style="font-weight:bold; margin-bottom:6px; margin-top:4px; cursor:pointer; font-size:16px"/>
<h3 id = "id_player_status" style="margin-bottom:0px; display:inline; font-family:sans;"/>
</div>
<h4 id = "id_log" style="margin-top:6px; margin-bottom:0px; padding-left:6px; margin-bottom:4px; text-align:left;"/>
<h4 id = "id_player_party_loot" style="margin-bottom:0px; display:inline; box-shadow:none;"/>
</div>

<p style="margin:18px;"></p>
<button type = "button" id = "button_attack">🎯&nbsp;&nbsp;Attack</button>&nbsp;&nbsp;
<button type = "button" id = "button_roll">🌀&nbsp;&nbsp;Roll</button>&nbsp;&nbsp;
<button type = "button" id = "button_block">🔰&nbsp;&nbsp;Block</button>
<p style="margin:14px;"></p>
<button type = "button" id = "button_cast">🪄&nbsp;&nbsp;Cast</button>&nbsp;&nbsp;
<button type = "button" id = "button_curse">🪬&nbsp;&nbsp;Curse</button>&nbsp;&nbsp;
<button type = "button" id = "button_pray">🙏&nbsp;&nbsp;Pray</button>
<p style="margin:14px;"></p>
<button type = "button" id = "button_grab">✋&nbsp;&nbsp;Grab</button>&nbsp;&nbsp;
<button type = "button" id = "button_speak">💬&nbsp;&nbsp;Speak</button>&nbsp;&nbsp;
<button type = "button" id = "button_sleep">💤&nbsp;&nbsp;Rest</button>

<p style="margin:26px"></p>
<h4 style="font-size:12px; opacity:0.85; box-shadow:none;">Made with 💚 by <a href="https://github.com/IGPenguin/webcrawler/">IGPenguin</a></h4><h4 id="id_version" style="font-size:10px; margin-top:-12px; opacity:0.6; box-shadow:none;"/>
</center>
