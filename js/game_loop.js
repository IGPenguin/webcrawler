//Having all this in a one file is truly shameful
//...submit a pull request if you dare

//Tech init
var versionCode = "work-in-progress, ver. 5/4/23"
var cardUIElement;
var emojiUIElement;
var enemyInfoUIElement;
var playerInfoUIElement;

var seenEncountersString = JSON.parse(localStorage.getItem("seenEncounters"));
var seenEncounters;
var randomEncounterIndex;
var encountersTotal;
var encounterIndex;
var lines;

if (seenEncountersString == null){
  seenEncounters = [];
} else {
  seenEncounters = Array.from(seenEncountersString); //Load seen encounters
}

//Player stats init
function renewPlayer(){
  playerHpMax=playerHpDefault;
  playerHp = playerHpMax;
  playerStaMax = playerStaDefault;
  playerSta = playerStaDefault;
  playerAtk = 1;
  playerDef = 0;
  playerInt = 1;
  playerLootString = "";
  playerPartyString = "";
  adventureLog = "";
}

var playerName = "Nameless Hero";
var playerLootString = "";
var playerPartyString = "";
var playerHpDefault = 3;
var playerStaDefault = 3;
var playerLckDefault = 0;

var playerHpMax = playerHpDefault;
var playerStaMax = playerStaDefault;
var playerHp = playerHpMax;
var playerSta = playerStaMax;
var playerLck = playerLckDefault;
var playerInt = 1;
var playerAtk = 1;

var luckInterval = 15; //Lower to increase chances

var actionString;
var actionLog = "💤&nbsp;▸&nbsp;💭&nbsp;You hear some faint echoing screams.<br>💤&nbsp;▸&nbsp;💭&nbsp;It's pitch black, you can't see anything.<br>💤&nbsp;▸&nbsp;💭&nbsp;You feel a strange presence nearby.\n";
var adventureLog = actionLog;
var adventureEncounterCount = -1; // -1 for death
var adventureEndReason = "";

//Area init
var checkpointEncounter;
var previousArea;
var areaName;

//Enemy stats init
var enemyEmoji;
var enemyName;
var enemyHp;
var enemyAtk;
var enemySta;
var enemyLck;
var enemyInt;
var enemyType;
var enemyTeam;
var enemyDesc;
var enemyMsg;

var enemyHpLost = 0;
var enemyStaLost = 0;
var enemyAtkBonus = 0;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/encounters.csv",
        dataType: "text",
        success: function(data) {
          processData(data);
          registerClickListeners();
        }
     });
});

//Data logic

function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  lines = [];

  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(';');
      if (data.length == headers.length) {

          var tarr = [];
          for (var j=0; j<headers.length; j++) {
              tarr.push(headers[j]+":"+data[j]);
          }
        lines.push(tarr);
  }
  }
  loadEncounter(1);//Start from the first encounter (0 is dead)
  redraw();
}

function getNextEncounterIndex(){
  encountersTotal = lines.length-1;
  var nextItemIndex = encounterIndex+1;
  if (nextItemIndex > encountersTotal){ //Game Completed
    gameEnd();
    return 4; //Skip tutorial
  }
  return nextItemIndex;
}

function getUnseenEncounterIndex() { //Unused
  console.log("Already seen line indexes: " + seenEncounters);
  encountersTotal = lines.length;
  var max = encountersTotal;
    do {
      randomEncounterIndex = Math.floor(Math.random() * max);
      if (seenEncounters.length >= encountersTotal){
        gameEnd();
        break;
      }
    } while (seenEncounters.includes(randomEncounterIndex));
    return randomEncounterIndex;
}

function markAsSeen(seenID){
  if (!seenEncounters.includes(seenID)){
    seenEncounters.push(seenID);
    localStorage.setItem("seenEncounters", JSON.stringify(seenEncounters));
  }
}

function resetSeenEncounters(){
  localStorage.setItem("seenEncounters", JSON.stringify(""));
  seenEncounters = [];
}

function loadEncounter(index){
  encounterIndex = index;
  selectedLine = String(lines[index]);

  //Encounter data - area;emoji;name;type;hp;atk;sta;def;team;desc
  areaName = String(selectedLine.split(",")[0].split(":")[1]);
  enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  enemyAtk = parseInt(String(selectedLine.split(",")[5].split(":")[1]))+enemyAtkBonus;
  enemySta = String(selectedLine.split(",")[6].split(":")[1]);
  enemyLck = String(selectedLine.split(",")[7].split(":")[1]);
  enemyInt = String(selectedLine.split(",")[8].split(":")[1]);
  enemyTeam = String(selectedLine.split(",")[9].split(":")[1]);
  enemyDesc = String(selectedLine.split(",")[10].split(":")[1]);
  enemyMsg = String(selectedLine.split(",")[11].split(":")[1]);
}

