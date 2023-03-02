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
var lightLevel = 1; //Light 1,2,3/4/3,2,1   Dark -1,-2,-3/-4/-3,-2,-1
var lighLevelString = "";
var adventureLog = "";

//Player stats init
//var playerName = prompt("Enter your character's name: ","Nameless Hero") + ":&nbsp;&nbsp;";
var playerName = "Nameless Hero:&nbsp;&nbsp;"
var playerHpDefault = 3;
var playerHp;
var playerSta;
var playerAtk;
var playerDef;
var playerInt;
var actionString;
var actionLog = "🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;\"You are waking up from seemingly<br>eternal slumber. Not knowing where you are.<br>Now it's time to find out.\"";
renewPlayer();

//Enemy stats init
var enemyEmoji;
var enemyName;
var enemyHp;
var enemyAtk;
var enemySta;
var enemyDef;
var enemyInt;
var enemyType;
var enemyMsg;

var enemyLostHp = 0;
var enemyLostSta = 0;
var enemyAtkBonus = 0;

//Uncomment and change the int for testing ids higher than that
//seenEncounters = Array.from(Array(1).keys())

var lines;
var randomEncounterIndex;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/forest-encounters.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

//Functions

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
  redraw(getUnseenEncounterIndex());
  registerClickListeners();
}

function previousItem(){ //Unused
  var previousItemIndex = encounterIndex-1;
  if (previousItemIndex < 0){
    previousItemIndex = encountersTotal-1;
  }
  redraw(previousItemIndex);
}

function nextItem(){ //Unused
  var nextItemIndex = encounterIndex+1;
  if (nextItemIndex > encountersTotal-1){
    nextItemIndex = 0;
  }
  redraw(nextItemIndex);
}

function getUnseenEncounterIndex() {
  console.log("Already seen IDs: " + seenEncounters);
  encountersTotal = lines.length;
  var max = encountersTotal;
    do {
      randomEncounterIndex = Math.floor(Math.random() * max);
      if (seenEncounters.length >= encountersTotal){
        gameEnd(); //Hmm, unsure if this ever happens
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
  encounterIndex = getUnseenEncounterIndex();
}

function redraw(index){
  incrementLightLevel();
  encounterIndex = index; //Prediction: This will cause trouble.

  //Player UI
  document.getElementById('id_player_name').innerHTML = playerName;
  var playerStatusString = "❤️ " + "▰".repeat(playerHp) + "▱".repeat((-1)*(playerHp-playerHpDefault)) + "&nbsp;&nbsp;"
  playerStatusString += "🎯 " + "×".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;

  selectedLine = String(lines[index]);
  //Enemy UI - id;emoji;name;type;hp;atk;sta;def;team;desc
  enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  enemyAtk = parseInt(String(selectedLine.split(",")[5].split(":")[1]))+enemyAtkBonus;
  enemySta = String(selectedLine.split(",")[6].split(":")[1]);
  var enemyDef = String(selectedLine.split(",")[7].split(":")[1]);
  enemyInt = String(selectedLine.split(",")[8].split(":")[1]);
  var enemyTeam = String(selectedLine.split(",")[9].split(":")[1]);
  var enemyDesc = String(selectedLine.split(",")[10].split(":")[1]);
  enemyMsg = String(selectedLine.split(",")[11].split(":")[1]);

  document.getElementById('id_emoji').innerHTML = enemyEmoji;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = enemyDesc;
  document.getElementById('id_team').innerHTML = "»&nbsp;&nbsp;" + enemyTeam + "&nbsp;&nbsp;«";

  var enemyStatusString = ""
  if (enemyHp > 0) { enemyStatusString = "❤️ " + "▰".repeat(enemyHp);}
    if (enemyLostHp > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyLostHp) + "▱".repeat(enemyLostHp); } //YOLO
  if (enemySta > 0) { enemyStatusString += "&nbsp;&nbsp;🟢 " + "▰".repeat(enemySta);}
    if (enemyLostSta > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyLostSta) + "▱".repeat(enemyLostSta); } //YOLO
  if (enemyAtk > 0) {enemyStatusString += "&nbsp;&nbsp;🎯 " + "×".repeat(enemyAtk);}
  if ((enemyType == "Item") || (enemyType == "Consumable") || (enemyType == "Trap")) {enemyStatusString = "❤️ ??&nbsp;&nbsp;🎯 ??"} //Blah, nasty hack
  document.getElementById('id_stats').innerHTML = enemyStatusString;

  var itemsLeft = encountersTotal-seenEncounters.length;
  document.getElementById('id_subtitle').innerHTML = lighLevelString;

  document.getElementById('id_log').innerHTML = actionLog;
  console.log("Redrawing... ("+enemyName+")")
}

