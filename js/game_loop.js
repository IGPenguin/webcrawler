//Tech init
var seenEncountersString = JSON.parse(localStorage.getItem("seenEncounters"));
var seenEncounters;
var encountersTotal;
var encounterIndex;

if (seenEncountersString == null){
  seenEncounters = [];
} else {
  seenEncounters = Array.from(seenEncountersString); //Load seen encounters
}

//Environment init
var adventureLog = "";

//Player stats init
var playerName = "Nameless Hero"
var playerHpDefault = 3
var playerStaDefault = 3;

var playerHpMax = playerHpDefault;
var playerStaMax = playerStaDefault;
var playerHp = playerHpMax-1; //Starting in a dream
var playerSta = playerStaMax;
var playerStaLost = 1; //Starting in a dream
var playerAtk;
var playerDef;
var playerInt;

var actionString;
var actionLog = "💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;You felt that something <b>hurt you</b> -1 💔<br>💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;It's pitch black, nothing to see or hear.<br>💤&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;You are wondering where you could be.";

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
  redraw(0); //Start from the first encounter
}

function getNextEncounterIndex(){
  encountersTotal = lines.length-1;
  var nextItemIndex = encounterIndex+1;
  if (nextItemIndex >= encountersTotal){ //Game Completed
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
  encounterIndex = index;
  selectedLine = String(lines[index]);

  //Player UI
  document.getElementById('id_player_name').innerHTML = playerName;
  var playerStatusString = "❤️ " + "▰".repeat(playerHp) + "▱".repeat((-1)*(playerHp-playerHpMax))
  if (playerSta > 0) { playerStatusString += "&nbsp;&nbsp;🟢 " + "▰".repeat(playerSta-playerStaLost) + "▱".repeat(playerStaLost);}
    if (playerStaLost > 0) { playerStatusString = playerStatusString.slice(0,-1*playerStaLost) + "▱".repeat(playerStaLost); } //YOLO
  playerStatusString += "&nbsp;&nbsp;🎯 " + "×".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;

  //Encounter data - area;emoji;name;type;hp;atk;sta;def;team;desc
  areaName = String(selectedLine.split(",")[0].split(":")[1]);
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
  document.getElementById('id_area').innerHTML = areaName;

  document.getElementById('id_emoji').innerHTML = enemyEmoji;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = enemyDesc;
  document.getElementById('id_team').innerHTML = "»&nbsp;&nbsp;" + enemyTeam + "&nbsp;&nbsp;«";

  var enemyStatusString = ""
  if (enemyHp > 0) { enemyStatusString = "❤️ " + "▰".repeat(enemyHp);}
    if (enemyHpLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyHpLost) + "▱".repeat(enemyHpLost); } //YOLO
  if (enemySta > 0) { enemyStatusString += "&nbsp;&nbsp;🟢 " + "▰".repeat(enemySta);}
    if (enemyStaLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyStaLost) + "▱".repeat(enemyStaLost); } //YOLO
  if (enemyAtk > 0) {enemyStatusString += "&nbsp;&nbsp;🎯 " + "×".repeat(enemyAtk);}
  if (enemyType.includes("Item") || enemyType.includes("Consumable") || enemyType.includes("Trap") || enemyType.includes("Prop")) {enemyStatusString = "❤️ ??&nbsp;&nbsp;🎯 ??";} //Blah, nasty hack
  if (enemyType.includes("Friend")) {enemyStatusString = "❤️ ??&nbsp;&nbsp;🟢 ??&nbsp;&nbsp;🎯 ??";} //Im just too tired today
  if (enemyType.includes("Dream")) {enemyStatusString = "💤 💤 💤";} //Im just too tired today, again
  document.getElementById('id_stats').innerHTML = enemyStatusString;
  document.getElementById('id_log').innerHTML = actionLog;
}

