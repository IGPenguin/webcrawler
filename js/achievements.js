var AchievementManager = (function () {
  var STORAGE_KEY = 'achievements';
  var STATS_KEY   = 'achievStats';

  var ACHIEVEMENTS = [
    { id: 'died_first',          emoji: '💀', desc: 'Died for the first time!', hint: "Finally face the inevitable." },
    { id: 'reincarnated_first',  emoji: '✨', desc: 'Reincarnated for the first time!', hint: "Don't give up skeleton!"},
    { id: 'coin_first',          emoji: '🪙', desc: 'Picked up your first Drachmae!', hint: "Unlock an eternal advantage." },
    { id: 'coin_5',              emoji: '💰', desc: 'Set up for success with 5 Drachmae!' },
    { id: 'gamble_win_first',    emoji: '🍀', desc: 'Won the gamble for the first time!' },
    { id: 'gamble_lose_first',   emoji: '🥺', desc: 'Lost the gamble for the first time!' },
    { id: 'gamble_win_10',       emoji: '🎰', desc: 'Won the gamble 10 times!' },
    { id: 'destiny_first',       emoji: '🃏', desc: 'Accepted a destiny for the first time!', hint: "Finally get a purpose." },
    { id: 'destiny_10',          emoji: '♠️', desc: 'Accepted a destiny 10 times!' },
    { id: 'buy_item_first',      emoji: '⚖️', desc: 'Bought an item for the first time!' },
    { id: 'spent_10',            emoji: '💸', desc: 'Spent 10 Drachmae at the Undertaker!' },
    { id: 'buy_artifact_first',  emoji: '💎', desc: 'Bought an artifact for the first time!' },
    { id: 'buy_level_first',     emoji: '⭐️', desc: 'Bought a level up for the first time!' },
    { id: 'game_win_first',      emoji: '👑', desc: 'Finished the game for the first time!' },
    { id: 'kill_first',          emoji: '💔', desc: 'Defeated your first enemy!', hint: "Spill blood for the first time." },
    { id: 'kill_50',             emoji: '🔪', desc: 'Defeated 50 enemies!'  },
    { id: 'boss_kill_first',     emoji: '🎉', desc: 'Defeated your first boss!', hint: "Defeat your first boss!"},
    { id: 'boss_kill_10',        emoji: '🎖️', desc: 'Defeated 10 bosses!' },
    { id: 'knockout_first',      emoji: '💤', desc: 'Knocked out your first enemy!', hint: 'It does not have to hurt.' },
    { id: 'knockout_50',         emoji: '✌️', desc: 'Knocked out 50 enemies!' },
    { id: 'calm_first',          emoji: '💬', desc: 'Talked an enemy into submission!', hint: 'How about trying de-escalation?' },
    { id: 'pet_first',           emoji: '🐾', desc: 'Got your first companion!', hint: 'Some creatures can be befriended.' },
    { id: 'recruit_first',       emoji: '🤝', desc: 'Recruited your first ally!', hint: 'Be smarter. Be convincing.' },
    { id: 'quest_first',         emoji: '⁉️', desc: 'Completed your first quest!', hint: 'Bring them what they ask for.' },
    { id: 'spoke_boss',          emoji: '🗣️', desc: 'Spoke a Boss into submission!', hint: 'Could peace be an actual option?' },
    { id: 'survive_trap',        emoji: '🪤', desc: 'Survived a deadly trap!', hint: 'Touch everything.' },
    { id: 'full_party',          emoji: '👥', desc: 'Gathered a full party of three!', hint: 'The more, the merrier, always.' },
    { id: 'fish_bait_first',     emoji: '🎣', desc: 'Caught something for the first time!', hint: "Whaaat? There's fishing?" },
    { id: 'fish_bait_50',       emoji: '🎏', desc: 'Caught something 50 times!' },
    { id: 'fish_no_bait_first',  emoji: '🪝', desc: 'Caught something without a bait!', hint: "Pffft. Who needs a bait anyway?" },
    { id: 'fish_no_bait_50',    emoji: '😎', desc: 'Caught something without a bait 50 times!' },
    { id: 'discover_forsaken',   emoji: '🏚️', desc: 'Discovered Forsaken Village!' },
    { id: 'discover_fairyland',  emoji: '🍄', desc: 'Discovered Twisted Fairyland!' },
    { id: 'discover_river',      emoji: '🌊', desc: 'Discovered River of Sorrows!' },
    { id: 'discover_necropolis', emoji: '🪦', desc: 'Discovered Shrouded Necropolis!' },
    { id: 'touch_grass',         emoji: '🌿', desc: 'You you touched the grass!', hint: 'Try going outside and then?' }
  ];
  // hint: optional short clue shown on locked entries (omit or leave empty to show nothing)

  var _defaultStats = {
    totalDeaths:         0,
    totalReincarnations: 0,
    maxSavedCoins:       0,
    totalCoinsSpent:     0,
    totalGambleWins:     0,
    totalGambleLosses:   0,
    totalDestinyAccepts: 0,
    totalKills:          0,
    totalBossKills:      0,
    totalKnockouts:      0,
    calmedEnemy:         false,
    gotPet:              false,
    gotRecruit:          false,
    completedQuest:      false,
    spokeBoss:           false,
    survivedTrap:        false,
    fullParty:           false,
    totalFishBait:       0,
    totalFishNoBait:     0,
    boughtItem:          false,
    boughtArtifact:      false,
    boughtLevel:         false,
    wonGame:             false,
    discoveredAreas:     []
  };

  var _unlocked       = {};
  var _stats          = {};
  var _sessionUnlocked = [];
  var _toastQueue     = [];
  var _toastActive    = false;

  // ── Persistence ──────────────────────────────────────────────────────────

  function _load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      _unlocked = raw ? JSON.parse(raw) : {};
    } catch(e) { _unlocked = {}; }
    try {
      var rawStats = localStorage.getItem(STATS_KEY);
      _stats = rawStats ? JSON.parse(rawStats) : {};
    } catch(e) { _stats = {}; }
    Object.keys(_defaultStats).forEach(function(k) {
      if (_stats[k] === undefined) {
        _stats[k] = JSON.parse(JSON.stringify(_defaultStats[k]));
      }
    });
  }

  function _save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_unlocked)); } catch(e) {}
    try { localStorage.setItem(STATS_KEY,   JSON.stringify(_stats));    } catch(e) {}
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  function _showNextToast() {
    if (_toastQueue.length === 0) { _toastActive = false; return; }
    _toastActive = true;
    var achievement = _toastQueue.shift();

    var old = document.getElementById('achievement_toast');
    if (old) old.remove();

    var toast = document.createElement('div');
    toast.id = 'achievement_toast';

    var ts = AchievementManager.getUnlockTime(achievement.id);
    var tsLine = '';
    if (ts) {
      var d = new Date(ts);
      tsLine = '<h5 style="margin:2px 0 4px 0; opacity:0.6; font-size:12px; text-align:left;">'
        + d.toLocaleString(undefined, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
        + '</h5>';
    }

    toast.innerHTML =
      '<div style="display:flex; align-items:center; gap:10px; padding:7px 0px 8px 12px; margin-bottom:-8px;">'
        + '<span style="font-size:22px; line-height:1; flex-shrink:0;">' + achievement.emoji + '</span>'
        + '<div style="flex:1;">'
          + '<h5 style="margin:-2px 0 0 0; font-size:16px; font-style:normal; font-weight:600; color:#FFD940; text-align:left; -webkit-text-stroke: 3px #121212;paint-order: stroke fill;">' + achievement.desc + '</h5>'
          + tsLine
        + '</div>'
      + '</div>';

    toast.style.cssText =
      'position:absolute; top:0; left:0; right:0;' +
      'z-index:9999; pointer-events:none; box-sizing:border-box;' +
      'background:#272727; overflow:hidden;' +
      'box-shadow:0 0 0 3px #FFD940;' +
      'opacity:0; transition:opacity 0.3s;';

    document.getElementById('id_action_bar_area').appendChild(toast);

    // Fade in
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { toast.style.opacity = '1'; });
    });

    // Border flash: gold → white → gold
    setTimeout(function() {
      if (document.getElementById('achievement_toast') !== toast) return;
      toast.style.boxShadow = '0 0 0 3px #fff, 0 0 8px #FFD940';
      setTimeout(function() {
        if (document.getElementById('achievement_toast') !== toast) return;
        toast.style.boxShadow = '0 0 0 3px #FFD940';
      }, 280);
    }, 150);

    // Auto-dismiss after 4s, fade out over 2s
    setTimeout(function() {
      if (document.getElementById('achievement_toast') !== toast) return;
      toast.style.transition = 'opacity 2s';
      toast.style.opacity = '0';
      setTimeout(function() {
        if (document.getElementById('achievement_toast') === toast) toast.remove();
        _toastActive = false;
        _showNextToast();
      }, 2300); // Show next toast 300ms after first
    }, 4000);
  }

  // ── Unlock ────────────────────────────────────────────────────────────────

  function _unlock(id) {
    if (_unlocked[id]) return;
    _unlocked[id] = Date.now();
    _sessionUnlocked.push(id);
    _save();
    var achievement = null;
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      if (ACHIEVEMENTS[i].id === id) { achievement = ACHIEVEMENTS[i]; break; }
    }

    // Add log
    if (achievement) setTimeout(function () {
      var MAX_LENGTH = 39;
      var text = achievement.desc;
      if (text.length > MAX_LENGTH) text = achievement.desc.substring(0,MAX_LENGTH)+"..."
      
      logAction("🧩 ▸ "+achievement.emoji+" <b style=\"color:"+colorGold+"\";>"+text+"</b>");
      redraw();
    },1) //Hehehehe, hack to log after logging action done

    // Show toast
    if (achievement) {
      _toastQueue.push(achievement);
      if (!_toastActive) _showNextToast();
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  function check(trigger, value) {
    switch (trigger) {

      case 'death':
        _stats.totalDeaths++;
        _save();
        if (_stats.totalDeaths === 1) _unlock('died_first');
        break;

      case 'reincarnate':
        _stats.totalReincarnations++;
        _save();
        if (_stats.totalReincarnations === 1) _unlock('reincarnated_first');
        break;

      case 'coin_pickup':
        // value = current savedCoins after pickup
        if (value > _stats.maxSavedCoins) { _stats.maxSavedCoins = value; _save(); }
        if (_stats.maxSavedCoins >= 1) _unlock('coin_first');
        if (_stats.maxSavedCoins >= 5) _unlock('coin_5');
        break;

      case 'gamble_win':
        _stats.totalGambleWins++;
        _save();
        if (_stats.totalGambleWins === 1)  _unlock('gamble_win_first');
        if (_stats.totalGambleWins >= 10)  _unlock('gamble_win_10');
        break;

      case 'gamble_lose':
        _stats.totalGambleLosses++;
        _save();
        if (_stats.totalGambleLosses === 1) _unlock('gamble_lose_first');
        break;

      case 'destiny':
        _stats.totalDestinyAccepts++;
        _save();
        if (_stats.totalDestinyAccepts === 1)  _unlock('destiny_first');
        if (_stats.totalDestinyAccepts >= 10)  _unlock('destiny_10');
        break;

      case 'buy_item':
        if (!_stats.boughtItem) { _stats.boughtItem = true; _save(); _unlock('buy_item_first'); }
        break;

      case 'buy_artifact':
        if (!_stats.boughtArtifact) { _stats.boughtArtifact = true; _save(); _unlock('buy_artifact_first'); }
        break;

      case 'buy_level':
        if (!_stats.boughtLevel) { _stats.boughtLevel = true; _save(); _unlock('buy_level_first'); }
        break;

      case 'spend_coins':
        _stats.totalCoinsSpent += (value || 0);
        _save();
        if (_stats.totalCoinsSpent >= 10) _unlock('spent_10');
        break;

      case 'kill':
        _stats.totalKills++;
        _save();
        if (_stats.totalKills === 1)  _unlock('kill_first');
        if (_stats.totalKills >= 50)  _unlock('kill_50');
        break;

      case 'boss_kill':
        _stats.totalBossKills++;
        _save();
        if (_stats.totalBossKills === 1)  _unlock('boss_kill_first');
        if (_stats.totalBossKills >= 10)  _unlock('boss_kill_10');
        break;

      case 'knockout':
        _stats.totalKnockouts++;
        _save();
        if (_stats.totalKnockouts === 1)  _unlock('knockout_first');
        if (_stats.totalKnockouts >= 50)  _unlock('knockout_50');
        break;

      case 'calm_enemy':
        if (!_stats.calmedEnemy) { _stats.calmedEnemy = true; _save(); _unlock('calm_first'); }
        break;

      case 'get_pet':
        if (!_stats.gotPet) { _stats.gotPet = true; _save(); _unlock('pet_first'); }
        break;

      case 'get_recruit':
        if (!_stats.gotRecruit) { _stats.gotRecruit = true; _save(); _unlock('recruit_first'); }
        break;

      case 'quest_complete':
        if (!_stats.completedQuest) { _stats.completedQuest = true; _save(); _unlock('quest_first'); }
        break;

      case 'calm_boss':
        if (!_stats.spokeBoss) { _stats.spokeBoss = true; _save(); _unlock('spoke_boss'); }
        break;

      case 'survive_trap':
        if (!_stats.survivedTrap) { _stats.survivedTrap = true; _save(); _unlock('survive_trap'); }
        break;

      case 'full_party':
        if (!_stats.fullParty) { _stats.fullParty = true; _save(); _unlock('full_party'); }
        break;

      case 'fish_bait':
        _stats.totalFishBait++;
        _save();
        if (_stats.totalFishBait === 1)   _unlock('fish_bait_first');
        if (_stats.totalFishBait >= 50)  _unlock('fish_bait_50');
        break;

      case 'fish_no_bait':
        _stats.totalFishNoBait++;
        _save();
        if (_stats.totalFishNoBait === 1)   _unlock('fish_no_bait_first');
        if (_stats.totalFishNoBait >= 50)  _unlock('fish_no_bait_50');
        break;

      case 'discover_area': {
        var _areaMap = {
          'Forsaken Village':    'discover_forsaken',
          'Twisted Fairyland':   'discover_fairyland',
          'River of Sorrows':    'discover_river',
          'Shrouded Necropolis': 'discover_necropolis'
        };
        var _achId = _areaMap[value];
        if (_achId && !_stats.discoveredAreas.includes(value)) {
          _stats.discoveredAreas.push(value);
          _save();
          _unlock(_achId);
        }
        break;
      }

      case 'game_win':
        if (!_stats.wonGame) { _stats.wonGame = true; _save(); _unlock('game_win_first'); }
        break;

      case 'touch_grass':
        _unlock('touch_grass');
        break;
    }
  }

  function resetSession() {
    _sessionUnlocked = [];
  }

  function getSessionUnlocked() {
    return _sessionUnlocked.slice();
  }

  function isUnlocked(id) {
    return !!_unlocked[id];
  }

  function getUnlockTime(id) {
    var ts = _unlocked[id];
    if (!ts || ts === true) return null; // backwards-compat: old saves stored `true`
    return ts;
  }

  function getAll() {
    return ACHIEVEMENTS;
  }

  function clearAll() {
    _unlocked = {};
    _stats = JSON.parse(JSON.stringify(_defaultStats));
    _save();
  }

  _load();

  return {
    check:               check,
    resetSession:        resetSession,
    getSessionUnlocked:  getSessionUnlocked,
    isUnlocked:          isUnlocked,
    getUnlockTime:       getUnlockTime,
    getAll:              getAll,
    clearAll:            clearAll
  };
})();
