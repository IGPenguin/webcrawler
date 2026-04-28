function logCheatUse(message) {
  var currentEmoji = _getCurrentNameEmoji();
  var baseName = currentEmoji ? playerName.slice(currentEmoji.length + 1) : playerName;
  playerEmoji = '⚠️';
  playerName = '⚠️ ' + baseName;
  AchievementManager.check('use_cheat');
  logAction("✏️ ▸ ⚠️ <b>Cheat used: " + message + "</b>");
  redraw();
}

// Returns true if a cheat keyword was detected and applied
function _applyCheatName(name) {
  try { var nameNumber = parseInt(name.match(/\d+/)[0]); } catch(e) { var nameNumber = NaN; }
  var cheatAmount = 3;

  if (name.includes("Cheater")) {
    if (!isNaN(nameNumber) && nameNumber > 0) cheatAmount = nameNumber;
    playerHpMax = cheatAmount; playerAtk = cheatAmount; playerStaMax = cheatAmount;
    playerMgkMax = cheatAmount; playerLck = cheatAmount; playerInt = cheatAmount;
    playerHp = playerHpMax; playerSta = playerStaMax; playerMgk = playerMgkMax;
    logCheatUse("Changed Stats ➔  " + cheatAmount);
    return true;
  }
  if (name.includes("Mucho Dinero")) {
    savedCoins = 9; localStorage.setItem('coins', savedCoins);
    logCheatUse("Added Drachmae: +9 🪙");
    return true;
  }
  if (name.includes("Poco Dinero")) {
    savedCoins = 3; localStorage.setItem('coins', savedCoins);
    logCheatUse("Added Drachmae: +3 🪙");
    return true;
  }
  if (name.includes("Bay Goblin")) {
    playerLootString += chooseFrom(validBaits) + chooseFrom(validBaits) + chooseFrom(validBaits);
    logCheatUse("Added baits");
    return true;
  }
  if (name.includes("Genesis")) {
    AchievementManager.check('boss_kill');
    logCheatUse("Force-unlocked Origins.");
    return true;
  }
  if (name.includes("Cleaner")) {
    localStorage.removeItem('coins'); savedCoins = 0;
    logCheatUse("Force-wiped save data.");
    return true;
  }
  return false;
}
