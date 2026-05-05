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
      }, 1800);
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

// Fades the curtain in, runs callback() while fully black (load encounter /
// redraw), shows area name text, holds briefly, then fades both out.
function transitionArea(html, callback) {
  var curtain = document.getElementById('id_fullscreen_curtain');
  var textEl  = document.getElementById('id_fullscreen_text');
  var gen = ++_curtainGen;

  curtain.style.pointerEvents = 'auto';
  curtain.style.display = 'block';
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.4s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');

  curtain.addEventListener('animationend', function onIn() {
    curtain.removeEventListener('animationend', onIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');

    // Load encounter + redraw while curtain is fully opaque
    callback();

    // Fade in area name text on top of black curtain
    textEl.innerHTML = html;
    textEl.style.display = 'block';
    void textEl.offsetWidth;
    textEl.style.setProperty('--animate-duration', '0.7s');
    textEl.classList.add('animate__animated', 'animate__fadeIn');

    // Hold, then fade both out together
    setTimeout(function () {
      if (_curtainGen !== gen) return;
      textEl.classList.remove('animate__animated', 'animate__fadeIn');
      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.65s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');
      void textEl.offsetWidth;
      textEl.style.setProperty('--animate-duration', '0.65s');
      textEl.classList.add('animate__animated', 'animate__fadeOut');

      curtain.addEventListener('animationend', function onOut() {
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
        textEl.classList.remove('animate__animated', 'animate__fadeOut');
        textEl.style.display = 'none';
        registerClickListeners(300);
      });
    }, 900);
  });
}

function curtainFadeInAndOut(message="", duration=3) {
  var curtain = document.getElementById('id_fullscreen_curtain');
  var textEl  = document.getElementById('id_fullscreen_text');
  var gen = ++_curtainGen;

  removeClickListeners();
  curtain.style.pointerEvents = 'auto';
  curtain.style.display = 'block';
  void curtain.offsetWidth;
  curtain.style.setProperty('--animate-duration', '0.4s');
  curtain.classList.add('animate__animated', 'animate__fadeIn');

  curtain.addEventListener('animationend', function onIn() {
    curtain.removeEventListener('animationend', onIn);
    if (_curtainGen !== gen) return;
    curtain.classList.remove('animate__animated', 'animate__fadeIn');

    setBackground(areaName);

    if (message) {
      textEl.innerHTML = message;
      textEl.style.display = 'block';
      void textEl.offsetWidth;
      textEl.style.setProperty('--animate-duration', '0.3s');
      textEl.classList.add('animate__animated', 'animate__fadeIn');
    }

    setTimeout(function () {
      if (_curtainGen !== gen) return;
      if (message) {
        textEl.classList.remove('animate__animated', 'animate__fadeIn');
        void textEl.offsetWidth;
        textEl.style.setProperty('--animate-duration', '0.65s');
        textEl.classList.add('animate__animated', 'animate__fadeOut');
      }

      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.7s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');

      curtain.addEventListener('animationend', function onOut() {
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
        if (message) {
          textEl.classList.remove('animate__animated', 'animate__fadeOut');
          textEl.style.display = 'none';
        }
        registerClickListeners(300);
      });
    }, duration * 500);
  });
}

// Permanent death: fade to black, save & return to menu, show message, hold, fade out.
function permanentDeath(htmlMsg) {
  try {
    if (typeof AchievementManager !== 'undefined' && AchievementManager.isUnlocked('boss_kill_first')) {
      var nextOrigins = Menu.rollOrigins();
      if (nextOrigins && nextOrigins.length > 0) {
        var emojiStr = nextOrigins.map(function(o) { return o.emoji; }).join('&nbsp;&nbsp;');
        htmlMsg = 'New fates await:'
          + '<p style="font-size:26px;letter-spacing:4px;margin-top:2px;">' + emojiStr + '</p>';
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

// Quick black flash for menu screen transitions (no text, no game click listeners).
function menuFade(callback) {
  var curtain = document.getElementById('id_fullscreen_curtain');
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

    callback();

    void curtain.offsetWidth;
    curtain.style.setProperty('--animate-duration', '0.3s');
    curtain.classList.add('animate__animated', 'animate__fadeOut');

    curtain.addEventListener('animationend', function onOut() {
      curtain.removeEventListener('animationend', onOut);
      if (_curtainGen !== gen) return;
      curtain.classList.remove('animate__animated', 'animate__fadeOut');
      curtain.style.display = 'none';
      curtain.style.pointerEvents = 'none';
    });
  });
}

function displayEnemyEffect(message){
  var el = document.getElementById('id_enemy_overlay');
  el.style.opacity = '';
  displayEffect(message, el);
}

function setPersistentEnemyEffect(icon) {
  var el = document.getElementById('id_enemy_overlay');
  var gen = (_animateUIElementGen.get(el) || 0) + 1;
  _animateUIElementGen.set(el, gen);
  el.classList.remove('animate__animated', 'animate__fadeOut', 'animate__infinite');
  el.innerHTML = icon;
  el.style.opacity = '0.7';
  el.style.display = 'block';
}

function clearPersistentEnemyEffect() {
  var el = document.getElementById('id_enemy_overlay');
  var gen = (_animateUIElementGen.get(el) || 0) + 1;
  _animateUIElementGen.set(el, gen);
  el.classList.remove('animate__animated', 'animate__fadeOut', 'animate__infinite');
  el.innerHTML = '';
  el.style.opacity = '';
  el.style.display = 'none';
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
function animateUIElement(documentElement,animation,time="0s",hidden = false,message="",animateInfinite=false){
  if (typeof time != "string") time = String(time);

  var gen = (_animateUIElementGen.get(documentElement) || 0) + 1;
  _animateUIElementGen.set(documentElement, gen);

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
  documentElement.addEventListener('animationend', function onEnd() {
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
      void curtain.offsetWidth;
      curtain.style.setProperty('--animate-duration', '0.8s');
      curtain.classList.add('animate__animated', 'animate__fadeOut');
      curtain.addEventListener('animationend', function onOut() {
        curtain.removeEventListener('animationend', onOut);
        if (_curtainGen !== gen) return;
        curtain.classList.remove('animate__animated', 'animate__fadeOut');
        curtain.style.display = 'none';
        curtain.style.pointerEvents = 'none';
        textEl.style.display = 'none';
        if (onComplete) onComplete();
      });
      return;
    }
    var frame = frames[idx];
    textEl.innerHTML = '<div style="font-size:60px;margin-bottom:12px;line-height:1;">' + frame.emoji + '</div>'
                     + '<div style="font-size:15px;letter-spacing:1.2px;color:#ccc;max-width:270px;margin:0 auto;line-height:1.5;">' + frame.text + '</div>';
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
    }, 2800);
  }
}

function setBackground(fileName="Depths.png"){
  var fileUrl='url(https://raw.githubusercontent.com/IGPenguin/stay-dead/refs/heads/live/assets/img/file.png)';
  fileUrl=fileUrl.replaceAll("file.png",fileName.split(" ")[0]+".png");
  var bodyUIElement = document.getElementsByTagName('body')[0];

  bodyUIElement.style.backgroundImage = fileUrl;
}

(function preloadBackgrounds(){
  var names = ['Auxiliary','Depths','Eternal','Fading','Forsaken','Freezing','Mournful','River','Shrouded','Twisted'];
  var base = 'https://raw.githubusercontent.com/IGPenguin/stay-dead/refs/heads/live/assets/img/';
  names.forEach(function(n){ new Image().src = base + n + '.png'; });
})();

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