//UI Logic
function redraw(){
  //Version
  document.getElementById('id_version').innerHTML = versionCode;

  //Player UI
  playerInfoUIElement= document.getElementById('id_player_info');
  document.getElementById('id_player_name').innerHTML = playerName;
  var playerStatusString = "❤️ " + "◆".repeat(playerHp) + "◇".repeat((-1)*(playerHp-playerHpMax));
  playerStatusString += "&nbsp;&nbsp;🟢 " + "◆".repeat(playerSta) + "◇".repeat(playerStaMax-playerSta);
  playerStatusString += "&nbsp;&nbsp;🎯 " + "×".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;
  document.getElementById('id_player_party_loot').innerHTML = "";
  if (playerPartyString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "<b>Party:</b> " +playerPartyString;
  }
  if (playerLootString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "&nbsp;<b>Loot:</b> "+playerLootString;
  }
  if (playerPartyString.length+playerLootString.length == 0) {
    document.getElementById('id_player_party_loot').innerHTML = "∙∙∙";
  }

  //Encounter UI
  cardUIElement = document.getElementById('id_card');
  enemyInfoUIElement = document.getElementById('id_enemy_info');
  emojiUIElement = document.getElementById('id_emoji');

  emojiUIElement.innerHTML = enemyEmoji;
  document.getElementById('id_area').innerHTML = areaName;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = enemyDesc;
  document.getElementById('id_team').innerHTML = "»&nbsp;" + enemyTeam + "&nbsp;«";

  //Encounter Statusbar UI
  var enemyStatusString = ""
  if (enemyHp > 0) { enemyStatusString = "❤️ " + "◆".repeat(enemyHp);}
    if (enemyHpLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyHpLost) + "◇".repeat(enemyHpLost); } //YOLO
  if (enemySta > 0) { enemyStatusString += "&nbsp;🟢 " + "◆".repeat(enemySta);}
    if (enemyStaLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyStaLost) + "◇".repeat(enemyStaLost); } //YOLO
  if (enemyAtk > 0) {enemyStatusString += "&nbsp;🎯 " + "×".repeat(enemyAtk);}

  switch(enemyType){
    case "Standard":
    case "Recruit":
    case "Pet":
    case "Swift":
    case "Heavy":
      break; //Show default - HP, Sta + dmg
    case "Item":
    case "Trap":
    case "Friend":
      enemyStatusString = "";
      if (enemyHp>0) {enemyStatusString += "❤️ ??&nbsp;&nbsp;";}
      if (enemyAtk>0) {enemyStatusString += "🎯 ??&nbsp;&nbsp;";}
      if (enemySta>0) {enemyStatusString += "🟢 ??&nbsp;&nbsp;";}
      if (enemyLck>0) {enemyStatusString += "🍀 ??&nbsp;&nbsp;";}
      if (enemyInt>0) {enemyStatusString += "🧠 ??&nbsp;&nbsp;";}
      break;
    case "Consumable":
      enemyStatusString = "❤️ +&nbsp;&nbsp;🟢 +";
      break;
    default:
      enemyStatusString = "∙  ∙  ∙"; //Dream, Prop, Upgrade etc.
      break;
  }

  document.getElementById('id_stats').innerHTML = enemyStatusString;
  document.getElementById('id_log').innerHTML = actionLog;
  adjustEncounterButtons();
}

