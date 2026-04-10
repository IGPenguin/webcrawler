var SaveManager = (function () {
  var HISTORY_KEY = 'sessionHistory';
  var MAX_SESSIONS = 20;

  function hasContinue() {
    var coins = parseInt(localStorage.getItem('coins'));
    return !isNaN(coins) && coins > 0;
  }

  function saveSession(session) {
    var history = listSessionHistory();
    history.unshift(session);
    if (history.length > MAX_SESSIONS) history.length = MAX_SESSIONS;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.log('SaveManager: write failed', e);
    }
  }

  function listSessionHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  // Wipes coins and fishing loot — triggers fresh tutorial on next start
  function clearSave() {
    localStorage.removeItem('coins');
    localStorage.removeItem('seenLoot');
  }

  function clearAll() {
    clearSave();
    localStorage.removeItem(HISTORY_KEY);
  }

  return {
    hasContinue:        hasContinue,
    saveSession:        saveSession,
    listSessionHistory: listSessionHistory,
    clearSave:          clearSave,
    clearAll:           clearAll
  };
})();
