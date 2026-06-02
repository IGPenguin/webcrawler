---
layout: default
image: "https://igpenguin.github.io/stay-dead/assets/img/og-preview.png"
---
<!--Prevent auto-refresh on phone on resume-->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

<meta http-equiv="Permissions-Policy" content="interest-cohort=()">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
<link rel="manifest" href="manifest.json">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="js/constants.js"></script>
<script src="js/game-config.js"></script>
<script>
  if (getPlatform() === 'android') document.documentElement.classList.add('is-android');
  applyFontPreference();
  
  // Request persistent storage to prevent browsers from wiping data after inactivity
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(function(persistent) {
      if (persistent) console.log("Storage will not be cleared except by explicit user action");
      else console.log("Storage may be cleared by the UA under storage pressure.");
    });
  }

  // Apply initial background based on vector preference and preload others
  var _preloadedImages = [];
  (function() {
    var isVector = (typeof VECTOR_BACKGROUNDS_ENABLED !== 'undefined') ? VECTOR_BACKGROUNDS_ENABLED : false;
    var ext = isVector ? '.svg' : '.png';
    var folder = isVector ? 'assets/svg/' : 'assets/img/';
    var fileUrl = 'url(' + folder + 'Depths' + ext + ')';

    var applyBg = function() {
      var bodyEl = document.getElementsByTagName('body')[0];
      if (!bodyEl) { setTimeout(applyBg, 50); return; }
      bodyEl.style.backgroundImage = fileUrl;
      if (isVector) {
        bodyEl.style.backgroundRepeat = 'no-repeat';
        bodyEl.style.backgroundSize = 'cover';
        bodyEl.style.backgroundPosition = 'center bottom';
        bodyEl.style.backgroundAttachment = 'fixed';
      }
    };
    applyBg();

    // Preload all backgrounds to ensure offline availability
    var names = ['Auxiliary','Depths','Eternal','Fading','Forsaken','Freezing','Mournful','River','Shrouded','Twisted'];
    names.forEach(function(n) {
      var img = new Image();
      img.src = folder + n + ext;
      _preloadedImages.push(img);
    });
  })();
</script>
<script src="js/logging.js"></script>
<script src="js/string-generator.js"></script>
<script src="js/game-state.js"></script>
<script src="js/action-config.js"></script>
<script src="js/ui-effects.js"></script>
<script src="js/ui-render.js"></script>
<script src="js/enemy-skills.js"></script>
<script src="js/player-skills.js"></script>
<script src="js/inventory-manager.js"></script>
<script src="js/save-manager.js"></script>
<script src="js/achievements.js"></script>
<script src="js/transfunctioner.js"></script>
<script src="js/menu.js"></script>
<script src="js/data-loader.js"></script>
<script src="js/companion-manager.js"></script>
<script src="js/encounter-loader.js"></script>
<script src="js/encounter-generator.js"></script>
<script src="js/game-loop.js"></script>
<script src="js/score-manager.js"></script>
<script src="js/rival-manager.js"></script>
<script src="js/telemetry.js"></script>
<script src="js/social.js"></script>
<script src="js/action-resolver.js"></script>
<script src="js/action-bar.js"></script>
<script src="js/ui-buttons.js"></script>
<script src="js/keyboard.js"></script>

<div class= "curtain" id="id_fullscreen_curtain" style="pointer-events: none;" ></div>
<div class= "curtain curtain--fadein" id="id_curtain_fadein" style="pointer-events: none;" ></div>
<div class= "fullScreenText" id="id_fullscreen_text" style="-webkit-text-stroke: 6.5px black;
      paint-order: stroke fill;"></div>

<center class="animate__animated animate__fadeIn animate__fast">

<div class="game-viewport">