//Game logic
function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    var buttonUIElement = document.getElementById(button);
    actionString = buttonUIElement.innerHTML;
    actionVibrateFeedback(button);

    switch (button) {
      case 'button_attack': //Attacking always needs stamina
        if (!playerUseStamina(1,"You are too tired to attack anything.")){
            break;
          }
        switch (enemyType){
          case "Trap":
          case "Trap-Roll":
            logPlayerAction(actionString,"You smashed it into small pieces -1 🟢");
            nextEncounter();
            break;
          case "Trap-Attack":
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" ❤️");
            playerHit(enemyAtk);
            break;
          case "Item":
          case "Consumable":
          case "Container":
            var openMessage = "You attacked and destroyed it -1 🟢";
            if (enemyMsg != ""){
              openMessage = enemyMsg.replace("."," -1 🟢");
            }
            logPlayerAction(actionString,openMessage);
            displayEnemyEffect("〽️");
            enemyAnimateDeathNextEncounter();
            break;
          case "Friend":
            logPlayerAction(actionString,"You scared them to run away -1 🟢");
            displayEnemyEffect("〽️");
            nextEncounter();
            break;
          case "Heavy":
          case "Standard": //You hit first, they hit back if they have stamina
          case "Recruit":
          case "Pet":
            enemyHit(playerAtk);
            if (enemyHp-enemyHpLost > 0) { //If they survive, they counterattack or regain stamina
              enemyAttackOrRest();
            }
            break;
          case "Swift": //They hit you first if they have stamina
            if (enemySta-enemyStaLost > 0) {
              enemyStaminaChangeMessage(-1,"They dodged and counter-attacked -"+enemyAtk+" 💔","n/a");
              playerHit(enemyAtk);
            } else {
              enemyHit(playerAtk);
              enemyAttackOrRest();
            }
            break;
          case "Death":
            logPlayerAction(actionString,"There is nothing to attack anymore.");
            break
          case "Upgrade":
          logPlayerAction(actionString,"Your felt your body become stronger.");
          displayPlayerEffect("✨");
            playerHpMax+=1;
            playerHp+=1;
            playerSta+=1; //Restore lost stamina from initial attack
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"Your attack had no effect on that -1 🟢");
            displayEnemyEffect("〽️");
      }
      break;

      case 'button_roll': //Stamina not needed for non-enemies + dodge handling per enemy type
        const noStaForRollMessage = "You are too tired to make any move.";
        switch (enemyType){
          case "Standard":
          case "Recruit":
          case "Pet":
            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"You dodged their standard attack -1 🟢","Your rolling was a waste of energy -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;
          case "Swift":
            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"They hit you while you were rolling -"+enemyAtk+" 💔","You rolled into a surprise attack -"+enemyAtk+" 💔");
              playerHit(enemyAtk);
            }
            break;
          case "Heavy":
            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"You dodged their heavy attack -1 🟢","Your rolling was a waste of energy  -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;
          case "Item":
          case "Consumable":
          case "Checkpoint":
            logPlayerAction(actionString,"You walked away leaving it behind.");
            nextEncounter();
            break;
          case "Container":
            logPlayerAction(actionString,"You walked away without investigating.");
            encounterIndex+=1; //Skip loot
            nextEncounter();
            break;
          case "Dream":
            logPlayerAction(actionString,"You walked further along the road.");
            nextEncounter();
            break;
          case "Prop":
            logPlayerAction(actionString,"You continued on your adventure.");
            nextEncounter();
            break;
          case "Friend":
            logPlayerAction(actionString,"You walked far away from them.");
            nextEncounter();
            break;
          case "Trap-Roll": //You get damage rolling into "Trap-Roll" type encounters
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            break;
          case "Trap":
          case "Trap-Attack":
            logPlayerAction(actionString,"You continued onwards away from that.");
            nextEncounter();
            break;
          case "Death":
            logPlayerAction(actionString,"There is nothing to avoid anymore.");
            animateUIElement(playerInfoUIElement,"animate__headShake","0.7");
            break;
            nextEncounter();
          case "Upgrade":
            logPlayerAction(actionString,"Your felt your body become faster.");
            displayPlayerEffect("✨");
            playerStaMax+=1;
            playerSta+=1;
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"Feels like nothing really happened.");
        }
        break;

      case 'button_block':
        if (enemyType == "Upgrade"){
          logPlayerAction(actionString,"Your felt your brain grow wiser.");
          displayPlayerEffect("🧠");
          playerInt+=1;
          nextEncounter();
          break;
        }
        if (!playerUseStamina(1,"You are too tired to raise your shield.")){
            break;
          }
        switch (enemyType){
          case "Standard":
          case "Recruit":
          case "Pet":
            enemyStaminaChangeMessage(-1,"You blocked their standard attack -1 🟢","You blocked absolutely nothing -1 🟢");
            displayPlayerEffect("🛡");
            break;
          case "Swift":
            enemyStaminaChangeMessage(-1,"You blocked their swift attack -1 🟢","You blocked absolutely nothing -1 🟢");
            displayPlayerEffect("🛡");
            break;
          case "Heavy":
            if (enemyStaminaChangeMessage(-1,"You didn't block their heavy blow&nbsp;-"+enemyAtk+" 💔","n/a")){
              playerHit(enemyAtk);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","You blocked absolutely nothing -1 🟢");
            }
            break;
          case "Death":
              logPlayerAction(actionString,"There is nothing to block anymore.");
              break;
          default:
            logPlayerAction(actionString,"You blocked absolutely nothing -1 🟢");
            displayPlayerEffect("🛡");
        }
        break;

      case 'button_grab': //Player vs encounter stamina decides the success
        switch (enemyType){
          case "Pet": //Can become pet it when the player has higher current stamina
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){
              if (enemyInt > playerInt ) { //Cannot become a party member if it has higher int than the player
                logPlayerAction(actionString,"You need to be wiser to befriend them.");
                enemyAttackOrRest();
                break;
              }
              logPlayerAction(actionString,"You petted it and became friends!");
              displayPlayerEffect(enemyEmoji);
              playerPartyString+=" "+enemyEmoji;
              playerAtk+=enemyAtk;
              enemyAnimateDeathNextEncounter();
              break;
            }
          case "Recruit":
          case "Standard": //Player vs encounter stamina - knockout, dodge or asymmetrical rest
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){ //If they are tired and player has stamina
              logPlayerAction(actionString,"You grabbed them into stranglehold.");
              enemyKnockedOut();
            } else if (enemySta - enemyStaLost > 0){ //Enemy dodges if they got stamina
              var touchChance = Math.floor(Math.random() * luckInterval);
              console.log("touchChance: "+touchChance+"/"+luckInterval+" lck: "+playerLck) //Generous chance to make enemy uncomfortable
              if ( touchChance <= playerLck ){
                logAction("🍀&nbsp;▸&nbsp;✋&nbsp;They were scared away by your touch.");
                displayPlayerEffect("🍀");
                nextEncounter();
                break;
              }
              else {
                displayPlayerCannotEffect();
                enemyAttackOrRest();
                logPlayerAction(actionString,"You were too slow, they dodged that.");
              }
            } else { //Player and enemy have no stamina - asymetrical rest
              enemyKicked();
            }
            break;
          case "Swift": //Player can only kick tired swift enemies
            if (enemySta-enemyStaLost == 0){
              enemyKicked();
              break;
            }
            logPlayerAction(actionString,"They swiftly evaded your grasp.");
            displayEnemyEffect("🌀");
            enemyAttackOrRest();
            break;
          case "Heavy":
            if (enemySta - enemyStaLost > 0){ //Enemy hits extra hard if they got stamina
              logPlayerAction(actionString,"You struggled and got hit hard -"+enemyAtk*2+" 💔");
              playerHit(enemyAtk+2);
            } else { //Enemy has no stamina - asymetrical rest
              enemyKicked();
            }
            break;
          case "Trap":
          case "Trap-Roll":
          case "Trap-Attack":
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            displayEnemyEffect("✋");
            break;
          case "Container":
            var openMessage = "There was something hidden inside.";
            displayEnemyEffect("👋");
            if (enemyMsg != ""){
              openMessage = enemyMsg;
            }
            logPlayerAction(actionString,openMessage);
            nextEncounter();
            break;
          case "Item":
            playerLootString+=" "+enemyEmoji;
            displayEnemyEffect("✋");
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt);
            break;
          case "Friend":
            logPlayerAction(actionString,"It slipped through your fingers.");
            displayEnemyEffect("✋");
            nextEncounter();
            break;
          case "Consumable":
            playerConsumed();
            displayEnemyEffect("🍽");
            enemyAnimateDeathNextEncounter();
            break;
          case "Dream":
            logPlayerAction(actionString,"You reached out into the endless void.");
            displayEnemyEffect("✋");
            break;
          case "Death":
            logPlayerAction(actionString,"Your body reconnected with your soul.");
            displayEnemyEffect("✋");
            var deathMessage="💤&nbsp;▸&nbsp;💭&nbsp;An unknown power resurrected you.<br>💤&nbsp;▸&nbsp;💭&nbsp;Hopefully it wasn't some tainted spell.";
            logAction(deathMessage);
            if (checkpointEncounter == null){
              renewPlayer();
              encounterIndex=3; //Skip tutorial
            } else {
              //TODO load playerStats to prevent stacking via resurrecting on checkpoints
              encounterIndex=checkpointEncounter-1; //Start from checkpoint
              playerHp=playerHpMax;
              playerSta=playerStaMax;
            }
            adventureEncounterCount = -1; //For death
            nextEncounter();
            break;
          case "Upgrade":
            logPlayerAction(actionString,"You felt your chances increase.");
            displayPlayerEffect("🍀");
            playerLck+=1;
            nextEncounter();
            break;
          case "Checkpoint": //Save and rest to full HP and Sta
            displayPlayerEffect("💾");
            logPlayerAction(actionString,"You embraced the "+enemyName+".");
            playerGetStamina(playerStaMax-playerSta,true);
            playerHp=playerHpMax;
            checkpointEncounter=encounterIndex;
            break;
          default:
            logPlayerAction(actionString,"You touched it and nothing happened.");
            displayEnemyEffect("✋");
          }
        break;

      case 'button_speak':
        switch (enemyType){
          case "Recruit":
            if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){ //If they are tired and you are smarter they join you
              logPlayerAction(actionString,"You convinced them to join your party!");
              displayPlayerEffect(enemyEmoji);
              animateUIElement(playerInfoUIElement,"animate__tada","1"); //Animate player gain
              playerPartyString+=" "+enemyEmoji
              playerAtk+=enemyAtk;
              enemyAnimateDeathNextEncounter();
              break;
            }
          case "Standard":
          case "Swift":
          case "Heavy":
          case "Pet":
            if (enemyInt < playerInt){
              logPlayerAction(actionString,"You convinced them to leave you alone.");
              displayPlayerEffect("💬");
              nextEncounter();
              break;
            } else if ((enemyInt > (playerInt+2)) && enemyAtkBonus < 2) {
              logPlayerAction(actionString,"That made them more angry!");
              displayPlayerEffect("💬");
              enemyAtkBonus+=1;
            } else {
              var speechChance = Math.floor(Math.random() * luckInterval);
              console.log("speechChance: "+speechChance+"/"+luckInterval+" lck: "+playerLck) //Chance to lie
              if ( speechChance <= playerLck ){
                logAction("🍀&nbsp;▸&nbsp;💬&nbsp;They believed your lies and left.");
                displayPlayerEffect("💬");
                nextEncounter();
                break;
              }
              else {
                logPlayerAction(actionString,"They ignored whatever you said.");
              }
            }
            enemyAttackOrRest();
            break;
          case "Friend":
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt);
            displayPlayerEffect("💬");
            break;
          case "Death":
            copyAdventureToClipboard();
            break;
          case "Dream":
            logPlayerAction(actionString,"You can not move your lips to speak.");
            displayPlayerCannotEffect();
            break;
          case "Upgrade":
            logPlayerAction(actionString,"You chose to become <b> cursed -1 💔 -1 🟢</b>");
            playerHpMax-=1;
            playerHit(1);
            playerStaMax-=1;
            playerSta-=1;
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"Your voice echoes around the area.");
            displayPlayerEffect("💬");
        }
        break;

      case 'button_sleep':
        switch (enemyType){
          case "Standard":
          case "Swift":
          case "Heavy":
          case "Recruit":
          case "Pet":
            enemyAttackOrRest();
            if (playerHp>0){
              displayPlayerEffect("💤");
              playerGetStamina(1);
            }
            break;
          case "Trap":
          case "Trap-Attack":
          case "Trap-Roll":
          case "Item":
          case "Consumable":
          case "Prop":
          case "Dream":
          case "Container":
          case "Checkpoint":
            displayPlayerEffect("💤");
            playerGetStamina(playerStaMax-playerSta);//Rest to full if out of combat
            break;
          case "Friend":
            displayPlayerEffect("💤");
            playerGetStamina(playerStaMax-playerSta);//Rest to full if out of combat
            logPlayerAction(actionString,"They got tired of waiting for you and left.");
            nextEncounter();
            break;
          case "Death":
            redirectToTweet();
            break;
          case "Upgrade":
            logPlayerAction(actionString,"You skipped boosting your character.");
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"You cannot rest, monsters are nearby.");
            displayPlayerCannotEffect();
            displayPlayerEffect("👀");
            break;
        }
    };
    loadEncounter(encounterIndex);
    redraw();
  };
}

