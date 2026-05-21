//Encounters
function getRandomFish(forcedLootIndex){ //TODO refactor into encounters.csv (in the next life)
  toggleUIElement(areaUIElement,1);
  animateUIElement(areaUIElement,"animate__bounce","1.2");
  animateUIElement(cardUIElement,"animate__bounceInUp","1.2");
  isFishing=true;
  previousArea = areaName;
  adventureEncounterCount+=1;

  lastEncounterIndex = encounterIndex-1;
  lootEncounterIndex = (forcedLootIndex !== undefined) ? forcedLootIndex : getWeightedLootIndex(playerLck, playerKarma);
  markAsSeenFishing(lootEncounterIndex);
  var _savedRested = playerRested;
  encounterRenew();
  playerRested = _savedRested;
  return true;
}

function nextEncounter(animateArea=true, skipAreaTransition=false){ //Note: Even generator encounters go through here :)
  // Kill ending: intercept when leaving the boss fight — play cutscene before Stack Overflow
  if (isKillEnding) {
    isKillEnding = false;
    playEndingCutscene(ENDING_FRAMES['button_attack'], function() { _doGameEnd('win_kill'); });
    return;
  }

  fishingRested = false; // leaving this encounter — reset fishing sleep limit
  encounterCount++;
  if (!enemyType.includes("Generator")) { //Hacky hacky hack and mess on top of it
    previousArea = areaName;
    markAsSeen(enemyName);
    previousEnemyType = enemyType;
  }

  if (procAbilityChance("🥻",5)){
    var philosopherThoughts = ["area:"+areaName,"emoji:💭","name:Deep Thought","type:Prop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Epiphany","desc:Stopped to think about the universe:<br>n/a","message:","achiev:none"]
    linesStory.splice(encounterIndex+1,0,philosopherThoughts);
    logAction("🥻 ▸ <b>💭 Deep Thought</b> came on your mind.")
  }

  encounterIndex = getNextEncounterIndex();

  encounterRenew();

  // Peek at the area of the encounter about to be loaded so we can fade
  // BEFORE loading rather than after (gives a clean black-screen transition).
  var _peekLine = linesStory[encounterIndex] ? String(linesStory[encounterIndex]) : '';
  var _peekArea = _peekLine.split(",")[0].split(":")[1] || '';
  var _isAreaChange = previousArea !== undefined
                   && previousArea !== _peekArea
                   && _peekArea !== "Eternal Realm"
                   && !enemyType.includes("Boss"); // boss has its own curtain already

  if (_isAreaChange) playerAreaSleepCount = 0;

  if (_isAreaChange && !skipAreaTransition) {
    preloadBackground(_peekArea);
    var _areaHtml = "<p style=\"color:"+colorWhite+";letter-spacing: 1.6px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:40px;\">"
                  + _peekArea
                  + "</p><p style=\"font-size:20px;margin-top:-44px;z-index:-100;position:relative;\">____________________________________</p>";
    transitionArea(_areaHtml, function () {
      loadEncounter(encounterIndex);
      if (levelUpSavedCorpse !== null && enemyType !== "Upgrade") restoreCorpseAfterLevelUp();
      if (animateArea) {
        toggleUIElement(areaUIElement,1);
        animateUIElement(areaUIElement,"animate__flipInX","1.2");
      }
      animateUIElement(buttonsContainer,"animate__fadeIn","1.2");
      if (!areaName.includes("Fading") && !areaName.includes("Eternal") && !areaName.includes("Depths") && !adventureLog.includes("Arrived to: <b>"+areaName+"</b>")) {
        logAction("💭 ▸ 👣 Arrived to: <b>"+areaName+"</b>");
        AchievementManager.check('discover_area', areaName);
      }
      redraw();
      startEnemyEmojiPulse();
      _fireRemembranceFade();
    }, function () {
      setBackground(areaName); // called right before curtain fades out — guaranteed black
    });
    return;
  }

  if (animateArea) {
    toggleUIElement(areaUIElement,1);
    animateUIElement(areaUIElement,"animate__flipInX","1.2");
  }
  animateUIElement(buttonsContainer,"animate__fadeIn","1.2");

  loadEncounter(encounterIndex);
  if (levelUpSavedCorpse !== null && enemyType !== "Upgrade") restoreCorpseAfterLevelUp();

  // Boss → new area: boss curtain handles bg swap via setBackground(areaName) while black
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm")){
    playerAreaSleepCount = 0;
    if ((!areaName.includes("Fading")) && (!areaName.includes("Eternal")) && (!areaName.includes("Depths")) && (!adventureLog.includes("Arrived to: <b>"+areaName+"</b>"))) {
      logAction("💭 ▸ 👣 Arrived to: <b>"+areaName+"</b>");
      AchievementManager.check('discover_area', areaName);
    }
  }
  animateUIElement(cardUIElement,"animate__fadeIn","1.2");
  redraw();
  startEnemyEmojiPulse();
  _fireRemembranceFade();
}