<!-- ── Main Menu ──────────────────────────────────────────────────────── -->
<div id="id_menu" class="menu-screen" style="display:none;">

  <!-- Shared logo — one element, animated on every menu show -->
  <!-- height:0 + overflow:visible mirrors the original h2 line-height:1px trick;
       SVG margin-top:-50px pulls the text up to the same visual position -->
  <div id="id_menu_logo" style="height:0; overflow:visible; margin-top:40px; margin-bottom:-5px; text-align:center; position:relative; z-index:1;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 150" width="340" style="overflow:visible; display:block; margin:0 auto; margin-top:-50px;">
      <!-- Smooth drops (shown in Native/Gelasio mode) -->
      <g class="drops-smooth">
        <path class="logo-drop-1" d="M 70,82 C 69,85 62.5,90 62.5,96 C 62.5,103 77.5,103 77.5,96 C 77.5,90 71,85 70,82 Z" fill="#9B0000" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>
        <path class="logo-drop-2" d="M 152,82 C 151,85 144.5,90 144.5,96 C 144.5,103 159.5,103 159.5,96 C 159.5,90 153,85 152,82 Z" fill="#9B0000" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>
        <path class="logo-drop-3" d="M 200,82 C 199,85 192.5,90 192.5,96 C 192.5,103 207.5,103 207.5,96 C 207.5,90 201,85 200,82 Z" fill="#9B0000" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>
        <path class="logo-drop-4" d="M 268,82 C 267,85 260.5,90 260.5,96 C 260.5,103 275.5,103 275.5,96 C 275.5,90 269,85 268,82 Z" fill="#9B0000" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>
        <path class="logo-drop-5" d="M 338,82 C 337,85 330.5,90 330.5,96 C 330.5,103 345.5,103 345.5,96 C 345.5,90 339,85 338,82 Z" fill="#9B0000" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>
      </g>
      <!-- Pixelated drops (shown in Pixel mode) -->
      <g class="drops-pixel" style="display:none;">
        <path class="logo-drop-1" d="M 68,82 H 72 V 86 H 75 V 90 H 77 V 95 H 74 V 98 H 66 V 95 H 63 V 90 H 65 V 86 H 68 Z" fill="#9B0000" stroke="#000" stroke-width="1.5" />
        <path class="logo-drop-2" d="M 150,82 H 154 V 86 H 157 V 90 H 159 V 95 H 156 V 98 H 148 V 95 H 145 V 90 H 147 V 86 H 150 Z" fill="#9B0000" stroke="#000" stroke-width="1.5" />
        <path class="logo-drop-3" d="M 198,82 H 202 V 86 H 205 V 90 H 207 V 95 H 204 V 98 H 196 V 95 H 193 V 90 H 195 V 86 H 198 Z" fill="#9B0000" stroke="#000" stroke-width="1.5" />
        <path class="logo-drop-4" d="M 266,82 H 270 V 86 H 273 V 90 H 275 V 95 H 272 V 98 H 264 V 95 H 261 V 90 H 263 V 86 H 266 Z" fill="#9B0000" stroke="#000" stroke-width="1.5" />
        <path class="logo-drop-5" d="M 336,82 H 340 V 86 H 343 V 90 H 345 V 95 H 342 V 98 H 334 V 95 H 331 V 90 H 333 V 86 H 336 Z" fill="#9B0000" stroke="#000" stroke-width="1.5" />
      </g>
      <text x="190" y="76"
        id="id_logo_text"
        text-anchor="middle"
        font-family="Georgia,'Times New Roman',serif"
        font-size="72" font-weight="bold"
        fill="#CC0000" stroke="#000000" stroke-width="6"
        paint-order="stroke fill" letter-spacing="2">Stay Dead</text>
    </svg>
  </div>

  <!-- Main screen -->
  <div id="menu_main_screen">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
      <h2 style="font-size:20px;
      letter-spacing:1.5px;
      -webkit-text-stroke: 5px black;
      paint-order: stroke fill;
      margin:8px 0 8px 0;
      text-align:center;">💀 Main Menu</h2>
      <div id="menu_continue_preview" style="display:none; margin-bottom:8px; overflow:hidden;"></div>
      <button class="menu-btn" id="menu_continue">⚔️ Continue</button>
      <button class="menu-btn" id="menu_new_game" style="color:#FFD940;">✨ Rise Again</button>
      <div class="menu-spacer"></div>
      <button class="menu-btn" id="menu_leaderboard" style="color:grey;">🪦 Reckonings</button>
      <button class="menu-btn" id="menu_challenges">🧩 Memories</button>
      <button class="menu-btn" id="menu_history">📜 Chronicles</button>
      <div class="menu-spacer"></div>
      <button class="menu-btn" id="menu_settings">⚙️ Settings</button>
      <button class="menu-btn" id="menu_credits">🖤 Makers</button>
    </div>
  </div>

  <!-- Origin picker screen -->
  <div id="menu_origin_screen" style="display:none;">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
      <h2 style="font-size:20px;
             letter-spacing:1.5px;
             -webkit-text-stroke: 5px black;
             paint-order: stroke fill;
             margin:8px 0 8px 0;
             text-align:center;">✨ Rise Again</h2>
      <h5 id="menu_origin_subtitle" style="margin:0 0 12px 0;
       font-size:14px; opacity:1; letter-spacing:0.8px; text-align:center;">
        This is a subtitle placeholder.</h5>
      <div style="flex:1;
                  min-height:0;
                  max-height:310px;
                  overflow-x:hidden;
                  overflow-y:auto;
                  scrollbar-width:none;
                  padding-top:4px;
                  margin-top:-6px;
                  padding-bottom:0px;">
        <div id="menu_origin_list"></div>
      </div>
      <button class="menu-btn" id="menu_origin_reroll" style="color:#2cc176; background-color:rgb(40 57 79);">✨ Transmute <b style="font-size:14px; color:#7193bf;"> -1 🪙</b></button>
      <div class="menu-spacer"></div>
      <button class="menu-btn" id="menu_origin_begin" style="margin-top:16px; color:grey;">✨ Choose an Origin</button>
      <button class="menu-btn" id="menu_origin_cancel">👈 Cancel</button>
    </div>
  </div>

  <!-- Confirm new game screen -->
  <div id="menu_confirm_screen" style="display:none;">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
        <h2 style="font-size:20px;
               letter-spacing:1.5px;
               -webkit-text-stroke: 5px black;
               paint-order: stroke fill;
               margin:8px 0 8px 0;
               text-align:center;">⚠️ Really want to start over?</h2>
        <div id="menu_confirm_preview" style="display:none; margin-bottom:8px; overflow:hidden;"></div>
        <div id="menu_confirm_warning" style="background-color:#202020; padding:6px 0 0 0; box-shadow:inset 0px 0px 0px 3px #000, 0 4px 8px 0 rgba(0,0,0,0.5);">
        <h4 style="text-align:center; min-height:0; font-size:14px; line-height:26px; margin-bottom:6px"><b style="font-weight:600; color:red; font-size:16px; ">Your current journey progress will be lost!</b><br><b style="font-weight:800; color:#62a862ff">🧩 Memories</b> and <b style="font-weight:800; color:#7193bf;">🪙 Drachmae</b> are forever.</h4>
      </div>
      <div class="menu-spacer"></div>
      <button class="menu-btn" id="menu_confirm_yes" style="margin-top:16px; color:red;">✕ Start Over</button>
      <button class="menu-btn" id="menu_confirm_cancel">👈 Cancel</button>
    </div>
  </div>

  <!-- Memories screen -->
  <div id="menu_memories_screen" style="display:none;">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
      <h2 style="font-size:20px;
            letter-spacing:1.5px;
            -webkit-text-stroke: 5px black;
            paint-order: stroke fill;
            margin:8px 0 6px 0;
            text-align:center;">🧩 Memories</h2>
      <h5 id="menu_memories_count" style="margin:0 0 12px 0; font-size:14px; opacity:1; letter-spacing:0.8px; text-align:center;"></h5>
      <div style="flex:1;
                  min-height:0;
                  max-height:432px;
                  overflow-x:hidden;
                  overflow-y:auto;
                  scrollbar-width:none;
                  padding-top:4px;
                  margin-top:-6px;
                  padding-bottom:4px;">
        <div id="menu_memories_list"></div>
      </div>
      <div class="menu-spacer"></div>
      <button class="menu-btn" id="menu_memories_back">👈 Back</button>
    </div>
  </div>

  <!-- Session History screen -->
  <div id="menu_history_screen" style="display:none;">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
      <h2 style="font-size:20px;
            letter-spacing:1.5px;
            -webkit-text-stroke: 5px black;
            paint-order: stroke fill;
            margin:8px 0 6px 0;
            text-align:center;">📜 Chronicles</h2>
      <h5 id="menu_chronicles_note" style="margin:0 0 12px 0; font-size:14px; opacity:1; letter-spacing:0.8px; text-align:center;">The eternal remains of those who tried.</h5>
      <div style="flex:1;
                  min-height:0;
                  max-height:432px;
                  overflow-x:hidden;
                  overflow-y:auto;
                  scrollbar-width:none;
                  padding-top:4px;
                  margin-top:-6px;
                  padding-bottom:4px;">
        <div id="menu_history_list"></div>
      </div>
      <div class="menu-spacer"></div>
        <div id="menu_history_actions" style="display:none; gap:4px; margin-top:5px;">
        <button class="menu-btn" id="menu_history_scorelink" style="flex:1; display:none; margin-top:0px; color:#7193bf;">🔗 Score Link</button>
        <button class="menu-btn" id="menu_history_review" style="flex:1; margin-top:0; color:#62a862ff;">💚 Rate</button>
        <button class="menu-btn" id="menu_history_donate" style="flex:1; margin-top:0; color:#BF40BF;">🎉 Praise</button>
        <button class="menu-btn" id="menu_history_share" style="flex:1; margin-top:0; color:#fff;">📎 Share</button>
      </div>
      <button class="menu-btn" id="menu_history_back">👈 Back</button>
    </div>
  </div>

  <!-- Credits screen -->
  <div id="menu_credits_screen" style="display:none;">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
          <h2 style="font-size:20px;
            letter-spacing:1.5px;
            -webkit-text-stroke: 5px black;
            paint-order: stroke fill;
            margin:8px 0 8px 0;
            text-align:center;">🖤 Makers</h2>
      <div id="menu_credits_body" style="padding:12px 0 12px 0; box-shadow:inset 0px 0px 0px 3px #000; background-color:#272727;">
        <h5 style="text-align:center; padding-left:4px; margin-bottom:2px; margin-top:8px; opacity:0.6; font-size:16px; color:#FFF;">Developed by</h5>
        <h4 style="min-height:0; margin-bottom:10px; padding:0 4px; font-size:18px; font-weight:600; margin-bottom:12px;">Adam <a href="https://github.com/IGPenguin" target="_blank" rel="noopener">"IGPenguin"</a> Svoboda</h4>
        <h5 style="text-align:center; padding-left:4px; margin-bottom:2px; opacity:0.6; font-size:14px;">Co-designer, feedback</h5>
        <h4 style="min-height:0; margin-bottom:10px; padding:0 4px; font-size:16px; font-weight:600;margin-bottom:14px;">Terezka <a href="https://github.com/Blue2lip" target="_blank" rel="noopener">"Blue2lip"</a> Svobodová</h4>
        <h5 style="text-align:center; padding-left:4px; margin-bottom:2px; opacity:0.6; font-size:14px;">Custom tools</h5>
        <h4 style="min-height:0; margin-bottom:10px; padding:0 4px; font-size:14px; font-weight:600;margin-bottom:16px;"><a href="https://github.com/IGPenguin/perseus-blade" target="_blank" rel="noopener">Perseus Blade</a>, <a href="https://github.com/IGPenguin/hades-gate" target="_blank" rel="noopener">Hades Gate</a><br><a href="https://github.com/IGPenguin/styx-flow" target="_blank" rel="noopener">Styx Flow</a>, <a href="https://github.com/IGPenguin/medusa-gaze" target="_blank" rel="noopener">Medusa Gaze</a>, <a href="https://github.com/IGPenguin/echo-skepsis" target="_blank" rel="noopener">Echo Skepsis</a></h4>
        <h5 style="text-align:center; padding-left:4px; margin-bottom:4px; opacity:0.6; font-size:14px;">Coding tech</h5>
        <h4 style="min-height:0; margin-bottom:10px; padding:0 4px; font-size:14px; margin-bottom:16px;"><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener">JS</a> + <a href="https://jekyllrb.com/" target="_blank" rel="noopener">Jekyll</a> + <a href="https://animate.style" target="_blank" rel="noopener">animate.style</a></h4>
        <h5 style="text-align:center; padding-left:4px; margin-bottom:2px; opacity:0.6; font-size:14px;">Beta testers</h5>
        <h4 style="min-height:0; margin-bottom:10px; padding:0 4px; font-size:14px; color:yellow; font-weight:600;margin-bottom:16px;">Your Nickname to shine here!</h4>
        <h5 style="text-align:center; padding-left:4px; margin-bottom:2px; opacity:0.6; font-size:12px;">Time sacrificed</h5>
        <h5 style="text-align:center; font-size:12px; line-height:20px; margin-top:2px; margin-bottom:8px; padding-left:48px; padding-right:48px; color:#fff;">Countless nights since <a href="https://github.com/IGPenguin/stay-dead/commit/d345a3bc8aefa1989b9c0354d8b32262091254f6#diff-f4fff32f05723c7a6fbc73dd7f920e2c3b85f600a5d4aa760854bc4900b9ced8" target="_blank" rel="noopener">February 27, 2023</a></h5>
        <h4 style="min-height:0; margin-bottom:8px; margin-top:12px; padding:0 4px; font-size:18px; color:#FFD940; font-weight:600; -webkit-text-stroke:4px black; paint-order:stroke fill; display:none;">Thank you for playing!</h4>
      </div>
      <div class="menu-spacer"></div>
      <div style="display:flex; gap:4px; margin-top:5px;">
        <button class="menu-btn" id="menu_credits_review" style="flex:1; margin-top:0; color:#62a862ff;">💚 Rate</button>
        <button class="menu-btn" id="menu_credits_contact" style="flex:1; margin-top:0; color:#487bb5;">🗣️ Greet</button>
        <button class="menu-btn" id="menu_credits_share" style="flex:1; margin-top:0; color:#fff;">🔗 Share</button>
      </div>
      <button class="menu-btn" id="menu_credits_donate" style="flex:1; color:#F7D147; background-color:#4d4112;">☕️ Donate 1 Coffee!</button>
      <button class="menu-btn" id="menu_credits_back">👈 Back</button>
    </div>
  </div>

  <!-- Rankings screen -->
  <div id="menu_rankings_screen" style="display:none;">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
      <h2 style="font-size:20px;
            letter-spacing:1.5px;
            -webkit-text-stroke: 5px black;
            paint-order: stroke fill;
            margin:8px 0 6px 0;
            text-align:center;">🪦 Reckonings</h2>
      <h5 id="menu_rankings_note" style="margin:0 0 12px 0; font-size:14px; opacity:1; letter-spacing:0.8px; text-align:center;">The data is updated approx. every 15 minutes.</h5>
      <div style="flex:1;
                  min-height:0;
                  max-height:444px;
                  overflow-x:hidden;
                  overflow-y:auto;
                  scrollbar-width:none;
                  padding-top:4px;
                  margin-top:-6px;
                  padding-bottom:4px;">
        <div id="menu_rankings_list"></div>
      </div>
      <div class="menu-spacer"></div>
      <button class="menu-btn" id="menu_rankings_back">👈 Back</button>
    </div>
  </div>

  <!-- Settings screen -->
  <div id="menu_settings_screen" style="display:none;">
    <div class="card menu-main-card" style="background-color:#202020; padding-top:10px; padding-bottom:14px; margin-top:42px">
      <h2 style="font-size:20px; letter-spacing:1.5px; -webkit-text-stroke:5px black; paint-order:stroke fill; margin:8px 0 8px 0; text-align:center;">⚙️ Settings</h2>
      <div id="menu_settings_content" style="overflow-x:hidden; overflow-y:auto; max-height:444px; scrollbar-width:none; padding-top:2px; padding-bottom:2px;"></div>
      <button class="menu-btn" id="menu_codex">📕 Codex of the Damned</button>
      <h5 style="margin:8px 3px 0 3px; font-size:12px; line-height:165%; opacity:0.75; color:#fff; text-align:center;"><b style="color:red;">↑</b> Read this if you keep struggling with staying alive.<br></h5>
      <div class="menu-spacer"></div>
      <h5 style="margin-top:12px; margin-bottom:8px 3px -8px 3px; font-size:12px; line-height:175%; opacity:0.75; color:#fff; text-align:center;">🔒 Non-personal telemetry data <a href="https://github.com/IGPenguin/stay-dead" style="color:#487bb5; opacity:0.9;"> is being collected.</a></h5>
      <div style="display:flex; gap:2px;">
      <button class="menu-btn" id="menu_version_history" style="flex:1;">🗂️ History</button>
      <button class="menu-btn" id="menu_contribute" style="flex:1;">🏗️ Build</button>
      <button class="menu-btn" id="menu_report_bug" style="flex:1;">🐞 Report</button>
      </div>
      <button class="menu-btn" id="menu_settings_purge_1" style="color:red;">✕ Delete Saves</button>
      <div id="menu_settings_purge_2" style="display:none; gap:4px;">
        <button class="menu-btn" id="menu_settings_purge_cancel" style="flex:1; margin-top:0;">Cancel</button>
        <button class="menu-btn" id="menu_settings_purge_confirm" style="flex:1; margin-top:0; color:red;">✕ Delete</button>
      </div>
      <button class="menu-btn" id="menu_settings_back">👈 Back</button>
    </div>
  </div>

  <!-- Always-visible version footer -->
  <div id="version_warpper_menu" style="cursor: pointer; padding-right:24px; padding-left:24px; text-align:center;">
    <h4 style="font-size:14px; opacity:0.6; margin-top:6px; margin-bottom:0; letter-spacing:1px; box-shadow:none; text-align:center;">developed by IGPenguin</h4>
      <h4 id="menu_version" style="font-size:12px; margin-top:-8px; margin-bottom:0; opacity:0.4; box-shadow:none; text-align:center; width:100%;"></h4>
  </div>

