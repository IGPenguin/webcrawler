var RivalManager = (function () {

  // ── Config ──────────────────────────────────────────────────────────────────
  // ELIGIBLE_AREAS and SPAWN_CHANCE come from GAME_CONFIG.rivals at runtime.
  var NAME_MAX_LEN = 30;
  var RIVAL_EMOJIS = ['🧟', '🧟‍♀️', '🧟‍♂️'];

  function _cfg() {
    return (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.rivals) || {};
  }

  // Stat caps per area [hp, atk, sta, lck, int, mgk, def] — boss-level ceiling
  var STAT_CAPS = {
    'Forsaken Village':  [3, 2, 3, 0, -1, 1, 1],
    'Twisted Fairyland': [4, 3, 4, 0, -1, 2, 2],
    'River of Sorrows':  [5, 4, 4, 0, -1, 3, 2]
  };

  // Stat floors per area — rivals are always threatening
  var STAT_FLOORS = {
    'Forsaken Village':  [2, 1, 2, 0, -1, 0, 0],
    'Twisted Fairyland': [3, 2, 3, 0, -1, 0, 0],
    'River of Sorrows':  [4, 3, 3, 0, -1, 0, 0]
  };


  var _WALL_TEMPLATES = {
    win_speak:   '{name} said her name here. She remembered.',
    win_free:    '{name} unraveled the curse at this threshold.',
    win_kill:    '{name} settled it in blood.',
    win_embrace: '{name} chose the dark together.',
    win_pray:    '{name} begged the gods. They answered.',
    win_walk:    '{name} walked away. The world rotted.',
    win_guard:   '{name} stands guard. Still here.',
    win_sleep:   '{name} lay down and never rose.',
    win_curse:   '{name} sealed something terrible here.',
    win:         '{name} reached the end. The way is lost.',
    death:       '{name} fell before reaching her.',
    rival_death: '{name} was cut down by another traveler.'
  };

  function _wallEpitaph(entry) {
    var name = String(entry.charName || 'Unknown').trim().slice(0, 30);
    var tpl = _WALL_TEMPLATES[entry.endType] || '{name} passed through here.';
    return tpl.replace('{name}', '<b>' + name + '</b>');
  }

  // ── State ───────────────────────────────────────────────────────────────────
  var _pool                 = [];
  var _rivalForcedArea      = null;
  var _rivalSpawnedInArea   = {};
  var _rivalScheduledThisRun = false;
  var _wallShown            = false;

  // ── Public API ───────────────────────────────────────────────────────────────

  function fetchPool() {
    if (typeof ScoreManager === 'undefined') return;
    ScoreManager.fetchRankings(function (err, data) {
      if (err || !data || !data.length) return;
      var myNick = ((ScoreManager.getNickname && ScoreManager.getNickname()) || '').toLowerCase().trim();
      _pool = data.filter(function (entry) {
        if (!entry || !entry.stats || !entry.charName) return false;
        var nick = (entry.nickname || '').toLowerCase().trim();
        return !myNick || nick !== myNick;
      });
    });
  }

  function resetRun() {
    _rivalSpawnedInArea    = {};
    _rivalScheduledThisRun = false;
    _wallShown             = false;
    var areas = _cfg().eligibleAreas || [];
    _rivalForcedArea = areas.length ? areas[Math.floor(Math.random() * areas.length)] : null;
  }

  // Called from generateNextEncounters case 4 (Hard) for eligible areas.
  function tryPushRival(area) {
    var cfg = _cfg();
    if (!cfg.enabled)                              return;
    var areas = cfg.eligibleAreas || [];
    if (!areas.includes(area))                     return;
    if (_rivalSpawnedInArea[area])                 return;
    if (_pool.length === 0)                        return;

    var isForced = (area === _rivalForcedArea && !_rivalScheduledThisRun);
    if (!isForced && !procAbilityChance('', cfg.spawnChance || 33)) return;

    var entry = _pool[Math.floor(Math.random() * _pool.length)];
    var row   = _buildRow(entry, area);
    if (!row) return;

    pushEncounter(row);
    _rivalSpawnedInArea[area]  = true;
    _rivalScheduledThisRun     = true;
  }

  function getDialogue() {
    return typeof getRivalDialogue !== 'undefined' ? getRivalDialogue() : "You should have stayed dead.";
  }

  function buildWallPropRow() {
    if (_wallShown || _pool.length === 0) return null;
    _wallShown = true;

    var shuffled = _pool.slice().sort(function() { return Math.random() - 0.5; });
    var picks = shuffled.slice(0, Math.min(2, shuffled.length));
    var desc = picks.map(_wallEpitaph).join('<br>');

    return [
      'area:Shrouded Necropolis',
      'emoji:🪦',
      'name:Whispering Stones',
      'type:Prop',
      'hp:0', 'atk:0', 'sta:0', 'lck:0', 'int:0', 'mgk:0', 'def:0',
      'note:',
      'desc:' + desc,
      'message:',
      'achiev:none'
    ];
  }

  function getLastWord(endType) {
    return typeof getRivalLastWord !== 'undefined' ? getRivalLastWord(endType) : "No echo. They left nothing behind.";
  }

  // Returns an encounter row for a random item from the rival's inventory.
  // Falls back to getWeightedEncounter(['Item']) if nothing matches.
  function getRivalItemDrop(inventory) {
    var emojis = [...String(inventory || '')].filter(function (e) { return e.trim(); });
    if (emojis.length) {
      // Shuffle
      for (var i = emojis.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = emojis[i]; emojis[i] = emojis[j]; emojis[j] = t;
      }
      for (var k = 0; k < emojis.length; k++) {
        var picked = emojis[k];
        var matches = linesGenerator.filter(function (row) {
          return row[1] && row[1].split(':').slice(1).join(':') === picked
              && row[3] && row[3].includes('type:Item');
        });
        if (matches.length) return matches[Math.floor(Math.random() * matches.length)];
      }
    }
    return getWeightedEncounter(['Item']);
  }

  // ── Internal ─────────────────────────────────────────────────────────────────

  function _buildRow(entry, area) {
    var caps   = STAT_CAPS[area];
    var floors = STAT_FLOORS[area];
    if (!caps) return null;

    // stats field: "hp;atk;sta;lck;int;mgk;def"
    var raw = (entry.stats || '').split(';').map(Number);
    while (raw.length < 7) raw.push(0);
    var s = raw.map(function (v, i) {
      return Math.max(floors[i], Math.min(Math.abs(v), caps[i]));
    });

    var name = String(entry.charName || 'Unknown').trim();
    if (name.length > NAME_MAX_LEN) name = name.slice(0, NAME_MAX_LEN) + '…';

    var nick = String(entry.nickname || name).trim();
    if (nick.length > NAME_MAX_LEN) nick = nick.slice(0, NAME_MAX_LEN) + '…';

    var emoji     = RIVAL_EMOJIS[Math.floor(Math.random() * RIVAL_EMOJIS.length)];
    var desc      = 'Reanimated dead body from a different world.<br>Bears a tattoo "' + nick + '".';
    var deathMsg  = 'Slayed by ' + name + '.';
    var inventory = String(entry.inventory || '');

    return [
      'area:'   + area,
      'emoji:'  + emoji,
      'name:'   + name,
      'type:Boss-Rival',
      'hp:'     + s[0],
      'atk:'    + s[1],
      'sta:'    + s[2],
      'lck:'    + s[3],
      'int:'    + s[4],
      'mgk:'    + s[5],
      'def:'    + s[6],
      'note:',
      'desc:'   + desc,
      'message:' + deathMsg,
      'achiev:none',
      inventory,              // index 15 — rival's inventory for item drop
      String(entry.endType || '') // index 16 — rival's ending type for last word
    ];
  }

  return {
    fetchPool:        fetchPool,
    resetRun:         resetRun,
    tryPushRival:     tryPushRival,
    getDialogue:      getDialogue,
    getRivalItemDrop: getRivalItemDrop,
    buildWallPropRow: buildWallPropRow,
    getLastWord:      getLastWord
  };
})();
