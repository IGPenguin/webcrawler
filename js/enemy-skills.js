//Enemy
function enemyRest(stamina){
  if (enemyHp - enemyHpLost > 0){
    if (document.getElementById('id_enemy_overlay').innerHTML!= "💢") displayEnemyEffect("💤")
    enemyStaLost-=stamina;
    if (enemyStaLost < 0) {
      enemyStaLost = 0;
    }
  }
}

function enemyStaminaChangeMessage(stamina,successMessage,failMessage){
  if (enemyStaLost < enemySta) {
    logPlayerAction(actionString,successMessage); //TODO: switch emojis around >> 🐅 > ⚔️
    //animateUIElement(enemyInfoUIElement,"animate__headShake","0.7");

    //Play attack animation
    displayEnemyAttackEffect();

    enemyStaLost -= stamina;
    if (enemyStaLost > enemySta) enemyStaLost = enemySta;
    return true;
  } else if (enemyHp - enemyHpLost > 0) { //Enemy rest if not dead
    logPlayerAction(actionString,failMessage);
    //animateUIElement(enemyInfoUIElement,"animate__pulse","0.4");

    //Animate enemy rest
    displayEnemyRestEffect();
    displayEnemyEffect("💤");

    enemyStaLost += stamina
    return false;
  } else { //Enemy dead
    return false;
  }
}

function enemyHit(damage,magicType=false,applyLuck=true,silent=false) {
  if (playerHas("🐴")){
    if (enemyHpLost==0) enemyAtkBonus+=1; //Revert mask effect, just the first time hit
  }

  animateUIElement(emojiWrapperUIElement,"animate__shakeX","0.5"); //Animate hitreact
  var hitMsg = "Hit them with an attack -"+damage+" 💔";

  if (magicType==true) {
    actionString=playerCastType; hitMsg="Scorched them with a spell -"+damage+" 💔";
  } else { //Melee
      actionString="⚔️";
  }

  displayEnemyEffect("💢");
  var critChance = Math.floor(Math.random() * luckInterval);
  if ( (critChance <= playerLck) && applyLuck){
    logAction("🍀 ▸ "+actionString+" Your strike was blessed with luck.");
    hitMsg="Attack hit them critically -"+(damage+2)+" 💔";
    displayPlayerEffect("🍀");
    damage+=2;
  }

  if (damage<=0) {
    hitMsg="Your attack had no effect! ❌";
    displayEnemyEffect("");
  }
  if (enemyDef>0 && !magicType) {
    hitMsg=hitMsg+" ("+enemyDef+" 🔰)";
    if (damage<=0){
      hitMsg="Your attack was fully repelled! ("+enemyDef+" ️🔰)";
      displayEnemyEffect("🔰");
    }
  }

  if (!silent) logPlayerAction(actionString,hitMsg);
  enemyHpLost = enemyHpLost + damage;

  if (!magicType && procAbilityChance("🀄️",25) && playerHp<playerHpMax){
      logAction("🀄️ "+arrowSymbol+" ✨ Your attack has syphoned health +1 ❤️");
      playerHp+=1;
  }

  if (enemyHpLost >= enemyHp) {
    enemyHpLost=enemyHp; //Negate overkill damage
    enemyKilled();
    return true;
  }

  if (enemyAtk==0 && enemyAtkBonus<1) {
    enemyAtkBonus++
    logAction(enemyEmoji+" "+arrowSymbol+" 💢 They got enraged gaining +1 ⚔️");
  }
}

function enemyKilled(){
  var gainedXP=parseInt(playerGainXP(1,0,""));
  logAction(enemyEmoji + " ▸ " + "☠️ They've received a fatal blow " + decorateStatusText("","+"+gainedXP+" XP",colorGold));

  playerKarma-=1; console.log("karma-- ("+playerKarma+")");
  playerKills++;
  AchievementManager.check('kill');
  if (enemyBossType.includes('Boss')) AchievementManager.check('boss_kill');

  var _wasFishing=isFishing;
  isFishing=false;

  if (_wasFishing || enemyBossType.includes('Boss')) {
    animateFlipNextEncounter();
  } else {
    animateFlipToCorpse("killed");
  }
}

