encounterRenew();
function encounterRenew(){
  playerRested=false;
  playerCooked=false;

  enemyStaLost = 0;
  enemyHpLost = 0;
  enemyAtkBonus = 0;
  enemyIntBonus = 0;
  enemyMgkLost = 0;
  enemyDef = 0;
  enemyBossType = "";
  enemyItemSlot = null;
  enemyCursed=false;
  encounterUsed=false;
  bubblesUsed = false;
  currentProphercy = getGameTip();
  enemyEmojiScaleX = chooseFrom(['scaleX(-1)','scaleX(1)']);

  totalBonus=0;
  totalMalus=0;

  corpseState="";
  corpseSnapshot=null;
  corpseHasLoot=false;
  corpseLoot=null;
  clearPersistentEnemyEffect();
}

//Load or generate encounter
function loadEncounter(index, fileLines = linesStory){
  encounterIndex = index;
  var row = fileLines[index];

  //Encounter data initialization, details in encounters.csv
  areaName = String(row[0].split(":").slice(1).join(":"));
  if (fileLines!=linesStory) areaName = previousArea
  enemyEmoji = String(row[1].split(":").slice(1).join(":"));
  enemyName = String(row[2].split(":").slice(1).join(":"));
  if (enemyName.includes("You are dead!")) enemyName="<text style=color:"+colorRed+";>"+enemyName+"</text>";
  enemyType = String(row[3].split(":").slice(1).join(":"));
  if (enemyType.includes("Boss")) {
    enemyBossType = enemyType; //I'll end up in hell for these hacks
    if (isNaN(savedCoins)) savedCoins=0;
    //enemyName="<text style=color:"+colorRed+";>"+enemyName+"</text>";
  }
  if (enemyType.startsWith("Item-")) {
    enemyItemSlot = enemyType.slice(5).toLowerCase(); // "Item-Head" → "head"
    enemyType = "Item";
  }
  if (enemyType.includes("Generator")) {
    var number = enemyType.match(/\d+$/);
    //console.log("Gen-type:"+number);
    if (number) number = parseInt(number[0],10);

    generateNextEncounters(number);
    adventureEncounterCount-- //Remove the generator from the counter
    nextEncounter();
    return;
  }

  //Handle container depth (for skipping it)
  if (enemyType.includes("Container")) {
    var number = enemyType.match(/\d+$/);
    if (number) enemyContainerNumber = parseInt(number[0],10);
  }

  enemyHp = String(row[4].split(":")[1]);
  enemyAtk = parseInt(row[5].split(":")[1]);
  enemySta = String(row[6].split(":")[1]);
  enemyLck = String(row[7].split(":")[1]);
  enemyInt = String(row[8].split(":")[1]);
  enemyMgk = String(row[9].split(":")[1]);
  enemyDef = String(row[10].split(":")[1]);

  //Calculate total bonus/malus
  var effectArray = [enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef];
  var effectArrayBonus=effectArray.filter(function(x){ return x > 0 });
  var effectArrayMalus=effectArray.filter(function(x){ return x < 0 });
  totalBonus=effectArrayBonus.reduce((partialSum, a) => partialSum + a, "");
  totalMalus=effectArrayMalus.reduce((partialSum, a) => partialSum + a, "");
  if (totalMalus=="") totalMalus=0;
  if (totalBonus=="") totalBonus=0;
  //console.log("bonus: "+totalBonus+" malus: "+totalMalus);

  enemyTeam = RarityManager.stripTagFromNote(String(row[11].split(":").slice(1).join(":")));
  enemyDesc = String(row[12].split(":").slice(1).join(":"));
  if (enemyDesc.includes("po/em")) enemyDesc = enemyTeam.includes("Piece of History") ? getWeddingInvitationPoem() : getPoem();
  if (enemyTeam.includes("Prophe") || enemyTeam.includes("Knowledge") || enemyTeam.includes("Epiphany") || enemyTeam.includes("Note")) {
    enemyDesc=enemyDesc.replaceAll("n/a","");
    enemyDesc+="<i>"+getGameTip()+"</i>";
  }
  if (enemyType.includes("Friend")){
    enemyQuestItems=enemyType.replace("Friend","").split('\\');
    if (String(enemyQuestItems).length>0){
      var heldItem=checkPlayerHasItem(enemyQuestItems);
      if (heldItem==""){
        enemyDesc="If you see me again, bring me <b>something good</b>.<br>Perhaps this? "+String(enemyQuestItems).replaceAll(","," ");
      }
      enemyDesc=enemyDesc.replaceAll("n/a",heldItem);
    }

    enemyType="Friend";
  }
  if (enemyName.includes("Undertaker")) {
    enemyDesc=getShopMessage();
    enemyDesc=enemyDesc+"<i><b>Unspent Drachmae: "+parseInt(savedCoins-spentCoins)+"</b></i> 🪙";
  }
  
  //Disabled for now, there's very limited number of these now
  //if (enemyEmoji=="🪙" && !enemyName.includes("Lucky")) enemyDesc=enemyDesc+"<i><b>Total Drachmae: "+parseInt(savedCoins)+"</b></i> 🪙";

  enemyMsg = String(row[13].split(":").slice(1).join(":"));
  var _achievField = row[14] ? String(row[14].split(":").slice(1).join(":")).trim() : 'none';
  enemyFamiliar = (_achievField && _achievField !== 'none');

  switch (enemyType){
    case "Small":
    case "Standard":
    case "Swift":
    case "Heavy":
    case "Recruit":
    case "Pet":
    case "Spirit":
    case "Demon":
    case "Undead":
    case "Small":
    case "Stingy":
    case "Toxic":
      if ((enemyAtk+enemyAtkBonus>0)||enemyMgk>0) {
        logAction("💢 ▸ "+enemyEmoji+" Engaged an enemy: <b>"+enemyName+"</b>")
        if (playerLootString.includes("📌")) {
          enemyHit(1,false,false,true)
          logAction("📌 ▸ "+enemyEmoji+" Inflicted the <b>☠️ Ancient Voodoo</b> -1 💔")
        }
      } else {
        logAction("👁️ ▸ "+enemyEmoji+" Spotted a critter: <b>"+enemyName+"</b>")
      }
      break;
    case "Item":
      if (enemyTeam.includes("Artifact")){
        logAction("🟠 ▸ "+enemyEmoji+"<text style=color:"+colorOrange+";>" + " Unveiled artifact: <b>"+enemyName+"</b></text>")
      } else {
        if (enemyTeam.includes("Possesion")) {
          logAction("⭐️ ▸ "+enemyEmoji+" Found a possesion: <b>"+enemyName+"</b>")
        } else {
         if (!enemyTeam.includes("Lover's Memento") && !enemyTeam.includes("Piece of History")) {
           if (enemyName=="Ethereal Drachma"){
             logAction("🌀 ▸ "+enemyEmoji+"<text style=color:"+colorLightShadeBlue+";>" + " Shape spawned: <b>"+enemyName+"</b></text>")
           } else if (enemyEmoji== "🪙" || enemyEmoji=="💰") {
             if (!enemyName.includes("Lucky")) logAction("🌀 ▸ "+enemyEmoji+"<text style=color:"+colorLightShadeBlue+";>" + " Found fortune: <b>"+enemyName+"</b></text>")
           } else {
              logAction("🎉 ▸ "+enemyEmoji+" Found some loot: <b>"+enemyName+"</b>")
           }
         } else {
          logAction("🫀 ▸ "+enemyEmoji+" Found a clue: <b>"+enemyName+"</b>")
         }
        }
      }
      // If this is a slot item and the slot is occupied, show swap diff
      if (enemyItemSlot) {
        var _occ = getPlayerSlot(enemyItemSlot);
        if (_occ) {
          logAction("⁉️ ▸ "+_occ.emoji+" <text style=color:"+colorOrange+";><b>Slot full, swap?</b></text> "+formatSlotDiff(_occ));
        }
      }
      break;
    case "Consumable":
      if (enemyTeam.includes("Artifact")){
        logAction("🟠 ▸ "+enemyEmoji+"<text style=color:"+colorRed+";>" +" Unveiled artifact: <b>"+enemyName+"</b></text>")
      } else {
        logAction("👁️ ▸ "+enemyEmoji+" Found a snack: <b>"+enemyName+"</b>")
      }
      break;
    case "Trap":
    case "Trap-Big":
    case "Trap-Obstacle":
    case "Trap-Attack":
    case "Trap-Roll":
    case "Trap-Sleep":
      if (totalBonus==0 && totalMalus==0) logAction("⚫️ ▸ "+enemyEmoji+" Spotted obstacle: <b>"+enemyName+"</b>")
      if (totalBonus>0 && totalMalus<0) logAction("🎀 ▸ "+enemyEmoji+" Noticed something: <b>"+enemyName+"</b>")
      if (totalMalus<0) logAction("⁉️ ▸ "+enemyEmoji+" Noticed a hazard: <b>"+enemyName+"</b>")
      break;
    case "Curse":
      logAction("⁉️ ▸ "+enemyEmoji+" Noticed something: <b>"+enemyName+"</b>")
      break;
    case "Container":
      if (enemyHp<0 || enemyAtk<0 || enemySta<0 || enemyLck<0 || enemyInt<0 || enemyMgk<0) logAction("⁉️ ▸ "+enemyEmoji+" Noticed hazard: <b>"+enemyName+"</b>")
      break;
    case "Altar":
      logAction("👁️ ▸ "+enemyEmoji+" Noticed something: <b>"+enemyName+"</b>")
      break;
    case "Memory":
      logAction("👁️ ▸ "+enemyEmoji+" Noticed something: <b>"+enemyName+"</b>")
      break;
    case "Friend":
      if (!enemyName.includes("Bride")) logAction("👁️ ▸ "+enemyEmoji+" Met a creature: <b>"+enemyName+"</b>")
      break;
    case "Shop": //I just did HAAAACKKKK, and it feelt sooo WRONG (really, needs fixing... later)
      if (!adventureLog.includes("Silhouette appeared:")) logAction("🌀 ▸ "+enemyEmoji+"<text style=color:"+colorLightShadeBlue+";>" + " Silhouette appeared: <b>"+enemyName+"</b></text>")
      if (savedCoins-spentCoins==0) logAction(enemyEmoji+" ▸ 💬 You are broke, I guess that's it for now...")
      break;
    default:
      if (enemyType.includes("Boss") && !adventureLog.includes("Bride") && !adventureLog.includes("Engaged a boss: <b>"+enemyName+"</b>")) {
        logAction("💢 ▸ "+enemyEmoji+" <text style=color:"+colorRed+";>"+"Engaged a boss: <b>"+enemyName+"</b></text>")
        if (playerLootString.includes("📌") && ((enemyAtk+enemyAtkBonus)>0)) {
          enemyHit(1,false,false,true)
          logAction("📌 ▸ "+enemyEmoji+" Inflicted the <b>☠️ Ancient Voodoo</b> -1 💔")
        }
      }
      break;
  }

  // ── Encounter telemetry ───────────────────────────────────────────────────
  if (typeof TelemetryManager !== 'undefined' && TELEMETRY_DETAILS_ENABLED) {
    var _statStr = [enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef].join(';');
    var _nameStr = enemyEmoji + ' ' + enemyName;
    var _genSrc  = (lastGeneratorName && lastGeneratorName !== 'none') ? ('gen:' + lastGeneratorName) : 'story';

    if (enemyType === 'Item' || enemyType === 'Consumable') {
      var _lootSrc = isFishing ? 'fishing' : (TelemetryManager.popLootSource() || _genSrc);
      TelemetryManager.send('loot', _lootSrc + '|' + enemyType + '|' + _nameStr + '|' + _statStr);
    } else {
      var _combatTypes = ['Small','Standard','Swift','Heavy','Recruit','Pet','Spirit','Demon','Undead','Stingy','Toxic'];
      if (_combatTypes.indexOf(enemyType) !== -1 || enemyType.includes('Boss')) {
        var _enemySrc = isFishing ? 'fishing' : _genSrc;
        TelemetryManager.send('enemy', _enemySrc + '|' + enemyType + '|' + _nameStr + '|' + _statStr);
      }
    }
  }

  //Specific encounter starts
  if (enemyType=="Dream" && (!enemyName.includes("Waking Moment")) && (!enemyName.includes("Terrific Realization")) && (!enemyName.includes("Horrific Realization"))) playerSta=0;

  //Decrase final bass attack/mana based on player love
  if (enemyName.includes("Bride") && playerLove>2) {
    dbg("playerlove: "+playerLove);

    //Meh, I just wanna consider this game finished now
    enemyMgk-=playerLove;
    if (enemyMgk<0) enemyMgk=0;

    if (enemyAtk<=playerLove) {
      if (enemyAtk>0) {
        logAction("♥️ ▸ "+enemyEmoji+" <text style=color:"+colorGold+";>Your true love has calmed her down.</text>")
        enemyAtkBonus=-enemyAtk
        enemyName="Merciful Bride"
        enemyMsg="There's still hope for this to end well."
        enemyInt=0;
        enemyType="Boss-Standard"
      }
      if (enemyName.includes("Defeated Bride")) {
        encounterIndex++; //Skip second phase
        enemyMsg="I'm glad that you didn't forget."
      }
    } else if (playerLove>0){
      enemyAtkBonus-=playerLove;
      logAction("♥️ ▸ "+enemyEmoji+" She is showing some signs of mercy -"+playerLove+" ⚔️")
    }
  }
  if (enemyTeam.includes("Lost Possesion")) { //Found quest item, spawn friend who wants it
    dbg(enemyEmoji)
    var randomSlot=chooseFrom([3,4,5])
    pushEncounter(getRandomEncounter(["Friend"],[enemyEmoji]),randomSlot);
  }

  if (playerHas("👺") || playerHas("😈")) {
    if (enemyType=="Demon") {
      enemyAtkBonus=(-enemyAtk);
      enemyMgkLost=(enemyMgk);
    }
  }
  if (playerHas("🐴")) { //Prey appearance, enemies passive
    enemyAtkBonus-=enemyAtk;
    enemyMgkLost=enemyMgk;
  }
  if (playerHas("💀") || playerHas("🧟‍♂️")) {
    if (enemyType=="Undead") {
      enemyAtkBonus=(-enemyAtk);
      enemyMgkLost=(enemyMgk);
    }
  }
  if (playerHas("👻")) {
    if (enemyType=="Spirit") {
      enemyAtkBonus=(-enemyAtk);
      enemyMgkLost=(enemyMgk);
    }
  }
  if (playerHas("🦧")) {
    if (enemyType=="Small") {
      enemyAtkBonus=(-enemyAtk);
    }
  }
  runLogAdd("encounter", {
    area: areaName, emoji: enemyEmoji, name: enemyName, type: enemyType,
    hp: enemyHp, atk: enemyAtk, sta: enemySta, lck: enemyLck,
    int: enemyInt, mgk: enemyMgk, def: enemyDef, note: enemyTeam
  });

  if (enemyName === "Gloomy Gateway" && !gatewayPassed) {
    gatewayPassed = true;
    setTimeout(applyGatewayEffects, 600);
  }
  if (enemyName === "Dying Bride") {
    isEndingState = true;
    brideDialogueActive = true;
    setTimeout(startBrideDialogue, 700);
  }
}