</div><!-- end id_menu -->

<!-- Score submission overlay — shown on every game end -->
<div id="nickname_overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:9999; align-items:center; justify-content:center; flex-direction:column;">
  <div class="card" style="background-color:#202020; padding:20px 20px 14px 20px; max-width:320px; width:90%; max-height:88vh; overflow-y:auto; scrollbar-width:none; box-shadow:0 0 0 3px #000;">
    <div id="nickname_ending_label" style="text-align:center; margin:0 0 4px 0; font-size:20px; font-weight:bold; -webkit-text-stroke:4px black; paint-order:stroke fill;"></div>
    <div id="nickname_score_display" style="text-align:center; margin:0 0 10px 0; color:#FFD940; font-size:24px; font-weight:bold; -webkit-text-stroke:4px black; paint-order:stroke fill;"></div>
    <div id="nickname_score_breakdown" class="menu-score-bar" style="margin:0 0 12px 0; padding:8px 10px; background-color:#272727; box-shadow:0px 0px 0px 3px #121212; font-size:14px;"></div>
    <input id="nickname_input" type="text" maxlength="32" placeholder="Your Nickname (3+ chars)" style="width:100%; box-sizing:border-box; font-size:16px; padding:9px 10px; background:#2a2a2a; border:none; outline:2px solid #555; color:#fff; font-family:inherit; border-radius:0;">
    <h5 style="text-align:center; margin:12px 0 0 0; opacity:0.55; font-size:13px; font-weight:400;">Your Valor will be shown in the Reckonings.</h5>
    <h5 id="nickname_error" style="color:#ff4444; text-align:center; margin:6px 0 0 0; font-size:13px; display:none;">Minimum 3 characters required.</h5>
    <h5 id="nickname_ban_error" style="color:#ff4444; text-align:center; margin:6px 0 0 0; font-size:13px; display:none;">That name is not allowed.</h5>
    <button id="nickname_confirm" class="menu-btn" style="margin-top:14px; color:#FFD940;">✓ Submit</button>
    <button id="nickname_skip" class="menu-btn" style="margin-top:4px; color:#FF0000;">✕ Skip</button>
  </div>
