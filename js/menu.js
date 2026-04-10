var Menu = (function () {
  var SCREENS = ['menu_main_screen', 'menu_history_screen', 'menu_credits_screen'];

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
    var continueBtn = document.getElementById('menu_continue');
    continueBtn.style.display = SaveManager.hasContinue() ? '' : 'none';
    _showScreen('menu_main_screen');
  }

  // ── Session History ────────────────────────────────────────────────────────

  function _renderHistory() {
    var list = document.getElementById('menu_history_list');
    var sessions = SaveManager.listSessionHistory();

    if (sessions.length === 0) {
      list.innerHTML =
        '<h4 style="color:#888888; text-align:center; min-height:0; ' +
        'padding:16px 0; margin:0;">No sessions recorded yet.</h4>';
      _showScreen('menu_history_screen');
      return;
    }

    list.innerHTML = '';
    sessions.forEach(function (session) {
      var icon  = session.outcome === 'win' ? '👑' : '💀';
      var label = icon + '&nbsp;' +
        (session.playerName || 'Unknown') +
        '&nbsp;&nbsp;·&nbsp;&nbsp;Lv.' + (session.level || '?') +
        '&nbsp;&nbsp;·&nbsp;&nbsp;' + (session.area || '?');
      var sub = (session.date || '') +
        (session.causeOfDeath ? '&nbsp;&nbsp;·&nbsp;&nbsp;' + session.causeOfDeath : '');

      var entry = document.createElement('div');
      entry.className = 'menu-history-entry';
      entry.innerHTML =
        '<h4 style="min-height:0; margin:0; padding:0; font-size:13px; ' +
        'line-height:22px;">' + label + '</h4>' +
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
      SaveManager.clearSave();
      savedCoins = NaN; // NaN causes neither returning-player branch in processStoryData
      startGame(false);
    });

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
