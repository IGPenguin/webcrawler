---
layout: default
---
<!--Prevent auto-refresh on phone on resume-->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

<meta http-equiv="Permissions-Policy" content="interest-cohort=()">
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="{{ page.title }}" />
<meta name="twitter:title" content="{{ page.title }}" />
<meta name="twitter:image" content="{{ page.title_image }}" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
<script src="js/game_loop.js"></script>

<div class= "curtain" id="id_fullscreen_curtain" style="height:200%; pointer-events: none;" ></div>
<div class= "fullScreenText" id="id_fullscreen_text" style="-webkit-text-stroke: 6.5px black;
      paint-order: stroke fill;"></div>

<center class="animate__animated animate__fadeIn animate__fast">

<h2 id = "id_area" style="margin-top:-30px;
    margin-bottom:-12px;
    font-size:28px;
    letter-spacing: 1.5px;
    -webkit-text-stroke: 6.5px black;
      paint-order: stroke fill;
        position:relative; z-index:2;">Forgotten Forest</h2>

<div class="card" id="id_card" style="background-color:#202020;padding-bottom:4px">

<div id="id_enemy_card_contents">
<div id = "id_enemy_info">
  <div class="box-border-dynamic" style="position:relative; z-index:1;">
  <h2 id = "id_name" style="text-align:left;
    font-size:18px;
    padding-left:8px;
    letter-spacing:0.8px;
    -webkit-text-stroke: 5px #121212;
      paint-order: stroke fill;
    margin-bottom:-13px;
    padding-top:1px;
    padding-bottom:1px;
    background-color:#202020;"/>
  </div>

<div class= "enemyOverlay" id="id_enemy_overlay" style="font-family:sans; font-size:88px; position:absolute; z-index:4;"></div>
<br style="clear:both" />
<div class="box-border-dynamic">
<div id = "id_emoji_flipper" style="margin-bottom:14px;
                              box-shadow:
                                0px 0px 0px 3px #121212;
                              padding-bottom:0px;
                              padding-top:8px;
                              margin-top:0px;
                              background-color:#272727;">
<div id = "id_emoji_wrapper">
<h1 id = "id_emoji" style="position:relative; z-index:3 padding:4px"/>
</div>
</div>
</div>

<div class="box-border-dynamic" style="margin-top:0px;
        box-shadow:
          0px 0px 0px 3px #000000;
            position:relative; z-index:2;
            overflow:auto;
            background-color:#202020;">


<h3 id = "id_stats" style="float:left;
                            text-align:left;
                            font-size:14px;
                            padding-left:8px;
                            padding-bottom:0px;
                            line-height:24px;
                            margin-top:0px;
                            margin-bottom:0px;
                            margin-right:0px;
                            font-family:sans;
                            display:inline;
                            width:70%;"/>

<h5 id = "id_team" style="float:right;
                                text-align:right;
                                font-weight:300;
                                font-size:14px;
                                padding-bottom:0px;
                                padding-right:7px;
                                margin-bottom:0px;
                                display:inline;
                                overflow:auto;
                                line-height:24px"/>
</div>
<div class="box-border-dynamic" style="margin-top:3px;
  margin-right:0px;
    margin-bottom:12px;
  background-color:#272727;
  box-shadow:
    0px 0px 0px 3px #121212;
      position:relative; z-index:1;
      overflow:auto;">

<h4 id = "id_desc" style="float:left;
  text-align:left;
  padding-top:6px;
  padding-left:8px;
  padding-right:8px;
  padding-bottom:2px;
  min-height:74px;
  margin-bottom:0px;
  line-height:165%;
  width:95%;
  position:relative;"/>
</div>
</div>
</div>
</div>

<p style="margin:4px;"></p>
<h3 id = "id_versus" style="margin-top:-13px;
  margin-bottom:-13px;
    color:red;
    font-size:24px;
      letter-spacing:1.5px;
      -webkit-text-stroke: 5px black;
        paint-order: stroke fill;
          position:relative; z-index:2;">VS</h3>

<div class="toolbar-card" id = "id_toolbar_card" style="padding-bottom:6px;
  margin-top:4px;
    padding-top:6px;
      background-color:#202020;">