//Enemy
function enemyRenew(){
  enemyStaLost = 0;
  enemyHpLost = 0;
  enemyAtkBonus = 0;
}

function enemyRest(stamina){
  if (enemyHp - enemyHpLost > 0){
    animateUIElement(enemyInfoUIElement,"animate__pulse","0.4"); //Animate enemy rest
    enemyStaLost-=stamina;
    if (enemyStaLost < 0) {
      enemyStaLost = 0;
    }
  }
}

function enemyStaminaChangeMessage(stamina,successMessage,failMessage){
  if (enemyStaLost < enemySta) {
    logPlayerAction(actionString,successMessage);
    animateUIElement(emojiUIElement,"animate__headShake","0.7"); //Play attack animation
    enemyStaLost -= stamina;
    return true;
  } else if (enemyHp - enemyHpLost > 0) { //Enemy rest if not dead
    logPlayerAction(actionString,failMessage);
    animateUIElement(enemyInfoUIElement,"animate__pulse","0.4"); //Animate enemy rest
    enemyStaLost += stamina
    return false;
  } else { //Enemy dead
    return false;
  }
}

function enemyHit(damage){
  var hitMsg = "You hit them with an attack -"+damage+" 💔";

  displayEnemyEffect("💢");
  var critChance = Math.floor(Math.random() * luckInterval);
  console.log("critChance: "+critChance+"/"+luckInterval+" lck: "+playerLck) //Chance to crit
  if ( critChance <= playerLck ){
    logAction("🍀&nbsp;▸&nbsp;🎯&nbsp;Your strike was blessed with luck.");
    hitMsg="You hit them with a critical attack -"+(damage+2)+" 💔";
    displayPlayerEffect("🍀");
    damage+=2;
  }

  logPlayerAction(actionString,hitMsg);
  enemyHpLost = enemyHpLost + damage;

  if (enemyHpLost >= enemyHp) {
    enemyHpLost=enemyHp; //Negate overkill damage
    logAction(enemyEmoji + "&nbsp;▸&nbsp;" + "💀&nbsp;You successfully eliminated them.");
    enemyAnimateDeathNextEncounter();
  } else {
    animateUIElement(enemyInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  }
}

function enemyKicked(){
  logPlayerAction(actionString,"You kicked them afar and gained +2 🟢");
  displayEnemyEffect("🦶");
  playerGetStamina(2,true);
  enemyRest(1);
}

function enemyKnockedOut(){
  logAction(enemyEmoji + "&nbsp;▸&nbsp;" + "💤&nbsp;You harmlessly knocked them out.");
  displayEnemyEffect("💤");
  enemyAnimateDeathNextEncounter();
}

function enemyAttackOrRest(){
  if (enemySta-enemyStaLost > 0) {
    enemyStaminaChangeMessage(-1,"The enemy attacked you for -"+enemyAtk+" 💔","n/a");
    playerHit(enemyAtk);
  } else {
    enemyRest(1);
  }
}

function nextEncounter(){
  adventureEncounterCount+=1;
  markAsSeen(encounterIndex);
  encounterIndex = getNextEncounterIndex();

  //Fullscreen Curtain
  previousArea = areaName;
  loadEncounter(encounterIndex);
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm")){ //Does not animate new area when killed
    curtainFadeInAndOut(areaName);
  }

  enemyRenew();
  animateUIElement(cardUIElement,"animate__fadeIn","0.7");
}

