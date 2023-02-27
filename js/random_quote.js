//Init
var redrawnTimes = 0;
var seenIDsString = JSON.parse(localStorage.getItem("seenIDs"));
var seenIDs;
var quoteCount;
var quoteIndex;

if (seenIDsString == null){
  seenIDs = [];
} else {
  seenIDs = Array.from(seenIDsString);
}

//Uncomment and change the int for testing ids higher than that
//seenIDs = Array.from(Array(1).keys())

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

  var selectedEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  var selectedName = String(selectedLine.split(",")[2].split(":")[1]);
  var selectedType = String(selectedLine.split(",")[3].split(":")[1]);
  var selectedDesc = String(selectedLine.split(",")[9].split(":")[1]);

  //tweet = String(selectedEmoji + " " + selectedTitle + "\n\n").replaceAll("<br>"," ") + String(selectedText).replaceAll("<br>","\n") + "\n\n" + selectedTopic + " at:";

  document.getElementById('id_emoji').innerHTML = selectedEmoji;
  document.getElementById('id_name').innerHTML = selectedName;
  document.getElementById('id_stats').innerHTML =  "❤️ ◽◽◽◻ " + "\n" +"🗡 1";
  document.getElementById('id_desc').innerHTML = selectedDesc;
  document.getElementById('id_type').innerHTML = "»  " + selectedType + " «";

  markAsSeen(quoteIndex);
  setQuest();
  celebrateSeeingItAll();

  var itemsLeft = quoteCount-seenIDs.length;
  document.getElementById('id_subtitle').innerHTML = "There are " + itemsLeft + " enemies waiting for defeat.";
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
  vibrateButtonPress();
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
      if (seenIDs.length >= quoteCount){
        celebrateSeeingItAll();
        break;
      }
    } while (seenIDs.includes(randomTopicIndex));
    return randomTopicIndex;
}

function markAsSeen(seenID){
  if (!seenIDs.includes(seenID)){
    seenIDs.push(seenID);
    localStorage.setItem("seenIDs", JSON.stringify(seenIDs));
    console.log("Already seen IDs: " + seenIDs);
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
  var questText = "🔴"+"&nbsp;&nbsp;"+"<b>Daily Goal:</b> Vanquish another " + remainingcards + " monsters."
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
  if (seenIDs.length >= quoteCount){
    alert("ʕつ•ᴥ•ʔつ  Congratulations! You saved the princess.")
    localStorage.setItem("seenIDs", JSON.stringify(""));
    seenIDs = [];
  }
}

function actionAttack(){
  alert("༼ ಠ_ಠ ༽ Welp, seems like you hit a wall.");
}

function actionBlock(){
  die();
}

function actionMagic(){
  alert("༼ つ ◕_◕ ༽つ Oh, you don't know any spells.");
}

function actionHeal(){
  die();
}

function actionSleep(){
  alert("༼ ಠ_ಠ ༽ You cannot rest. There are monsters nearby!");
}

function die(){
  alert("༼ >_< ༽ You died of being killed!");
  localStorage.setItem("seenIDs", JSON.stringify(""));
  seenIDs = [];
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
  document.getElementById('button_magic').addEventListener(eventType, actionMagic);
  document.getElementById('button_heal').addEventListener(eventType, actionHeal);
  document.getElementById('button_sleep').addEventListener(eventType, actionSleep);
}