//Game logic
function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    actionString = document.getElementById(button).innerHTML;
    actionFeedback(button);

    switch (button) {
      case 'button_attack':
        if (!playerUseStamina(1)){
            logPlayerAction(actionString,"You are too tired for attacking 0 🟢");
            break;
          }
        switch (enemyType){
          case "Trap":
          case "Trap-Roll":
            logPlayerAction(actionString,"You smashed it into little pieces -1 🟢");
            nextEncounter();
            break;
          case "Trap-Attack":
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" ❤️");
            playerHit(enemyAtk);
            break;
          case "Item":
          case "Consumable":
            logPlayerAction(actionString,"You irreversibly destroyed that thing -1 🟢");
            nextEncounter();
            break;
          case "Friend":
            logPlayerAction(actionString,"You scared them to run away -1 🟢");
            nextEncounter();
            break;
          case "Heavy":
          case "Standard": //You hit first, they hit back if they have stamina
            logPlayerAction(actionString,"You hit them with an attack -"+playerAtk+" 💔")
            var enemyPostHitHp = enemyHp-enemyHpLost-playerAtk;
            enemyHit(playerAtk);
            if ((enemySta-enemyStaLost > 0) && (enemyPostHitHp > 0)) { //They counterattack or regain stamina
              enemyStaminaChangeMessage(-1,"They hit you with a counter-attack -"+enemyAtk+" 💔","n/a");
              playerHit(enemyAtk);
            } else {
              enemyRest(1);
            }
            break;
          case "Swift": //They hit you if they have stamina
            if (enemySta-enemyStaLost > 0) {
              enemyStaminaChangeMessage(-1,"They stopped you with a counter-attack -"+enemyAtk+" 💔","n/a");
              playerHit(enemyAtk);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","You hit them with an attack -"+playerAtk+" 💔");
              enemyHit(playerAtk);
            }
            break;
          default:
            logPlayerAction(actionString,"Your attack hit absolutely nothing -1 🟢");
            break;
      }
      break;

      case 'button_block':
        if (!playerUseStamina(1)){
          logPlayerAction(actionString,"You are too tired to raise shield 0 🟢");
          break;
        }
        switch (enemyType){
          case "Standard":
            enemyStaminaChangeMessage(-1,"You blocked their standard attack.","You wasted energy by blocking -1 🟢");
            break;
          case "Swift":
            enemyStaminaChangeMessage(-1,"You blocked their light attack.","You wasted energy by blocking -1 🟢");
            break;
          case "Heavy":
            if (enemySta-enemyStaLost > 0){
              enemyStaminaChangeMessage(-1,"You couldn't block their heavy blow&nbsp;&nbsp;-"+enemyAtk+" 💔","n/a");
              playerHit(enemyAtk);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","You wasted energy by blocking -1 🟢");
            }
            break;
          case "Dream":
              logPlayerAction(actionString,"You tried to <b>raise your shield</b> -1 🟢");
              break;
          default:
            logPlayerAction(actionString,"You wasted energy by blocking -1 🟢");
        }
        break;

      case 'button_roll':
        switch (enemyType){
          case "Standard":
            if (playerUseStamina(1)){
              enemyStaminaChangeMessage(-1,"You dodged their standard attack -1 🟢","Your roll was totally pointless -1 🟢");
            } else {
              logPlayerAction(actionString,"You are too tired to make a move 0 🟢");
            }
            break;
          case "Swift":
            if (playerUseStamina(1)){
              enemyStaminaChangeMessage(-1,"They hit you while you were rolling -"+enemyAtk+" 💔","You rolled into a surprise attack -"+enemyAtk+" 💔");
              playerHit(enemyAtk);
            } else {
              logPlayerAction(actionString,"You are too tired to make a move 0 🟢");
            }
            break;
          case "Heavy":
            if (playerUseStamina(1)){
              enemyStaminaChangeMessage(-1,"You dodged their heavy attack.","Your roll was pointless.");
            } else {
              logPlayerAction(actionString,"You are too tired to make a move 0 🟢");
            }
            break;
          case "Item":
          case "Consumable":
          case "Prop":
            logPlayerAction(actionString,"You rolled away leaving it all behind.");
            nextEncounter();
            break;
          case "Friend":
            logPlayerAction(actionString,"You rolled far away from them.");
            nextEncounter();
            break;
          case "Trap-Roll":
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            break;
          case "Trap":
          case "Trap-Attack":
            logPlayerAction(actionString,"You continued onwards, away from that.");
            nextEncounter();
            break;
          case "Dream":
            logPlayerAction(actionString,"<b>Combat actions</b> drain <b>energy</b> -1 🟢");
            nextEncounter();
          break;
          default:
            logPlayerAction(actionString,"Feels like nothing really happened.");
        }
        break;

      case 'button_grab':
        switch (enemyType){
          case "Standard":
            if ((enemySta - enemyStaLost) == 0 && playerStaLost < playerSta){ //If they are tired and player has stamina
              logPlayerAction(actionString,"You grabbed them into stranglehold.");
              enemyKnockedOut();
            } else {
              logPlayerAction(actionString,"You were too slow, they dodged that."); // Not enough stamina to choke
              enemyRest(1);
            }
            break;
          case "Swift":
            logPlayerAction(actionString,"They swiftly evaded your grasp.");
            enemyRest(1);
            break;
          case "Heavy":
            if (enemySta - enemyStaLost > 0){
              logPlayerAction(actionString,"You struggled and got hit hard -"+enemyAtk*2+" 💔");
              playerHit(enemyAtk+2);
            } else {
              playerPushAndGetStamina(2);
              enemyRest(1);
            }
            break;
          case "Trap":
          case "Trap-Roll":
          case "Trap-Attack":
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            break;
          case "Item":
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyDef, enemyInt);
            break;
          case "Friend":
            logPlayerAction(actionString,"It slipped through your fingers.");
            nextEncounter();
            break;
          case "Consumable":
            playerConsumed(enemyHp,enemySta);
            nextEncounter();
            break;
          case "Dream":
              logPlayerAction(actionString,"You <b>reached</b> out into the endless void.");
              break;
          default:
            logPlayerAction(actionString,"You reached out and nothing happened.");
          }
          break;

      case 'button_speak':
        switch (enemyType){
          case "Standard":
          case "Swift":
          case "Heavy":
            if (enemyInt < playerInt){
              logPlayerAction(actionString,"You convinced them to leave you alone.");
              nextEncounter();
            } else if ((enemyInt > (playerInt+2)) && enemyAtkBonus < 2) {
              logPlayerAction(actionString,"That made them more angry!");
              enemyAtkBonus+=1;
            } else {
              logPlayerAction(actionString,"They ignored whatever you said.");
            }
            enemyRest(1);
            break;
          case "Friend":
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyDef, enemyInt);
            break;
          case "Trap-Roll":
            logPlayerAction(actionString,"No one replied. Total silence...");
            break;
          case "Dream":
            logPlayerAction(actionString,"Your face is frozen, you can not <b>speak</b>.");
            break;
          default:
            logPlayerAction(actionString,"Your voice echoes around the area.");
        }
        break;

      case 'button_sleep':
        var playerPostHitHp = 1; //You can rest by default
        switch (enemyType){
          case "Standard":
          case "Swift":
          case "Heavy":
            //Opportunity to attack player
            if (enemySta - enemyStaLost > 0){
              playerPostHitHp=playerHp-enemyAtk;
            }
            enemyAttackIfPossible();
            if (playerPostHitHp > 0) { //Rest if alive
              playerGetStamina(1);
            }
            break;
          case "Trap":
          case "Trap-Attack":
          case "Trap-Roll":
          case "Item":
          case "Consumable":
          case "Prop":
            playerGetStamina(1);
            break; //Just rest to full if anything above
          case "Friend":
            logPlayerAction(actionString,"They got tired of waiting for you and left.");
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"You <b>cannot rest</b>, monsters are nearby.");
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
  enemyStaLost-=stamina;
  if (enemyStaLost < 0) {
    enemyStaLost = 0;
  }
}

