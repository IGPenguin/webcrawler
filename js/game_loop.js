//Init
var redrawnTimes = 0;
var seenEnemiesString = JSON.parse(localStorage.getItem("seenEnemies"));
var seenEnemies;
var quoteCount;
var quoteIndex;

if (seenEnemiesString == null){
  seenEnemies = [];
} else {
  seenEnemies = Array.from(seenEnemiesString);
}

//Player stats
var playerHp = 2;
var playerSta = 2;
var playerAtk = 1;

//Enemy stats
var enemyCurrentHp;

//Uncomment and change the int for testing ids higher than that
//seenEnemies = Array.from(Array(1).keys())

var tweet;
var lines;
var randomTopicIndex;

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
  redraw(getUnseenTopicIndex());
  registerClickListeners();
}

function redraw(index){
  redrawnTimes++;

  quoteIndex = index;
  selectedLine = String(lines[index]);

  // id;emoji;name;type;hp;atk;sta;def;desc
  var enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  var enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  var enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  var enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  var enemyAtk = String(selectedLine.split(",")[5].split(":")[1]);
  var enemySta = String(selectedLine.split(",")[5].split(":")[1]);
  var enemyDef = String(selectedLine.split(",")[5].split(":")[1]);
  var selectedDesc = String(selectedLine.split(",")[8].split(":")[1]);

  //tweet = String(enemyEmoji + " " + selectedTitle + "\n\n").replaceAll("<br>"," ") + String(selectedText).replaceAll("<br>","\n") + "\n\n" + selectedTopic + " at:";

  document.getElementById('id_emoji').innerHTML = enemyEmoji;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = selectedDesc;
  document.getElementById('id_type').innerHTML = "»  " + enemyType + " «";

  enemyCurrentHp = enemyHp; //TODO
  enemyLostHp = enemyHp-enemyCurrentHp;
  
  enemyCurrentHpString = "❤️ " + "▰".repeat(enemyCurrentHp)
  if (enemyLostHp > 0) { enemyCurrentHpString = enemyCurrentHpString.slice(0,-1*enemyLostHp) + "▱".repeat(enemyLostHp); } //YOLO

  document.getElementById('id_stats').innerHTML = enemyCurrentHpString;

  markAsSeen(quoteIndex);
  setQuest();
  celebrateSeeingItAll();

  var itemsLeft = quoteCount-seenEnemies.length;
  document.getElementById('id_subtitle').innerHTML = "There are " + itemsLeft + " enemies awaiting defeat.";
}

function randomItem(){
  vibrateButtonPress();
  redraw(getUnseenTopicIndex());
}

function previousItem(){
  vibrateButtonPress();
  var previousItemIndex = quoteIndex-1;
  if (previousItemIndex < 0){
    previousItemIndex = quoteCount-1;
  }
  redraw(previousItemIndex);
}

function nextItem(){
  //vibrateButtonPress();
  var nextItemIndex = quoteIndex+1;
  if (nextItemIndex > quoteCount-1){
    nextItemIndex = 0;
  }
  redraw(nextItemIndex);
}

function getUnseenTopicIndex() {
  quoteCount = lines.length;
  var max = quoteCount;
    do {
      randomTopicIndex = Math.floor(Math.random() * max);
      if (seenEnemies.length >= quoteCount){
        celebrateSeeingItAll();
        break;
      }
    } while (seenEnemies.includes(randomTopicIndex));
    return randomTopicIndex;
}

function markAsSeen(seenID){
  if (!seenEnemies.includes(seenID)){
    seenEnemies.push(seenID);
    localStorage.setItem("seenEnemies", JSON.stringify(seenEnemies));
    console.log("Already seen IDs: " + seenEnemies);
  }
}

function generateTweet(){
  vibrateButtonPress();
  var url = "http://twitter.com/intent/tweet?url=https://igpenguin.github.io/nomo&text=";
  var noTagsTweet=tweet.replace("<b>","").replace("</b>","");
  window.open(url+encodeURIComponent(noTagsTweet));
}

function setQuest(){
  var questTarget = 4;
  var remainingcards = questTarget-redrawnTimes;
  var questText = "🔴"+"&nbsp;&nbsp;"+"<b>Quest:</b> Vanquish some more enemies." // + remainingcards
  if (remainingcards <= 0) {questText = "🟢"+"&nbsp;&nbsp;"+"<b>Well done! </b> You've made this world a safer place."}
  document.getElementById('id_quest_text').innerHTML = questText;
}

function vibrateButtonPress(){
  //Vibrate on button press on Android devices
  if (!("vibrate" in window.navigator)){
    console.log("Vibrate not supported!");
    return;
  }
  window.navigator.vibrate([5,20,10]);
}

function celebrateSeeingItAll(){
  if (seenEnemies.length >= quoteCount){
    //alert("ʕつ•ᴥ•ʔつ  Congratulations! You saved the princess.");
    localStorage.setItem("seenEnemies", JSON.stringify(""));
    seenEnemies = [];
  }
}

async function performAction(buttonID, message){
  vibrateButtonPress();
  var button = document.getElementById(buttonID);
  var initialButtonText = button.innerText;
  button.innerText = "♻️ Working...";

  await new Promise(resolve => setTimeout(resolve, 100)); // muhehe
  button.innerText = initialButtonText;
  alert(message);
}

function resolveAction(){

}

function actionAttack(){
  performAction('button_attack',"༼ ╯°o° ༽╯ Welp, seems like you missed.");
}

function actionBlock(){
  performAction('button_block',"༼  >_<  ༽ You blocked a killing blow!");
}

function actionRoll(){
  performAction('button_roll',"༼ つ ◕_◕ ༽つ Oh, you don't know any spells.");
}

function actionSleep(){
  performAction('button_sleep',"༼  ಠ_ಠ  ༽ Cannot rest, there are monsters nearby!");
}

function actionCheese(){
  performAction('button_cheese',"༼ง •̀_•́ ༽ง You scared them away!");
  nextItem();
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
  document.getElementById('button_attack').addEventListener(eventType, actionAttack);
  document.getElementById('button_block').addEventListener(eventType, actionBlock);
  document.getElementById('button_roll').addEventListener(eventType, actionRoll);
  document.getElementById('button_sleep').addEventListener(eventType, actionSleep);
  document.getElementById('button_cheese').addEventListener(eventType, actionCheese);
}