function generateRandomItem(item=""){
  var randomItem=getWeightedEncounter(["Item"],[],"ALL",["Artifact","Lover's Memento","Piece of History","Lost Possesion"]);
  if (item=="Artifact") randomItem=getWeightedEncounter(["Item"],["Artifact"],"ALL",["Lover's Memento","Piece of History","Lost Possesion"]);
  return randomItem;
}

function generateRandomItemByTier(tier){
  return getWeightedEncounterByTier(tier,["Item"],[],"ALL",["Artifact","Lover's Memento","Piece of History","Lost Possesion"]);
}

function drachmaeBuy(price=1,item="",skillSuccess=null){
  var availableCoins=(savedCoins-spentCoins)

  if (availableCoins>=price) {
    playerShopped=true;
    spentCoins+=price;
    AchievementManager.check('spend_coins', price);
    if (enemyDesc.includes("Unspent Drachmae")) {
      enemyDesc = enemyDesc.replace(/Unspent Drachmae: \d+/, "Unspent Drachmae: "+parseInt(savedCoins-spentCoins));
    }
    //DO NOT localStorage.setItem('coins', availableCoins); //Remove from local storage as well (coins do not endlessly add up)
    displayEnemyEffect("🪙");
    displayPlayerEffect("");

    var _tierMap = { ItemCommon: "Common", ItemUncommon: "Uncommon", ItemRare: "Rare" };
    var _forcedTier = _tierMap[item] || null;
    var _isItemBuy = (item=="Item" || item=="Artifact" || _forcedTier);
    if (_isItemBuy) {
      if (item=="Artifact") AchievementManager.check('buy_artifact');
      else AchievementManager.check('buy_item');
      displayPlayerGainedEffect();
      logPlayerAction(actionString,"Splendid choice, this ought to help");
      drachmaShop[0]="area:"+"Fading Wildlands";
      var genItem = _forcedTier ? generateRandomItemByTier(_forcedTier) : generateRandomItem(item=="Artifact" ? "Artifact" : "");
      genItem[0]="area:"+areaName;
      pushEncounter(genItem);
      nextEncounter();
      pushEncounter(drachmaShop);
    } else if (item=="Favor" || item=="Body") {
      var statPool = item=="Favor"
        ? [{ stat: "🍀", apply: function() { playerLck++; } },
           { stat: "🧠", apply: function() { playerInt++; } }]
        : [{ stat: "❤️", apply: function() { playerHp++; playerHpMax++; } },
           { stat: "🟢", apply: function() { playerSta++; playerStaMax++; } }];
      var picked = statPool[Math.floor(Math.random() * statPool.length)];
      picked.apply();
      displayPlayerGainedEffect();
      displayPlayerEffect(picked.stat);
      logPlayerAction(actionString, "Fate has shaped you to gain +1 "+picked.stat);
      redraw();
      return;
    } else if (item=="Gamble")  {
      if (skillSuccess === true){
        AchievementManager.check('gamble_win');
        displayPlayerGainedEffect();
        displayPlayerEffect("🍀");
        logPlayerAction(actionString,"<text style=color:"+colorDarkGreen+";>Lucky bastard, you actually won!</text>")
        drachmaPrize[0]="area:"+areaName;
        pushEncounter(drachmaPrize);
        nextEncounter();
      } else {
        AchievementManager.check('gamble_lose');
        logPlayerAction(actionString,"<text style=color:"+colorRed+";>Ooops... you lost the gamble!</text>")
        gamblingLost[0]="area:"+areaName;
        displayPlayerCannotEffect();
        displayPlayerEffect("❌");
        pushEncounter(gamblingLost);
        nextEncounter();
      }
      pushEncounter(drachmaShop);
      return;
    } else {
      AchievementManager.check('buy_level');
      displayPlayerGainedEffect();
      logPlayerAction(actionString,"Sure, grow stronger as you need");
      playerXP+=playerXPThreshold;
      playerRest(true);
      return;
    }
    return;
  } else {
    logAction("👤 ▸ ⁉️ "+"<text style=color:"+colorRed+";>You don't have enough 🪙 <b>Drachmae</b>!</text>")
    displayEnemyDodgeEffect();
    displayPlayerCannotEffect();
    return;
  }
}
