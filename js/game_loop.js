//Having all this in a one file is truly shameful
//...submit pull request if you dare

//Tech init
var versionCode = "work-in-progress, ver. 3/16/23"
var cardUIElement;
var emojiUIElement;
var enemyInfoUIElement;
var playerInfoUIElement;

var seenEncountersString = JSON.parse(localStorage.getItem("seenEncounters"));
var seenEncounters;
var encountersTotal;
var encounterIndex;

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
var playerHpDefault = 3
var playerStaDefault = 3;

var playerHpMax = playerHpDefault;
var playerStaMax = playerStaDefault;
var playerHp = playerHpMax;
var playerSta = playerStaMax;
var playerAtk = 1;
var playerDef = 0;
var playerInt = 1;

var actionString;
var actionLog = "💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;You hear some faint echoing screams.<br>💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;It's pitch black, you can't see anything.<br>💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;You feel a strange presence nearby.\n";
var adventureLog = actionLog;


//Enemy stats init
var enemyEmoji;
var enemyName;
var enemyHp;
var enemyAtk;
var enemySta;
var enemyDef;
var enemyInt;
var enemyType;
var enemyTeam;
var enemyDesc;
var enemyMsg;

var enemyHpLost = 0;
var enemyStaLost = 0;
var enemyAtkBonus = 0;
var lines;
var randomEncounterIndex;

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
  redraw(1); //Start from the first encounter (0 is dead)
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
  console.log("Seen line indexes reset.");
  localStorage.setItem("seenEncounters", JSON.stringify(""));
  seenEncounters = [];
}

