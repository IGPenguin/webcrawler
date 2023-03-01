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
var actionString;
var actionLog = "You are slowly waking up<br>from what seemed like<br>an eternal slumber.<br>...";
renewPlayer();

//Enemy stats init
var enemyEmoji;
var enemyName;
var enemyHp;
var enemySta;
var enemyAtk;
var enemyType;

var enemyLostHp = 0;
var enemyLostSta = 0;

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
    console.log("Already seen IDs: " + seenEncounters);
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
  playerStatusString += "🗡 " + "×".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;

  selectedLine = String(lines[index]);
  //Enemy UI - id;emoji;name;type;hp;atk;sta;def;team;desc
  enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  enemyAtk = String(selectedLine.split(",")[5].split(":")[1]);
  enemySta = String(selectedLine.split(",")[6].split(":")[1]);
  var enemyDef = String(selectedLine.split(",")[7].split(":")[1]);
  var enemyTeam = String(selectedLine.split(",")[8].split(":")[1]);
  var enemyDesc = String(selectedLine.split(",")[9].split(":")[1]);

  document.getElementById('id_emoji').innerHTML = enemyEmoji;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = enemyDesc;
  document.getElementById('id_team').innerHTML = "»&nbsp;&nbsp;" + enemyTeam + "&nbsp;&nbsp;«";

  var enemyStatusString = ""
  if (enemyHp > 0) { enemyStatusString = "❤️ " + "▰".repeat(enemyHp);}
    if (enemyLostHp > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyLostHp) + "▱".repeat(enemyLostHp); } //YOLO
  if (enemySta > 0) { enemyStatusString += "&nbsp;&nbsp;🟢 " + "▰".repeat(enemySta);}
    if (enemyLostSta > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyLostSta) + "▱".repeat(enemyLostSta); } //YOLO
  if (enemyAtk > 0) {enemyStatusString += "&nbsp;&nbsp;🗡 " + "×".repeat(enemyAtk);}
  if ((enemyType == "Item") || (enemyType == "Trap")) {enemyStatusString = "❤️ ??&nbsp;&nbsp;🗡 ??"} //Blah, nasty hack
  document.getElementById('id_stats').innerHTML = enemyStatusString;

  var itemsLeft = encountersTotal-seenEncounters.length;
  document.getElementById('id_subtitle').innerHTML = lighLevelString;

  document.getElementById('id_log').innerHTML = actionLog;
  markAsSeen(encounterIndex); //LOL THIS WAS MISSING
  console.log("Redrawing... ("+enemyName+")")
}

function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    actionString = document.getElementById(button).innerHTML;
    actionFeedback(button);

    switch (button) {
      case 'button_attack':
        switch (enemyType){
          case "Item":
            logPlayerAction(actionString,"Bonk! The item was destroyed.");
            nextEncounter();
            break;
          default:
            if (enemySta-enemyLostSta < 1) {
              enemyStaminaChange(-1,"n/a","You hit them with an attack:&nbsp;&nbsp;-"+playerAtk+" ❤️");
              enemyHit(playerAtk);
            } else {
              enemyStaminaChange(-1,"A sudden counter-attack hit you:&nbsp;&nbsp;-"+enemyAtk+" ❤️","n/a");
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
            logPlayerAction(actionString,"You failed to block a heavy blow:&nbsp;&nbsp;-"+enemyAtk+" ❤️")
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
            enemyStaminaChange(-1,"You rolled right into an attack:&nbsp;&nbsp;-"+enemyAtk+" ❤️","Your roll was pointless.");
            playerHit(enemyAtk);
            break;
          case "Heavy":
            enemyStaminaChange(-1,"You dodged a heavy attack.","Your roll was pointless.");
            break;
          case "Item":
            logPlayerAction(actionString,"You rolled away. The item has been lost.");
            nextEncounter();
            break;
          case "Trap":
            logPlayerAction(actionString,"You rolled past that. Better safe than sorry.");
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"It didn't feel right, so you changed your mind.");
        }
        break;

      case 'button_grab':
        switch (enemyType){
          case "Standard":
          case "Swift":
          case "Heavy":
            logPlayerAction(actionString,"You touched them, they hit you extra hard:&nbsp;&nbsp;-"+enemyAtk*2+" ❤️");
            playerHit(enemyAtk*2);
            break;
          case "Trap":
            playerHit(100);
            logPlayerAction(actionString,"You died instantenously of some mischief!");
            break;
          case "Item":
            playerGained(enemyHp, enemyAtk);
            logPlayerAction(actionString,"You gained "+ enemyHp + " ❤️ and " + enemyAtk +" 🗡");
            break;
          default:
            logPlayerAction(actionString,"No, you cannot touch that!");
          }
          break;

      case 'button_sleep': //TODO
        logPlayerAction(actionString,"You cannot rest, there are monsters nearby!");
        break;

      case 'button_cheese': //DEBUG
        logPlayerAction(actionString,"Shame on you, cheesy bastard!");
          nextEncounter();
        break;

      default:
        console.log("Huh, that button does not exist.");
    };
    redraw(encounterIndex);
  };
}

//Enemy
function renewEnemy(){
  enemyLostSta = 0;
  enemyLostHp = 0;
}

function enemyStaminaChange(stamina,successMessage,failMessage){
  if (enemyLostSta < enemySta) {
    logPlayerAction(actionString,successMessage);
    enemyLostSta -= stamina;
  } else {
    logPlayerAction(actionString,failMessage);
    enemyLostSta += stamina

    //Avoid spamming log?
    //logAction(enemyEmoji + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + "⚡️&nbsp;&nbsp;They regained some energy.");
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
  encounterIndex = getUnseenEncounterIndex();
  renewEnemy();
}

//Player

function playerGained(bonusHp,bonusAtk){
  playerHpDefault = playerHpDefault + parseInt(bonusHp);
  playerHp = playerHp + parseInt(bonusHp);
  playerAtk = playerAtk + parseInt(bonusAtk);
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
}

//End Game
function gameOver(){
  actionLog="Unbelievable, you rise again.<br>Something brought you back alive.<br>Hopefully not necromancy.<br>...";
  renewPlayer();
  resetSeenEncounters();
  nextEncounter();
  alert("༼  x_x  ༽  Welp, you are dead.");
}

function gameEnd(){
  resetSeenEncounters();
  nextEncounter();
  alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!");
}

//Environment
function incrementLightLevel(){
  //Incr or Decr light level
  lighLevelString = "∙&nbsp;&nbsp;∙&nbsp;&nbsp;∙&nbsp;&nbsp;☀️&nbsp;&nbsp;∙&nbsp;&nbsp;∙&nbsp;&nbsp;∙" //Placeholder
}

//TECH SECTION
function logPlayerAction(actionString,message){
  actionString = actionString.substring(0,actionString.indexOf("&nbsp;")) + "&nbsp;&nbsp;▸&nbsp;&nbsp;" + enemyEmoji + "&nbsp;&nbsp;" + message + "<br>";
  adventureLog += actionString;
  actionLog = actionString + actionLog;
  if (actionLog.split("<br>").length > 3) {
    actionLog = actionLog.split("<br>").slice(0,3).join("<br>") + "<br>...";
  }
}

function logAction(message){
  actionLog = message + "<br>" + actionLog;
  if (actionLog.split("<br>").length > 3) {
    actionLog = actionLog.split("<br>").slice(0,3).join("<br>") + "<br>...";
  }
}

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
  //document.getElementById('button_cheese').addEventListener(eventType, resolveAction('button_cheese'));
}
