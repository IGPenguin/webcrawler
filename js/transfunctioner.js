function logCheatUse(message) {
  playerEmoji = '⚠️';
  cheatedThisRun = true;
  if (typeof TelemetryManager !== 'undefined') TelemetryManager.send('cheat_used', message);
  AchievementManager.check('use_cheat');
  logAction("✏️ ▸ ⚠️ <text style='color:" + colorSoftRed + ";'><b>Cheat used: " + message + "</b></text>");
  AchievementManager.queueToast({ emoji: '⚠️', desc: "Cheat used: "+message, color: colorSoftRed }, 'Reckonings disabled for the current character.');
  redraw();
}

// Returns true if a cheat keyword was detected and applied
function _applyCheatName(name) {
  try { var nameNumber = parseInt(name.match(/\d+/)[0]); } catch(e) { var nameNumber = NaN; }
  var cheatAmount = 3;

  if (name.includes("Dirty Cheater")) {
    if (!isNaN(nameNumber) && nameNumber > 0) cheatAmount = nameNumber;
    playerHpMax = cheatAmount; playerAtk = cheatAmount; playerStaMax = cheatAmount;
    playerMgkMax = cheatAmount; playerLck = cheatAmount; playerInt = cheatAmount;
    playerHp = playerHpMax; playerSta = playerStaMax; playerMgk = playerMgkMax;
    logCheatUse("Changed stats ➔  " + cheatAmount);
    return true;
  }

  if (name.includes("Lucky Number")) {
    cheatAmount = 7;
    if (!isNaN(nameNumber) && nameNumber > 0) cheatAmount = nameNumber;
    if (name.includes("-")) cheatAmount=(-cheatAmount)

    playerLck = cheatAmount;
    logCheatUse("Changed luck ➔  " + cheatAmount +" 🍀");
    return true;
  }

  if (name.includes("Albert Einstein")) {
    cheatAmount = 9;
    if (!isNaN(nameNumber) && nameNumber > 0) cheatAmount = nameNumber;
    if (name.includes("-")) cheatAmount=(-cheatAmount)

    playerInt = cheatAmount;
    logCheatUse("Changed brains ➔  " + cheatAmount +" 🧠");
    return true;
  }

  if (name.includes("Easy Lover")) {
    cheatAmount = 10;
    if (!isNaN(nameNumber) && nameNumber > 0) cheatAmount = nameNumber;
    if (name.includes("-")) cheatAmount=(-cheatAmount)

    playerLove = cheatAmount;
    logCheatUse("Changed love ➔  " + cheatAmount +" 💖");
    return true;
  }

  if (name.includes("Karma Chameleon")) {
    cheatAmount = 10;
    if (!isNaN(nameNumber) && nameNumber > 0) cheatAmount = nameNumber;
    if (name.includes("-")) cheatAmount=(-cheatAmount)
      
    playerKarma = cheatAmount;
    logCheatUse("Changed karma ➔  " + cheatAmount +" 🎭");
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
    var baits=chooseFrom(validBaits) + chooseFrom(validBaits) + chooseFrom(validBaits)
    playerLootString += baits;
    logCheatUse("Get fishing baits "+baits);
    return true;
  }

  if (name.includes("Origin Genesis")) {
    AchievementManager.check('boss_kill');
    logCheatUse("Force-unlocked Origins.");
    return true;
  }

  if (name.includes("Not Fragile")) {
    try { localStorage.setItem('sd_picker_override', 'true'); } catch(e) {}
    AchievementManager.check('game_win');
    logCheatUse("Force-unlocked Hardcore.");
    return true;
  }

  if (name.includes("Bonafide Hustler")) {
    var XPforLevel=playerXPThreshold;
    playerGainXP(1,parseInt(XPforLevel),"");
    logCheatUse("Added "+XPforLevel+" XP for level up.");
    return true;
  }

  if (name.includes("Total Recall")) {
    AchievementManager.unlockAll();
    logCheatUse("Unlocked ALL memories!");
    return true;
  }

  if (name.includes("Star Gate")) {
    AchievementManager.check('gate_fairyland');
    logCheatUse("Force-unlocked the Arch!");
    return true;
  }

  return false;
}