function enemyAnimateDeathNextEncounter(){
  animateUIElement(emojiUIElement,"animate__fadeOutDown","0.75");
  var animationHandler = function(){
    nextEncounter();
    redraw();
    emojiUIElement.removeEventListener("animationend",animationHandler);
  }
  emojiUIElement.addEventListener('animationend',animationHandler);
}

//Player
function playerGetStamina(stamina,silent = false){
  if (playerSta >= playerStaMax) { //Cannot get more
    if (!silent){
      logPlayerAction(actionString,"You just wasted a moment of your life.");
    }
    return false;
  } else {
    if (!silent){
      logPlayerAction(actionString,"You rested and regained energy +" + stamina + " 🟢");
    }
    playerSta += stamina;
    if (playerSta > playerStaMax){
      playerSta = playerStaMax;
    }
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
    return true;
  }
}

function playerUseStamina(stamina, message = ""){
  if (playerSta <= 0) { //Cannot lose more
    if (message != ""){ //Display specific "too tired message"
      logPlayerAction(actionString,message);
    }
    displayPlayerCannotEffect();
    return false;
  } else {
    playerSta -= stamina;
    return true;
  }
}

function playerGainedItem(bonusHp,bonusAtk,bonusSta,bonusLck,bonusInt){
  var gainedString;
  if (enemyMsg != "") {
    gainedString = enemyMsg;
  } else {
    gainedString="You felt becoming stronger";
  }
  if (bonusHp > 0) {
    playerHpMax += parseInt(bonusHp);
    playerHp += parseInt(bonusHp);
    gainedString += " +"+bonusHp + " ❤️";
    displayPlayerEffect("✨");
  }
  if (bonusAtk > 0){
    playerAtk += parseInt(bonusAtk);
    gainedString += " +"+bonusAtk + " 🎯";
    displayPlayerEffect("✨");
  }
  if (bonusSta > 0){
    playerStaMax += parseInt(bonusSta);
    playerSta += parseInt(bonusSta);
    gainedString += " +"+bonusSta + " 🟢";
    displayPlayerEffect("✨");
  }
  if (bonusLck > 0){
    playerLck += parseInt(bonusLck);
    gainedString += " +"+bonusLck + " 🍀";
    displayPlayerEffect("🍀");
  }
  if (bonusInt > 0){
    playerInt += parseInt(bonusInt);
    gainedString += " +"+bonusInt + " 🧠";
    displayPlayerEffect("🧠");
  }
  animateUIElement(playerInfoUIElement,"animate__tada","1"); //Animate player gain
  logPlayerAction(actionString,gainedString);
  nextEncounter();
}