</div>

<!-- Companion / character name overlay -->
<div id="companion_name_overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:9999; align-items:center; justify-content:center; flex-direction:column;">
  <div class="card" style="background-color:#202020; padding:20px 20px 0px 20px; max-width:320px; width:90%; box-shadow:0 0 0 3px #000;">
    <h3 id="companion_name_title" style="text-align:center; margin:0 0 16px 0; font-size:18px; -webkit-text-stroke:4px black; paint-order:stroke fill;">✏️ Name them:</h3>
    <input id="companion_name_input" type="text" maxlength="32" placeholder="Enter a name..." style="width:100%; box-sizing:border-box; font-size:16px; padding:9px 10px; background:#2a2a2a; border:none; outline:2px solid #555; color:#fff; font-family:inherit; border-radius:0;">
    <button id="companion_name_confirm" class="menu-btn" style="margin-top:14px; color:#FFD940;">✓ Confirm</button>
    <button id="companion_name_skip" class="menu-btn" style="margin-top:4px; color:#FF0000;">✕ Skip</button>
  </div>
</div>

<!-- Slot swap comparison overlay -->
<div id="swap_overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:9999; align-items:center; justify-content:center; flex-direction:column;">
  <div class="card" style="background-color:#202020; padding:20px 20px 14px 20px; max-width:320px; width:90%; box-shadow:0 0 0 3px #000;">
    <h3 style="text-align:center; margin:0 0 14px 0; font-size:17px; color:#fff; -webkit-text-stroke:4px black; paint-order:stroke fill;">⁉️ Replace the current item?</h3>
    <div style="margin:0 0 4px 0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#fff;">Current Item</div>
    <div id="swap_current_row" class="menu-history-entry" style="margin-bottom:12px; cursor:default;"></div>
    <div style="margin:0 0 4px 0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#fff;">New Item</div>
    <div id="swap_new_row" class="menu-history-entry" style="margin-bottom:12px; cursor:default;"></div>
    <div id="swap_diff_row" style="text-align:center; font-size:14px; font-weight:bold; min-height:1.2em;"></div>
    <button id="swap_confirm" class="menu-btn" style="margin-top:14px; color:#FFD940;">✓ Equip New</button>
    <button id="swap_cancel" class="menu-btn" style="margin-top:4px; color:#FF0000;">✕ Cancel</button>
  </div>