function enemyStaminaChange(stamina){
  if (enemyStaLost < enemySta) {
    enemyStaLost -= stamina;
  } else {
    enemyStaLost += stamina
  }
}

function enemyStaminaChangeMessage(stamina,successMessage,failMessage){
  if (enemyStaLost < enemySta) {
    logPlayerAction(actionString,successMessage);
    enemyStaLost -= stamina;
  } else {
    logPlayerAction(actionString,failMessage);
    enemyStaLost += stamina
  }
}

function enemyHit(damage){
  enemyHpLost = enemyHpLost + damage
  if (enemyHpLost >= enemyHp) {
    playerGetStaminaSilent(2); //Is this too much?
    logAction(enemyEmoji + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + "💀&nbsp;&nbsp;You eliminated them and rested +2 🟢");
    nextEncounter();
  }
}

function enemyKnockedOut(){
  playerGetStaminaSilent(2); //Is this too much?
  logAction(enemyEmoji + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + "💤&nbsp;&nbsp;You knocked them out and rested +2 🟢");
  nextEncounter();
}

function enemyAttackIfPossible(){
  if (enemySta-enemyStaLost > 0) {
    enemyStaminaChangeMessage(-1,"The enemy attacked you for&nbsp;&nbsp;-"+enemyAtk+" ❤️","n/a");
    playerHit(enemyAtk);
  } else {
    enemyRest(1);
  }
}

