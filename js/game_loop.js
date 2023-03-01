//Init
var seenEnemiesString = JSON.parse(localStorage.getItem("seenEnemies"));
var seenEnemies;
var encountersTotal;
var encounterIndex;

if (seenEnemiesString == null){
  seenEnemies = [];
} else {
  seenEnemies = Array.from(seenEnemiesString); //load seen enemies
}

//Player stats
//var playerName = prompt("Enter your character's name: ","Nameless Hero") + ":&nbsp;&nbsp;";
var playerName = "Nameless Hero:&nbsp;&nbsp;"
var playerHpDefault = 3;
var playerHp;
var playerSta;
var playerAtk;
var gameLog = "";
renewPlayer();

//Enemy stats
var enemyLostHp = 0;
var enemyLostSta = 0;
var enemyHp;
var enemySta;
var enemyAtk;
var enemyType;

//Uncomment and change the int for testing ids higher than that
//seenEnemies = Array.from(Array(1).keys())

var lines;
var randomEnemyIndex;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/enemies.csv",
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
  redraw(getUnseenEnemyIndex());
  registerClickListeners();
}

function redraw(index){
  encounterIndex = index; //Prediction: This will cause trouble.

  //Player UI
  document.getElementById('id_player_name').innerHTML = playerName;
  var playerStatusString = "❤️ " + "▰".repeat(playerHp) + "▱".repeat((-1)*(playerHp-playerHpDefault)) + "&nbsp;&nbsp;"
  playerStatusString += "🗡 " + "×".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;

  selectedLine = String(lines[index]);
  //Enemy UI - id;emoji;name;type;hp;atk;sta;def;team;desc
  var enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  var enemyName = String(selectedLine.split(",")[2].split(":")[1]);
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
  document.getElementById('id_stats').innerHTML = enemyStatusString;

  var itemsLeft = encountersTotal-seenEnemies.length;
  document.getElementById('id_subtitle').innerHTML = "There are " + itemsLeft + " enemies awaiting defeat.";

  document.getElementById('id_log').innerHTML = gameLog;
  console.log("Redrawing... ("+enemyName+")")
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

function getUnseenEnemyIndex() {
  encountersTotal = lines.length;
  var max = encountersTotal;
    do {
      randomEnemyIndex = Math.floor(Math.random() * max);
      if (seenEnemies.length >= encountersTotal){
        gameEnd(); //Hmm, unsure if this ever happens
        break;
      }
    } while (seenEnemies.includes(randomEnemyIndex));
    return randomEnemyIndex;
}

function markAsSeen(seenID){
  if (!seenEnemies.includes(seenID)){
    seenEnemies.push(seenID);
    localStorage.setItem("seenEnemies", JSON.stringify(seenEnemies));
    console.log("Already seen IDs: " + seenEnemies);
  }
}

function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    actionFeedback(button);

    switch (button) {
      case 'button_attack':
        switch (enemyType){
          case "Item":
            itemLost();
            logAction("Bonk! Now the item is completely worthless.");
            break;
          default:
            if (enemySta-enemyLostSta < 1) {
              enemyStaminaChange(+1); //TODO CHANCE?
              enemyHit(playerAtk);
              logAction("The pain energized them.")
            } else {
              logAction("Enemy counter-attacked, hitting you for: "+enemyAtk)
              playerHit(enemyAtk);
            };
      }
      break;

      case 'button_block':
        switch (enemyType){
          case "Standard":
            enemyStaminaChange(-1);
            logAction("Succesful block, enemy lost energy.");
            break;
          case "Swift":
            enemyStaminaChange(-1);
            logAction("Succesful block, enemy lost energy.");
            break;
          case "Heavy":
            playerHit(enemyAtk);
            logAction("You failed to block heavy blow, hit for: "+enemyAtk)
            break;
          default:
            logAction("Suprisingly, nothing happened.");
        }
        break;

      case 'button_roll':
        switch (enemyType){
          case "Standard":
            enemyStaminaChange(-1);
            logAction("Succesful roll, enemy lost energy.");
            break;
          case "Swift":
            playerHit(enemyAtk);
            logAction("You rolled into enemy attack, hit for: "+enemyAtk);
            break;
          case "Heavy":
            enemyStaminaChange(-1);
            logAction("Succesful roll, enemy lost energy.");
            break;
          case "Item":
            itemLost();
            logAction("You rolled away. The item has been lost.");
            break;
          case "Trap":
            skipEncounter();
            logAction("You ignored that. Better safe than sorry.");
            break;
          default:
            logAction("It didn't feel right, so you changed your mind.");
        }
        break;

      case 'button_grab':
        switch (enemyType){
          case "Standard":
          case "Swift":
          case "Heavy":
            playerHit(enemyAtk*2);
            logAction("You touched them and got hit extra hard: "+enemyAtk*2);
            break;
          case "Trap":
            playerHit(100);
            logAction("You died instantenously!");//TODO
            break;
          case "Item": //TODO
            itemLost();
            //itemGained();
            logAction("You obtained something new. (TODO)");
            break;
          default:
            logAction("No, you cannot touch that!");
          }
          break;

      case 'button_sleep': //TODO
        logAction("༼  ಠ_ಠ  ༽ Cannot rest, there are monsters nearby!");
        break;

      case 'button_cheese': //DEBUG
          skipEncounter();
        break;

      default:
        console.log("Huh, button does not exist.");
    };
    redraw(encounterIndex);
  };
}

//Enemy
function renewEnemy(){
  enemyLostSta = 0;
  enemyLostHp = 0;
}

function enemyStaminaChange(stamina){
  enemyLostSta -= stamina;
  if (enemyLostSta >= enemySta) {
    enemyLostSta = enemySta;
  }
}

function enemyHit(damage){
  enemyLostHp = enemyLostHp + damage
  logAction("Succesful attack, hit them for:" + damage + ".");
  if (enemyLostHp >= enemyHp) {
    logAction("Enemy killed!");
    encounterIndex = getUnseenEnemyIndex();
    renewEnemy();
  }
}

function itemLost(){
  encounterIndex = getUnseenEnemyIndex();
  renewEnemy();
}

//Player
function renewPlayer(){
  playerHp = playerHpDefault;
  playerSta = 2;
  playerAtk = 1;
}

function skipEncounter(){
  encounterIndex = getUnseenEnemyIndex();
  renewEnemy();
}

function playerHit(incomingDamage){
  playerHp = playerHp - incomingDamage;
  if (playerHp <= 0){
    logAction("Game Over: YOU ARE DEAD!"); //Does not work :( due to the alert
    alert("༼  x_x  ༽  Welp, you are dead.");
    gameLog = "";
    renewPlayer();
    gameEnd();
  }
}

function gameEnd(){
  if (seenEnemies.length >= encountersTotal){
    logAction("Unbelievable, you finished the game!"); //Does not work :( due to the alert
    alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!");
  }
  localStorage.setItem("seenEnemies", JSON.stringify(""));
  seenEnemies = [];
  encounterIndex = getUnseenEnemyIndex();
}

//TECH SECTION
function logAction(message){
  gameLog = message + "<br>" + gameLog;
  if (gameLog.split("<br>").length > 3) {
    gameLog = gameLog.split("<br>").slice(0,3).join("<br>") + "<br>...";
  }
}

function vibrateButtonPress(){
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
  document.getElementById('button_cheese').addEventListener(eventType, resolveAction('button_cheese'));
}
