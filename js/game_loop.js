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
var playerHpDefault = 3;
var playerHp;
var playerSta;
var playerAtk;
initPlayer();

//Enemy stats
var enemyLostHp = 0;
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

  //Player
  var playerStatusString = "❤️ " + "▰".repeat(playerHp) + "▱".repeat((-1)*(playerHp-playerHpDefault)) + "&nbsp;&nbsp;"
  playerStatusString += "🗡 " + "×".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;

  //Enemy - id;emoji;name;type;hp;atk;sta;def;desc
  selectedLine = String(lines[index]);

  var enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  var enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  var enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  enemyAtk = String(selectedLine.split(",")[5].split(":")[1]);
  enemySta = String(selectedLine.split(",")[6].split(":")[1]);
  var enemyDef = String(selectedLine.split(",")[7].split(":")[1]);
  var selectedDesc = String(selectedLine.split(",")[8].split(":")[1]);

  document.getElementById('id_emoji').innerHTML = enemyEmoji;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = selectedDesc;
  document.getElementById('id_type').innerHTML = "»  " + enemyType + " «";

  enemyStatusString = "❤️ " + "▰".repeat(enemyHp);
    if (enemyLostHp > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyLostHp) + "▱".repeat(enemyLostHp); } //YOLO
  enemyStatusString = enemyStatusString + "&nbsp;&nbsp;🗡 " + "×".repeat(enemyAtk);

  document.getElementById('id_stats').innerHTML = enemyStatusString;

  var itemsLeft = encountersTotal-seenEnemies.length;
  document.getElementById('id_subtitle').innerHTML = "There are " + itemsLeft + " enemies awaiting defeat.";

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
        gameEnd("This shouldn't happen."); //Hmm, unsure if this ever happens
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

function resolveAction(button){
  return function(){ //Well, stackoverflow comes to the rescue
    actionFeedback(button);

    switch (button) {
      case 'button_attack':
        if (enemySta < 1) {
           enemyLostHp = enemyLostHp + playerAtk
           console.log("Succesful attack, enemyHp: " + enemyHp);
           if (enemyHp <= 0) { console.log("Enemy killed"); }
        } else {
           console.log("Enemy counter-attacks.")
           playerHit(enemyAtk);
        }
        break;

      case 'button_block':
        switch (enemyType){
          case "Swift":
            enemySta -= 1;
            console.log("Succesful block, enemySta: "+enemySta);
            break;
          case "Heavy":
            playerHit(enemyAtk);
            break;
          default:
            console.log("Unspecified reaction for enemy type.");
        }
        break;

      case 'button_roll':
        switch (enemyType){
          case "Swift":
            playerHit(enemyAtk);
            break;
          case "Heavy":
            console.log("Successful dodge.")
            break;
          default:
            console.log("Unspecified reaction for enemy type.");
        }
        break;

      case 'button_sleep': //TODO
        alert("༼  ಠ_ಠ  ༽ Cannot rest, there are monsters nearby!");
        break;

      case 'button_cheese': //DEBUG
        encounterIndex = getUnseenEnemyIndex();
        break;

      default:
        console.log("Huh, button does not exist.");
    };
    redraw(encounterIndex);
  };
}

//Player
function initPlayer(){
  playerHp = playerHpDefault;
  playerSta = 2;
  playerAtk = 1;
}

function playerHit(incomingDamage){
  playerHp = playerHp - incomingDamage;
  console.log("Ouch, you were hit for: " + incomingDamage + " currentHp: " + playerHp);

  if (playerHp <= 0){
    console.log("Game end: DEAD");
    alert("༼  x_x  ༽  Welp, you are dead.");
    gameEnd();
  }
}

function gameEnd(){
  if (seenEnemies.length >= encountersTotal){
    console.log("Game end: WIN");
    alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!");
  }
  localStorage.setItem("seenEnemies", JSON.stringify(""));
  seenEnemies = [];
  encounterIndex = getUnseenEnemyIndex();
  initPlayer();
}

//TECH SECTION
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
  document.getElementById('button_sleep').addEventListener(eventType, resolveAction('button_sleep'));
  document.getElementById('button_cheese').addEventListener(eventType, resolveAction('button_cheese'));
}
