var TelemetryManager = (function () {
  var FORM_URL     = 'https://docs.google.com/forms/d/e/1FAIpQLSdIEKIq1Dz5X-jPDFKdE5MhCwEtFdI_X0_KgaXETSO5VAYLOA/formResponse';
  var NICKNAME_KEY = 'playerNickname';

  var ENTRY = {
    userId:         'entry.532633489',
    sessionId:      'entry.2096381360',
    event:          'entry.779158674',
    payload:        'entry.1070192513',
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
    datetime:       'entry.384732007',
    inventory:      'entry.1287444781',
    coins:          'entry.232215063',
    browserInfo:    'entry.180473238'
  };

  var _pendingLootSource = null;

  function _getNickname() {
    try { return localStorage.getItem(NICKNAME_KEY) || ''; } catch (e) { return ''; }
  }

  function _getBrowserInfo() {
    var ua       = navigator.userAgent || '';
    var platform = navigator.platform  || '';
    var touch    = navigator.maxTouchPoints > 0 ? 'touch' : 'mouse';
    var res      = screen.width + 'x' + screen.height;
    var dpr      = (+(window.devicePixelRatio || 1).toFixed(1)) + 'x';

    var os = 'Unknown';
    if      (/iPhone/.test(ua))             os = 'iOS-iPhone';
    else if (/iPad/.test(ua))               os = 'iOS-iPad';
    else if (/Android/.test(ua))            os = 'Android';
    else if (/CrOS/.test(ua))              os = 'ChromeOS';
    else if (/Win/.test(platform))          os = 'Windows';
    else if (/Mac/.test(platform))          os = 'macOS';
    else if (/Linux/.test(platform))        os = 'Linux';

    var browser = 'Unknown';
    var _ver = function (rx) { var m = ua.match(rx); return m ? ' ' + m[1] : ''; };
    if      (/Firefox\//.test(ua))                              browser = 'Firefox'  + _ver(/Firefox\/(\d+)/);
    else if (/Edg\//.test(ua))                                  browser = 'Edge'     + _ver(/Edg\/(\d+)/);
    else if (/OPR\//.test(ua))                                  browser = 'Opera'    + _ver(/OPR\/(\d+)/);
    else if (/Chrome\//.test(ua) && !/Chromium\//.test(ua))    browser = 'Chrome'   + _ver(/Chrome\/(\d+)/);
    else if (/Chromium\//.test(ua))                             browser = 'Chromium' + _ver(/Chromium\/(\d+)/);
    else if (/Safari\//.test(ua) && !/Chrome\//.test(ua))      browser = 'Safari';

    return [os, browser, res, dpr, touch].join('|');
  }

  function _buildContext() {
    var stats      = [playerHpMax || 0, playerAtk || 0, playerStaMax || 0,
                      playerLck   || 0, playerInt  || 0, playerMgkMax || 0, playerDef || 0].join(';');
    var companions = [...String(playerPartyString || '')].length;
    var playtime   = Math.floor((Date.now() - (runStartTimestamp || Date.now())) / 1000);
    var score      = (typeof ScoreManager !== 'undefined') ? ScoreManager.calculate() : 0;
    var difficulty = (typeof GAME_CONFIG !== 'undefined')
                     ? (GAME_CONFIG.displayName || GAME_CONFIG.label) : '?';

    return {
      score:          score,
      charName:       String(playerName        || '?'),
      origin:         String(playerOriginName  || ''),
      level:          playerLevel              || 1,
      encounterCount: encounterCount           || 0,
      companions:     companions,
      stats:          stats,
      karma:          playerKarma              || 1,
      difficulty:     difficulty,
      gameVersion:    (typeof versionCode !== 'undefined') ? versionCode : '?',
      playtime:       playtime,
      datetime:       new Date().toISOString(),
      inventory:      String(playerLootString   || ''),
      coins:          savedCoins               || 0
    };
  }

  function send(event, payload) {
    if (!isAuthorizedHost()) return;
    if (isLocalhost() && TELEMETRY_DISABLED_LOCALHOST) return;
    if (navigator.webdriver) return; // automated browser (Playwright / CI)
    try { if (localStorage.getItem('sd_is_test') === 'true') return; } catch (e) {}
    
    // Always allow start/visit/cheat events; otherwise block if cheated
    var criticalEvents = ['run_start', 'game_visit', 'cheat_used'];
    if (cheatedThisRun && criticalEvents.indexOf(event) === -1) return;

    var ctx    = _buildContext();
    var params = new URLSearchParams();
    
    // Safety check for identity globals
    var uid = (typeof userId !== 'undefined') ? userId : 'anonymous';
    var sid = (typeof sessionId !== 'undefined') ? sessionId : 'none';

    params.append(ENTRY.userId,          uid);
    params.append(ENTRY.sessionId,       sid);
    params.append(ENTRY.event,          event);
    params.append(ENTRY.payload,        String(payload || ''));
    params.append(ENTRY.score,          ctx.score);
    params.append(ENTRY.nickname,       _getNickname() || '');
    params.append(ENTRY.charName,       ctx.charName);
    params.append(ENTRY.origin,         ctx.origin);
    params.append(ENTRY.level,          ctx.level);
    params.append(ENTRY.encounterCount, ctx.encounterCount);
    params.append(ENTRY.companions,     ctx.companions);
    params.append(ENTRY.stats,          ctx.stats);
    params.append(ENTRY.karma,          ctx.karma);
    params.append(ENTRY.difficulty,     ctx.difficulty);
    params.append(ENTRY.gameVersion,    ctx.gameVersion);
    params.append(ENTRY.playtime,       ctx.playtime);
    params.append(ENTRY.datetime,       ctx.datetime);
    params.append(ENTRY.inventory,      ctx.inventory);
    params.append(ENTRY.coins,          ctx.coins);
    params.append(ENTRY.browserInfo,    _getBrowserInfo());

    if (navigator.sendBeacon) {
      var blob = new Blob([params.toString()], { type: 'application/x-www-form-urlencoded' });
      navigator.sendBeacon(FORM_URL, blob);
    } else {
      fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: params }).catch(function () {});
    }
  }

  // Called before pushEncounter(corpseLoot) to tag the next item as an enemy drop.
  // Consumed once by popLootSource() in loadEncounter().
  function setLootSource(src) {
    _pendingLootSource = src;
  }

  function popLootSource() {
    var s = _pendingLootSource;
    _pendingLootSource = null;
    return s;
  }

  return { send: send, setLootSource: setLootSource, popLootSource: popLootSource };
})();