function _fireRemembranceFade() {
  if (!enemyTeam) return;
  if (enemyType === "Memory") {
    setTimeout(function() { curtainFadeInAndOut(getMeetingPlaceFade(), 3); }, 300);
  } else if (enemyTeam.includes("Remembrance") || enemyTeam.includes("Piece of History")) {
    setTimeout(function() { curtainFadeInAndOut(getWeddingInvitationFade(), 3); }, 300);
  } else if (enemyTeam.includes("Lover's Memento")) {
    setTimeout(function() { curtainFadeInAndOut(getLoversMementoFade(), 3); }, 300);
  }
}

function animateFlipNextEncounter(){
  var animationHandler = function(e){
    if (e.target !== cardUIElement) return; // ignore bubbled animationend from child elements
    if (e.animationName !== 'flipOutY') return; // ignore other animations completing on the card
    nextEncounter();
    registerClickListeners();
    cardUIElement.removeEventListener("animationend",animationHandler);
  }
  cardUIElement.removeEventListener("animationend",animationHandler);

  animateUIElement(areaUIElement,"animate__flipOutX","1.2");
  animateUIElement(cardUIElement,"animate__flipOutY","1.2");

  removeClickListeners();

  cardUIElement.addEventListener('animationend',animationHandler);
}

function gameOver(silent=false){
  AchievementManager.check('death');
  if (_isRival) AchievementManager.check('rival_killed_by');
  if (enemyType && enemyType.includes('Trap')) AchievementManager.check('death_trap');
  if (enemyType && (enemyType === 'Consumable' || enemyType === 'Consumable-Container')) AchievementManager.check('death_sleep');
  //Random death messages
  var deathMsg=["Your life has sliped into silence.","The last breath of life has faded.","You have ran out of blood.","Your adventure has ended.","Your life has ended, shadows remain.","Your life has withered away.","Your fate has been sealed forever.","The end has come, the darkness awaits.","Silence has taken the hold.","Your journey has ended here."]
  deathMsg=chooseFrom(deathMsg)

  //Reset progress to death encounter
  if ((enemyMsg=="")||(enemyType=="Pet")||(enemyType=="Altar")||(enemyType.includes("Container")||enemyType=="Prop"||enemyType=="Consumable")) enemyMsg=deathMsg;
  if (enemyTeam.includes("Lover's Memento" || enemyTeam.includes("Piece of History"))) enemyMsg="Killed by a severe heartbreak.";
  if (_isRival) enemyMsg = 'Slayed by ' + enemyName + '.';
  if (!silent) {
    if (_isRival) {
      logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 <text style='color:"+colorRed+";'>"+enemyMsg+"</text>");
    } else {
      logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 "+enemyMsg);
    }
  }
  adventureEndTime=getTime();
  adventureEndReason="\nKilled by: "+enemyEmoji+" "+enemyName;
  runLogAdd("run_end", {outcome: _isRival ? "rival_death" : "death", killedBy: enemyName, killedByEmoji: enemyEmoji, area: areaName, time: adventureEndTime});
  downloadRunLog();
  var _deathEndType = _isRival ? 'rival_death' : 'death';
  var _deathPayload = ScoreManager.buildPayload(_deathEndType);
  SaveManager.saveSession({
    date: adventureStartTime,
    playerName: playerName,
    level: playerLevel,
    kills: playerKills,
    area: areaName,
    causeOfDeath: _isRival ? ('👾 ' + enemyName + ' [Invader]') : (enemyEmoji + ' ' + enemyName),
    deathMessage: (enemyEmoji ? enemyEmoji + ' ' : '') + (enemyMsg || ''),
    outcome: _deathEndType,
    actionLog: adventureLog,
    playerHpMax: playerHpMax,
    playerStaMax: playerStaMax,
    playerAtk: playerAtk,
    playerMgkMax: playerMgkMax,
    playerLootString: String(playerLootString),
    playerPartyString: String(playerPartyString),
    sessionAchievements: AchievementManager.getSessionUnlocked(),
    score:          _deathPayload.score,
    endType:        _deathEndType,
    ghostLink:      ScoreManager.encodeGhostLink(_deathPayload),
    playerOriginName: playerOriginName || 'None',
    encounterCount: encounterCount || 0,
    difficulty:     _deathPayload.difficulty,
    playtime:       _deathPayload.playtime
  });
  lastEncounterIndex = encounterIndex; //Save death position for reincarnation
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  playerSta=0; //You are just tired when dead :)
  playerMgk=0;

  removeGatewayEffects();
  var _curtainDetail = _isRival
    ? ('<p style="font-size:20px; color:' + colorRed + ';">' + enemyMsg + '</p>')
    : ('<p style="font-size:20px;"' + decorateStatusText("", enemyMsg, colorWhite));
  curtainFadeInAndOut("<p style=\"color:"+colorRed+";letter-spacing: 1.8px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:52px;line-height:20px;\">You died!</p>" + _curtainDetail, 3, function() { registerClickListeners(300); }, function() { ScoreManager.submitOrPrompt(_deathPayload); });
  animateUIElement(emojiWrapperUIElement,"animate__flipInY","1.2");
  nextEncounter();
  // linesStory intentionally NOT rebuilt here — reincarnation needs the index to stay valid.
  // processStoryData is called by startGame() on a fresh new game instead.
}