function playerConsumed(){
  var consumedString = "Mmm, that was refreshing "

  var missingHp=playerHpMax-playerHp;
  var missingSta=playerStaMax-playerSta;

  if ((missingHp > 0) || (missingSta > 0)){

    if (missingHp > 0){
      playerHp += missingHp;
      consumedString += "+"+missingHp + " ❤️ ";
    }

    if (missingSta > 0){
      playerGetStamina(missingSta,true);
      consumedString += "+"+missingSta + " 🟢";
    }
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
  } else {
    var tooFullStaLost = 2;
    consumedString="You lost energy due to overeating -"+tooFullStaLost+" 🟢";
    animateUIElement(playerInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
    playerUseStamina(tooFullStaLost);
  }
  logPlayerAction(actionString,consumedString);
}

function playerHit(incomingDamage){
  var hitChance = Math.floor(Math.random() * luckInterval);
  console.log("hitChance: "+hitChance+"/"+luckInterval+" lck: "+playerLck) //Chance to not get hit
  if ( hitChance <= playerLck ){
    logAction("🍀&nbsp;▸&nbsp;💢&nbsp;You avoided receiving the damage.");
    displayPlayerEffect("🍀");
    return;
  }

  playerHp = playerHp - incomingDamage;
  animateUIElement(playerInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  if (playerHp <= 0){
    playerHp=0; //Prevent redraw issues post-overkill
    var deathChance = Math.floor(Math.random() * luckInterval * 3); //Small chance to not die
    console.log("deathChance: "+deathChance+"/"+(luckInterval*3)+" lck: "+playerLck)
    if ( deathChance <= playerLck ){
      playerHp+=1;
      logAction("🍀&nbsp;▸&nbsp;💀&nbsp;Luckily you got a second chance to live.");
      displayPlayerEffect("🍀");
      return;
    }
    gameOver();
    return;
  }
  displayPlayerEffect("💢");
}

//End Game
function gameOver(){
  //Reset progress to death encounter
  logAction(enemyEmoji+"&nbsp;▸&nbsp;💀&nbsp;You were killed, the adventure ends. ");
  adventureEndReason="\nDefeated by: "+enemyEmoji+" "+enemyName;
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  nextEncounter();
  animateUIElement(emojiUIElement,"animate__flip","1");
  playerSta=0; //You are just tired when dead :)
  resetSeenEncounters();
}

function gameEnd(){
  var winMessage="🧠&nbsp;▸&nbsp;💭&nbsp;You just had a deja vu, didn't you?<br>🧠&nbsp;▸&nbsp;💭&nbsp;It feels like you already did this. (NG+)";
  logAction(winMessage);

  //Reset progress to game start
  resetSeenEncounters();
  encounterIndex=4;
  alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!\nSpecial thanks: 0melapics on Freepik.com, https://animate.style and Stackoverflow.com");
}

//Logging
function logPlayerAction(actionString,message){
  actionString = actionString.substring(0,actionString.indexOf("&nbsp;")) + "&nbsp;▸&nbsp;" + enemyEmoji + "&nbsp;" + message + "<br>";
  adventureLog += actionString;
  actionLog = actionString + actionLog;
  if (actionLog.split("<br>").length > 3) {
    actionLog = actionLog.split("<br>").slice(0,3).join("<br>");
  }
}

function logAction(message){
  actionLog = message + "<br>" + actionLog;
  adventureLog += message+"<br>";
  if (actionLog.split("<br>").length > 3) {
    actionLog = actionLog.split("<br>").slice(0,3).join("<br>");
  }
}

//UI Buttons
function resetEncounterButtons(){
  document.getElementById('button_attack').innerHTML="🎯&nbsp;Attack";
  document.getElementById('button_block').innerHTML="🛡&nbsp;Block";
  document.getElementById('button_roll').innerHTML="🌀&nbsp;Roll";
  document.getElementById('button_grab').innerHTML="✋&nbsp;Grab";
  document.getElementById('button_sleep').innerHTML="💤&nbsp;Rest";
  document.getElementById('button_speak').innerHTML="💬&nbsp;Speak";
}

function adjustEncounterButtons(){
  resetEncounterButtons();
  switch (enemyType){
    case "Upgrade":
      document.getElementById('button_attack').innerHTML="❤️&nbsp;Health";
      document.getElementById('button_roll').innerHTML="🟢&nbsp;Energy";
      document.getElementById('button_block').innerHTML="🧠&nbsp;Mind";
      document.getElementById('button_grab').innerHTML="🍀&nbsp;Luck";
      document.getElementById('button_speak').innerHTML="👁‍🗨&nbsp;Curse";
      document.getElementById('button_sleep').innerHTML="↪️&nbsp;Skip";
      break;
    case "Container":
      document.getElementById('button_grab').innerHTML="👋&nbsp;Search";
      document.getElementById('button_roll').innerHTML="👣&nbsp;Walk";
      break;
    case "Consumable":
      document.getElementById('button_roll').innerHTML="👣&nbsp;Walk";
      break;
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋&nbsp;Touch";
    case "Item":
    case "Trap":
    case "Trap-Roll":
    case "Trap-Attack":
    case "Prop":
    case "Dream":
      document.getElementById('button_roll').innerHTML="👣&nbsp;Walk";
      break;
    case "Recruit":
        if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){ //If they are tired and you are smarter they join you
          document.getElementById('button_speak').innerHTML="💬&nbsp;Recruit";
        }
        if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) {
          document.getElementById('button_grab').innerHTML="🦶&nbsp;Kick";
        }
        break;
    case "Pet":
      if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){
        document.getElementById('button_grab').innerHTML="👋&nbsp;Pet";
      }
    case "Standard":
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) { //Applies for all above without "break;"
        document.getElementById('button_grab').innerHTML="🦶&nbsp;Kick";
      }
      break;
    case "Heavy":
    case "Swift":
      if ((enemySta-enemyStaLost)==0) {
        document.getElementById('button_grab').innerHTML="🦶&nbsp;Kick";
      }
      break;
    case "Death":
      document.getElementById('button_speak').innerHTML="💌&nbsp;Share";
      document.getElementById('button_sleep').innerHTML="🦆&nbsp;Tweet";
      break;
    case "Checkpoint":
      document.getElementById('button_grab').innerHTML="💾&nbsp;Save";
      document.getElementById('button_roll').innerHTML="👣&nbsp;Walk";
    default:
  }
}