</div>

<!-- Version changelog overlay — shown once when version changes -->
<div id="changelog_overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:9999; align-items:center; justify-content:center; flex-direction:column;">
  <div class="card" style="background-color:#202020; padding:20px 20px 14px 20px; max-width:320px; width:90%; box-shadow:0 0 0 3px #000;">
    <h3 style="text-align:center; margin:0 0 4px 0; font-size:18px; -webkit-text-stroke:4px black; paint-order:stroke fill;">🎉 New version released!</h3>
    <h5 id="changelog_version" style="text-align:center; margin:0 0 14px 0; opacity:0.75; font-size:12px; font-weight:400;"></h5>
    <div id="changelog_list" class="menu-score-bar" style="max-height:50vh; min-height:68px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#000 transparent; margin-bottom:14px; background-color:#272727; box-shadow:0px 0px 0px 3px #121212; padding:8px; margin:4px 4px 12px 4px;"></div>
    <button id="changelog_dismiss" class="menu-btn" style="color:#FFD940;">✓ Dismiss</button>
  </div>
</div>

<!-- Version history overlay — full VERSION.md shown on demand from Settings -->
<div id="version_history_overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:9999; align-items:center; justify-content:center; flex-direction:column;">
  <div class="card" style="background-color:#202020; padding:20px 20px 14px 20px; max-width:320px; width:90%; box-shadow:0 0 0 3px #000;">
    <h3 style="text-align:center; margin:0 0 12px 0; font-size:18px; -webkit-text-stroke:4px black; paint-order:stroke fill;">🗒️ Version History</h3>
    <div id="version_history_list" class="menu-score-bar" style="height:52vh; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#000 transparent; background-color:#272727; box-shadow:0px 0px 0px 3px #121212; padding:8px; margin:0 0 12px 0;"></div>
    <button id="version_history_dismiss" class="menu-btn" style="color:#FFD940;">✓ Dismiss</button>
  </div>