function enemyJoinedParty(){
  displayPlayerEffect(enemyEmoji);
  playerPartyString+=enemyEmoji;
  //logPlayerAction(actionString,enemyName+" joined the party!");
  var gainedXP=playerGainXP(1.5,0,"");
  playerKarma++;
  enemyMsg=enemyMsg+decorateStatusText(""," +"+gainedXP+" XP",colorGold)
  playerChangeStats(0, enemyAtk, 0, enemyLck, 0, enemyMgk,0,enemyMsg); //Cannot get health/sta/int/def from a pet
  AchievementManager.check('get_pet');
  if ([...playerPartyString].length >= 3) AchievementManager.check('full_party');
}

function enemyKnockedOut(){
  var gainedXP=parseInt(playerGainXP(1.25,0,""));
  var knockoutString="💤 Harmlessly knocked them out "
  if ((enemyAtk+enemyAtkBonus)<=0) knockoutString="💤 Carefully put them to sleep "
  logAction(enemyEmoji + "&nbsp;▸&nbsp;" + knockoutString + decorateStatusText("","+"+gainedXP+" XP",colorGold));
  if (enemyAtk>0) playerKarma++;
  if (enemyAtk<=0) playerKarma--;
  AchievementManager.check('knockout');

  var _wasFishing=isFishing;
  isFishing=false;
  displayEnemyEffect("💤");

  if (_wasFishing || enemyBossType.includes('Boss')) {
    animateFlipNextEncounter();
  } else {
    animateFlipToCorpse("neutralized");
  }
}

function animateFlipToCorpse(state) {
  var animationHandler = function(){
    transitionToCorpse(state);
    registerClickListeners();
    cardUIElement.removeEventListener("animationend", animationHandler);
  }
  cardUIElement.removeEventListener("animationend", animationHandler);
  animateUIElement(areaUIElement,"animate__flipOutX","1.2");
  animateUIElement(cardUIElement,"animate__flipOutY","1.2");
  removeClickListeners();
  cardUIElement.addEventListener('animationend', animationHandler);
}

function transitionToCorpse(state) {
  var baseName  = (corpseSnapshot) ? corpseSnapshot.name  : enemyName;
  var baseEmoji = (corpseSnapshot) ? corpseSnapshot.emoji : enemyEmoji;

  corpseSnapshot = null;
  if (state === "neutralized") {
    corpseSnapshot = {
      name: enemyName, emoji: enemyEmoji, type: enemyType,
      hp: enemyHp, atk: enemyAtk, sta: enemySta,
      lck: enemyLck, int: enemyInt, mgk: enemyMgk, def: enemyDef,
      desc: enemyDesc, msg: enemyMsg
    };
  }

  corpseState = state;
  corpseHasLoot = false;
  corpseLoot = null;

  enemyEmoji = (state === "killed") ? "☠️" : "💤";
  enemyName  = baseName + (state === "killed" ? " (Dead)" : " (Asleep)");
  enemyType  = "Prop";

  enemyAtk=0; enemyAtkBonus=0;
  enemySta=0; enemyStaLost=0;
  enemyMgk=0; enemyMgkLost=0;
  enemyDef=0;
  totalBonus=0; totalMalus=0;

  var _lootType = null;
  if (procAbilityChance("", GAME_CONFIG.killItemDropChance+playerLck)) {
    _lootType = ["Item"];
  } else if (procAbilityChance("", GAME_CONFIG.killConsumableDropChance+playerLck)) {
    _lootType = ["Consumable"];
  }
  if (_lootType) {
    var _loot = getRandomEncounter(_lootType, [], "", ["Artifact","Lover's Memento","Lost Possesion"]);
    if (_loot) { corpseHasLoot=true; corpseLoot=_loot; }
  }

  if (state === "killed") {
    enemyDesc = corpseHasLoot ? "There's something among the bones.<br>" : "Nothing but quiet remains.<br>";
  } else {
    enemyDesc = corpseHasLoot ? "There's something underneath them.<br>" : "Lies on the ground, breathing faintly.<br>";
  }
  enemyMsg = "";

  animateUIElement(cardUIElement,"animate__fadeIn","1.2");
  redraw();
}

