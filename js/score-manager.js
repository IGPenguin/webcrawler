var ScoreManager = (function () {
  var FORM_URL     = 'https://docs.google.com/forms/d/e/1FAIpQLScqmG98EkuIREvZIXq7PYC6-z2HrPU4UKB07ifoIxEVPfefsg/formResponse';
  var HMAC_SALT    = '@Pd`6aI3>Cb};XCco_Ol.~3._b*+iE?c}HMlJx>cQ>~Tv4h#bE#yif,dK<KlMq5C';
  var NICKNAME_KEY = 'playerNickname';
  var RANKINGS_URL = 'https://raw.githubusercontent.com/IGPenguin/stay-dead/rankings/highscores.json';

  var ENTRY = {
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
    var stats = (playerHpMax || 0) + (playerAtk || 0) + (playerStaMax || 0)
              + (playerLck || 0) + (playerInt || 0) + (playerMgkMax || 0) + (playerDef || 0);
    var companions = [...String(playerPartyString || '')].length;
    return (
      ((playerLevel || 1) * 15)
      + Math.floor((encounterCount || 0) / 5)
      + (companions * 8)
      + Math.floor(stats / 2)
      + Math.round(((playerKarma || 1) - 1) * 5)
    );
  }

  function buildPayload(endType) {
    var score = calculate() + (endType === 'win' ? 100 : 0);
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
      difficulty:     (typeof GAME_CONFIG !== 'undefined' ? GAME_CONFIG.label : 'Standard'),
      gameVersion:    (typeof versionCode !== 'undefined' ? versionCode : '?'),
      playtime:       playtime,
      endType:        endType,
      datetime:       new Date().toISOString(),
      inventory:      String(playerLootString || ''),
      coins:          savedCoins || 0
    };
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
    } catch (e) { return 'err'; }
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
    var hash = await _generateHash(payload);
    var ghost = encodeGhostLink(payload);
    // Google Forms requires application/x-www-form-urlencoded — URLSearchParams sends that format.
    // FormData sends multipart/form-data which the formResponse endpoint silently rejects.
    var params = new URLSearchParams();
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
    fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: params }).catch(function () {});
  }

  function submitOrPrompt(payload) {
    if (cheatedThisRun) return;
    if (getNickname()) {
      payload.nickname = getNickname();
      _doSubmit(payload);
    } else {
      _pendingPayload = payload;
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
    init:            init
  };
})();