function nextEncounter(){
  markAsSeen(encounterIndex);
  encounterIndex = getNextEncounterIndex();
  console.log("Starting new encounter:"+ encounterIndex);
  enemyRenew();
}

//Player
function playerGetStamina(stamina){
  if (playerStaLost < 1) { //Cannot get more
    logPlayerAction(actionString,"You just wasted a moment of your live.");
    return false;
  } else {
    logPlayerAction(actionString,"You rested and regained energy +" + stamina + " 🟢");
    playerStaLost -= stamina;
    return true;
  }
}

function playerGetStaminaSilent(stamina){
  if (playerStaLost < 1) { //Cannot get more
    logPlayerAction(actionString,"n/a");
    return false;
  } else {
    playerStaLost -= stamina;
    if (playerStaLost < 0){
      playerStaLost = 0;
    }
    return true;
  }
}

function playerPushAndGetStamina(stamina){
  if (playerStaLost < 1) { //Cannot get more
    return false;
  } else {
    logPlayerAction(actionString,"You pushed them away and rested +" + stamina + " 🟢");
    playerStaLost -= stamina;
    if (playerStaLost<0){
      playerStaLost = 0;
    }
    return true;
  }
}

function playerUseStamina(stamina){
  if (playerStaLost >= playerSta) { //Cannot lose more
    return false;
  } else {
    playerStaLost += stamina;
    if (playerStaLost > playerStaMax) {playerStaLost = playerStaMax;}
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
  logPlayerAction(actionString,gainedString);
  nextEncounter();
}

function playerConsumed(refreshHp,refreshSta){
  var consumedString = "Mmm, that felt quite refreshing "

  var wastedHp=(-1)*((playerHpMax-playerHp)-refreshHp);
  console.log("refreshHp:"+refreshHp);
  console.log("wastedHp"+wastedHp);
  var healedAmount = refreshHp - wastedHp;

  var wastedSta=refreshSta-playerStaLost;
  console.log("refreshSta"+refreshSta);
  console.log("wastedSta:"+wastedSta);
  var refreshedAmount = refreshSta - wastedSta;

  if ((playerHpMax-playerHp > 0) || (playerStaLost > 0)){

    if (healedAmount > 0){
      playerHp += healedAmount;
      consumedString += "+"+healedAmount + " ❤️ ";
    }

    if (refreshedAmount > 0){
      playerGetStaminaSilent(refreshedAmount);
      consumedString += "+"+refreshedAmount + " 🟢";
    }
  } else {
    var tooFullStaLost = 2;
    consumedString="You lost energy due to overeating -"+tooFullStaLost+" 🟢";
    playerUseStamina(tooFullStaLost);
  }
  logPlayerAction(actionString,consumedString);
}

function playerHit(incomingDamage){
  playerHp = playerHp - incomingDamage;
  if (playerHp <= 0){
    gameOver();
  }
}

function renewPlayer(){
  playerHp = playerHpDefault;
  playerSta = playerStaDefault;
  playerStaLost = 0;
  playerAtk = 1;
  playerDef = 0;
  playerInt = 1;
}

//End Game
function gameOver(){
  var deathMessage="🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;Unknown power ressurected your body.<br>🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;Hopefully it wasn't some tainted spell.";
  logAction(deathMessage);
  renewPlayer();

  //Reset progress to mid-tutorial
  resetSeenEncounters();
  encounterIndex=1;
  nextEncounter();
  alert("༼  x_x  ༽  Welp, you are dead.");
}

function gameEnd(){
  var winMessage="🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;You just had a deja vu, didn't you?<br>🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;It feels like you already did this. (NG+)";
  logAction(winMessage);

  //Reset progress to game start
  resetSeenEncounters();
  alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!\nSpecial thanks: 0melapics on Freepik and Stackoverflow");
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
  if (actionLog.split("<br>").length > 3) {
    actionLog = actionLog.split("<br>").slice(0,3).join("<br>");
  }
}

//UI Tech
function vibrateButtonPress(){
  if (!("vibrate" in window.navigator)){
    console.log("Vibrate not supported!");
    return;
  }
  window.navigator.vibrate([5,20,10]);
}

async function actionFeedback(buttonID){
  vibrateButtonPress();
  await new Promise(resolve => setTimeout(resolve, 100)); // muhehe
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
}
