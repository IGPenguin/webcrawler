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
  fishingRested = false; // leaving this encounter — reset fishing sleep limit
  encounterCount++;
  if (!enemyType.includes("Generator")) { //Hacky hacky hack and mess on top of it
    previousArea = areaName;
    markAsSeen(enemyName);
    previousEnemyType = enemyType;
  }

  if (procAbilityChance("🥻",5)){
    var philosopherThoughts = ["area:"+areaName,"emoji:💭","name:Curious Thought","type:Prop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Epiphany","desc:Stopped to think about the universe.<br>n/a","message:","achiev:none"]
    linesStory.splice(encounterIndex+1,0,philosopherThoughts);
    logAction("🥻 ▸ <b>💭 Curious Thought</b> came on your mind.")
  }

  if (animateArea) {
    toggleUIElement(areaUIElement,1);
    animateUIElement(areaUIElement,"animate__flipInX","1.2");
  }
  animateUIElement(buttonsContainer,"animate__fadeIn","1.2");

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

  if (_isAreaChange && !skipAreaTransition) {
    var _areaHtml = "<p style=\"color:"+colorWhite+";letter-spacing: 1.6px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:40px;\">"
                  + _peekArea
                  + "</p><p style=\"font-size:20px;margin-top:-44px;z-index:-100;position:relative;\">____________________________________</p>";
    transitionArea(_areaHtml, function () {
      loadEncounter(encounterIndex);
      if (levelUpSavedCorpse !== null && enemyType !== "Upgrade") restoreCorpseAfterLevelUp();
      setBackground(areaName);
      if (!areaName.includes("Fading") && !areaName.includes("Eternal") && !areaName.includes("Depths") && !adventureLog.includes("Arrived to area: <b>"+areaName+"</b>")) {
        logAction("💭 ▸ 👣 Arrived to area: <b>"+areaName+"</b>");
        AchievementManager.check('discover_area', areaName);
      }
      animateUIElement(cardUIElement,"animate__fadeIn","1.2");
      redraw();
      startEnemyEmojiPulse();
    });
    return;
  }

  loadEncounter(encounterIndex);
  if (levelUpSavedCorpse !== null && enemyType !== "Upgrade") restoreCorpseAfterLevelUp();

  // Boss → new area: boss curtain handles bg swap via setBackground(areaName) while black
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm")){
    if ((!areaName.includes("Fading")) && (!areaName.includes("Eternal")) && (!areaName.includes("Depths")) && (!adventureLog.includes("Arrived to area: <b>"+areaName+"</b>"))) {
      logAction("💭 ▸ 👣 Arrived to area: <b>"+areaName+"</b>");
      AchievementManager.check('discover_area', areaName);
    }
  }
  animateUIElement(cardUIElement,"animate__fadeIn","1.2");
  redraw();
  startEnemyEmojiPulse();
}