</div>

<!-- Rolling credits overlay — shown after win, before Stack Overflow reveals -->
<div id="credits_roll" style="display:none; position:fixed; inset:0; z-index:9000; overflow:hidden; pointer-events:none; background:#000;">
  <div id="credits_scroll_inner" style="position:absolute; top:0; left:0; right:0; text-align:center; padding:40px 32px; will-change:transform;"></div>
</div>

<!-- ── Game ───────────────────────────────────────────────────────────── -->
<div id="id_game" style="display:none;">

<h2 id = "id_area" style="
    margin-bottom:-12px;
    margin-top:-2px;
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

<br style="clear:both" />
<div class="box-border-dynamic">
<div id = "id_emoji_flipper" style="margin-bottom:14px;
                              box-shadow:
                                0px 0px 0px 3px #121212;
                              padding-bottom:0px;
                              padding-top:8px;
                              margin-top:0px;
                              background-color:#272727;">
<div id = "id_emoji_wrapper" style="position:relative;">
<h1 id = "id_emoji" style="position:relative; z-index:3; padding:0px;"></h1>
<div class="enemyOverlay" id="id_enemy_overlay" style="font-family:sans; font-size:74px; position:absolute; top:-20px; width:100%; display:none; align-items:center; justify-content:center; pointer-events:none; z-index:4;"></div>
</div>
</div>
</div>

