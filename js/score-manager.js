var ScoreManager = (function () {
  var FORM_URL     = 'https://docs.google.com/forms/d/e/1FAIpQLScqmG98EkuIREvZIXq7PYC6-z2HrPU4UKB07ifoIxEVPfefsg/formResponse';
  var HMAC_SALT    = '@Pd`6aI3>Cb};XCco_Ol.~3._b*+iE?c}HMlJx>cQ>~Tv4h#bE#yif,dK<KlMq5C';

  var ENDING_LABELS = {
    win_kill:    '🗡 Slain',
    win_walk:    '💔 Walked Away',
    win_guard:   '🗿 Eternal Guard',
    win_embrace: '🫂 Embraced',
    win_sleep:   '💤 Lay Together',
    win_speak:   '💖 Remembered',
    win_free:    '🪽 Freed',
    win_pray:    '🙏 Mercy',
    win_curse:   '👹 Cursed',
    win:         '👑 Finished',
    death:       '💀 Died',
    rival_death: '💔 Invader Kill'
  };

  function getEndingLabel(endType) {
    return ENDING_LABELS[endType] || (endType && endType.startsWith('win_') ? '👑 ' + endType.slice(4) : '💀 Died');
  }
  var NICKNAME_KEY = 'playerNickname';
  var RANKINGS_URL = 'https://raw.githubusercontent.com/IGPenguin/stay-dead/rankings/highscores.json';

  var ENTRY = {
    userId:         'entry.1612912835',
    sessionId:      'entry.1993758260',
    score:          'entry.1465451014',
    nickname:       'entry.1372787820',
    charName:       'entry.1616306744',
    origin:         'entry.1542875165',
    level:          'entry.590114713',
    encounterCount: 'entry.839368',
    companions:     'entry.33188034',
    stats:          'entry.1588854288',
    karma:          'entry.583263093',
    difficulty:     'entry.1242759362',
    gameVersion:    'entry.1921806822',
    playtime:       'entry.25828477',
    endType:        'entry.1003026246',
    datetime:       'entry.384732007',
    inventory:      'entry.1287444781',
    coins:          'entry.232215063',
    ghostLink:      'entry.180473238',
    hash:           'entry.1370835727'
  };

  var _pendingPayload = null;

  function calculate() {
    if (!encounterCount) return 0;
    var stats = (playerHpMax || 0) + (playerAtk || 0) + (playerStaMax || 0)
              + (playerLck || 0) + (playerInt || 0) + (playerMgkMax || 0) + (playerDef || 0);
    var companions = [...String(playerPartyString || '')].length;
    return (
      (Math.max(0, (playerLevel || 1) - 1) * 15)
      + Math.floor((encounterCount || 0) / 5)
      + (companions * 8)
      + Math.floor(Math.max(0, stats - scoreBaselineStats) / 2)
      + Math.max(0, (playerKarma || 1) - 1)
    );
  }

  function buildPayload(endType) {
    var _mult = 1.0;
    if (typeof GAME_CONFIG !== 'undefined') {
      if (GAME_CONFIG.label === 'Easy')     _mult = 0.7;
      else if (GAME_CONFIG.label === 'Hardcore') _mult = 1.5;
    }
    var score = Math.round((calculate() + (endType === 'win' || (typeof endType === 'string' && endType.startsWith('win_')) ? 100 : 0)) * _mult);
    var companions = [...String(playerPartyString || '')].length;
    var playtime = Math.floor((Date.now() - (runStartTimestamp || Date.now())) / 1000);
    var statsStr = [playerHpMax, playerAtk, playerStaMax, playerLck, playerInt, playerMgkMax, playerDef].join(';');
    return {
      score:          score,
      nickname:       getNickname() || String(playerName || '?'),
      charName:       String(playerName || '?'),
      origin:         String(playerOriginName || ''),
      level:          playerLevel || 1,
      encounterCount: encounterCount || 0,
      companions:     companions,
      stats:          statsStr,
      karma:          playerKarma || 1,
      difficulty:     (typeof GAME_CONFIG !== 'undefined' ? (GAME_CONFIG.displayName || GAME_CONFIG.label) : '💔 Rough'),
      gameVersion:    (typeof versionCode !== 'undefined' ? versionCode : '?'),
      playtime:       playtime,
      endType:        endType,
      datetime:       new Date().toISOString(),
      inventory:      String(playerLootString || ''),
      coins:          savedCoins || 0,
      deathMessage:   typeof enemyMsg !== 'undefined' ? String(enemyMsg || '') : ''
    };
  }

  function _rotr32(x, n) { return (x >>> n) | (x << (32 - n)); }

  function _sha256(buf) {
    var K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var len = buf.length, bitLen = len * 8;
    var padLen = (len % 64 < 56) ? 56 - (len % 64) : 120 - (len % 64);
    var padded = new Uint8Array(len + padLen + 8);
    padded.set(buf); padded[len] = 0x80;
    var pdv = new DataView(padded.buffer);
    pdv.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000), false);
    pdv.setUint32(padded.length - 4, bitLen >>> 0, false);
    var w = new Uint32Array(64);
    for (var bi = 0; bi < padded.length; bi += 64) {
      var dv = new DataView(padded.buffer, bi, 64);
      for (var j = 0; j < 16; j++) w[j] = dv.getUint32(j * 4, false);
      for (j = 16; j < 64; j++) {
        var s0 = _rotr32(w[j-15],7)  ^ _rotr32(w[j-15],18) ^ (w[j-15] >>> 3);
        var s1 = _rotr32(w[j-2], 17) ^ _rotr32(w[j-2], 19) ^ (w[j-2]  >>> 10);
        w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0;
      }
      var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for (j = 0; j < 64; j++) {
        var S1  = _rotr32(e,6)  ^ _rotr32(e,11) ^ _rotr32(e,25);
        var ch  = (e & f) ^ (~e & g);
        var t1  = (h + S1 + ch + K[j] + w[j]) >>> 0;
        var S0  = _rotr32(a,2)  ^ _rotr32(a,13) ^ _rotr32(a,22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2  = (S0 + maj) >>> 0;
        h=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
      }
      H[0]=(H[0]+a)>>>0; H[1]=(H[1]+b)>>>0; H[2]=(H[2]+c)>>>0; H[3]=(H[3]+d)>>>0;
      H[4]=(H[4]+e)>>>0; H[5]=(H[5]+f)>>>0; H[6]=(H[6]+g)>>>0; H[7]=(H[7]+h)>>>0;
    }
    var out = new Uint8Array(32), ov = new DataView(out.buffer);
    for (var i = 0; i < 8; i++) ov.setUint32(i * 4, H[i], false);
    return out;
  }

  function _hmacSha256Fallback(keyStr, msgStr) {
    var enc = new TextEncoder();
    var key = enc.encode(keyStr), msg = enc.encode(msgStr);
    if (key.length > 64) key = _sha256(key);
    var ipad = new Uint8Array(64), opad = new Uint8Array(64);
    ipad.set(key); opad.set(key);
    for (var i = 0; i < 64; i++) { ipad[i] ^= 0x36; opad[i] ^= 0x5c; }
    var inner = new Uint8Array(64 + msg.length);
    inner.set(ipad); inner.set(msg, 64);
    var outer = new Uint8Array(96);
    outer.set(opad); outer.set(_sha256(inner), 64);
    return Array.from(_sha256(outer)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  async function _generateHash(payload) {
    var msg = payload.charName + '|' + payload.score + '|' + payload.datetime;
    var enc = new TextEncoder();
    try {
      var key = await crypto.subtle.importKey(
        'raw', enc.encode(HMAC_SALT),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      );
      var sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
      return Array.from(new Uint8Array(sig)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    } catch (e) { return _hmacSha256Fallback(HMAC_SALT, msg); }
  }

  function encodeGhostLink(payload) {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))); }
    catch (e) { return ''; }
  }

  function decodeGhostLink(b64) {
    try { return JSON.parse(decodeURIComponent(escape(atob(b64)))); }
    catch (e) { return null; }
  }

  function getNickname() {
    try { return localStorage.getItem(NICKNAME_KEY) || null; } catch (e) { return null; }
  }

  function setNickname(s) {
    try { localStorage.setItem(NICKNAME_KEY, s); } catch (e) {}
  }

  async function _doSubmit(payload) {
    if (!isAuthorizedHost()) return;
    var hash = await _generateHash(payload);
    var ghost = encodeGhostLink(payload);

    var uid = (typeof userId !== 'undefined') ? userId : 'anonymous';
    var sid = (typeof sessionId !== 'undefined') ? sessionId : 'none';

    // Google Forms requires application/x-www-form-urlencoded — URLSearchParams sends that format.
    var params = new URLSearchParams();
    params.append(ENTRY.userId,          uid);
    params.append(ENTRY.sessionId,       sid);
    params.append(ENTRY.score,          payload.score);
    params.append(ENTRY.nickname,       payload.nickname);
    params.append(ENTRY.charName,       payload.charName);
    params.append(ENTRY.origin,         payload.origin);
    params.append(ENTRY.level,          payload.level);
    params.append(ENTRY.encounterCount, payload.encounterCount);
    params.append(ENTRY.companions,     payload.companions);
    params.append(ENTRY.stats,          payload.stats);
    params.append(ENTRY.karma,          payload.karma);
    params.append(ENTRY.difficulty,     payload.difficulty);
    params.append(ENTRY.gameVersion,    payload.gameVersion);
    params.append(ENTRY.playtime,       payload.playtime);
    params.append(ENTRY.endType,        payload.endType);
    params.append(ENTRY.datetime,       payload.datetime);
    params.append(ENTRY.inventory,      payload.inventory);
    params.append(ENTRY.coins,          payload.coins);
    params.append(ENTRY.ghostLink,      ghost);
    params.append(ENTRY.hash,           hash);

    var success = false;
    try {
      // Primary: fetch with no-cors (most reliable for active session)
      fetch(FORM_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: params,
        keepalive: true 
      });
      success = true;
    } catch (e) {
      // Fallback: sendBeacon
      if (navigator.sendBeacon) {
        success = navigator.sendBeacon(FORM_URL, params);
      }
    }

    if (success) {
      showAchievementToast({ emoji: '⭐', desc: 'Rankings score submitted: ' + payload.score + ' pts' }, Date.now(), null);
      logAction("⭐ ▸ 🚀 Rankings score submitted: " + payload.score + ' pts')
    }
  }

  function submitOrPrompt(payload) {
    if (cheatedThisRun) return;
    if (isLocalhost() && RANKINGS_DISABLED_LOCALHOST) return;
    if (getNickname()) {
      payload.nickname = getNickname();
      _doSubmit(payload);
    } else {
      _pendingPayload = payload;
      var scoreEl = document.getElementById('nickname_score_display');
      if (scoreEl) scoreEl.textContent = '⭐ ' + payload.score + ' pts';
      var el = document.getElementById('nickname_overlay');
      if (el) el.style.display = 'flex';
    }
  }

  function fetchRankings(callback) {
    fetch(RANKINGS_URL + '?_=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (data) { callback(null, data); })
      .catch(function (e) { callback(e, null); });
  }

  function init() {
    var confirmBtn = document.getElementById('nickname_confirm');
    var skipBtn    = document.getElementById('nickname_skip');
    var input      = document.getElementById('nickname_input');
    var errEl      = document.getElementById('nickname_error');
    var overlay    = document.getElementById('nickname_overlay');
    if (!confirmBtn) return;

    confirmBtn.addEventListener('click', function () {
      var val = (input.value || '').trim();
      if (val.length < 3) {
        if (errEl) errEl.style.display = '';
        return;
      }
      if (errEl) errEl.style.display = 'none';
      setNickname(val);
      if (_pendingPayload) {
        _pendingPayload.nickname = val;
        _doSubmit(_pendingPayload);
        _pendingPayload = null;
      }
      if (overlay) overlay.style.display = 'none';
    });

    skipBtn.addEventListener('click', function () {
      _pendingPayload = null;
      if (overlay) overlay.style.display = 'none';
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') confirmBtn.click();
    });
  }

  return {
    calculate:       calculate,
    buildPayload:    buildPayload,
    submitOrPrompt:  submitOrPrompt,
    encodeGhostLink: encodeGhostLink,
    decodeGhostLink: decodeGhostLink,
    getNickname:     getNickname,
    setNickname:     setNickname,
    fetchRankings:   fetchRankings,
    getEndingLabel:  getEndingLabel,
    init:            init
  };
})();