//UI Effects
function curtainFadeInAndOut(message=""){
  var curtainUIElement = document.getElementById('id_fullscreen_curtain');
  var fullscreenTextUIElement = document.getElementById('id_fullscreen_text');

  animateUIElement(fullscreenTextUIElement,"animate__fadeIn",1.1,true,message);
  animateUIElement(curtainUIElement,"animate__fadeIn",1,true);

  var animationHandler = function(){
    animateUIElement(curtainUIElement,"animate__fadeOut",2.5,true);
    animateUIElement(fullscreenTextUIElement,"animate__fadeOut",2.5,true,message);
    curtainUIElement.removeEventListener("animationend",animationHandler);
  }
  curtainUIElement.addEventListener('animationend',animationHandler);
}

function displayEnemyEffect(message){
  displayEffect(message,document.getElementById('id_enemy_overlay'));
}

function displayPlayerEffect(message){
  displayEffect(message,document.getElementById('id_player_overlay'));
}

function displayPlayerCannotEffect(){
  animateUIElement(playerInfoUIElement,"animate__headShake","0.7"); //Animate Player not enough stamina
}

function displayEffect(message,documentElement){
  animateUIElement(documentElement,"animate__fadeOut",1.3,true,message)
}

function animateUIElement(documentElement,animation,time="0s",hidden = false,message=""){
  if (hidden){
    documentElement.innerHTML = message;
    documentElement.style.display = "block";
  }
documentElement.classList.remove(animation);
void documentElement.offsetWidth; // trigger a DOM reflow

  documentElement.style.setProperty("--animate-duration","0.0001s");
  //Wow, this is nice - https://animate.styles
  documentElement.classList.add("animate__animated",animation);
  if (time !="0s"){
    documentElement.style.setProperty("--animate-duration",time+"s");
  }
  documentElement.addEventListener('animationend', () => {
    if (hidden){
      documentElement.style.display = "none";
    }
    documentElement.classList.remove("animate__animated",animation);
  });
}

