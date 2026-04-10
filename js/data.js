//Load encounter data .csv file on page ready
var _csvStoryLoaded = false;
var _pendingStart   = null; // null | true (continue) | false (new game)

$(document).ready(function() {
  Menu.init(); // show menu while CSVs load in background

  $.ajax({
    type: "GET",
    url: "data/story.csv",
    dataType: "text",
    success: function(data) {
      storyData = data;
      _csvStoryLoaded = true;
      if (_pendingStart !== null) _doStartGame(_pendingStart);
    }
  });

  $.ajax({
    type: "GET",
    url: "data/encounters.csv",
    dataType: "text",
    success: function(data) {
      processEncounterData(data);
    }
  });
});

function startGame(isContinue) {
  if (_csvStoryLoaded) {
    _doStartGame(isContinue);
  } else {
    _pendingStart = isContinue;
    var btn = document.getElementById(isContinue ? 'menu_continue' : 'menu_new_game');
    if (btn && !btn.innerHTML.includes('…')) btn.innerHTML += ' …';
  }
}

function _doStartGame(isContinue) {
  _pendingStart = null;
  Menu.hide();

  if (isContinue) {
    var saved = SaveManager.loadGameState();
    if (saved) {
      SaveManager.restoreGameState(saved);
      // linesGenerator / linesLoot are rebuilt from encounters.csv on every load — no restore needed
      redraw();
      registerClickListeners(!isLocalhost() ? 4000 : 0);
      registerClickListenersTechnical();
      curtainFadeInAndOut("<p style=\"color:"+colorRed+";-webkit-text-stroke: 6.5px black;paint-order: stroke fill;letter-spacing:1.8px;line-height:1px;font-size:74px;font-weight:700;\">Stay Dead</p><p style=\"font-size:16px;line-height:18px;letter-spacing:1.2px\""+decorateStatusText("","<br>"+emptySpace.repeat(41)+"by IGPenguin",colorWhite),3.5);
      animateUIElement(emojiUIElement,"animate__pulse","2",false,"",true);
      return;
    }
  }

  processStoryData(storyData);
  if (!isLocalhost()) { registerClickListeners(4000); } else { registerClickListeners(0); }
  registerClickListenersTechnical();
}

//Process csv into lines of encounters
function processStoryData(allText, initNextEncounter=true,encounterIndex=0) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  linesStory = [];

  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(';');
      if (data.length == headers.length) {

          var tarr = [];
          for (var j=0; j<headers.length; j++) {
              tarr.push(headers[j]+":"+data[j]);
          }
        linesStory.push(tarr);
  }
  }

  if (initNextEncounter){
    loadEncounter(1+initialEncounterOverride+encounterIndex);//Start from the first encounter (0 is dead)
    if (savedCoins!= NaN && savedCoins>0){ //Skip tutorial, visit shop
      logAction("♻️&nbsp;▸&nbsp;❤️ Seems like this is <b>not your first time.</b>");
      playerSta=playerStaMax;
      loadEncounter(4);
      drachmaShop[0]="area:"+"Fading Wildlands";
      linesStory.splice(encounterIndex+1,1); //RM Realization
      pushEncounter(drachmaShop)
    }
    if (savedCoins==0){
      loadEncounter(4);
      enemyName="Familiar Moment";
      enemyEmoji="🤔";
      playerSta=playerStaMax;
      logAction("♻️&nbsp;▸&nbsp;❤️ Seems like this is <b>not your first time.</b>");
    }
    redraw();
    curtainFadeInAndOut("<p style=\"color:"+colorRed+";-webkit-text-stroke: 6.5px black;paint-order: stroke fill;letter-spacing:1.8px;line-height:1px;font-size:74px;font-weight:700;\">Stay Dead</p><p style=\"font-size:16px;line-height:18px;letter-spacing:1.2px\""+decorateStatusText("","<br>"+emptySpace.repeat(41)+"by IGPenguin",colorWhite),3.5);
    animateUIElement(emojiUIElement,"animate__pulse","2",false,"",true);
  }
}

//Process csv into lines of encounters and fishing loot
function processEncounterData(allText){
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  linesGenerator = [];
  linesLoot = [];

  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(';');
      if (data.length == headers.length) {
          var tarr = [];
          for (var j=0; j<headers.length; j++) {
              tarr.push(headers[j]+":"+data[j]);
          }
          if (data[0] === "Fishing") {
            linesLoot.push(tarr);
          } else {
            linesGenerator.push(tarr);
          }
      }
  }
}

function getNextEncounterIndex(){
  encountersTotal = linesStory.length-1;
  var nextItemIndex = encounterIndex+1;
  if (nextItemIndex >= encountersTotal){ //Game Completed
    gameEnd();
    return encounterIndex+1; //Skip tutorial
  }
  adventureEncounterCount+=1;
  return nextItemIndex;
}