function wakeUpEnemy() {
  logAction(corpseSnapshot.emoji + " ▸ 💢 " + corpseSnapshot.name + " stirred awake from the blow.");

  enemyEmoji = corpseSnapshot.emoji;
  enemyName  = corpseSnapshot.name;
  enemyType  = corpseSnapshot.type;
  enemyAtk   = corpseSnapshot.atk;
  enemySta   = corpseSnapshot.sta;
  enemyLck   = corpseSnapshot.lck;
  enemyInt   = corpseSnapshot.int;
  enemyMgk   = corpseSnapshot.mgk;
  enemyDef   = corpseSnapshot.def;
  enemyDesc  = corpseSnapshot.desc;
  enemyMsg   = corpseSnapshot.msg;
  enemyStaLost=0;
  enemyMgkLost=0;
  enemyAtkBonus=0;

  var ea=[enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef].map(Number);
  totalBonus=ea.filter(function(x){return x>0}).reduce(function(s,a){return s+a},0);
  totalMalus=ea.filter(function(x){return x<0}).reduce(function(s,a){return s+a},0);

  corpseState="";
  corpseSnapshot=null;
  corpseHasLoot=false;
  corpseLoot=null;

  animateUIElement(emojiWrapperUIElement,"animate__bounce","0.8");
  redraw();
}

function enemyDisengage(){
  playerGainXP(1.5,0,"Convinced them to disengage");
  playerKarma+=1;

  isFishing=false;
  displayPlayerEffect("💬");
  animateFlipNextEncounter();
}

function enemyGrabbedIntoLoot(msg="Grabbed it into your bag -1 🟢"){
  playerGainXP(1.25,0,msg);
  playerLootString+=enemyEmoji;
  //No karma change

  isFishing=false;
  displayEnemyEffect("👋");
  nextEncounter();
}

function enemyKicked(){
  logPlayerAction(actionString,"Kicked them afar regaining +2 🟢");
  displayEnemyCannotEffect();
  displayEnemyEffect("🦶");
  playerGetStamina(2,true);
  enemyRest(1);
  if (enemyAtk==0 && enemyAtkBonus<1) {
    enemyAtkBonus++
    logAction(enemyEmoji+" "+arrowSymbol+" 💢 They got enraged gaining +1 ⚔️");
  }
}

function enemyTurnAggressive(message="That has made them really upset!"){
  enemyType="Standard";
  enemyDesc="It wanted be friends, not enemies.<br>But you asked for it..."
  enemyHp=2+playerLevel;
  enemyAtk=Math.floor(1+playerLevel/2);
  enemySta=Math.floor(2+playerLevel/2);
  enemyMsg="Got killed by a friend."
  playerKarma--;
  logPlayerAction(actionString,message);
  return true;
}

function enemyDodged(message="Missed, they evaded your grasp."){
  displayPlayerCannotEffect();
  displayEnemyEffect("🌀");
  enemyAttackOrRest(message,true); //FML
}