var _ENDING_TYPES = {
  button_attack:  'win_kill',
  button_roll:    'win_walk',
  button_block:   'win_guard',
  button_grab:    'win_embrace',
  button_sleep:   'win_sleep',
  button_speak:   'win_speak',
  button_cast:    'win_free',
  button_pray:    'win_pray',
  button_curse:   'win_curse'
};

// ENDING_FRAMES lives in string-generator.js

function startBrideDialogue() {
  var poem  = getBrideDyingByLove().replace(/<\/?i>/g, '');
  var parts = poem.split('<br>');
  var line1 = (parts[0] || '').trim();
  var line2 = (parts[1] || '').trim();
  var fadeHtml =
    '<p style="letter-spacing:1.8px;-webkit-text-stroke:6.5px black;paint-order:stroke fill;line-height:1.2;margin:0 0 8px;"><i>' + line1 +"<br>"+ line2 + '</i></p>'
  curtainFadeInAndOut(fadeHtml, 3.5, function() {
    adjustEncounterButtons();
    registerClickListeners(300);
    redraw();
  });
}

function resolveEnding(button) {
  isEndingState = false;
  removeClickListeners();

  if (button === 'button_attack') {
    logAction("🔪 ▸ 👰🏻‍♀️ <text style=color:" + colorRed + ";>She freed from your grasp full of anger.</text>");
    var brideBoss = getRandomEncounter(
      ["Boss-Standard","Boss-Swift","Boss-Demon","Boss-Heavy","Boss-Toxic","Boss-Undead"],
      ["Forgotten Love"], "Shrouded Necropolis"
    );
    pushEncounter(brideBoss, 1);
    nextEncounter(); // loads the boss; isKillEnding set AFTER so the intercept fires on exit
    displayEnemyCannotEffect();
    isKillEnding = true;
    return;
  }

  var frames = ENDING_FRAMES[button];
  var _endType = _ENDING_TYPES[button] || 'win';
  playEndingCutscene(frames, function() {
    _doGameEnd(_endType);
  });
}

function gameEnd() {
  _doGameEnd();
}

function _doGameEnd(endType) {
  endType = endType || 'win';
  AchievementManager.check('game_win');
  if (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.label === 'Hardcore') {
    AchievementManager.check('hardcore_win');
  }
  var winMessage="👤 ▸ 👑 You finished the adventure!";
  logAction(winMessage);
  adventureEndTime=getTime();
  runLogAdd("run_end", {outcome: endType, area: areaName, time: adventureEndTime});
  downloadRunLog();
  var _winPayload = ScoreManager.buildPayload(endType);
  SaveManager.saveSession({
    date: adventureStartTime,
    playerName: playerName,
    level: playerLevel,
    kills: playerKills,
    area: areaName,
    causeOfDeath: ScoreManager.getEndingLabel(endType),
    outcome: endType,
    actionLog: adventureLog,
    playerHpMax: playerHpMax,
    playerStaMax: playerStaMax,
    playerAtk: playerAtk,
    playerMgkMax: playerMgkMax,
    playerLootString: String(playerLootString),
    playerPartyString: String(playerPartyString),
    sessionAchievements: AchievementManager.getSessionUnlocked(),
    score:          _winPayload.score,
    endType:        endType,
    ghostLink:      ScoreManager.encodeGhostLink(_winPayload),
    playerOriginName: playerOriginName || '',
    encounterCount: encounterCount || 0,
    difficulty:     _winPayload.difficulty,
    playtime:       _winPayload.playtime
  });
  playerWonThisRun = true;
  removeGatewayEffects();
  var _wp = _winPayload;
  setTimeout(function() {
    curtainFadeInAndOut('', 2, function() { registerClickListeners(300); }, function() { ScoreManager.submitOrPrompt(_wp); });
    if (encounterIndex + 1 < linesStory.length - 1) nextEncounter(true, true);
  }, 50);
}