<div id = "id_stats_wrapper" class="box-border-dynamic" style="margin-top:0px;
        box-shadow:
          0px 0px 0px 3px #000000;
            position:relative; z-index:2;
            overflow:hidden;
            background-color:#202020;">


<h3 id = "id_stats" style="float:left;
                            text-align:left;
                            font-size:14px;
                            height:26px;
                            padding-left:8px;
                            padding-bottom:0px;
                            line-height:26px;
                            margin-top:0px;
                            margin-bottom:-2px;
                            margin-right:0px;
                            font-family:sans;
                            display:inline;
                            overflow:hidden;
                            width:100%;"/>

<h5 id = "id_team" style="float:right;
                                text-align:right;
                                font-weight:300;
                                font-size:14px;
                                padding-bottom:0px;
                                padding-right:7px;
                                margin-bottom:-4px;
                                margin-top:1px;
                                margin-left:-10px;
                                display:inline;
                                overflow:hidden;
                                line-height:24px;"/>
</div>
<div class="box-border-dynamic" style="margin-top:3px;
  margin-right:0px;
    margin-bottom:12px;
  background-color:#272727;
  box-shadow:
    0px 0px 0px 3px #121212;
      position:relative; z-index:1;
      overflow:hidden;">

<h4 id = "id_desc" style="float:left;
  text-align:left;
  padding-top:2px;
  padding-left:8px;
  padding-right:4px;
  padding-bottom:2px;
  min-height:74px;
  margin-bottom:0px;
  line-height:165%;
  position:relative;"/>
</div>
</div>
</div>
</div>