function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    actionString = document.getElementById(button).innerHTML;
    actionFeedback(button);

    switch (button) {
      case 'button_attack':
        switch (enemyType){
          case "Trap":
            logPlayerAction(actionString,enemyMsg +"&nbsp;&nbsp;-"+enemyAtk+" ❤️");
            playerHit(enemyAtk);
            break;
          case "Item":
          case "Consumable":
            logPlayerAction(actionString,"Bonk! The item was destroyed.");
            nextEncounter();
            break;
          case "Item-Speak":
            logPlayerAction(actionString,"You scared them away!");
            nextEncounter();
            break;
          default:
            if (enemySta-enemyLostSta < 1) {
              enemyStaminaChange(-1,"n/a","You hit them with an attack&nbsp;&nbsp;-"+playerAtk+" ❤️");
              enemyHit(playerAtk);
            } else {
              enemyStaminaChange(-1,"A sudden counter-attack hit you&nbsp;&nbsp;-"+enemyAtk+" ❤️","n/a");
              playerHit(enemyAtk);
            };
      }
      break;

      case 'button_block':
        switch (enemyType){
          case "Standard":
            enemyStaminaChange(-1,"You blocked an attack.","Your blocking was pointless.");
            break;
          case "Swift":
            enemyStaminaChange(-1,"You blocked a light attack.","Your blocking was pointless.");
            break;
          case "Heavy":
            logPlayerAction(actionString,"You failed to block a heavy blow&nbsp;&nbsp;-"+enemyAtk+" ❤️")
            playerHit(enemyAtk);
            break;
          default:
            logPlayerAction(actionString,"Suprisingly, nothing happened.");
        }
        break;

      case 'button_roll':
        switch (enemyType){
          case "Standard":
            enemyStaminaChange(-1,"You dodged an attack.","Your roll was pointless.");
            break;
          case "Swift":
            enemyStaminaChange(-1,"You rolled right into an attack&nbsp;&nbsp;-"+enemyAtk+" ❤️","You rolled into a surprise attack&nbsp;&nbsp;-"+enemyAtk+" ❤️");
            playerHit(enemyAtk);
            break;
          case "Heavy":
            enemyStaminaChange(-1,"You dodged a heavy attack.","Your roll was pointless.");
            break;
          case "Item":
          case "Consumable":
            logPlayerAction(actionString,"You rolled away. The item has been lost.");
            nextEncounter();
            break;
          case "Trap":
            logPlayerAction(actionString,"Well... Better safe than sorry.");
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"Feels like nothing really happened.");
        }
        break;

      case 'button_grab':
        switch (enemyType){
          case "Standard":
          case "Swift":
          case "Heavy":
            logPlayerAction(actionString,"What? They hit you extra hard&nbsp;&nbsp;-"+enemyAtk*2+" ❤️");
            playerHit(enemyAtk*2);
            break;
          case "Trap":
            logPlayerAction(actionString,enemyMsg+"&nbsp;&nbsp;-"+enemyAtk+" ❤️");
            playerHit(enemyAtk);
            break;
          case "Item":
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyDef, enemyInt);
            break;
          case "Item-Speak":
            logPlayerAction(actionString,"It slipped through your fingers.");
            nextEncounter();
            break;
          case "Consumable":
            playerConsumed(enemyHp);
            var consumedString = "That was refreshing: +" + enemyHp + " ❤️"
            logPlayerAction(actionString,consumedString);
            break;
          default:
            logPlayerAction(actionString,"No, you cannot touch that!");
          }
          break;

      case 'button_speak':
        switch (enemyType){
          case "Standard":
          case "Swift":
          case "Heavy":
            if (enemyInt < playerInt){
              logPlayerAction(actionString,"You convinced them to leave.");
              nextEncounter();
            } else if ((enemyInt > 2*playerInt) && enemyAtkBonus < 2) {
              logPlayerAction(actionString,"That made them extra angry!");
              enemyAtkBonus+=1;
            } else {
              enemyStaminaChange(-1,"They didn't listen.","The conversation went wrong.");
            }
            break;
          case "Trap":
            logPlayerAction(actionString,"Your speaking has no effect.");
            break;
          case "Item":
          case "Consumable":
            logPlayerAction(actionString,"Seems like nobody is listening.");
            break;
          case "Item-Speak":
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyDef, enemyInt);
            break;
          default:
            logPlayerAction(actionString,"No, you cannot speak to this...");
        }
        break;

      case 'button_sleep': //TODO
        logPlayerAction(actionString,"You cannot rest, monsters are nearby!");
        break;
    };
    redraw(encounterIndex);
  };
}

//Enemy
function renewEnemy(){
  enemyLostSta = 0;
  enemyLostHp = 0;
  enemyAtkBonus = 0;
}

