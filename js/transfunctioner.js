function logCheatUse(message) {
  playerEmoji = '⚠️';
  cheatedThisRun = true;
  AchievementManager.check('use_cheat');
  logAction("✏️ ▸ ⚠️ <text style='color:" + colorSoftRed + ";'><b>Cheat used: " + message + "</b></text>");
  showAchievementToast({ emoji: '⚠️', desc: message, color: colorSoftRed }, 'Rankings disabled for your current run.', null);
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
    logCheatUse("Changed stats ➔  " + cheatAmount);
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
  if (name.includes("Fragile")) {
    try { localStorage.setItem('sd_picker_override', 'true'); } catch(e) {}
    AchievementManager.check('game_win');
    logCheatUse("Force-unlocked Hardcore.");
    return true;
  }
  return false;
}