<p style="margin:4px;"></p>
<h3 id = "id_versus" style="margin-top:-20px;
  margin-bottom:-16px;
    color:red;
    font-size:28px;
      letter-spacing:1.5px;
      -webkit-text-stroke: 5px black;
        paint-order: stroke fill;
          position:relative; z-index:2;">VS</h3>

<div class="toolbar-card" id = "id_toolbar_card" style="padding-bottom:6px;
  margin-top:4px;
    padding-top:6px;
      background-color:#202020;">

<div class="toolbar" id = "id_player_info" style="padding-bottom:2px; padding-top:4px; max-width:340px;">

<h3 id="id_player_level" style="display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 28px;
  margin-top:6px;
  margin-bottom:-28px;
  margin-left:4px;
  position:relative;
  z-index:3;
  text-align:right;
  padding-right:10px;
  cursor:pointer;">Level</h3>

<div class="box-border-dynamic" style="margin-left:3px;
                                        margin-right:3px;
                                        margin-bottom:1px;
                                        background-color:#202020;">

<h3 id = "id_player_name" style="display: flex;
                                  align-items: center;
                                  height: 28px;
                                  text-align:left;
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
<div id="id_xp_progress" style="width:0%; height:2px; background:#FFD940; margin-top:1px; margin-bottom:0px; margin-left:4px">&nbsp;</div>

<div id="id_action_bar_area" style="position:relative; margin-bottom:14px;">
<div class="box-border-dynamic" style="margin-left:3px;
                                        margin-right:3px;
                                          box-shadow:
                                            0px 0px 0px 3px #121212;">

<div class= "playerOverlay" id="id_player_overlay" style="font-family:sans; font-size:88px; position:absolute; z-index:11;"></div>

<h3 id = "id_player_status" style="text-align:left;
                                    display: flex;
                                    align-items: center;
                                    height: 24px;
                                    padding-left:8px;
                                    font-size:14px;
                                    margin-bottom: 4px;
                                    margin-top:12px;
                                    font-family:sans;
                                    background-color: #202020;
                                    box-shadow:
                                      0px 0px 0px 3px #000000;
                                      position:relative; z-index:1;
                                      overflow: hidden;"/>
</div>
<div id="id_action_bar"><div id="id_action_bar_track"><div id="id_action_bar_cursor"></div><div id="id_action_bar_result"></div></div><div id="id_action_bar_cancel">✕ Cancel</div></div>
</div>
<div class="box-border-dynamic" style="margin-left:3px;
                                        margin-right:3px;
                                        margin-top:-11px;
                                        padding-bottom:0px;
                                          box-shadow:
                                            0px 0px 0px 3px #121212;
                                              background-color:#272727;">

<h4 id = "id_log" style="margin-top:0px;
                          padding-left:8px;
                          margin-bottom:12px;
                          text-align:left;
                          height:4.5em;
                          overflow-y:auto;
                          scrollbar-width:none;"/>
</div>
<h3 id="id_player_party_loot" style="text-align:left; overflow-x:auto; white-space:nowrap; float:left; padding-top:3px; padding-bottom:3px; padding-left:8px; margin-left:3px; margin-bottom:6px; margin-top:0px; display:inline-block; width:95.8%; box-shadow:0px 0px 0px 3px #121212; background-color:#272727;"></h3>
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
  <button type = "button" id = "button_heal">🙏</button>&nbsp;
  <button type = "button" id = "button_curse">🪬</button>
</div>
</div>

<div style="position:relative; margin-top:16px; display:flex; justify-content:center; align-items:center;">
  <button type="button" id="button_menu" style="position:absolute; left:-82px; top:50%; transform:translateY(-50%); font-size:16px; min-height:42px; width:64px; padding:0 12px; letter-spacing:0.5px;">⚙️</button>
  <button type="button" id="button_challenges" style="position:absolute; right:-82px; top:50%; transform:translateY(-50%); font-size:16px; min-height:42px; width:64px; padding:0 12px; letter-spacing:0.5px;">🧩</button>
  <div id="version_warpper" style="cursor: pointer; padding-right:4px; padding-left:4px; text-align:center;">
    <h4 style="font-size:14px; opacity:0.6; margin-bottom:0; letter-spacing:1px; box-shadow:none; text-align:center;">developed by IGPenguin</h4>
      <h4 id="id_version" style="font-size:12px; margin-top:-8px; margin-bottom:0; opacity:0.4; box-shadow:none; text-align:center; width:100%;"></h4>
  </div>
</div>

</div><!-- end id_game -->

</div><!-- end game-viewport -->
</center>
