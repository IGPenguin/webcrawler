var Menu = (function () {
  var SCREENS = [
    'menu_main_screen',
    'menu_history_screen',
    'menu_credits_screen',
    'menu_confirm_screen'
  ];

  // ── Show / Hide ────────────────────────────────────────────────────────────

  function show() {
    document.getElementById('id_menu').style.display = 'flex';
    document.getElementById('id_game').style.display = 'none';
    _renderMain();
  }

  function hide() {
    document.getElementById('id_menu').style.display = 'none';
    // display:contents makes #id_game transparent to its parent flex layout,
    // preserving the exact same centering as before the wrapper was added.
    document.getElementById('id_game').style.display = 'contents';
  }

  // ── Screen routing ─────────────────────────────────────────────────────────

  function _showScreen(id) {
    SCREENS.forEach(function (s) {
      document.getElementById(s).style.display = (s === id) ? '' : 'none';
    });
  }

  // ── Main ───────────────────────────────────────────────────────────────────

  function _renderMain() {
    document.getElementById('menu_continue').style.display =
      SaveManager.hasContinue() ? '' : 'none';
    _showScreen('menu_main_screen');
  }

  // ── Confirm new game ────────────────────────────────────────────────────────

  function _renderConfirm() {
    _showScreen('menu_confirm_screen');
  }

  function _doNewGame() {
    SaveManager.clearSave();
    savedCoins = NaN; // NaN causes neither returning-player branch in processStoryData
    startGame(false);
  }

  // ── Session History ────────────────────────────────────────────────────────

  var OUTCOME_ICON = { win: '👑', death: '💀', abandoned: '♻️' };

  function _buildStatsString(session) {
    var s = '';
    if (session.playerHpMax  > 0) s += '❤️ '           + fullSymbol.repeat(session.playerHpMax);
    if (session.playerStaMax > 0) s += '&nbsp;&nbsp;🟢 ' + fullSymbol.repeat(session.playerStaMax);
    if (session.playerAtk    > 0) s += '&nbsp;&nbsp;⚔️ ' + fullSymbol.repeat(session.playerAtk);
    if (session.playerMgkMax > 0) s += '&nbsp;&nbsp;🔵 ' + fullSymbol.repeat(session.playerMgkMax);
    return s;
  }

  function _renderHistory() {
    var list = document.getElementById('menu_history_list');
    var sessions = SaveManager.listSessionHistory();

    if (sessions.length === 0) {
      list.innerHTML =
        '<h4 style="color:#888888; text-align:center; min-height:0; ' +
        'padding:16px 0; margin:0;">No runs recorded yet.</h4>';
      _showScreen('menu_history_screen');
      return;
    }

    list.innerHTML = '';
    sessions.forEach(function (session) {
      //var icon  = OUTCOME_ICON[session.outcome] || '💀';
      var icon = ""; // Unsure about this conflicting with special char icons, will disable for now
      var label = '<b>' + icon + '&nbsp;' +
        (session.playerName || 'Unknown') +
        '&nbsp;&nbsp;·&nbsp;&nbsp;Lv.' + (session.level || '?') +
        '&nbsp;&nbsp;·&nbsp;&nbsp;' + (session.area || '?') + '</b>';
      var sub = (session.causeOfDeath ? "" + session.causeOfDeath : '')
        + '&nbsp;&nbsp;·&nbsp;&nbsp;'
        + (session.date || '') ;
      var stats = _buildStatsString(session);

      var partyLoot = '';
      if (session.playerPartyString) partyLoot += session.playerPartyString;
      if (session.playerLootString)  partyLoot += (partyLoot ? '&nbsp;&nbsp;' : '') + session.playerLootString;

      var entry = document.createElement('div');
      entry.className = 'menu-history-entry';
      entry.innerHTML =
        '<h4 style="min-height:0; margin:0; padding:0; font-size:13px; line-height:22px;">' +
          label +
        '</h4>' +
        (stats ? '<h4 style="min-height:0; margin:0; padding:0; font-size:13px; line-height:22px;">' + stats + '</h4>' : '') +
        (partyLoot ? '<h4 style="min-height:0; margin:0; padding:0; font-size:13px; line-height:22px;">' + partyLoot + '</h4>' : '') +
        '<h5 style="margin:0;">' + sub + '</h5>';

      var logDiv = document.createElement('div');
      logDiv.className = 'menu-history-log';
      var logLines = (session.actionLog || '').split('<br>').filter(function (l) {
        return l.replace(/&nbsp;/g, '').trim();
      });
      logDiv.innerHTML = logLines.length ? logLines.join('<br>') : '<i>No log.</i>';

      entry.addEventListener('click', function () {
        logDiv.style.display = logDiv.style.display === 'block' ? 'none' : 'block';
      });

      list.appendChild(entry);
      list.appendChild(logDiv);
    });

    _showScreen('menu_history_screen');
  }

  // ── Credits ────────────────────────────────────────────────────────────────

  function _renderCredits() {
    _showScreen('menu_credits_screen');
  }

  // ── Button wiring ──────────────────────────────────────────────────────────

  function _bindButtons() {
    document.getElementById('menu_new_game').addEventListener('click', function () {
      if (SaveManager.hasContinue()) {
        _renderConfirm();
      } else {
        _doNewGame();
      }
    });

    document.getElementById('menu_confirm_yes').addEventListener('click', function () {
      SaveManager.abandonCurrentRun();
      _doNewGame();
    });

    document.getElementById('menu_confirm_cancel').addEventListener('click', _renderMain);

    document.getElementById('menu_continue').addEventListener('click', function () {
      startGame(true);
    });

    document.getElementById('menu_history').addEventListener('click', _renderHistory);
    document.getElementById('menu_credits').addEventListener('click', _renderCredits);
    document.getElementById('menu_history_back').addEventListener('click', _renderMain);
    document.getElementById('menu_credits_back').addEventListener('click', _renderMain);
  }

  // ── Public init ────────────────────────────────────────────────────────────

  function init() {
    document.getElementById('menu_version').innerHTML = versionCode;
    _bindButtons();
    show();
  }

  return { init: init, show: show, hide: hide };
})();