//UI Logic
function redraw(index){
  document.getElementById('id_version').innerHTML = versionCode;
  encounterIndex = index;
  selectedLine = String(lines[index]);

  //Player UI
  playerInfoUIElement= document.getElementById('id_player_info');
  document.getElementById('id_player_name').innerHTML = playerName;
  var playerStatusString = "❤️ " + "▰".repeat(playerHp) + "▱".repeat((-1)*(playerHp-playerHpMax));
  playerStatusString += "&nbsp;&nbsp;🟢 " + "▰".repeat(playerSta) + "▱".repeat(playerStaMax-playerSta);
  playerStatusString += "&nbsp;&nbsp;🎯 " + "×".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;
  document.getElementById('id_player_party_loot').innerHTML = "";
  if (playerPartyString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "<b>Party:</b> " +playerPartyString;
  }
  if (playerLootString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "&nbsp;&nbsp;<b>Loot:</b> "+playerLootString;
  }
  if (playerPartyString.length+playerLootString.length == 0) {
    document.getElementById('id_player_party_loot').innerHTML = "∙∙∙";
  }

  //Encounter data - area;emoji;name;type;hp;atk;sta;def;team;desc
  var areaName = String(selectedLine.split(",")[0].split(":")[1]);
  enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  enemyAtk = parseInt(String(selectedLine.split(",")[5].split(":")[1]))+enemyAtkBonus;
  enemySta = String(selectedLine.split(",")[6].split(":")[1]);
  enemyDef = String(selectedLine.split(",")[7].split(":")[1]);
  enemyInt = String(selectedLine.split(",")[8].split(":")[1]);
  enemyTeam = String(selectedLine.split(",")[9].split(":")[1]);
  enemyDesc = String(selectedLine.split(",")[10].split(":")[1]);
  enemyMsg = String(selectedLine.split(",")[11].split(":")[1]);

  //Encounter UI
  cardUIElement = document.getElementById('id_card');
  enemyInfoUIElement = document.getElementById('id_enemy_info');
  emojiUIElement = document.getElementById('id_emoji');

  emojiUIElement.innerHTML = enemyEmoji;
  document.getElementById('id_area').innerHTML = areaName;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = enemyDesc;
  document.getElementById('id_team').innerHTML = "»&nbsp;&nbsp;" + enemyTeam + "&nbsp;&nbsp;«";

  var enemyStatusString = ""
  if (enemyHp > 0) { enemyStatusString = "❤️ " + "▰".repeat(enemyHp);}
    if (enemyHpLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyHpLost) + "▱".repeat(enemyHpLost); } //YOLO
  if (enemySta > 0) { enemyStatusString += "&nbsp;&nbsp;🟢 " + "▰".repeat(enemySta);}
    if (enemyStaLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyStaLost) + "▱".repeat(enemyStaLost); } //YOLO
  if (enemyAtk > 0) {enemyStatusString += "&nbsp;&nbsp;🎯 " + "×".repeat(enemyAtk);}
  if (enemyType.includes("Item") || enemyType.includes("Trap")) {enemyStatusString = "❤️ ??&nbsp;&nbsp;🎯 ??";} //Blah, nasty hack
  if (enemyType.includes("Friend")) {enemyStatusString = "❤️ ??&nbsp;&nbsp;🟢 ??&nbsp;&nbsp;🎯 ??";} //Im just too tired today
  if (enemyType.includes("Dream")||enemyType.includes("Prop")||enemyType.includes("Container")) {enemyStatusString = "∙  ∙  ∙";} //Im just too tired today, again
  if (enemyType.includes("Consumable")) {enemyStatusString = "+ ❤️&nbsp;&nbsp;+ 🟢";} //Im just too tired today, again and again
  if (enemyType.includes("Death")) {enemyStatusString = "🦴&nbsp;&nbsp;🦴&nbsp;&nbsp;🦴";} //Im just too tired today, for the last time

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
            if (enemySta - enemyStaLost <=0){
              logPlayerAction(actionString,"You hit them with a critical attack -"+(playerAtk+2)+" 💔");
              enemyHit(playerAtk+2); //Critical attack if they are exhausted
              break;
            }
          case "Standard": //You hit first, they hit back if they have stamina
          case "Recruit":
          case "Pet":
            logPlayerAction(actionString,"Your attack successfully hit them -"+playerAtk+" 💔")
            var enemyPostHitHp = enemyHp-enemyHpLost-playerAtk;
            enemyHit(playerAtk);
            if ((enemySta-enemyStaLost > 0) && (enemyPostHitHp > 0)) { //They counterattack or regain stamina
              enemyStaminaChangeMessage(-1,"They hit you with a counter-attack -"+enemyAtk+" 💔","n/a");
              playerHit(enemyAtk);
            } else if (enemyPostHitHp > 0) {
              enemyRest(1);
            }
            break;
          case "Swift": //They hit you if they have stamina
            if (enemySta-enemyStaLost > 0) {
              enemyStaminaChangeMessage(-1,"They dodged and counter-attacked -"+enemyAtk+" 💔","n/a");
              playerHit(enemyAtk);
            } else {
              enemyHit(playerAtk);
              enemyStaminaChangeMessage(-1,"n/a","You hit them with an attack -"+playerAtk+" 💔");
            }
            break;
          case "Death":
            logPlayerAction(actionString,"There is nothing to attack anymore.");
            break;
          default:
            logPlayerAction(actionString,"Your attack attempt had no effect -1 🟢");
            displayEnemyEffect("〽️");
      }
      break;

      case 'button_block':
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
            if (enemyStaminaChangeMessage(-1,"You didn't block their heavy blow&nbsp;&nbsp;-"+enemyAtk+" 💔","n/a")){
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
              enemyStaminaChangeMessage(-1,"You dodged their heavy attack.","Your rolling was a waste of energy  -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;
          case "Item":
          case "Consumable":
            logPlayerAction(actionString,"You walked away leaving it behind.");
            displayPlayerEffect("👣");
            nextEncounter();
            break;
          case "Container":
            logPlayerAction(actionString,"You walked away without looking inside.");
            displayPlayerEffect("👣");
            encounterIndex+=1; //Skip loot
            nextEncounter();
            break;
          case "Dream":
            logPlayerAction(actionString,"You walked further along the road.");
            displayPlayerEffect("👣");
            nextEncounter();
            break;
          case "Prop":
            logPlayerAction(actionString,"You continued on your adventure.");
            displayPlayerEffect("👣");
            nextEncounter();
            break;
          case "Friend":
            logPlayerAction(actionString,"You walked far away from them.");
            displayPlayerEffect("👣");
            nextEncounter();
            break;
          case "Trap-Roll": //You get damage rolling into "Trap-Roll" type encounters
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            break;
          case "Trap":
          case "Trap-Attack":
            logPlayerAction(actionString,"You continued onwards away from that.");
            displayPlayerEffect("👣");
            nextEncounter();
            break;
          case "Death":
            logPlayerAction(actionString,"There is nothing to avoid anymore.");
            animateUIElement(playerInfoUIElement,"animate__headShake","0.7");
            break;
          default:
            logPlayerAction(actionString,"Feels like nothing really happened.");
        }
        break;

      case 'button_grab': //Player vs encounter stamina decides the success
        switch (enemyType){
          case "Pet": //Can become pet it when the player has higher current stamina
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){
              if (enemyInt > playerInt ) { //Cannot become a party member if it has higher int than the player
                logPlayerAction(actionString,"You need to be wiser to befriend them.");
                break;
              }
              logPlayerAction(actionString,"You petted it and became friends!");
              displayPlayerEffect("💖");
              playerPartyString+=" "+enemyEmoji;
              playerAtk+=enemyAtk;
              nextEncounter();
              break;
            }
          case "Recruit":
          case "Standard": //Player vs encounter stamina - knockout, dodge or asymmetrical rest
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){ //If they are tired and player has stamina
              logPlayerAction(actionString,"You grabbed them into stranglehold.");
              enemyKnockedOut();
            } else if (enemySta - enemyStaLost > 0){ //Enemy dodges if they got stamina
              logPlayerAction(actionString,"You were too slow, they dodged that.");
              displayPlayerCannotEffect();
              enemyRest(1);
            } else { //Player and enemy have no stamina - asymetrical rest
              logPlayerAction(actionString,"You kicked them afar and gained +2 🟢");
              displayEnemyEffect("🦶");
              playerGetStamina(2,true);
              enemyRest(1);
            }
            break;
          case "Swift": //Player cannot grab swift enemies
            logPlayerAction(actionString,"They swiftly evaded your grasp.");
            displayEnemyEffect("🌀");
            enemyRest(1);
            break;
          case "Heavy":
            if (enemySta - enemyStaLost > 0){ //Enemy hits extra hard if they got stamina
              logPlayerAction(actionString,"You struggled and got hit hard -"+enemyAtk*2+" 💔");
              playerHit(enemyAtk+2);
            } else { //Enemy has no stamina - asymetrical rest
              logPlayerAction(actionString,"You kicked out of balance and gained +2 🟢");
              displayEnemyEffect("🦶");
              playerGetStamina(2,true);
              enemyRest(1);
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
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyDef, enemyInt);
            break;
          case "Friend":
            logPlayerAction(actionString,"It slipped through your fingers.");
            displayEnemyEffect("✋");
            nextEncounter();
            break;
          case "Consumable":
            playerConsumed();
            displayPlayerEffect("🍽");
            nextEncounter();
            break;
          case "Dream":
            logPlayerAction(actionString,"You reached out into the endless void.");
            displayEnemyEffect("✋");
            break;
          case "Death":
            renewPlayer();
            logPlayerAction(actionString,"Your body reconnected with your soul.");
            var deathMessage="💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;An unknown power resurrected you.<br>💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;Hopefully it wasn't some tainted spell.";
            logAction(deathMessage);
            encounterIndex=4; //Skip tutorial
            displayEnemyEffect("✋");
            nextEncounter();
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
              displayPlayerEffect("💬");
              animateUIElement(playerInfoUIElement,"animate__tada","1"); //Animate player gain
              playerPartyString+=" "+enemyEmoji
              playerAtk+=enemyAtk;
              nextEncounter();
              break;
            }
          case "Standard":
          case "Swift":
          case "Heavy":
          case "Pet":
            if (enemyInt < playerInt){
              logPlayerAction(actionString,"You convinced them to leave you alone.");
              nextEncounter();
            } else if ((enemyInt > (playerInt+2)) && enemyAtkBonus < 2) {
              logPlayerAction(actionString,"That made them more angry!");
              enemyAtkBonus+=1;
            } else {
              logPlayerAction(actionString,"They ignored whatever you said.");
            }
            displayPlayerEffect("💬");
            enemyRest(1);
            break;
          case "Friend":
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyDef, enemyInt);
            displayPlayerEffect("💬");
            break;
          case "Death":
            logPlayerAction(actionString,"Your legend was copied into clipboard.");
            displayPlayerEffect("💌");
            adventureLog = adventureLog.replaceAll("<br>","\n").replaceAll("&nbsp;&nbsp;"," ");
            adventureLog += "\nCharacter: "+playerName +"\n"+"Party: "+playerPartyString+ "  Loot: "+playerLootString+"\n"+"❤️ "+"▰".repeat(playerHpMax)+"  🟢 "+"▰".repeat(playerStaMax)+"  🎯 " + "×".repeat(playerAtk)+"\n";
            adventureLog += "\nhttps://igpenguin.github.io/webcrawler\n"+ versionCode;
            navigator.clipboard.writeText(adventureLog);
            break;
          case "Dream":
            logPlayerAction(actionString,"You can not move your lips to speak.");
            displayPlayerCannotEffect();
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
            if ((playerHp-enemyAtk>0)||(enemySta-enemyStaLost==0)){
              displayPlayerEffect("💤");
              playerGetStamina(1);
            }
            enemyAttackIfPossible();
            break;
          case "Trap":
          case "Trap-Attack":
          case "Trap-Roll":
          case "Item":
          case "Consumable":
          case "Prop":
          case "Dream":
          case "Container":
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
            logPlayerAction(actionString,"You can rest as long as you please.");
            displayPlayerEffect("💤");
            break;
          default:
            logPlayerAction(actionString,"You cannot rest, monsters are nearby.");
            displayPlayerCannotEffect();
            displayPlayerEffect("👀");
            break
        }
    };
    redraw(encounterIndex);
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