function animateFlipNextEncounter(){
  var animationHandler = function(e){
    if (e.target !== cardUIElement) return; // ignore bubbled animationend from child elements
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
  if (enemyType && enemyType.includes('Trap')) AchievementManager.check('death_trap');
  if (enemyType && (enemyType === 'Consumable' || enemyType === 'Consumable-Container')) AchievementManager.check('death_sleep');
  //Random death messages
  var deathMsg=["Your life has sliped into silence.","The last breath of life has faded.","You have ran out of blood.","Your adventure has ended.","Your life has ended, shadows remain.","Your life has withered away.","Your fate has been sealed forever.","The end has come, the darkness awaits.","Silence has taken the hold.","Your journey has ended here."]
  deathMsg=chooseFrom(deathMsg)

  //Reset progress to death encounter
  if ((enemyMsg=="")||(enemyType=="Pet")||(enemyType=="Altar")||(enemyType.includes("Container")||enemyType=="Prop"||enemyType=="Consumable")) enemyMsg=deathMsg;
  if (enemyTeam.includes("Lover's Memento")) enemyMsg="Killed by a severe heartbreak.";
  if (!silent) logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 "+enemyMsg);
  adventureEndTime=getTime();
  adventureEndReason="\nKilled by: "+enemyEmoji+" "+enemyName;
  runLogAdd("run_end", {outcome: "death", killedBy: enemyName, killedByEmoji: enemyEmoji, area: areaName, time: adventureEndTime});
  downloadRunLog();
  var _deathPayload = ScoreManager.buildPayload('death');
  SaveManager.saveSession({
    date: adventureStartTime,
    playerName: playerName,
    level: playerLevel,
    kills: playerKills,
    area: areaName,
    causeOfDeath: enemyEmoji + ' ' + enemyName,
    outcome: 'death',
    actionLog: adventureLog,
    playerHpMax: playerHpMax,
    playerStaMax: playerStaMax,
    playerAtk: playerAtk,
    playerMgkMax: playerMgkMax,
    playerLootString: String(playerLootString),
    playerPartyString: String(playerPartyString),
    sessionAchievements: AchievementManager.getSessionUnlocked(),
    score:          _deathPayload.score,
    endType:        'death',
    ghostLink:      ScoreManager.encodeGhostLink(_deathPayload),
    playerOriginName: playerOriginName || 'None',
    encounterCount: encounterCount || 0,
    difficulty:     _deathPayload.difficulty,
    playtime:       _deathPayload.playtime
  });
  ScoreManager.submitOrPrompt(_deathPayload);
  lastEncounterIndex = encounterIndex; //Save death position for reincarnation
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  playerSta=0; //You are just tired when dead :)
  playerMgk=0;

  curtainFadeInAndOut("<p style=\"color:"+colorRed+";letter-spacing: 1.8px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:52px;line-height:20px;\">You died!</p><p style=\"font-size:20px;\""+decorateStatusText("",enemyMsg,colorWhite));
  animateUIElement(emojiWrapperUIElement,"animate__flipInY","1.2");
  nextEncounter();
  // linesStory intentionally NOT rebuilt here — reincarnation needs the index to stay valid.
  // processStoryData is called by startGame() on a fresh new game instead.
}

var _ENDING_FRAMES = {
  button_attack: [{emoji:'⚔️', text:'The deed is done.'}, {emoji:'🩸', text:'She finally rests in peace.'}, {emoji:'🖤', text:'And you walk on. Alone.'}],
  button_roll:   [{emoji:'💔', text:'You turn your back.'}, {emoji:'🥀', text:'The world slowly rots.'}, {emoji:'👰🏻‍♀️', text:'She still waits, always will.'}],
  button_block:  [{emoji:'🔰', text:'You stand your ground.'}, {emoji:'🗿', text:'Slowly turning to stone.'}, {emoji:'💞', text:'Your hearts bound forever.'}],
  button_grab:   [{emoji:'🫂', text:'You hold her close.'}, {emoji:'🌑', text:'The darkness takes you both.'}, {emoji:'🖤', text:'Together. At last.'}],
  button_sleep:  [{emoji:'💤', text:'You lie beside her.'}, {emoji:'🌿', text:'The ground grows still.'}, {emoji:'🤍', text:'Your hearts make no sound.'}],
  button_speak:  [{emoji:'❤️', text:'You say her name. Rosabel.'}, {emoji:'✨', text:'Something stirs inside.'}, {emoji:'💖', text:'She remembers who she was.'}],
  button_cast:   [{emoji:'❤️‍🩹', text:'You unravel the curse.'}, {emoji:'✨', text:'The magic tears it apart.'}, {emoji:'🪽', text:'She is finally free.'}],
  button_pray:   [{emoji:'🙏', text:'You beg for mercy.'}, {emoji:'🌩️', text:'Something hears your call.'}, {emoji:'🌪️', text:'The gods take her gently.'}],
  button_curse:  [{emoji:'💀', text:'You seal the pact.'}, {emoji:'🌑', text:'The darkness claims you both.'}, {emoji:'👹', text:'None of you deserve peace.'}]
};

function startBrideDialogue() {
  ['button_roll','button_block','button_grab','button_sleep',
   'button_speak','button_cast','button_pray','button_curse'].forEach(function(id) {
    document.getElementById(id).disabled = true;
  });

  var beat1 = playerLove >= 3
    ? "👰🏻‍♀️ ▸ 💬 She turns to face you. <i>\"I knew you would come.\"</i>"
    : "👰🏻‍♀️ ▸ 💬 She turns to face you. <i>\"You shouldn't have come.\"</i>";

  setTimeout(function() {
    if (!brideDialogueActive) return;
    logAction(beat1); redraw();

    setTimeout(function() {
      if (!brideDialogueActive) return;
      logAction("👰🏻‍♀️ ▸ 💬 " + getBridePoemByLove()); redraw();

      setTimeout(function() {
        if (!brideDialogueActive) return;
        var beat3 = playerKarma >= 2
          ? "😟 ▸ 💭 <i>You remember everything. There is still a chance.</i>"
          : "😟 ▸ 💭 <i>You remember everything. Some things cannot be undone.</i>";
        logAction(beat3);
        brideDialogueActive = false;

        ['button_roll','button_block','button_grab','button_sleep',
         'button_speak','button_cast','button_pray','button_curse'].forEach(function(id) {
          document.getElementById(id).disabled = false;
        });
        adjustEncounterButtons();
        redraw();
      }, 3500);
    }, 3500);
  }, 1500);
}

function resolveEnding(button) {
  isEndingState = false;
  brideDialogueActive = false;
  removeClickListeners();

  if (button === 'button_attack') {
    isKillEnding = true;
    logAction("🔪 ▸ 👰🏻‍♀️ <text style=color:" + colorRed + ";>The fight begins.</text>");
    var brideBoss = getRandomEncounter(
      ["Boss-Standard","Boss-Swift","Boss-Demon","Boss-Heavy","Boss-Toxic","Boss-Undead"],
      ["Forgotten Love"], "Shrouded Necropolis"
    );
    pushEncounter(brideBoss, 1);
    nextEncounter();
    return;
  }

  var frames = _ENDING_FRAMES[button];
  playEndingCutscene(frames, function() {
    _doGameEnd();
  });
}

function gameEnd() {
  if (isKillEnding) {
    isKillEnding = false;
    playEndingCutscene(_ENDING_FRAMES['button_attack'], function() {
      _doGameEnd();
    });
    return;
  }
  _doGameEnd();
}

function _doGameEnd() {
  AchievementManager.check('game_win');
  if (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.label === 'Hardcore') {
    AchievementManager.check('hardcore_win');
  }
  var winMessage="👤 ▸ 👑 You finished the adventure!";
  logAction(winMessage);
  adventureEndTime=getTime();
  runLogAdd("run_end", {outcome: "win", area: areaName, time: adventureEndTime});
  downloadRunLog();
  var _winPayload = ScoreManager.buildPayload('win');
  SaveManager.saveSession({
    date: adventureStartTime,
    playerName: playerName,
    level: playerLevel,
    kills: playerKills,
    area: areaName,
    causeOfDeath: '👑 Finished!',
    outcome: 'win',
    actionLog: adventureLog,
    playerHpMax: playerHpMax,
    playerStaMax: playerStaMax,
    playerAtk: playerAtk,
    playerMgkMax: playerMgkMax,
    playerLootString: String(playerLootString),
    playerPartyString: String(playerPartyString),
    sessionAchievements: AchievementManager.getSessionUnlocked(),
    score:          _winPayload.score,
    endType:        'win',
    ghostLink:      ScoreManager.encodeGhostLink(_winPayload),
    playerOriginName: playerOriginName || '',
    encounterCount: encounterCount || 0,
    difficulty:     _winPayload.difficulty,
    playtime:       _winPayload.playtime
  });
  ScoreManager.submitOrPrompt(_winPayload);

  SaveManager.clearGameState();
  resetSeenEncounters();
  processStoryData(storyData,false);
}