function registerClickListeners(){
  //Essential, onTouchEnd event type usage is needed on mobile to enable vibration effects
  //Breaks interactions on loading the page using Dev Tools "mobile preview" followed by switching it off
  var eventType = 'click';

  //Disabled: Event type switch needed for vibration feedback on Android
  //This seems to be the cause why interactions stopped working recently on Android/Chrome
  //if (String(navigator.userAgentData) != "undefined"){ //Any browser except Chrome needs this, it took only 3 hours to realize
  //  if (navigator.userAgentData.mobile){
  //    eventType = 'touchend';
  //  }
  //}
  console.log("platform interaction event type="+eventType);

  document.getElementById('button_attack').addEventListener(eventType, resolveAction('button_attack'));
  document.getElementById('button_block').addEventListener(eventType, resolveAction('button_block'));
  document.getElementById('button_roll').addEventListener(eventType, resolveAction('button_roll'));
  document.getElementById('button_grab').addEventListener(eventType, resolveAction('button_grab'));
  document.getElementById('button_sleep').addEventListener(eventType, resolveAction('button_sleep'));
  document.getElementById('button_speak').addEventListener(eventType, resolveAction('button_speak'));

  document.getElementById('id_player_name').addEventListener(eventType, ()=>{
    playerName=prompt("Name your character: ");
    if (!playerName.replace(/\s/g, '').length){
      playerName="Nameless Character";
    }
    redraw();
  });
}

//Social
function generateCharacterShareString(){
  var characterShareString="";
  characterShareString+="\nCharacter: "+playerName;
  characterShareString+="\n❤️ "+"◆".repeat(playerHpMax)+"  🟢 "+"◆".repeat(playerStaMax)+"  🎯 " + "×".repeat(playerAtk);

  if (playerPartyString.length > 0) {
    characterShareString += "\nParty: " +playerPartyString;
  }
  if (playerLootString.length > 0) {
    characterShareString += "\nLoot: "+playerLootString;
  }

  characterShareString+="\n\n"+ versionCode;

  return characterShareString;
}

function copyAdventureToClipboard(){
  displayPlayerEffect("💌");
  logPlayerAction(actionString,"Your legend was copied into clipboard.");
  adventureLog = adventureLog.replaceAll("<br>","\n").replaceAll("&nbsp;"," ");
  adventureLog += generateCharacterShareString();
  adventureLog += "\nhttps://igpenguin.github.io/webcrawler";
  navigator.clipboard.writeText(adventureLog);
}

function redirectToTweet(){
  var tweetUrl = "http://twitter.com/intent/tweet?url=https://igpenguin.github.io/webcrawler&text=";
  window.open(tweetUrl+encodeURIComponent("Hey @IGPenguin,\nI made it to stage #"+adventureEncounterCount+" in WebCrawler!"+adventureEndReason+"\n"+generateCharacterShareString()));
}

//Mobile specific
function vibrateButtonPress(){
  if (!("vibrate" in window.navigator)){
    console.log("Vibrate not supported!");
    return;
  }
  window.navigator.vibrate([5,20,10]);
}

async function actionVibrateFeedback(buttonID){
  vibrateButtonPress();
  await new Promise(resolve => setTimeout(resolve, 100)); // muhehe
}