function enemyAnimateDeathNextEncounter(){
  animateUIElement(emojiUIElement,"animate__fadeOutDown","0.75");
  var animationHandler = function(){
    nextEncounter();
    redraw(encounterIndex);
    emojiUIElement.removeEventListener("animationend",animationHandler);
  }
  emojiUIElement.addEventListener('animationend',animationHandler);
}

function enemyHit(damage){
  displayEnemyEffect("💢");
  enemyHpLost = enemyHpLost + damage;
  if (enemyHpLost >= enemyHp) {
    enemyHpLost=enemyHp; //Negate overkill damage
    logAction(enemyEmoji + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + "💀&nbsp;&nbsp;You successfully eliminated them.");
    enemyAnimateDeathNextEncounter();
  } else {
    animateUIElement(enemyInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  }
}

function enemyKnockedOut(){
  logAction(enemyEmoji + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + "💤&nbsp;&nbsp;You knocked them out of conscioussnes.");
  displayEnemyEffect("💤");
  enemyAnimateDeathNextEncounter();
}

function enemyAttackIfPossible(){
  if (enemySta-enemyStaLost > 0) {
    enemyStaminaChangeMessage(-1,"The enemy attacked you for -"+enemyAtk+" 💔","n/a");
    playerHit(enemyAtk);
  } else {
    enemyRest(1);
  }
}

function nextEncounter(){
  markAsSeen(encounterIndex);
  encounterIndex = getNextEncounterIndex();
  enemyRenew();
  animateUIElement(cardUIElement,"animate__fadeIn","0.7");
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

function playerGainedItem(bonusHp,bonusAtk,bonusSta,bonusDef,bonusInt){
  var gainedString;
  if (enemyMsg != "") {
    gainedString = enemyMsg;
  } else {
    gainedString="You feel somehow stronger";
  }
  if (bonusHp > 0) {
    playerHpMax += parseInt(bonusHp);
    playerHp += parseInt(bonusHp);
    gainedString += " +"+bonusHp + " ❤️";
  }
  if (bonusAtk > 0){
    playerAtk += parseInt(bonusAtk);
    gainedString += " +"+bonusAtk + " 🎯";
  }
  if (bonusSta > 0){
    playerStaMax += parseInt(bonusSta);
    playerSta += parseInt(bonusSta);
    gainedString += " +"+bonusSta + " 🟢";
  }
  if (bonusDef > 0){
    playerDef += parseInt(bonusDef);
    gainedString += " +"+bonusDef + " 🛡";
  }
  if (bonusInt > 0){
    playerInt += parseInt(bonusInt);
    gainedString += " +"+bonusInt + " 🧠";
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
  playerHp = playerHp - incomingDamage;
  animateUIElement(playerInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  if (playerHp <= 0){
    playerHp=0; //Prevent redraw issues post-overkill
    gameOver();
    return;
  }
  displayPlayerEffect("💢");
}

//End Game
function gameOver(){
  //Reset progress to death encounter
  resetSeenEncounters();
  logAction(enemyEmoji+"&nbsp;&nbsp;▸&nbsp;&nbsp;💀&nbsp;&nbsp;You were killed, the adventure ends. ")
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  nextEncounter();
  animateUIElement(emojiUIElement,"animate__flip","1");
  playerSta=0;
}

function gameEnd(){
  var winMessage="🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;You just had a deja vu, didn't you?<br>🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;It feels like you already did this. (NG+)";
  logAction(winMessage);

  //Reset progress to game start
  resetSeenEncounters();
  encounterIndex=4;
  alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!\nSpecial thanks: 0melapics on Freepik.com, https://animate.style and Stackoverflow.com");
}

//Logging
function logPlayerAction(actionString,message){
  actionString = actionString.substring(0,actionString.indexOf("&nbsp;")) + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + enemyEmoji + "&nbsp;&nbsp;" + message + "<br>";
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

//UI Tech
function resetEncounterButtons(){
  document.getElementById('button_attack').innerHTML="🎯&nbsp;&nbsp;Attack";
  document.getElementById('button_block').innerHTML="🛡&nbsp;&nbsp;Block";
  document.getElementById('button_roll').innerHTML="🌀&nbsp;&nbsp;Roll";
  document.getElementById('button_grab').innerHTML="✋&nbsp;&nbsp;Grab";
  document.getElementById('button_sleep').innerHTML="💤&nbsp;&nbsp;Rest";
  document.getElementById('button_speak').innerHTML="💬&nbsp;&nbsp;Speak";
}

function adjustEncounterButtons(){
  resetEncounterButtons();
  switch (enemyType){
    case "Container":
      document.getElementById('button_grab').innerHTML="👋&nbsp;&nbsp;Search";
      document.getElementById('button_roll').innerHTML="👣&nbsp;&nbsp;Walk";
      break;
    case "Consumable":
      document.getElementById('button_roll').innerHTML="👣&nbsp;&nbsp;Walk";
      break;
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋&nbsp;&nbsp;Touch";
    case "Item":
    case "Trap":
    case "Trap-Roll":
    case "Trap-Attack":
    case "Prop":
    case "Dream":
      document.getElementById('button_roll').innerHTML="👣&nbsp;&nbsp;Walk";
      break;
    case "Pet":
      if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){
        document.getElementById('button_grab').innerHTML="💖&nbsp;&nbsp;Adopt";
      }
    case "Recruit":
      if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){ //If they are tired and you are smarter they join you
        document.getElementById('button_speak').innerHTML="💬&nbsp;&nbsp;Recruit";
      }
    case "Standard":
    case "Swift":
    case "Heavy":
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) { //Applies for all above without "break;"
        document.getElementById('button_grab').innerHTML="🦶&nbsp;&nbsp;Kick";
      }
      break;
    case "Death":
      document.getElementById('button_speak').innerHTML="💌&nbsp;&nbsp;Share";
    default:
  }
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
  if (String(navigator.userAgentData) != "undefined"){ //Any browser except Chrome needs this, it took only 3 hours to realize
    if (navigator.userAgentData.mobile){
      eventType = 'touchend';
    }
  }
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
    redraw(encounterIndex);
  });
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