function enemyCastIfMgk(hit=true,customHitMessage=""){
  switch (enemyType){
    case "Trap": //Rest to full if out of combat + mana
    case "Trap-Attack":
    case "Trap-Roll":
    case "Trap-Big":
    case "Trap-Obstacle":
    case "Item":
    case "Consumable":
    case "Altar":
    case "Curse":
    case "Fishing":
      return false;
      break;
  }

  if (parseInt(enemyMgk)>parseInt(enemyMgkLost)) {
    var damageAndCost=1;
    if (parseInt(enemyMgk)>(parseInt(enemyMgkLost)+1)) damageAndCost=2;

    enemyMgkLost+=damageAndCost;
    displayEnemyCannotEffect(); //Actually can, but this is just for effect

    if (procAbilityChance("💠",33)){
      logAction("🪄 ▸ <b>💠 Reflect Magic</b> resisted their spell.");
      displayPlayerEffect("💠");
      return false;
    }

    if (hit && (customHitMessage=="")) {
      logAction(enemyEmoji+" ▸ 🪄 Got hit by the enemy spell -"+damageAndCost+" 💔");
    } else if (hit) {
      logPlayerAction(actionString,customHitMessage+" -"+damageAndCost+" 💔");
    }

    if (hit) playerHit(damageAndCost,true,true);

    return true;
  }
}

function enemyAttackOrRest(message="",isGrab=false,skipToxin=false){
  var damageReceived=enemyAtk+enemyAtkBonus;
  var staminaChangeMsg;

  if ((enemySta>enemyStaLost)&&(enemyHp>enemyHpLost)) {
    if (playerLootString.includes("🖤") || playerLootString.includes("🪣") ) {
      displayPlayerEffect("🔰");
      if ((enemyAtk+enemyAtkBonus)>0) playerHp++
    }

    if (enemyType!="Demon"){
      staminaChangeMsg = "The enemy attacked you dealing -"+(enemyAtk+enemyAtkBonus)+" 💔"
    } else {
        staminaChangeMsg = "The enemy syphoned some health -"+(enemyAtk+enemyAtkBonus)+" 💔";
        if (enemyHpLost >0) {enemyHpLost-=1;}
    }

    if ((damageReceived<=0)){
      staminaChangeMsg=chooseFrom(["They just hang around.","They do not seem to care.","They just wait around.","They seem to be very chill."])
      if (enemyCursed && (enemyAtk+enemyAtkBonus)<=0) staminaChangeMsg="They are too weak to do any harm."
      animateUIElement(emojiWrapperUIElement,"animate__headShake","0.8"); //Play chill animation
      if (enemyType=="Pet"){ //Harder to befriend
        enemyIntBonus++;
        if ((enemyInt+enemyIntBonus)<=playerInt){
          logAction(enemyEmoji+" ▸ ⁉️ They now seem more concerned.");
          displayEnemyEffect("⁉️")
          enemyRest(1);
        } else {
          logAction(enemyEmoji+" ▸ ‼️ They got bored and left.");
          nextEncounter();
          return;
        }
      }
      if (message!="") staminaChangeMsg=message;
      if (!isGrab) {
        logAction(enemyEmoji+" "+arrowSymbol+" 💤 "+staminaChangeMsg);
        enemyRest(1);
        sufferToxin();
        return; //They don't waste stamina unless necessary
      }
    } else {
      if (message!="") staminaChangeMsg=message;
      enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a");
      if (isGrab){return;}
      playerHit(damageReceived,true,false);

      if (playerLootString.includes("🥀") && (enemyHp>enemyHpLost) && (enemyAtk+enemyAtkBonus)>0 && !isGrab) {
        logAction("⚔️ ▸ 🥀 Dealt -1 💔 by <b>🥀 Thorns Payback</b>.");
        enemyHit(1,false,false,true);
        displayEnemyEffect("🥀");
      }

      if (playerLootString.includes("🖤") || playerLootString.includes("🪣") ) logAction("⚔️ ▸ <b>🔰 Unbreakable</b> provided protection +1 🔰");
      return;
    }
    enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a","Shit happened.");
  } else if (enemyHp > enemyHpLost) {
    if (message=="") {
      staminaChangeMsg="They recovered some energy.";
    } else {
      staminaChangeMsg=message;
    }
    if (enemyType=="Spirit") staminaChangeMsg = "Impossible to hit, they recovered energy."
    if (enemyType=="Spirit" && (enemySta+enemyStaLost==0)) staminaChangeMsg = "Seems to be impossible to hit."
    logPlayerAction(actionString,staminaChangeMsg);
    enemyRest(1);
    sufferToxin();
  }
}