function enemyStaminaChange(stamina,successMessage,failMessage){
  if (enemyLostSta < enemySta) {
    logPlayerAction(actionString,successMessage);
    enemyLostSta -= stamina;
  } else {
    logPlayerAction(actionString,failMessage);
    enemyLostSta += stamina
  }
}

function enemyHit(damage){
  enemyLostHp = enemyLostHp + damage
  if (enemyLostHp >= enemyHp) {
    logAction(enemyEmoji + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + "💀&nbsp;&nbsp;You eliminated an enemy!");
    nextEncounter();
  }
}

function nextEncounter(){
  markAsSeen(encounterIndex);
  encounterIndex = getUnseenEncounterIndex();
  renewEnemy();
}

//Player

function playerGainedItem(bonusHp,bonusAtk,bonusSta,bonusDef,bonusInt){
  var gainedString = "You feel stronger: "
  if (bonusHp > 0) {
    playerHpDefault += parseInt(bonusHp);
    playerHp += parseInt(bonusHp);
    gainedString += "+"+bonusHp + " ❤️";
  }
  if (bonusAtk > 0){
    playerAtk += parseInt(bonusAtk);
    gainedString += "+"+bonusAtk + " 🎯";
  }
  if (bonusSta > 0){
    playerSta += parseInt(bonusSta);
    gainedString += "+"+bonusSta + " 🟢";
  }
  if (bonusDef > 0){
    playerDef += parseInt(bonusDef);
    gainedString += "+"+bonusDef + " 🛡";
  }
  if (bonusInt > 0){
    playerInt += parseInt(bonusInt);
    gainedString += "+"+bonusInt + " 🧠";
  }
  logPlayerAction(actionString,gainedString);
  nextEncounter();
}

function playerConsumed(bonusHp){
  if (playerHp > playerHpDefault){
    playerHp += bonusHp;
  }
  if (playerHp > playerHpDefault){
    playerHp = playerHpDefault;
  }
  nextEncounter();
}

function playerHit(incomingDamage){
  playerHp = playerHp - incomingDamage;
  if (playerHp <= 0){
    gameOver();
  }
}

function renewPlayer(){
  playerHp = playerHpDefault;
  playerSta = 2;
  playerAtk = 1;
  playerDef = 0;
  playerInt = 1;
}

//End Game
function gameOver(){
  var deathMessage="🧠&nbsp;&nbsp;▸&nbsp;&nbsp;💭&nbsp;&nbsp;\"Unbelievable, you feel alive once again.<br>Something powerful must've brought you back.\"";
  logAction(deathMessage);
  renewPlayer();
  resetSeenEncounters();
  nextEncounter();
  alert("༼  x_x  ༽  Welp, you are dead.");
}

function gameEnd(){
  resetSeenEncounters();
  nextEncounter();
  alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!\nSpecial thanks: 0melapics on Freepik and Stackoverflow");
}

//Environment
function incrementLightLevel(){
  //Incr or Decr light level
  //lighLevelString = "∙&nbsp;&nbsp;∙&nbsp;&nbsp;∙&nbsp;&nbsp;☀️&nbsp;&nbsp;∙&nbsp;&nbsp;∙&nbsp;&nbsp;∙" //Placeholder
  lighLevelString = "∙&nbsp;&nbsp;∙&nbsp;&nbsp;∙"
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
function vibrateButtonPress(){ //FIXME Samsung?
  if (!("vibrate" in window.navigator)){
    console.log("Vibrate not supported!");
    return;
  }
  window.navigator.vibrate([5,20,10]);
}

async function actionFeedback(buttonID){
  vibrateButtonPress();
  var button = document.getElementById(buttonID);
  var initialButtonText = button.innerText;
  button.innerText = "♻️ Working...";

  await new Promise(resolve => setTimeout(resolve, 100)); // muhehe
  button.innerText = initialButtonText;
}

function registerClickListeners(){
  //Essential, onTouchEnd event type usage is needed on mobile to enable vibration effects
  //Breaks interactions on loading the page using Dev Tools "mobile preview" followed by switching it off
  var eventType;
  if (!(navigator.userAgentData.mobile)){
    eventType = 'click';
  } else {
    eventType = 'touchend';
  }
  document.getElementById('button_attack').addEventListener(eventType, resolveAction('button_attack'));
  document.getElementById('button_block').addEventListener(eventType, resolveAction('button_block'));
  document.getElementById('button_roll').addEventListener(eventType, resolveAction('button_roll'));
  document.getElementById('button_grab').addEventListener(eventType, resolveAction('button_grab'));
  document.getElementById('button_sleep').addEventListener(eventType, resolveAction('button_sleep'));
  document.getElementById('button_speak').addEventListener(eventType, resolveAction('button_speak'));
}
