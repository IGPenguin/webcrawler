//Init
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
  redraw(getUnseenTopicIndex());
}

function previousItem(){
  var previousItemIndex = quoteIndex-1;
  if (previousItemIndex < 0){
    previousItemIndex = quoteCount-1;
  }
  redraw(previousItemIndex);
}

function nextItem(){
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
  var questText = "🔴"+"&nbsp;&nbsp;"+"<b>Quest:</b> Vanquish some more enemies."
  document.getElementById('id_quest_text').innerHTML = questText;
}

function celebrateSeeingItAll(){
  if (seenEnemies.length >= quoteCount){
    //alert("ʕつ•ᴥ•ʔつ  Congratulations! You saved the princess.");
    localStorage.setItem("seenEnemies", JSON.stringify(""));
    seenEnemies = [];
  }
}

function resolveAction(button){
  return function(){ //Well, stackoverflow comes to the rescue
    actionFeedback(button);

    switch(button){
      case 'button_attack':
        console.log("Attack")
        break;
      case 'button_block':
        console.log("Block")
        break;
      case 'button_roll':
        console.log("Roll")
        break;
      case 'button_sleep':
        console.log("Sleep")
        break;
      case 'button_cheese':
        console.log("Cheese")
        nextItem();
        break;
      default:
        console.log("Huh, something is wrong.");
        
    };
  };
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
