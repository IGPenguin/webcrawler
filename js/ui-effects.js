//UI Effects
var _curtainGen = 0; // incremented on every curtain call; stale handlers self-abort
function toggleUIElement(UIElement,opacity = "0"){
  var elementDisplayState = UIElement.style.opacity;
  if (elementDisplayState != "0"){
    UIElement.style.opacity=opacity;
  } else {
    UIElement.style.opacity=opacity;
  }
}

// Fades the curtain in over the current screen, calls callback() while fully
// black (to swap menu → game), then fades the curtain out to reveal the game.
// Optional message: fades in over the black curtain, holds briefly, then fades out with the curtain.
function transitionToGame(callback, message) {
  var curtain = document.getElementById('id_fullscreen_curtain');
  var textEl  = document.getElementById('id_fullscreen_text');
  var gen = ++_curtainGen;

  curtain.style.pointerEvents = 'auto'; // block stray taps during transition
  curtain.style.display = 'block';
  void curtain.offsetWidth; // reflow so animate__fadeIn starts from opacity:0

  curtain.style.setProperty('--animate-duration', '0.4s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');

  curtain.addEventListener('animationend', function onFadeIn() {
    curtain.removeEventListener('animationend', onFadeIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');

    callback(); // hide menu, set up game state, redraw — all while curtain is opaque

    if (message) {
      textEl.innerHTML = message;
      textEl.style.display = 'block';
      void textEl.offsetWidth;
      textEl.style.setProperty('--animate-duration', '0.5s');
      textEl.classList.add('animate__animated', 'animate__fadeIn');

      setTimeout(function () {
        if (_curtainGen !== gen) return;
        textEl.classList.remove('animate__animated', 'animate__fadeIn');
        void curtain.offsetWidth;
        curtain.style.setProperty('--animate-duration', '0.7s');
        curtain.classList.add('animate__animated', 'animate__fadeOut');
        void textEl.offsetWidth;
        textEl.style.setProperty('--animate-duration', '0.7s');
        textEl.classList.add('animate__animated', 'animate__fadeOut');

        curtain.addEventListener('animationend', function onFadeOut() {
          curtain.removeEventListener('animationend', onFadeOut);
          if (_curtainGen !== gen) return;
          curtain.classList.remove('animate__animated', 'animate__fadeOut');
          curtain.style.display = 'none';
          curtain.style.pointerEvents = 'none';
          textEl.classList.remove('animate__animated', 'animate__fadeOut');
          textEl.style.display = 'none';
        });
      }, 3000);
    } else {
      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.7s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');

      curtain.addEventListener('animationend', function onFadeOut() {
        curtain.removeEventListener('animationend', onFadeOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
      });
    }
  });
}

// Two-element curtain approach: a dedicated fadein overlay handles the going-black
// phase (smooth fade-in, no animationend glitch risk), then the main curtain takes
// over solid-black for the hold + fade-out. The handoff is instant while both are
// fully opaque, so the transition is invisible.
function transitionArea(html, callback, onBeforeFadeOut) {
  var curtain  = document.getElementById('id_fullscreen_curtain');
  var fadeInEl = document.getElementById('id_curtain_fadein');
  var textEl   = document.getElementById('id_fullscreen_text');
  var gen = ++_curtainGen;

  // Phase 1: fade the fadein overlay to black
  fadeInEl.style.pointerEvents = 'auto';
  fadeInEl.style.display = 'block';
  void fadeInEl.offsetWidth;
  fadeInEl.style.setProperty('--animate-duration', '0.4s');
  fadeInEl.classList.add('animate__animated', 'animate__fadeIn');

  fadeInEl.addEventListener('animationend', function onFadeIn(e) {
    if (e.target !== fadeInEl) return;
    fadeInEl.removeEventListener('animationend', onFadeIn);
    if (_curtainGen !== gen) return;
    fadeInEl.classList.remove('animate__animated', 'animate__fadeIn');
    fadeInEl.style.opacity = '1'; // pin to prevent Chrome fill-mode glitch

    // Phase 2: snap main curtain solid black, load content under the fadein overlay
    curtain.style.pointerEvents = 'auto';
    curtain.style.opacity = '1';
    curtain.style.display = 'block';
    callback();

    // Phase 3: fade in area name text, then instantly drop the fadein overlay
    textEl.innerHTML = html;
    textEl.style.display = 'block';
    void textEl.offsetWidth;
    textEl.style.setProperty('--animate-duration', '0.5s');
    textEl.classList.add('animate__animated', 'animate__fadeIn');

    fadeInEl.style.display = 'none';
    fadeInEl.style.opacity = '';
    fadeInEl.style.pointerEvents = 'none';

    // Phase 4: hold, then fade curtain + text out together
    setTimeout(function () {
      if (_curtainGen !== gen) return;
      if (onBeforeFadeOut) onBeforeFadeOut();
      textEl.classList.remove('animate__animated', 'animate__fadeIn');
      curtain.style.opacity = '';
      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.7s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');
      void textEl.offsetWidth;
      textEl.style.setProperty('--animate-duration', '0.7s');
      textEl.classList.add('animate__animated', 'animate__fadeOut');

      curtain.addEventListener('animationend', function onOut(e) {
        if (e.target !== curtain) return;
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.opacity = '';
        curtain.style.pointerEvents = 'none';
        textEl.classList.remove('animate__animated', 'animate__fadeOut');
        textEl.style.display = 'none';
        registerClickListeners(300);
      });
    }, 2000);
  });
}

function curtainFadeInAndOut(message="", duration=3, onComplete, onFadeOutStart) {
  var curtain = document.getElementById('id_fullscreen_curtain');
  var textEl  = document.getElementById('id_fullscreen_text');
  var gen = ++_curtainGen;

  removeClickListeners();
  curtain.style.pointerEvents = 'auto';
  curtain.style.display = 'block';
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.4s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');

  curtain.addEventListener('animationend', function onIn(e) {
    if (e.target !== curtain) return;
    curtain.removeEventListener('animationend', onIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');

    setBackground(areaName);

    if (message) {
      textEl.innerHTML = message;
      textEl.style.display = 'block';
      void textEl.offsetWidth;
      textEl.style.setProperty('--animate-duration', '0.5s');
      textEl.classList.add('animate__animated', 'animate__fadeIn');
    }

    setTimeout(function () {
      if (_curtainGen !== gen) return;
      if (onFadeOutStart) onFadeOutStart();
      if (message) {
        textEl.classList.remove('animate__animated', 'animate__fadeIn');
        void textEl.offsetWidth;
        textEl.style.setProperty('--animate-duration', '0.7s');
        textEl.classList.add('animate__animated', 'animate__fadeOut');
      }

      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.7s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');

      curtain.addEventListener('animationend', function onOut(e) {
        if (e.target !== curtain) return;
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
        if (message) {
          textEl.classList.remove('animate__animated', 'animate__fadeOut');
          textEl.style.display = 'none';
        }
        if (onComplete) onComplete(); else registerClickListeners(300);
      });
    }, duration * 1000);
  });
}

// Fades curtain in and holds solid black — does NOT auto fade out.
// Pair with curtainFadeOut() when ready to reveal the screen.
function curtainFadeIn(onBlack) {
  var curtain = document.getElementById('id_fullscreen_curtain');
  var gen = ++_curtainGen;
  removeClickListeners();
  curtain.style.pointerEvents = 'auto';
  curtain.style.display = 'block';
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.4s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');
  curtain.addEventListener('animationend', function onIn(e) {
    if (e.target !== curtain) return;
    curtain.removeEventListener('animationend', onIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');
    if (onBlack) onBlack();
  });
}

// Fades the currently-solid curtain back out. Assumes curtain is already visible.
function curtainFadeOut(onDone) {
  var curtain = document.getElementById('id_fullscreen_curtain');
  var gen = ++_curtainGen;
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.7s');
  curtain.classList.add('animate__animated', 'animate__fadeOut');
  curtain.addEventListener('animationend', function onOut(e) {
    if (e.target !== curtain) return;
    curtain.removeEventListener('animationend', onOut);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeOut');
    curtain.style.display = 'none';
    curtain.style.pointerEvents = 'none';
    if (onDone) onDone();
  });
}

// Rolls credits (cloned from #menu_credits_body) from bottom to top over black.
// Calls onDone once the last line scrolls off the top edge.
function playCredits(onDone) {
  var overlay = document.getElementById('credits_roll');
  var inner   = document.getElementById('credits_scroll_inner');
  if (!overlay || !inner) { if (onDone) onDone(); return; }

  var source = document.getElementById('menu_credits_body');
  inner.innerHTML = source ? source.innerHTML : '';

  // The "Thank you for playing!" h4 is hidden in the static Makers screen — show it here
  var h4s = inner.querySelectorAll('h4');
  for (var i = 0; i < h4s.length; i++) {
    if (h4s[i].style.display === 'none') h4s[i].style.display = '';
  }

  overlay.style.display = 'block';

  var viewH    = window.innerHeight || 852;
  var contentH = inner.offsetHeight;
  var speed    = 80; // px/s
  var startY   = viewH;
  var endY     = -(contentH + 80);
  var startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    var y = startY - (ts - startTime) / 1000 * speed;
    inner.style.transform = 'translateY(' + y + 'px)';
    if (y <= endY) {
      overlay.style.display = 'none';
      inner.innerHTML = '';
      if (onDone) onDone();
      return;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function showCompanionNameDialog(type, defaultName, onConfirm, onCancel) {
  function _openOverlay() {
    var overlay    = document.getElementById('companion_name_overlay');
    var titleEl    = document.getElementById('companion_name_title');
    var input      = document.getElementById('companion_name_input');
    var confirmBtn = document.getElementById('companion_name_confirm');
    var skipBtn    = document.getElementById('companion_name_skip');

    var titles = { pet: '🐾 Name your companion:', follower: '🤝 Name your follower:', rename: '✏️ Rename your character:' };
    titleEl.textContent = titles[type] || '✏️ Name them:';
    skipBtn.textContent = (type === 'rename') ? '✕ Cancel' : '✕ Skip';
    input.value = defaultName;
    overlay.style.display = 'flex';
    setTimeout(function() { input.focus(); input.select(); }, 50);

    function _done(name) {
      overlay.style.display = 'none';
      confirmBtn.onclick = null;
      skipBtn.onclick = null;
      onConfirm(name);
    }
    function _cancel() {
      overlay.style.display = 'none';
      confirmBtn.onclick = null;
      skipBtn.onclick = null;
      if (onCancel) onCancel(); else onConfirm(defaultName);
    }

    confirmBtn.onclick = function() { _done(input.value.trim() || defaultName); };
    skipBtn.onclick = _cancel;
  }

  if (type === 'pet' || type === 'follower') {
    var _fadeMsg = type === 'pet'
      ? "<p style=\"color:#FFD940;letter-spacing:1.8px;-webkit-text-stroke:6.5px black;paint-order:stroke fill;font-size:44px;line-height:20px;\">A companion joins!</p><p style=\"font-size:18px;color:#ddd;\">Pick their name carefully.</p>"
      : "<p style=\"color:#FFD940;letter-spacing:1.8px;-webkit-text-stroke:6.5px black;paint-order:stroke fill;font-size:44px;line-height:20px;\">They follow you.</p><p style=\"font-size:18px;color:#ddd;\">Pick their name carefully.</p>";
    curtainFadeInAndOut(_fadeMsg, 3, _openOverlay);
  } else {
    _openOverlay();
  }
}

// Permanent death: fade to black, save & return to menu, show message, hold, fade out.
function permanentDeath(htmlMsg) {
  try {
    if (typeof AchievementManager !== 'undefined' && AchievementManager.isUnlocked('boss_kill_first')) {
      var nextOrigins = Menu.rollOrigins();
      if (nextOrigins && nextOrigins.length > 0) {
        var _tierRank = { Legendary: 0, Familiar: 1, Rare: 2, Uncommon: 3, Common: 4, Cursed: 5 };
        var _hasStats = function(o) { return (o.atk||0)!==0||(o.hp||0)!==0||(o.sta||0)!==0||(o.lck||0)!==0||(o.int||0)!==0||(o.mgk||0)!==0||(o.def||0)!==0; };
        nextOrigins = nextOrigins.slice().sort(function(a, b) {
          var td = (_tierRank[a.tier] !== undefined ? _tierRank[a.tier] : 4)
                 - (_tierRank[b.tier] !== undefined ? _tierRank[b.tier] : 4);
          if (td !== 0) return td;
          return (_hasStats(b) ? 1 : 0) - (_hasStats(a) ? 1 : 0);
        });
        var cards = nextOrigins.map(function(o) {
          var color = RarityManager.getColor(o.tier || 'Common');
          return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;">'
            + '<span style="font-size:32px;">' + o.emoji + '</span>'
            + '<span style="font-size:14px;color:' + color + ';letter-spacing:0.5px;margin-top:-8px;white-space:nowrap;">' + o.originName + '</span>'
            + '</div>';
        }).join('');
        htmlMsg = 'New fates await you:'
          + '<div style="display:flex;justify-content:center;gap:20px;margin-top:8px;">' + cards + '</div>';
      }
    }
  } catch(e) {}

  var curtain = document.getElementById('id_fullscreen_curtain');
  var textEl  = document.getElementById('id_fullscreen_text');
  var gen = ++_curtainGen;

  removeClickListeners();
  curtain.style.pointerEvents = 'auto';
  curtain.style.display = 'block';
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.6s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');

  curtain.addEventListener('animationend', function onIn() {
    curtain.removeEventListener('animationend', onIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');

    SaveManager.clearSave();
    Menu.show();

    if (htmlMsg) {
      textEl.innerHTML = htmlMsg;
      textEl.style.display = 'block';
      void textEl.offsetWidth;
      textEl.style.setProperty('--animate-duration', '0.4s');
      textEl.classList.add('animate__animated', 'animate__fadeIn');
    }

    setTimeout(function () {
      if (_curtainGen !== gen) return;
      if (htmlMsg) {
        textEl.classList.remove('animate__animated', 'animate__fadeIn');
        void textEl.offsetWidth;
        textEl.style.setProperty('--animate-duration', '0.7s');
        textEl.classList.add('animate__animated', 'animate__fadeOut');
      }

      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.8s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');

      curtain.addEventListener('animationend', function onOut() {
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
        if (htmlMsg) {
          textEl.classList.remove('animate__animated', 'animate__fadeOut');
          textEl.style.display = 'none';
        }
      });
    }, 2500);
  });
}

// Quick black flash for menu screen transitions. Pass optional `text` (HTML string) to show
// a centred message during the curtain with a 700ms hold before fade-out.
function menuFade(callback, text) {
  var curtain = document.getElementById('id_fullscreen_curtain');
  var textEl  = text ? document.getElementById('id_fullscreen_text') : null;
  var gen = ++_curtainGen;

  curtain.style.pointerEvents = 'auto';
  curtain.style.display = 'block';
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.2s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');

  curtain.addEventListener('animationend', function onIn() {
    curtain.removeEventListener('animationend', onIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');

    if (textEl) {
      textEl.innerHTML = text;
      textEl.style.display = 'block';
    }

    callback();

    function _doFadeOut() {
      if (_curtainGen !== gen) return;
      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.3s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');

      curtain.addEventListener('animationend', function onOut() {
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
        if (textEl) {
          textEl.style.display = 'none';
          textEl.innerHTML = '';
        }
      });
    }

    if (text) {
      setTimeout(_doFadeOut, 700);
    } else {
      _doFadeOut();
    }
  });
}

var _persistentEnemyEffect = null;

function displayEnemyEffect(message){
  var el = document.getElementById('id_enemy_overlay');
  if (!el) return;
  el.style.opacity = '';
  displayEffect(message, el);
  if (_persistentEnemyEffect) {
    var snapshot = _persistentEnemyEffect;
    var gen = _animateUIElementGen.get(el);
    el.addEventListener('animationend', function onRestore() {
      el.removeEventListener('animationend', onRestore);
      if (_animateUIElementGen.get(el) !== gen) return;
      if (_persistentEnemyEffect === snapshot) setPersistentEnemyEffect(snapshot.icon, snapshot.pulse);
    });
  }
}

function setPersistentEnemyEffect(icon, pulse = false) {
  var el = document.getElementById('id_enemy_overlay');
  if (!el) return;
  _persistentEnemyEffect = { icon: icon, pulse: pulse };
  var gen = (_animateUIElementGen.get(el) || 0) + 1;
  _animateUIElementGen.set(el, gen);
  el.classList.remove('animate__animated', 'animate__fadeOut', 'animate__pulse', 'animate__infinite');
  el.innerHTML = icon;
  el.style.opacity = '0.8';
  el.style.display = 'flex';
  if (pulse) {
    el.style.setProperty('--animate-duration', '2s');
    el.classList.add('animate__animated', 'animate__infinite', 'animate__pulse');
  }
}

function clearPersistentEnemyEffect() {
  var el = document.getElementById('id_enemy_overlay');
  if (!el) return;
  _persistentEnemyEffect = null;
  var gen = (_animateUIElementGen.get(el) || 0) + 1;
  _animateUIElementGen.set(el, gen);
  el.classList.remove('animate__animated', 'animate__fadeOut', 'animate__pulse', 'animate__infinite');
  el.innerHTML = '';
  el.style.opacity = '';
  el.style.display = 'none';
}

function stopEnemyEmojiPulse() {
  if (!emojiUIElement) return;
  var gen = (_animateUIElementGen.get(emojiUIElement) || 0) + 1;
  _animateUIElementGen.set(emojiUIElement, gen);
  emojiUIElement.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
}

function startEnemyEmojiPulse() {
  if (!emojiUIElement) return;
  animateUIElement(emojiUIElement, 'animate__pulse', '2', false, '', true);
}

function displayPlayerEffect(message){
  displayEffect(message,document.getElementById('id_player_overlay'));
}

function displayPlayerCannotEffect(){
  animateUIElement(playerInfoUIElement,"animate__headShake","0.7"); //Animate Player not enough stamina
}

function displayEnemyCannotEffect(){
  animateUIElement(emojiWrapperUIElement,"animate__headShake","0.7"); //Animate enemy not enough stamina
}

function displayEnemyDodgeEffect(){
  animateUIElement(emojiWrapperUIElement,"animate__shakeX","0.7");
}

function displayEnemyAttackEffect(){
  animateUIElement(emojiWrapperUIElement,"animate__bounce","0.7");
}

function displayEnemyRestEffect(){
  animateUIElement(emojiWrapperUIElement,"animate__pulse","0.7");
}

function displayPlayerGainedEffect(){
  animateUIElement(playerInfoUIElement,"animate__tada","1"); //Animate player gain
}

function displayPlayerRestedEffect(){
  animateUIElement(playerInfoUIElement,"animate__pulse","0.5"); //Animate player gain
}

function displayEffect(message,documentElement,time=3){
  animateUIElement(documentElement,"animate__fadeOut",time,true,message)
}

  //Wow, this is nice - https://animate.style
var _animateUIElementGen = new WeakMap();
var _animateUIElementClass = new WeakMap();
function animateUIElement(documentElement,animation,time="0s",hidden = false,message="",animateInfinite=false){
  if (typeof time != "string") time = String(time);

  var gen = (_animateUIElementGen.get(documentElement) || 0) + 1;
  _animateUIElementGen.set(documentElement, gen);

  // Remove previous animation class to prevent orphaned classes holding fill-mode end state
  var prevClass = _animateUIElementClass.get(documentElement);
  if (prevClass && prevClass !== animation) documentElement.classList.remove(prevClass);
  _animateUIElementClass.set(documentElement, animation);

  if (hidden){
    documentElement.innerHTML = message;
    documentElement.style.display = "block";
  }
  documentElement.classList.remove("animate__animated", animation);
  void documentElement.offsetWidth; // trigger a DOM reflow

  if (animateInfinite) {
    documentElement.classList.add("animate__infinite");
  } else {
    documentElement.classList.remove("animate__infinite");
  }
  documentElement.style.setProperty("--animate-duration","0.0001s");
  documentElement.classList.add("animate__animated",animation);
  if (time !="0s"){
    documentElement.style.setProperty("--animate-duration",time+"s");
  }
  documentElement.addEventListener('animationend', function onEnd(e) {
    if (e.target !== documentElement) return; // ignore bubbled animationend from children
    documentElement.removeEventListener('animationend', onEnd);
    if (_animateUIElementGen.get(documentElement) !== gen) return; // stale — newer animation took over
    if (hidden) documentElement.style.display = "none";
    documentElement.classList.remove("animate__animated", animation);
  });
}

function applyGatewayEffects() {
  if (!document.getElementById('id_gateway_fog_style')) {
    var style = document.createElement('style');
    style.id = 'id_gateway_fog_style';
    style.textContent = '@keyframes fogPulse{0%,100%{opacity:0.55}50%{opacity:1}}';
    document.head.appendChild(style);
  }
  document.body.style.transition = 'filter 3s ease';
  document.body.style.filter = 'grayscale(65%) brightness(0.82)';
  if (!document.getElementById('id_fog_overlay')) {
    var fog = document.createElement('div');
    fog.id = 'id_fog_overlay';
    fog.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:4;background:radial-gradient(ellipse at 50% 110%,rgba(210,210,230,0.18) 0%,transparent 65%);animation:fogPulse 5s ease-in-out infinite;';
    document.body.appendChild(fog);
  }
}

function removeGatewayEffects() {
  document.body.style.transition = 'filter 1.5s ease';
  document.body.style.filter = '';
  var fog = document.getElementById('id_fog_overlay');
  if (fog) fog.remove();
}

function playEndingCutscene(frames, onComplete) {
  if (!frames || frames.length === 0) { if (onComplete) onComplete(); return; }
  var curtain = document.getElementById('id_fullscreen_curtain');
  var textEl  = document.getElementById('id_fullscreen_text');
  var gen = ++_curtainGen;

  removeClickListeners();
  curtain.style.pointerEvents = 'auto';
  curtain.style.display = 'block';
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.5s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');

  curtain.addEventListener('animationend', function onCurtainIn() {
    curtain.removeEventListener('animationend', onCurtainIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');
    removeGatewayEffects();
    showFrame(0);
  });

  function showFrame(idx) {
    if (_curtainGen !== gen) return;
    if (idx >= frames.length) {
      textEl.style.display = 'none'; // hide last frame before curtain fades out
      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.8s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');
      curtain.addEventListener('animationend', function onOut() {
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
        if (onComplete) onComplete();
      });
      return;
    }
    var frame = frames[idx];
    textEl.innerHTML = '<p style=";letter-spacing:1.8px;-webkit-text-stroke:6.5px black;paint-order:stroke fill;line-height:1.2;margin:0 0 8px;"><i>' + frame.text + "<br>" + (frame.text2 || "" )+ '</i></p>'
                     + '<div style="font-size:54px;line-height:1;">' + frame.emoji + '</div>';
    textEl.style.display = 'block';
    void textEl.offsetWidth;
    textEl.style.setProperty('--animate-duration', '0.6s');
    textEl.classList.add('animate__animated', 'animate__fadeIn');

    setTimeout(function() {
      if (_curtainGen !== gen) return;
      textEl.classList.remove('animate__animated', 'animate__fadeIn');
      void textEl.offsetWidth;
      textEl.style.setProperty('--animate-duration', '0.55s');
      textEl.classList.add('animate__animated', 'animate__fadeOut');
      textEl.addEventListener('animationend', function onTextOut() {
        textEl.removeEventListener('animationend', onTextOut);
        if (_curtainGen !== gen) return;
        textEl.classList.remove('animate__animated', 'animate__fadeOut');
        showFrame(idx + 1);
      });
    }, 4000);
  }
}

function _bgUrl(areaName) {
  var prefix = areaName.split(" ")[0].replace(".svg", "").replace(".png", "");
  var isVector = (typeof VECTOR_BACKGROUNDS_ENABLED !== 'undefined') ? VECTOR_BACKGROUNDS_ENABLED : false;
  var ext = isVector ? '.svg' : '.png';
  var folder = isVector ? 'assets/svg/' : 'assets/img/';
  return { src: folder + prefix + ext, isVector: isVector };
}

function preloadBackground(areaName) {
  var info = _bgUrl(areaName);
  var img = new Image();
  img.src = info.src;
}

function setBackground(areaName="Depths"){
  var info = _bgUrl(areaName);

  var bodyEl = document.getElementsByTagName('body')[0];
  if (bodyEl) {
    bodyEl.style.backgroundImage = 'url(' + info.src + ')';
    if (info.isVector) {
      bodyEl.style.backgroundRepeat = 'no-repeat';
      bodyEl.style.backgroundSize = 'cover';
      bodyEl.style.backgroundPosition = 'center bottom';
      bodyEl.style.backgroundAttachment = 'fixed';
    } else {
      bodyEl.style.backgroundRepeat = 'repeat';
      bodyEl.style.backgroundSize = '';
      bodyEl.style.backgroundPosition = '';
      bodyEl.style.backgroundAttachment = '';
    }
  }
}

//Mobile specific - vibrate
function vibrateButtonPress(){
  if (typeof vibrationEnabled !== 'undefined' && !vibrationEnabled) return;
  if (!("vibrate" in window.navigator)){
    dbg("WARNING: Vibrate not supported!");
    return;
  }
  window.navigator.vibrate([5,20,10]);
}

async function actionVibrateFeedback(buttonID){
  vibrateButtonPress();
  await new Promise(resolve => setTimeout(resolve, 100)); // muhehe
}

function vibrateTick(){
  if (typeof vibrationEnabled !== 'undefined' && !vibrationEnabled) return;
  if (!("vibrate" in window.navigator)) return;
  window.navigator.vibrate(8);
}

//Technical

function hasAnyOf(array=[],item){
  return array.includes(item);
}

function chooseFrom(array=[]){
  var options = array.length
  var choice = array[Math.floor(Math.random() * options)];
  return choice;
}

function randomNumber(min=0,max=1){
  return min+Math.floor(Math.random() * max);
}

function romanNumber (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}