function getUnseenLootIndex() {
  lootTotal = linesLoot.length;
  var max = lootTotal;
    do {
      randomLootIndex = Math.floor(Math.random() * max);
      if (seenLoot.length >= lootTotal){
        console.log("ERROR: No more loot left.")
        break;
      }
    } while (seenLoot.includes(randomLootIndex));
    return randomLootIndex;
}

function getRandomEncounter(encounterTypes=[], includeStrings=[], areaNameOverride="", excludeStrings=[]) {
  var tempLinesGenerator = linesGenerator;
  var generatorAreaName=areaName;
  //console.log("Area override:"+areaNameOverride);

  //drop anything but areaName (unless areaNameOverride=="ALL")
  if (areaNameOverride!="") generatorAreaName = areaNameOverride;
  if (areaNameOverride!="ALL") tempLinesGenerator = $.grep(tempLinesGenerator, function (item) { return item.indexOf("area:"+generatorAreaName) === 0; });
  //You see the condition above? I'm not proud, its 1:44 AM an the beta test is supposed to be tomorrow

  //drop anything but type
  var matchingTypeLines = [];
  encounterTypes.forEach((type) => {
    $.grep(tempLinesGenerator, function (item) { return item[3].includes("type:"+type) }).forEach((line) => {
      //console.log(line);
      matchingTypeLines.push(line);
    });
  });
  //console.log(matchingTypeLines);
  tempLinesGenerator=matchingTypeLines;

  //drop anything but includesStrings (any of array)
  var includesStringLines = [];
  if (includeStrings.length!=0){
    includeStrings.forEach((string) => {
      $.grep(tempLinesGenerator, function (item) {
        return String(item).includes(string)}).forEach((line) => {
        includesStringLines.push(line);
      });
    });
    //console.log(includesStringLines);
    tempLinesGenerator=includesStringLines;
  }

  //drop all excluded strings
  if (excludeStrings.length !== 0) {
  tempLinesGenerator = tempLinesGenerator.filter((line) => {
    // keep line only if it does NOT include any excluded string
    return !excludeStrings.some((excludeString) => {
      return String(line).includes(excludeString);
    });
  });
}

  //drop all seen names
  //console.log("Seen: "+seenEncounters);
  seenEncounters.forEach(seenEncounterName => {
    //console.log("Dropping: "+seenEncounterName);
    tempLinesGenerator= tempLinesGenerator.filter(function(line) {
      var lineEnemyName= line[2].split("name:")[1]
      if (lineEnemyName!==seenEncounterName) {
        //console.log(lineEnemyName+" vs "+seenEncounterName);
        return line
      }
    })
  });
  //console.log(tempLinesGenerator); //Log all valid choices

  var tempLinesGeneratorTotal = tempLinesGenerator.length;
  var max = tempLinesGeneratorTotal;
  randomEncounterIndex = Math.floor(Math.random() * max);
  //console.log("Random encounter index: "+randomEncounterIndex)

  var randomEncounter = String(tempLinesGenerator[randomEncounterIndex])
  if (randomEncounter == "undefined") {
    randomEncounter=String(["area:Encounter Error","emoji:⚠️","name:Type Not Available","type:Error","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Critical Error","desc:No encounters for types -> "+String(encounterTypes).replaceAll(","," ")+"<br>","message:"]);
  }

  console.log("Type:"+encounterTypes+"\nOpts:"+tempLinesGeneratorTotal+"→#"+randomEncounterIndex+":\n"+randomEncounter.split(",t")[0].split("i:")[1])
  return randomEncounter;
}

function pushEncounter(encounterStringArray=[],index=1,areaNameOverride=""){
  if (encounterStringArray == []) encounterStringArray = ["area:Encounter Error","emoji:⚠️","name:Missing Encounter","type:Error","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Error","desc:Missing data for pushing new encounter.","message:"]

  if (areaNameOverride!=""){
    linesStory.splice(encounterIndex+index,0,encounterStringArray,areaNameOverride);
  } else {
    linesStory.splice(encounterIndex+index,0,encounterStringArray);
  }
}

function markAsSeen(seenName){
  seenName=seenName.replace(" (Crispy)","").replace(" (Salty)",""); //To avoid seeing same food again if cooked
  if (!seenEncounters.includes(seenName)) seenEncounters.push(seenName);
}

function markAsSeenFishing(seenID){  //TODO: remove and reuse the fn above?
  if (!seenLoot.includes(seenID)){
    seenLoot.push(seenID);
    localStorage.setItem("seenLoot", JSON.stringify(seenLoot));
  }
}

function resetSeenEncounters(){
  seenEncounters = [];
}