<div class="toolbar" id = "id_player_info" style="padding-bottom:8px; padding-top:8px; max-width:340px;">

<h3 id="id_player_level" style="margin-top:6px;
  margin-bottom:-19px;
    margin-left:4px;
      position:relative;
        z-index:3;
          text-align:right;
            padding-right:10px;
              cursor:pointer;">Level</h3>

<div class="box-border-dynamic" style="margin-left:3px;
                                        margin-right:3px;
                                        padding-top:2px;
                                        padding-bottom:2px;
                                              background-color:#202020;">

<h3 id = "id_player_name" style="text-align:left;
                                  padding-left:8px;
                                  letter-spacing:0.8px;
                                  font-weight:5OO;
                                  margin-top:0px;
                                  cursor:pointer;
                                  font-size:17px;
                                  margin-bottom:0px;
                                  -webkit-text-stroke: 5px #121212;
                                    paint-order: stroke fill;"/>

</div>

<div id="id_xp_progress" style="width:0%; height:1px; background:#FFD940; margin-top:1px; margin-bottom:0px; margin-left:4px">&nbsp;</div>

<div class="box-border-dynamic" style="margin-left:3px;
                                        margin-right:3px;
                                          margin-bottom:14px;
                                            box-shadow:
                                              0px 0px 0px 3px #121212;">

<div class= "playerOverlay" id="id_player_overlay" style="font-family:sans; font-size:88px; position:absolute; z-index:2;"></div>

<h3 id = "id_player_status" style="text-align:left;
                                    padding-left:8px;
                                    padding-top:2px;
                                    padding-bottom:2px;
                                    font-size:14px;
                                    margin-bottom:-11px;
                                    margin-top:12px;
                                    font-family:sans;
                                    box-shadow:
                                      0px 0px 0px 3px #000000;
                                      position:relative; z-index:1;"/>
</div>
<div class="box-border-dynamic" style="margin-left:3px;
                                        margin-right:3px;
                                        padding-top:2px;
                                        padding-bottom:0px;
                                          box-shadow:
                                            0px 0px 0px 3px #121212;
                                              background-color:#272727;">

<h4 id = "id_log" style="margin-top:0px;
                          padding-left:8px;
                          margin-bottom:12px;
                          text-align:left;"/>
</div>
<h3 id = "id_player_party_loot" style="text-align:left;
                                        text-overflow: cut;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        float:left;
                                        padding-top:3px;
                                        padding-bottom:3px;
                                        padding-left:8px;
                                        margin-left:3px;
                                        margin-bottom:0px;
                                        margin-top:0px;
                                        display:inline-block;                      
                                        width:95.8%;
                                        box-shadow:
                                          0px 0px 0px 3px #121212;
                                          background-color:#272727;"/>
</div>
<div id="id_buttons" style="margin:6px; margin-top:1px;">
  <button type = "button" id = "button_attack">🎯</button>&nbsp;
  <button type = "button" id = "button_roll">🌀</button>&nbsp;
  <button type = "button" id = "button_block">🔰</button>
    <p style="margin:8px;"></p>
  <button type = "button" id = "button_grab">✋</button>&nbsp;
  <button type = "button" id = "button_sleep">💤</button>&nbsp;
  <button type = "button" id = "button_speak">💬</button>
    <p style="margin:8px;"></p>
  <button type = "button" id = "button_cast">🪄</button>&nbsp;
  <button type = "button" id = "button_pray">🙏</button>&nbsp;
  <button type = "button" id = "button_curse">🪬</button>
</div>
</div>



<p style="margin:18px"></p>

<div style="cursor: pointer;" onclick="window.location='https://github.com/IGPenguin/webcrawler/pulls?q=is%3Apr+is%3Aclosed';">
<h4 style="font-size:11px; opacity:0.6; margin-top:-4px; letter-spacing:1px;box-shadow:none;">made with love by <a href="https://github.com/IGPenguin/webcrawler/pulls?q=is%3Apr+is%3Aclosed">IGPenguin</a></h4>
</div>

<div id="id_bug" style="cursor: pointer;">
<h4 id="id_version" style="font-size:10px; margin-top:-20px; margin-bottom:-8px; opacity:0.4; box-shadow:none;"/>
</div>
</center>
