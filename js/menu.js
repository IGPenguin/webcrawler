var Menu = (function () {
  var _currentDetailSession = null; // set when history detail is open

  var SCREENS = [
    'menu_main_screen',
    'menu_memories_screen',
    'menu_history_screen',
    'menu_credits_screen',
    'menu_confirm_screen'
  ];

  // ── Show / Hide ────────────────────────────────────────────────────────────

  function show() {
    document.getElementById('id_menu').style.display = 'flex';
    document.getElementById('id_game').style.display = 'none';
    _renderMain(true); // skipFade — outer curtain (transitionToGame / menuFade) handles the transition
    _animateLogo();
  }

  function hide() {
    document.getElementById('id_menu').style.display = 'none';
    // display:contents makes #id_game transparent to its parent flex layout,
    // preserving the exact same centering as before the wrapper was added.
    document.getElementById('id_game').style.display = 'contents';
  }

  // ── Logo animation ─────────────────────────────────────────────────────────

  function _animateLogo() {
    var logo = document.getElementById('id_menu_logo');
    if (!logo) return;
    logo.classList.remove('animate__animated', 'animate__fadeInDown');
    void logo.offsetWidth; // reflow
    logo.style.setProperty('--animate-duration', '2s');
    logo.classList.add('animate__animated', 'animate__infinite', 'animate__pulse' );
    logo.addEventListener('animationend', function onDone() {
      logo.removeEventListener('animationend', onDone);
      logo.classList.remove('animate__animated', 'animate__fadeInDown');
    });
  }

  // ── Screen routing ─────────────────────────────────────────────────────────

  function _doShowScreen(id) {
    SCREENS.forEach(function (s) {
      document.getElementById(s).style.display = (s === id) ? '' : 'none';
    });
    window.scrollTo(0, -128);
  }

  // Always fades between screens (only used for in-menu navigation, never from show()).
  function _showScreen(id) {
    menuFade(function () { _doShowScreen(id); });
  }

  // ── Main ───────────────────────────────────────────────────────────────────

  function _renderMain(skipFade) {
    var hasSave = SaveManager.hasContinue();
    document.getElementById('menu_continue').style.display = hasSave ? '' : 'none';

    var preview = document.getElementById('menu_continue_preview');
    if (hasSave) {
      var s = SaveManager.loadGameState();
      var stats = _buildStats(s.playerHpMax, s.playerStaMax, s.playerAtk, s.playerMgkMax);

      var partyLoot = '';
      if (s.playerPartyString && s.playerPartyString !== 'undefined') partyLoot += s.playerPartyString;
      if (s.playerLootString  && s.playerLootString  !== 'undefined') partyLoot += s.playerLootString;

      var encounter = (s.enemyEmoji || '') + (s.enemyName ? ' ' + s.enemyName : '');
      preview.innerHTML = _buildRunCardHTML(s.playerName || '?', s.playerLevel || '?', s.areaName || '?', stats, partyLoot, encounter || null, s.adventureStartTime || null, false, true);
      document.getElementById('menu_card_rename').addEventListener('click', function () {
        _renameCurrentRun(function () { _renderMain(true); });
      });
    } else {
      preview.innerHTML = _buildRunCardHTML('Damned Soul', '??', 'Depths of Slumber'," ⨯ ⨯ ⨯ ", '...', '💤 Drifting Away', '⨯ ⨯ ⨯');
    }
    preview.style.display = '';

    if (skipFade) { _doShowScreen('menu_main_screen'); } else { _showScreen('menu_main_screen'); }
  }

  // ── Confirm new game ────────────────────────────────────────────────────────

  function _renderConfirm() {
    var confirmPreview = document.getElementById('menu_confirm_preview');
    if (confirmPreview) {
      var s = SaveManager.loadGameState();
      if (s) {
        var stats = _buildStats(s.playerHpMax, s.playerStaMax, s.playerAtk, s.playerMgkMax);
        var partyLoot = '';
        if (s.playerPartyString && s.playerPartyString !== 'undefined') partyLoot += s.playerPartyString;
        if (s.playerLootString  && s.playerLootString  !== 'undefined') partyLoot += s.playerLootString;
        var encounter = (s.enemyEmoji || '') + (s.enemyName ? ' ' + s.enemyName : '');
        confirmPreview.innerHTML = _buildRunCardHTML(s.playerName || '?', s.playerLevel || '?', s.areaName || '?', stats, partyLoot, encounter || null, s.adventureStartTime || null, false, true);
        document.getElementById('menu_card_rename').addEventListener('click', function () {
          _renameCurrentRun(function () { _renderConfirm(); });
        });
        confirmPreview.style.display = '';
      } else {
        confirmPreview.style.display = 'none';
      }
    }
    _showScreen('menu_confirm_screen');
  }

  // ── Rename current run ─────────────────────────────────────────────────────

  function _renameCurrentRun(onDone) {
    var s = SaveManager.loadGameState();
    if (!s) return;
    var current = s.playerName || playerName || '';
    var newName = prompt('Rename your character: ', current);
    if (newName === '') newName = 'Nameless';
    else if (!newName) return; // cancelled — do nothing
    playerName = newName;
    SaveManager.patchPlayerName(playerName);
    onDone();
  }

  function _doNewGame() {
    savedCoins = parseInt(localStorage.getItem('coins'));
    renewPlayer(); // sets spentCoins=0, availableCoins=savedCoins
    AchievementManager.resetSession();
    SaveManager.clearSave();
    startGame(false);
  }

  // ── Shared run card renderer ───────────────────────────────────────────────

  function _buildStats(hpMax, staMax, atk, mgkMax) {
    var s = '';
    if (hpMax  > 0) s += '❤️ '            + fullSymbol.repeat(hpMax);
    if (staMax > 0) s += '&nbsp;&nbsp;🟢 ' + fullSymbol.repeat(staMax);
    if (atk    > 0) s += '&nbsp;&nbsp;⚔️ ' + fullSymbol.repeat(atk);
    if (mgkMax > 0) s += '&nbsp;&nbsp;🔵 ' + fullSymbol.repeat(mgkMax);
    return s;
  }

  // Builds an in-game-styled player card matching the in-game toolbar layout exactly.
  // area + sub render as one h5 line; date renders as a second dimmer h5 (matches list item style).
  // renameable=true adds a tap target on the name bar (id="menu_card_rename").
  function _buildRunCardHTML(name, level, area, stats, partyLoot, sub, date, skipLoot, renameable) {
    var html = '';

    // Outer wrapper — matches toolbar-card
    html += '<div style="padding-top:0px; padding-bottom:3px;">';

    // Level — negative margin-bottom overlaps the name bar below (must be directly before it)
    html += '<h3 style="margin-top:6px; margin-bottom:-19px; margin-left:4px; position:relative; '
      + 'z-index:3; text-align:right; padding-right:10px;">'
      + '<i style="font-weight:600; color:#FFD940; font-size:14px;'
      + '-webkit-text-stroke:3px #121212; paint-order:stroke fill;">Level&nbsp;' + level + '</i>'
      + '</h3>';

    // Name bar — directly after level so the overlap works
    html += '<div class="box-border-dynamic" style="margin-left:3px; margin-right:3px; '
      + 'padding-top:2px; padding-bottom:1px; background-color:#202020;">'
      + '<h3 ' + (renameable ? 'id="menu_card_rename" ' : '') + 'style="text-align:left; padding-left:8px; letter-spacing:0.8px; font-weight:500; '
      + 'margin-top:0px; margin-bottom:4px; font-size:17px; font-weight:bold; '
      + '-webkit-text-stroke:5px #121212; paint-order:stroke fill; position:relative; z-index:10;'
      + (renameable ? ' cursor:pointer; user-select:none;' : '') + '">'
      + name
      + '</h3>'
      + '</div>';

    // Area + cause + date — one bordered div, two h5 lines (matches history list style)
    var infoParts = [area && area !== '?' ? area : null, sub || null].filter(Boolean);
    if (infoParts.length || date) {
      html += '<div class="box-border-dynamic" style="margin-left:3px; margin-right:3px; '
        + 'padding:2px 8px; background-color:#202020;">';
      if (infoParts.length)
        html += '<h5 style="margin:4px 0 1px 0; font-size:16px; font-style: normal; font-weight:400;">' + infoParts.join('&nbsp;❖&nbsp;') + '</h5>';
      if (date)
        html += '<h5 style="margin:4px 0 4px 0; opacity:0.6; font-size:14px;">' + date + '</h5>';
      html += '</div>';
    }

    // XP bar (static, width 0)
    html += '<div style="width:0%; height:1px; background:#FFD940; '
      + 'margin-top:1px; margin-bottom:0px; margin-left:4px;">&nbsp;</div>';

    // Note: Disabled stats and party+loot display below to declutter main menu

    //Stats bar wrapper + stats h3
    // html += '<div class="box-border-dynamic" style="margin-left:3px; margin-right:3px; '
    //   + 'margin-bottom:14px; box-shadow:0px 0px 0px 3px #121212;">'
    //   + '<h3 style="text-align:left; padding-left:8px; padding-top:2px; padding-bottom:2px; '
    //   + 'font-size:14px; margin-bottom:-11px; margin-top:13px; font-family:sans; '
    //   + 'box-shadow:0px 0px 0px 3px #000000; position:relative; z-index:1;">'
    //   + (stats || '&nbsp;') + '</h3>'
    //   + '</div>';

    // if (!skipLoot) {
    //   // Loot/party bar — matches id_player_party_loot exactly
    //   html += '<h3 style="text-align:left; text-overflow:ellipsis; overflow:hidden; '
    //     + 'white-space:nowrap; float:left; padding-top:3px; padding-bottom:3px; padding-left:8px; '
    //     + 'margin-left:3px; margin-bottom:0px; margin-top:0px; display:inline-block; width:95.8%; '
    //     + 'box-shadow:0px 0px 0px 3px #121212; background-color:#272727;">'
    //     + (partyLoot || '<span style="color:#fff;">∙∙∙</span>') + '</h3>';
    //   // Clear float before closing wrapper
    //   html += '<div style="clear:both;"></div>';
    // }
    html += '</div>';

    return html;
  }

  // ── Session History ────────────────────────────────────────────────────────

  // Rebinds the history back button label and handler.
  function _bindHistoryBack(label, fn) {
    var btn = document.getElementById('menu_history_back');
    var fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.innerHTML = label;
    fresh.addEventListener('click', fn);
  }

  // State 1: compact session list.
  function _renderHistoryList() {
    _currentDetailSession = null;
    document.getElementById('menu_history_actions').style.display = 'none';
    _bindHistoryBack('👈 Back', function () { _renderMain(); });

    var list = document.getElementById('menu_history_list');
    var sessions = SaveManager.listSessionHistory();

    if (sessions.length === 0) {
      list.innerHTML =
        '<h4 style="color:#fff; text-align:center; min-height:0; ' +
        'padding:16px 0; margin:0;">No heroes have been buried yet.<br>⨯ ⨯ ⨯</h4>';
      return;
    }

    list.innerHTML = '';
    sessions.forEach(function (session) {
      var entry = document.createElement('div');
      entry.className = 'menu-history-entry';

      // Same level + name bar structure as _buildRunCardHTML (with the overlap trick)
      entry.innerHTML =
        '<div style="background-color:rgb(40,40,40); overflow:hidden; padding-top:1px; padding-bottom:3px;">'
          + '<h3 style="margin-top:3px; margin-bottom:-19px; margin-left:4px; position:relative; '
            + 'z-index:3; text-align:right; padding-right:10px; padding-bottom:2px;">'
          + '<i style="font-weight:600; color:#FFD940; font-size:14px; position:relative; top:2px;'
            + '-webkit-text-stroke:3px #121212; paint-order:stroke fill;">Level&nbsp;' + (session.level || '?') + '</i>'
          + '</h3>'
          + '<div class="box-border-dynamic" style="margin-left:3px; margin-right:3px; '
            + 'padding-top:3px; padding-bottom:2px; background-color:#202020;">'
            + '<h3 style="text-align:left; padding-left:8px; letter-spacing:0.8px; font-weight:500; '
            + 'margin-top:-1px; margin-bottom:0px; font-size:17px; font-weight:bold; '
            + '-webkit-text-stroke:5px #121212; paint-order:stroke fill;">'
            + (session.playerName || 'Unknown') + '</h3>'
          + '</div>'
        + '</div>'
        + '<h5 style="margin:4px 0 1px 0; font-size:16px; font-style: normal; font-weight:400">' + (session.area || '?') + '&nbsp;&nbsp;❖&nbsp;&nbsp;' + (session.causeOfDeath || '') + '</h5>'
        + '<h5 style="margin:4px 0 4px 0; opacity:0.6; font-size:14px;">' + (session.date || '') + '</h5>';

      entry.addEventListener('click', function () { menuFade(function () { _renderHistoryDetail(session); }); });
      list.appendChild(entry);
    });
  }

  // State 2: full in-game-style detail for a single session.
  function _renderHistoryDetail(session) {
    _currentDetailSession = session;
    document.getElementById('menu_history_actions').style.display = 'flex';
    _bindHistoryBack('👈 Back', function () { menuFade(_renderHistoryList); });

    var stats = _buildStats(session.playerHpMax, session.playerStaMax, session.playerAtk, session.playerMgkMax);

    var partyLoot = '';
    if (session.playerPartyString && session.playerPartyString !== 'undefined') partyLoot += session.playerPartyString;
    if (session.playerLootString  && session.playerLootString  !== 'undefined') partyLoot += session.playerLootString;

    var list = document.getElementById('menu_history_list');
    list.innerHTML = '';

    // Full player card
    var card = document.createElement('div');
    card.innerHTML = _buildRunCardHTML(
      session.playerName || 'Unknown',
      session.level || '?',
      session.area  || '?',
      stats, partyLoot,
      session.causeOfDeath || null,
      session.date || null,
      true  // skipLoot — loot bar rendered below log
    );
    list.appendChild(card);

    // Action log — styled like the in-game log box
    var logLines = (session.actionLog || '').split('<br>').filter(function (l) {
      return l.replace(/&nbsp;/g, '').trim();
    }).reverse();

    var logWrap = document.createElement('div');
    logWrap.style.cssText = 'margin:4px 3px 3px 3px; box-shadow:0px 0px 0px 3px #121212; background-color:#272727;';

    var logEl = document.createElement('h4');
    // Fixed 3-line height: font-size 12px × line-height 1.65 × 3 lines = ~60px content + padding
    logEl.style.cssText = 'margin: -8px 0 0 0; padding:4px 8px; text-align:left; '
      + 'font-size:14.6px; line-height:165%; height:74px; overflow-y:auto; '
      + 'scrollbar-width:thin; scrollbar-color:#000 transparent;';
    logEl.innerHTML = logLines.length ? logLines.join('<br>') : '<i style="opacity:0.5;">No log.</i>';

    logWrap.appendChild(logEl);
    list.appendChild(logWrap);

    // Loot/party bar — below the log
    var lootBar = document.createElement('h3');
    lootBar.style.cssText = 'text-align:left; text-overflow:ellipsis; overflow:hidden; '
      + 'white-space:nowrap; float:left; padding-top:3px; padding-bottom:3px; padding-left:8px; '
      + 'margin-left:3px; margin-bottom:0px; margin-top:8px; display:inline-block; width:95.8%; '
      + 'box-shadow:0px 0px 0px 3px #121212; background-color:#272727;';
    lootBar.innerHTML = partyLoot || '<span style="color:#fff;">∙∙∙</span>';
    list.appendChild(lootBar);

    var clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    list.appendChild(clearDiv);

    // Session achievements unlocked by this character
    // var achIds = session.sessionAchievements;
    // if (achIds && achIds.length > 0) {
    //   var allAchs = AchievementManager.getAll();
    //   var achMap = {};
    //   allAchs.forEach(function (a) { achMap[a.id] = a; });

    //   var achLabel = document.createElement('h5');
    //   achLabel.style.cssText = 'text-align:left; padding-left:8px; margin:6px 3px 2px 3px; font-size:12px; opacity:0.55; letter-spacing:0.5px;';
    //   achLabel.innerHTML = '🧩 Memories unlocked';
    //   list.appendChild(achLabel);

    //   var achWrap = document.createElement('div');
    //   achWrap.style.cssText = 'margin:0 3px 3px 3px; background:#1a1a1a; box-shadow:0 0 0 3px #FFD940; padding:6px 8px;';
    //   var achLines = achIds.map(function (id) {
    //     var a = achMap[id];
    //     return a ? (a.emoji + '&nbsp;' + a.desc) : id;
    //   });
    //   achWrap.innerHTML = '<h5 style="margin:0; font-size:13px; font-style:normal; line-height:190%; color:#FFD940;">'
    //     + achLines.join('<br>')
    //     + '</h5>';
    //   list.appendChild(achWrap);
    // }
  }

  // ── History share / review ─────────────────────────────────────────────────

  function _stripHtml(s) {
    return (s || '').replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '');
  }

  // Short summary text for clipboard.
  function _buildSessionShareText(session) {
    var t = _stripHtml(session.playerName || 'Unknown') + '  •  Lvl ' + (session.level || '?');
    t += '\n❤️ ' + (session.playerHpMax || '?')
       + '  🟢 ' + (session.playerStaMax || '?')
       + '  ⚔️ ' + (session.playerAtk || '?');
    if (session.playerMgkMax > 0) t += '  🔵 ' + session.playerMgkMax;
    var partyLoot = '';
    if (session.playerPartyString && session.playerPartyString !== 'undefined') partyLoot += session.playerPartyString;
    if (session.playerLootString  && session.playerLootString  !== 'undefined') partyLoot += session.playerLootString;
    if (partyLoot) t += '\n' + _stripHtml(partyLoot);
    t += '\n' + _stripHtml(session.area || '?') + '  ❖  ' + _stripHtml(session.causeOfDeath || '');
    t += '\n' + (session.date || '');
    t += '\nhttps://igpenguin.github.io/stay-dead';
    return t;
  }

  // Full legend: summary header + stripped action log reversed (for .txt and Google Form).
  function _buildSessionFullText(session) {
    var header = _buildSessionShareText(session);
    var logLines = (session.actionLog || '').split('<br>').map(function (l) {
      return _stripHtml(l).trim();
    }).filter(Boolean).reverse();
    return logLines.length ? header + '\n\n' + logLines.join('\n') : header;
  }

  function _downloadText(fileName, text) {
    var a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function _shareSession() { // TODO Fix the .png
    if (!_currentDetailSession) return;
    var session = _currentDetailSession;
    var safeName = _stripHtml(session.playerName || 'Unknown').replace(/\s+/g, '-');
    var shareText = _buildSessionShareText(session);
    var fullText  = _buildSessionFullText(session);

    // 1. Copy summary to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).catch(function () {});
    } else {
      var ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    // 2. Download full log as .txt
    _downloadText('Stay-Dead-' + safeName + '.txt', fullText);

    // 3. Download PNG — capture the actual rendered card from the page.
    if (typeof html2canvas !== 'undefined') {
      var listEl   = document.getElementById('menu_history_list');
      var scrollEl = listEl.parentElement;
      var cardEl = listEl.parentElement.parentElement;         // the overflow:auto container

      // Lift scroll clipping so html2canvas sees the full content height.
      //var prevOverflow  = scrollEl.style.overflow;
      //var prevMaxHeight = scrollEl.style.maxHeight;

      /// TODO Hide buttons
      //listEl.style.overflow  = 'visible';
      //listEl.style.maxHeight = 'none';

      html2canvas(cardEl, { scale: 2, logging: false, useCORS: true }).then(function (canvas) {
        //scrollEl.style.overflow  = prevOverflow;
        //scrollEl.style.maxHeight = prevMaxHeight;
        var a = document.createElement('a');
        a.download = 'Stay-Dead-' + safeName + '.png';
        a.href = canvas.toDataURL('image/png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      // TODO Show buttons
    }
  }

  function _reviewSession() {
    if (!_currentDetailSession) return;
    openFeedbackForm(_buildSessionFullText(_currentDetailSession));
  }

  function _renderHistory() {
    _renderHistoryList();
    _showScreen('menu_history_screen');
  }

  // ── Memories ──────────────────────────────────────────────────────────────────

  function _renderMemoriesList() {
    var list = document.getElementById('menu_memories_list');
    var achievements = AchievementManager.getAll();
    var unlockedCount = 0;

    list.innerHTML = '';

    achievements.forEach(function (a) {
      var unlocked = AchievementManager.isUnlocked(a.id);
      if (unlocked) unlockedCount++;
    });

    // Progress header
    var header = document.createElement('div');
    header.style.cssText = 'padding:4px 8px 6px 8px; text-align:center;';
    header.innerHTML = '<h5 style="margin:0; font-size:12px; opacity:1; letter-spacing:0.8px;">'
      + 'Unlocked: '+ unlockedCount + ' / ' + achievements.length
      + '</h5>';
    list.appendChild(header);

    achievements.forEach(function (a) {
      var unlocked = AchievementManager.isUnlocked(a.id);
      var entry = document.createElement('div');
      entry.className = 'menu-history-entry';

      var tsLine = '<h5 style="margin:4px 0 4px 0; opacity:0.6; font-size:12px; text-align:left;">'
    + "Keep trying..."
    + '</h5>';

      if (unlocked) {
        var ts = AchievementManager.getUnlockTime(a.id);
        if (ts) {
          var d = new Date(ts);
          tsLine = '<h5 style="margin:4px 0 4px 0; opacity:0.6; font-size:12px; text-align:left;">'
            + d.toLocaleString(undefined, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
            + '</h5>';
        }
        entry.innerHTML =
          '<div style="display:flex; align-items:center; gap:10px; padding:10px 0px 8px 12px; margin-bottom:-8px;">'
            + '<span style="font-size:22px; line-height:1; flex-shrink:0;">' + a.emoji + '</span>'
            + '<div><h5 style="margin:0; font-size:16px; font-style:normal; font-weight:600; color:#FFD940; text-align:left; -webkit-text-stroke: 3px #121212;paint-order: stroke fill;">' + a.desc + '</h5>' + tsLine + '</div>'
          + '</div>';
      } else {
        var hintText = (a.hint && a.hint.length > 0) ? a.hint : "Not discovered yet.";
        entry.innerHTML =
          '<div style="display:flex; align-items:center; gap:10px; padding:10px 0px 8px 12px; margin-bottom:-8px; background-color:rgb(22,22,22); opacity:0.38;">'
            + '<span style="font-size:22px; line-height:1; flex-shrink:0;">' + a.emoji + '</span>'
            + '<div><h5 style="margin:0; font-size:16px; font-style:itallic; font-weight:500; color:#CCCCCC; text-align:left; -webkit-text-stroke: 3px #121212;paint-order: stroke fill;"> ' + (hintText || '') + '</h5>' + tsLine + '</div>'
          + '</div>';
      }
      list.appendChild(entry);
    });
  }

  function _renderChallenges(skipFade) {
    _renderMemoriesList();
    if (skipFade) { _doShowScreen('menu_memories_screen'); }
    else          { _showScreen('menu_memories_screen'); }
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

    document.getElementById('menu_confirm_cancel').addEventListener('click', function () { _renderMain(); });

    document.getElementById('menu_continue').addEventListener('click', function () {
      AchievementManager.resetSession();
      startGame(true);
    });

    document.getElementById('menu_history_share').addEventListener('click', _shareSession);
    document.getElementById('menu_history_review').addEventListener('click', _reviewSession);

    document.getElementById('menu_memories_back').addEventListener('click', function () { _renderMain(); });
    document.getElementById('menu_challenges').addEventListener('click', function () { _renderChallenges(); });
    document.getElementById('menu_history').addEventListener('click', _renderHistory);
    document.getElementById('menu_credits').addEventListener('click', _renderCredits);
    document.getElementById('menu_credits_contact').addEventListener('click', function () { visitLinkedIn(); });
    document.getElementById('menu_credits_share').addEventListener('click', function () {
      window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent('https://igpenguin.github.io/stay-dead'));
    });
    document.getElementById('menu_credits_review').addEventListener('click', function () { redirectToFeedback(); });
    document.getElementById('menu_credits_back').addEventListener('click', function () { _renderMain(); });
  }

  // ── Public init ────────────────────────────────────────────────────────────

  function init() {
    document.getElementById('menu_version').innerHTML = versionCode;
    _bindButtons();
    show();
  }

  function showMemories() {
    document.getElementById('id_menu').style.display = 'flex';
    document.getElementById('id_game').style.display = 'none';
    _renderChallenges(true);
    _animateLogo();
  }

  return { init: init, show: show, hide: hide, showMemories: showMemories };
})();
