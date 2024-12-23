//Having all this in a one file is truly shameful
//...submit a pull request if you dare

//Debug
var versionCode = "ver. 12/23/24 • 00:33am"
var initialEncounterOverride=0; //~4 skips tutorial, ~38 barrens
if (initialEncounterOverride!=0) initialEncounterOverride-=3; //To handle notes and death in .csv

//Colors & Symbols
var colorWhite = "#FFFFFF"; var colorGold = "#FFD940"; var colorDarkGold = "#4d4112"; var colorGreen = "#22BF22"; var colorDarkGreen = "#509920"; var colorRed = "#FF0000"; var colorDarkRed = "#690000"; var colorGrey = "#CCCCCC"; var colorDarkGrey = "#888888"; var colorOrange = "orange"; var colorDarkOrange = "#523501"; var colorYellow = "#F7D147"; var colorDarkYellow = "#d6b53c"; var colorBlue = "#1059AA"; var colorLightBlue = "#487bb5"; var colorDarkBlue = "#072a52"; var colorPurple = "#BF40BF"; var colorDarkPurple = "#381338"; var colorPink = "#c9594f"; var colorCardBackground = "#202020";
var fullSymbol = "●"; var emptySymbol = "○"; var enemyStatusString = ""; var newline="<br>"; var emptySpace="&nbsp"; var arrowSymbol="▸";

//Stats
var adventureStartTime = getTime();
var adventureEndTime;

//Player stats init
var playerName = getFirstName();
var playerNumber = 1; //Increments on death if at least once saved
var playerKills = 0;
var playerLootString;
var playerPartyString;
var playerHpMax;
var playerStaMax;
var playerMgkMax;
var playerHp;
var playerSta;
var playerLck;
var luckInterval = 30; //Lower to increase chances
var playerInt;
var playerAtk;
var playerXP;
var playerLevel;
var playerXPThreshold;
var playerKarma=1; //Does not reset during the session
var playerRested = false;
var playerCooked = false;
var seenLoot;

renewPlayer();
function renewPlayer(){ //Default values
  playerName = getFirstName();
  playerHpMax=3;
  playerHp = playerHpMax;
  playerStaMax = 3;
  playerSta = 0; //Start tired in a dream (was playerStaMax;)
  playerMgkMax = 0;
  playerAtk = 1;
  playerLck = 0;
  playerInt = 1;
  playerXP=0;
  playerLevel=1;
  playerXPThreshold=playerLevel*150;
  playerMgk = playerMgkMax;
  playerRested = false;
  playerLootString = "";
  playerPartyString = "";

  playerKills = 0;
  seenLoot = [];
  adventureLog = [];
}

//Global vars
var storyData;
var linesStory;
var linesLoot;
var linesGenerator;
var encounterIndex;
var lastEncounterIndex;
var lastGeneratorName = "none";
var lootTotal;
var randomEncounterIndex;
var lootEncounterIndex;
var isFishing = false;
var seenEncounters = [];

//Globar vars - UIElements
var areaUIElement;
var nameUIElement;
var cardUIElement;
var emojiUIElement;
var emojiWrapperUIElement;
var emojiFlipperUIElement;
var enemyInfoUIElement;
var playerInfoUIElement;
var toolbarCardUIElement;
var enemyTeamUIElement;
var versusTextUIElement;
var buttonsContainer;

var grabColor=colorWhite;
var eatColor=colorWhite;

//String generators
function getFirstName(){
  const random_names = ["Vagrand","Pilgrim","Explorer","Adventurer","Wanderer", "Freak", "Nameless", "Peasant", "Voyager", "Stranger", "Traveller", "Survivor", "Prophet", "Drifter", "Vagabond", "Straggler", "Deserter","Venturer","Pathfinder","Seeker"];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getVitalName(name=playerName){
  if (name.includes(" ")) return name;
  const random_names = ["Big "+name,"Vital "+name,"Resilient "+name,"Strong "+name, "Vigorous "+name, "Muscular "+name, "Huge "+name, "Giant "+name, "Massive "+name, "Healthy "+name,name+" the Beast", name+" the Mighty"];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getSwiftName(name=playerName){
  if (name.includes(" ")) return name;
  const random_names = ["Swift "+name, "Speedy "+name, "Fast "+name, "Athletic "+name, "Rushing "+name, "Reckless "+name];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getFaithName(name=playerName){
  if (name.includes(" ")) return name;

  const random_names = ["Holy "+name, "Promising "+name, "Humble "+name, name+" the Believer",name+" Worshipper"];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getSorceryName(name=playerName){
  if (name.includes(" ")) return name;

  const random_names = [name+" Acolyte","Mystic "+name, name+" the Magician"];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getCleverName(name=playerName){
  if (name.includes(" ")) return name;

  const random_names = ["Intelligent "+name,"Resolute "+name, "Overthinking "+name, "Clever "+name, "Ambitious "+name, "Curious "+name];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getHatredName(name=playerName){
  if (name.includes(" ")) return name;

  const random_names = ["Mischievous "+name,"Bloody "+name, name+" the Warlock", "Spiteful "+name, "Withering "+name, "Ruthless "+name];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getLuckyName(name=playerName){
  if (name.includes(" ")) return name;

  const random_names = ["Lucky "+name, "Indigent "+name,"Wholesome "+name];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getProphecy(){
  const random_quotes = ["<b>👀 Search</b> for loot in places of interest.","<b>💤 Sleep</b> whenever you get a chance.","<b>💨 Hasty</b> attacks can only be <b>🔰 Blocked</b>.","<b>🔺 Heavy</b> attacks can only be <b>🌀 Dodged</b>.","<b>🔻 Small</b> creatures can be <b>👋 Grabbed</b>.","<b>👋 Grab</b> tired enemies to knock them out.","<b>🧠 Intellect</b> helps befreinding companions.","<b>💫 Cast</b> spells always hit before retaliation.","<b>🍴 Eating</b> when relaxed provides a bonus.","Use <b>🔰 Block</b> or <b>🌀 Dodge</b> before <b>⚔️ Attack</b>.","<b>💤 Sleep</b> recovers <b>🟢 Energy</b> and <b>🔵 Mana</b>.","<b>🍀 Luck</b> provides a chance for a critical hit.","<b>👋 Grab</b> bait 🪱 to do some <b>🎣 Fishing</b>.","<b>✏️ Report</b> any issues to make a difference.","<b>💬 Speaking</b> can sometimes stop the fight.","<b>🍀 Luck</b> may help to  survive a fatal hit.", "Some <b>🔱 Altars</b> require 🔪  for a <b>Sacrifice<b>.","<b>🎣 Fishing </b> provides a variety of unique items.", "<b>✏️ Rename</b> the hero by clicking their name.","<b>🐞 Report</b> issues by clicking the version code.","Pick up 🗝️<b>Keys</b> to unlock secrets later.","🪄 <b>Cast</b> a spell to open lock for -2 🔵 <b>Mana</b>.","🪬 <b>Curse</b> lowers the enemy damage by half.","Casting ❤️‍🩹 <b>Heal</b> restores up to <b>+2 ❤️ Health</b>.","<b>🟠 Legendary</b> items provide unique skills.","🔥 <b>Heat</b> raw food to remove negative effects.","<b>🍀 Luck</b> affects the chances for getting loot.","Open <b>🗝️ Locked</b> objects by <b>🪄 Cast</b> for -2 🔵","<b>❤️‍🩹 Heal</b> uses up to all available <b>🔵 Mana</b>.",decorateStatusText("","XP",colorGold)+" is obtained upon defeating foes.","Gain more "+decorateStatusText("","XP",colorGold)+" by non-deadly resolutions.","New perk is granted on gaining enough "+decorateStatusText("","XP",colorGold),"<b>🧠 Intellect</b> affects "+decorateStatusText("","XP",colorGold)+" gains both ways.","<b>💀 Killing</b> enemies affects karma <b>negatively</b>.","<b>Good karma</b> provides early game <b>🎁 Bonus</b>."];

  return random_quotes[Math.floor(Math.random() * random_quotes.length)];
}

//Adventure logging
var actionString; //Initial action log below
var actionLog = "💤&nbsp;▸&nbsp;💭 Fallen unconscious some time ago.<br>&nbsp;<br>&nbsp;";
var adventureLog = actionLog;
var adventureEncounterCount = 1;
var adventureEndReason = "";

//Area init
var previousArea;
var areaName;

//Enemy stats init
var enemyEmoji;
var enemyName;
var enemyHp;
var enemyAtk;
var enemySta;
var enemyLck;
var enemyInt;
var enemyMgk;
var enemyType;
var previousEnemyType;
var enemyContainerNumber = 0;
var enemyTeam;
var enemyDesc;
var enemyMsg;

var enemyHpLost = 0;
var enemyStaLost = 0;
var enemyAtkBonus = 0;
var enemyIntBonus = 0;
var enemyMgkLost = 0;
var currentProphercy;
var enemyEmojiScaleX;
var enemyBossType = "";

enemyRenew()
function enemyRenew(){
  enemyStaLost = 0;
  enemyHpLost = 0;
  enemyAtkBonus = 0;
  enemyIntBonus = 0;
  enemyMgkLost = 0;
  currentProphercy = getProphecy();
  enemyEmojiScaleX = chooseFrom(['scaleX(-1)','scaleX(1)']);
}

//Load encounter data .csv file on page ready
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/story.csv",
        dataType: "text",
        success: function(data) {
          storyData = data;
          processStoryData(storyData);
          registerClickListeners();
        }
     });

     $.ajax({
         type: "GET",
         url: "data/fishing.csv",
         dataType: "text",
         success: function(data) {
           processLoot(data);
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
    redraw();
    animateUIElement(emojiUIElement,"animate__pulse","2",false,"",true);
  }
}

//Process csv into lines of loot
function processLoot(allText){ //TODO: remove and reuse the fn above
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  linesLoot = [];

  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(';');
      if (data.length == headers.length) {

          var tarr = [];
          for (var j=0; j<headers.length; j++) {
              tarr.push(headers[j]+":"+data[j]);
          }
        linesLoot.push(tarr);
  }
  }
}

//Process csv into lines of encounters for generator
function processEncounterData(allText){ //TODO: remove and reuse the fn above
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  linesGenerator = [];

  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(';');
      if (data.length == headers.length) {

          var tarr = [];
          for (var j=0; j<headers.length; j++) {
              tarr.push(headers[j]+":"+data[j]);
          }
        linesGenerator.push(tarr);
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

function getRandomEncounter(encounterTypes=[], includeStrings=[], areaNameOverride="") {
  var tempLinesGenerator = linesGenerator;
  var generatorAreaName=areaName;
  //console.log("Area override:"+areaNameOverride);

  //drop anything but areaName
  if (areaNameOverride!="") generatorAreaName = areaNameOverride;
  tempLinesGenerator = $.grep(tempLinesGenerator, function (item) { return item.indexOf("area:"+generatorAreaName) === 0; });

  //drop anything but type
  var matchingTypeLines = [];
  encounterTypes.forEach((type) => {
    $.grep(tempLinesGenerator, function (item) { return item.indexOf("type:"+type) === 3 }).forEach((line) => {
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

  var tempLinesGeneratorTotal = tempLinesGenerator.length;
  var max = tempLinesGeneratorTotal;
  randomEncounterIndex = Math.floor(Math.random() * max);
  //console.log("Random encounter index: "+randomEncounterIndex)

  var randomEncounter = String(tempLinesGenerator[randomEncounterIndex])
  if (randomEncounter == "undefined") {
    randomEncounter=String(["area:Encounter Error","emoji:⚠️","name:Type Not Available","type:Error","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","note:Critical Error","desc:No encounters for types -> "+String(encounterTypes).replaceAll(","," ")+"<br>","message:"]);
  }

  console.log("Type:"+encounterTypes+" Opts:"+tempLinesGeneratorTotal+"→#"+randomEncounterIndex+":\n"+randomEncounter.split(",t")[0].split("i:")[1])
  return randomEncounter;
}

function pushEncounter(encounterStringArray=[],index=1,areaNameOverride=""){
  if (encounterStringArray == []) encounterStringArray = ["area:Encounter Error","emoji:⚠️","name:Missing Encounter","type:Error","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","note:Error","desc:Missing data for pushing new encounter.","message:"]

  if (areaNameOverride!=""){
    linesStory.splice(encounterIndex+index,0,encounterStringArray,areaNameOverride);
  } else {
    linesStory.splice(encounterIndex+index,0,encounterStringArray);
  }
}

function markAsSeen(seenName){
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

//Load or generate encounter
function loadEncounter(index, fileLines = linesStory){
  encounterIndex = index;
  selectedLine = String(fileLines[index]);

  //Encounter data initialization, details in encounters.csv
  areaName = String(selectedLine.split(",")[0].split(":")[1]);
  if (fileLines!=linesStory) areaName = previousArea
  enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  enemyBossType = enemyType; //I'll end up in hell for these hacks
  if (enemyType.includes("Generator")) {
    var number = enemyType.match(/\d+$/);
    //console.log("Gen-type:"+number);
    if (number) number = parseInt(number[0],10);

    generateNextEncounters(number);
    adventureEncounterCount-- //Remove the generator from the counter
    nextEncounter();
    return;
  }

  //Handle container depth (for skipping it)
  if (enemyType.includes("Container")) {
    var number = enemyType.match(/\d+$/);
    if (number) enemyContainerNumber = parseInt(number[0],10);
  }

  enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  enemyAtk = parseInt(String(selectedLine.split(",")[5].split(":")[1]));
  enemySta = String(selectedLine.split(",")[6].split(":")[1]);
  enemyLck = String(selectedLine.split(",")[7].split(":")[1]);
  enemyInt = String(selectedLine.split(",")[8].split(":")[1]);
  enemyMgk = String(selectedLine.split(",")[9].split(":")[1]);
  enemyTeam = String(selectedLine.split(",")[10].split(":")[1]);
  enemyDesc = String(selectedLine.split(",")[11].split(":")[1]);
  if (enemyTeam.includes("Prophe") || enemyTeam.includes("Knowledge") || enemyTeam.includes("Epiphany") || enemyTeam.includes("Note")) {
    enemyDesc=enemyDesc.replaceAll("n/a","");
    enemyDesc+="<i>"+getProphecy()+"</i>";
  }
  enemyMsg = String(selectedLine.split(",")[12].split(":")[1]);
}

function generateNextEncounters(generatorID=0, logCall=true){
  switch (generatorID) {

    case 0: //Prop or Small in container
      if (logCall) logGenerator("prop/small");
      var type=chooseFrom(["Prop","Prop","Prop","Small","Consumable"]) // 1/4 chance for small
      if (type=="Prop") {
        pushEncounter(getRandomEncounter(["Prop"]));
      }
      if (type=="Small") {
        pushEncounter(getRandomEncounter(["Prop"]));
        pushEncounter(getRandomEncounter(["Small"]));
        pushEncounter(getRandomEncounter(["Container"]));
      }
      if (type=="Consumable") {
        pushEncounter(getRandomEncounter(["Prop"]));
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Container"]));
      }
      break;

    case 1: //Consumable - Optional
      if (logCall) logGenerator("cons");
      pushEncounter(getRandomEncounter(["Consumable"]));
      pushEncounter(getRandomEncounter(["Container"]));
      break;

    case 2: //Easy Encounter
      if (logCall) logGenerator("easy/pet");
      generateNextEncounters(0,false); //Prop or Contained Small
      pushEncounter(getRandomEncounter(["Standard"]));
      break;

    case 3: //Mid Encounter - 20% item
      if (logCall) logGenerator("mid");
      generateNextEncounters(0,false); //Prop or Contained Small
      //20% item
      if (procAbilityChance("",20+playerLck)) {
        pushEncounter(getRandomEncounter(["Item"]))
      } else {
        //30% consumable
        if(procAbilityChance("",30+playerLck)) pushEncounter(getRandomEncounter(["Consumable"]));
      }
      pushEncounter(getRandomEncounter(["Standard","Recruit","Pet"]));
      break;

    case 4: //Hard Encounter - 40% item / 100% consumable
      if (logCall) logGenerator("hard");
      generateNextEncounters(0,false); //Prop or Contained Small
      //30% item & consumable
      if (procAbilityChance("",30+playerLck)) {
        pushEncounter(getRandomEncounter(["Item"]))
        pushEncounter(getRandomEncounter(["Consumable"]));
      } else {
        //40% consumable
        if (procAbilityChance("",40+playerLck)) pushEncounter(getRandomEncounter(["Consumable"]));
      }
      pushEncounter(getRandomEncounter(["Swift","Heavy","Demon","Spirit"]));


      break;

    case 9: //Boss
      if (logCall) logGenerator("boss");
      if (!areaName.includes("Meadows")) { //Do no guarantee legendary in first area
        pushEncounter(getRandomEncounter(["Item"],["Artifact"]));
      } else {
        pushEncounter(getRandomEncounter(["Item"]));
      }
      pushEncounter(getRandomEncounter(["Boss-Standard","Boss-Swift","Boss-Demon","Boss-Heavy","Boss-Spirit","Boss-Undead"]));
      break;

    case 20: //House Small - 20% item
      if (logCall) logGenerator("h-small");
      if (procAbilityChance("",20+playerLck)) {
        pushEncounter(getRandomEncounter(["Item"]))
      } else {
        //20% consumable or prop (cause this is container)
        if(procAbilityChance("",40+playerLck)) {
          pushEncounter(getRandomEncounter(["Consumable"]));
        } else {
          generateNextEncounters(0,false); //Prop or Contained Small
        }
      }
      pushEncounter(getRandomEncounter(["Standard","Recruit"]));
      pushEncounter(getRandomEncounter(["Container-2"]));
      break;

    case 30: //House Mid - 30% item
      if (logCall) logGenerator("h-mid");
      if (procAbilityChance("",30+playerLck)) { //
        pushEncounter(getRandomEncounter(["Item"]))
      } else {
        //50% consumable or prop (cause this is container)
        if (procAbilityChance("",50+playerLck)) {
          pushEncounter(getRandomEncounter(["Consumable","Friend"]));
        } else {
          generateNextEncounters(0,false); //Prop or Contained Small
        }
      }
      pushEncounter(getRandomEncounter(["Recruit","Standard","Swift","Heavy","Demon","Spirit","Curse","Trap","Trap-Attack","Trap-Roll","Altar"]));
      pushEncounter(getRandomEncounter(["Recruit","Standard","Swift","Heavy","Demon","Spirit","Curse","Trap","Trap-Attack","Trap-Roll","Altar"]));
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 31: //House Locked - 100% item/checkpoint/pet/friend, 100% consumable
      if (logCall) logGenerator("h-lock");
      var type=chooseFrom(["Item","Pet","Friend","Container-Friend"]);
      if (type=="Container-Friend") {
        var adjustedSizeContainer=getRandomEncounter(["Locked-Container-3"]).replace("3","4"); //Change container size to 4 to account for extra encounter -> item
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Item"],["Artifact"]));
        pushEncounter(getRandomEncounter([type]));
        pushEncounter(getRandomEncounter(["Altar","Curse","Trap","Trap-Attack","Trap-Roll"]));
        pushEncounter(adjustedSizeContainer);
        break;
      }

      pushEncounter(getRandomEncounter(["Consumable"]));
      if (type=="Item") {
        pushEncounter(getRandomEncounter([type],["Artifact"]));
      } else {
        pushEncounter(getRandomEncounter([type,"Checkpoint"]));
      }
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Attack","Trap-Roll"]));
      pushEncounter(getRandomEncounter(["Locked-Container-3"]));
      break;


    case 40: //Optional Hard House - 100% consumable, 40% item or maybe altar
      if (logCall) logGenerator("h-hard");
      if (procAbilityChance("",40+playerLck)) {
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Item"]))
      } else {
        pushEncounter(getRandomEncounter(["Prop","Altar"]));
        pushEncounter(getRandomEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Demon","Spirit","Curse","Trap","Trap-Attack","Trap-Roll"]));
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 50: //Optional Big House - 100% consumable, 40% item or maybe altar
      if (logCall) logGenerator("h-big");

      if (procAbilityChance("",40+playerLck)) {
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Item"]))
      } else {
        pushEncounter(getRandomEncounter(["Prop","Altar"]));
        pushEncounter(getRandomEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Demon","Spirit"]));
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Attack","Trap-Roll"]));
      pushEncounter(getRandomEncounter(["Container-4"]));
      break;

    case 60: //Optional Huge House - 100% consumable, 50% item or altar
      if (logCall) logGenerator("h-huge");
      if (procAbilityChance("",50+playerLck)) {
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Item","Checkpoint"]))
      } else {
        pushEncounter(getRandomEncounter(["Altar"]));
        pushEncounter(getRandomEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Demon","Spirit"]));
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Attack","Trap-Roll"]));
      pushEncounter(getRandomEncounter(["Small","Standard","Recruit","Pet"]));
      pushEncounter(getRandomEncounter(["Container-5"]));
      break;

    case 69: //Fishing
      if (logCall) logGenerator("fish");
      linesStory.splice(encounterIndex+1,0,getRandomEncounter(["Fishing"]));
      break;

    case 99: //Random house
      if (logCall) logGenerator("rand");
      generateNextEncounters(chooseFrom([20,30,31,40,50,60]));
      break;

    default:
      console.log("ERROR: Missing generator definition!");
  }
}

function chooseFrom(array=[]){
  var options = array.length
  var choice = array[Math.floor(Math.random() * options)];
  return choice;
}

function randomNumber(min=0,max=1){
  return min+Math.floor(Math.random() * max);
}

//UI DRAW FUNCTIONS
function redraw(){
  //Version
  versionIDUIElement = document.getElementById('id_version')
  versionIDUIElement.innerHTML = versionCode+"<br>"+lastGeneratorName+" (#"+adventureEncounterCount+")";

  //Player UI
  playerInfoUIElement = document.getElementById('id_player_info');
  toolbarCardUIElement = document.getElementById('id_toolbar_card');
  document.getElementById('id_player_name').innerHTML = playerName;

  playerLevelUIELement = document.getElementById('id_player_level');
  playerLevelUIELement.innerHTML = decorateStatusText("","Level "+playerLevel,colorGold);

  var playerStatusString = "❤️ " + fullSymbol.repeat(playerHp);
  if ((playerHpMax-playerHp)>0) playerStatusString+=emptySymbol.repeat(playerHpMax-playerHp);

  playerStatusString += "&nbsp;&nbsp;🟢 " + fullSymbol.repeat(playerSta)
  if ((playerStaMax-playerSta)>0) playerStatusString += emptySymbol.repeat(playerStaMax-playerSta);

  if (playerMgkMax>0 || playerMgk>0){ playerStatusString += "&nbsp;&nbsp;🔵 " + fullSymbol.repeat(playerMgk);}
  if ((playerMgkMax-playerMgk)>0) playerStatusString += emptySymbol.repeat(playerMgkMax-playerMgk);

  if (playerAtk>0) playerStatusString += "&nbsp;&nbsp;⚔️ " + fullSymbol.repeat(playerAtk);

  document.getElementById('id_player_status').innerHTML = playerStatusString;
  document.getElementById('id_player_party_loot').innerHTML = "";
  if (playerPartyString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "<b>Party:</b> " +playerPartyString+"&nbsp;";
  }
  if (playerLootString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "<b>Bag:</b> "+playerLootString;
  }
  if (playerPartyString.length+playerLootString.length == 0) {
    document.getElementById('id_player_party_loot').innerHTML = "∙∙∙";
  }

  //Versus UI
  versusTextUIElement = document.getElementById('id_versus');

  //Encounter UI
  areaUIElement = document.getElementById('id_area');
  nameUIElement = document.getElementById('id_name');
  cardUIElement = document.getElementById('id_card');
  enemyInfoUIElement = document.getElementById('id_enemy_card_contents'); //This is just for animations, so :shrug:
  emojiUIElement = document.getElementById('id_emoji');
  emojiWrapperUIElement = document.getElementById('id_emoji_wrapper');
  emojiFlipperUIElement = document.getElementById('id_emoji_flipper');
  emojiFlipperUIElement.style.transform=enemyEmojiScaleX; //Visual variety ++
  enemyTeamUIElement = document.getElementById('id_team');

  emojiUIElement.innerHTML = enemyEmoji;
  areaUIElement.innerHTML = areaName;
  nameUIElement.innerHTML = enemyName;

  var enemyDescUIElement = document.getElementById('id_desc')
  enemyDescUIElement.innerHTML = enemyDesc;
  //Hacky hacky hacky hack hack hack, hacky hacky hacky, yeah yeah
  enemyDescUIElement.innerHTML+="<br><center><i style=\"color:"+colorGrey+";"+"font-size:13px;\">"+"»  "+enemyTeam+" «"+"</i></center>"; //enemyTeamUIElement.innerHTML=enemyTeam;

  //Encounter Statusbar UI
  var effectArray = [enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk];
  var EffectArrayBonus=effectArray.filter(function(x){ return x > 0 });
  var EffectArrayMalus=effectArray.filter(function(x){ return x < 0 });
  var totalBonus=EffectArrayBonus.reduce((partialSum, a) => partialSum + a, "");
  var totalMalus=EffectArrayMalus.reduce((partialSum, a) => partialSum + a, "");
  if (totalMalus=="") totalMalus=0;
  //console.log("bonus: "+totalBonus+" malus: "+totalMalus);

  enemyTeamUIElement.innerHTML="";
  cardUIElement.style.background=colorCardBackground;

  switch(enemyType) {
    case "Pet":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔸","Minion",colorOrange);
      enemyStatusString=appendEnemyStats();
      break;
    case "Swift": //TODO: Perhaps there should also be "Flying"??
      enemyTeamUIElement.innerHTML=decorateStatusText("💨","Hasty",colorGreen);
      enemyStatusString=appendEnemyStats();
      break;
    case "Heavy":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔺","Strong",colorRed);
      enemyStatusString=appendEnemyStats();
      break;
    case "Spirit":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔘","Spirit",colorWhite);
      enemyStatusString=appendEnemyStats();
      break;
    case "Friend":
    case "Container-Friend":
      enemyStatusString=decorateStatusText("💬","Friendly",colorDarkGreen);
      //Do not display stats = reward hidden
      break;
    case "Small":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔻","Small",colorWhite);
      enemyStatusString=appendEnemyStats();
      break;
    case "Recruit":
    case "Standard":
      enemyTeamUIElement.innerHTML=decorateStatusText("▫️","Normal",colorWhite);
      enemyStatusString=appendEnemyStats();
      break;
    case "Demon":
      enemyTeamUIElement.innerHTML=decorateStatusText("👺","Demon",colorRed);
      enemyStatusString=appendEnemyStats();
      break;
    case "Undead":
      enemyTeamUIElement.innerHTML=decorateStatusText("💀","Undead",colorGrey);
      enemyStatusString=appendEnemyStats();
      break;

    case "Item":
      if ((totalBonus > 0) || (enemyEmoji=="🗝️")){
        enemyStatusString=decorateStatusText("⚜️","Valuable",colorGold);
        if (enemyMgk>0 || (parseInt(totalBonus)+parseInt(totalMalus))>=1 || (parseInt(totalMalus)>=0 && parseInt(totalBonus>0))){
          enemyStatusString=decorateStatusText("🔷","Magnificient",colorLightBlue);
          cardUIElement.style.background=colorDarkBlue;
        }
        if ((parseInt(totalBonus)+parseInt(totalMalus))>=2 || enemyHp>=2 || enemyAtk>=2 || enemySta>=2 || enemyMgk>=2){
          enemyStatusString=decorateStatusText("🟣","Exquisite",colorPurple);
          cardUIElement.style.background=colorDarkPurple;
        }
      } else {
        enemyStatusString=decorateStatusText("🕸️","Rubbish","lightgrey");
      }
      if (enemyTeam.includes("Artifact") ||  enemyTeam.includes("Questionable Drink")) {
        enemyStatusString=decorateStatusText("🟠","Legendary",colorOrange);
        cardUIElement.style.background=colorDarkOrange;
      }
      break;

    case "Trap":
    case "Trap-Attack":
    case "Trap-Roll":
      enemyStatusString=decorateStatusText("🚩","Hazardous",colorRed);
      break;
    case "Dream":
      enemyStatusString=decorateStatusText("💭","Guidance","#FFFFFF");
      break;
    case "Upgrade":
      enemyStatusString=decorateStatusText("⭐️","Advancement",colorGold);
      cardUIElement.style.background=colorDarkGold;
      break;
    case "Prop":
      enemyStatusString=decorateStatusText("⚪️","Unremarkable",colorWhite);
      break;
    case "Altar":
      if (totalBonus>0) enemyStatusString=decorateStatusText("🌙","Place of Worship",colorGold);
      if (totalMalus<0) enemyStatusString=decorateStatusText("♦️","Sacrificial Altar",colorRed);
      break;
    case "Fishing":
      enemyStatusString=decorateStatusText("🪝","Fishing Spot",colorGold);
      break;
    case "Curse":
      enemyStatusString=decorateStatusText("♣️","Mystery","lightgrey");
      break;
    case "Death":
      enemyStatusString=decorateStatusText("🦴","Deceased","lightgrey");
      break;
    case "Checkpoint":
      enemyStatusString=decorateStatusText("🌙","Place of Power",colorGold);
      cardUIElement.style.background=colorDarkOrange;
      break;

    default:
      enemyStatusString=decorateStatusText("⁉️","No Details","red");
      //Multi-match
      if (enemyType.includes("Container")) enemyStatusString=decorateStatusText("🟡","Interesting",colorYellow);
      if (enemyType.includes("Locked")) enemyStatusString=decorateStatusText("🗝️","Locked",colorGrey);

      if (enemyType.includes("Consumable")) {
        eatColor=colorWhite;
        enemyStatusString=decorateStatusText("❤️","Refreshment",colorWhite)
        if (enemyHp<0 || enemyAtk<0 || enemySta<0 || enemyLck<0 || enemyInt<0 || enemyMgk<0){
          enemyStatusString=decorateStatusText("🚩","Hazardous",colorRed);
          eatColor=colorRed;
        }
        if (enemyMgk>0 || (parseInt(totalBonus)+parseInt(totalMalus))>=1 || (parseInt(totalMalus)>=0 && parseInt(totalBonus>0))){
          enemyStatusString=decorateStatusText("💙","Refreshment",colorLightBlue);
          cardUIElement.style.background=colorDarkBlue;
          eatColor=colorLightBlue;
        }
        if ((parseInt(totalBonus)+parseInt(totalMalus))>=2 || enemyHp>=2 || enemyAtk>=2 || enemySta>=2 || enemyMgk>=2){
          enemyStatusString=decorateStatusText("💜","Refreshment",colorPurple);
          cardUIElement.style.background=colorDarkPurple;
          eatColor=colorPurple;
        }
      }

      if (enemyBossType.includes("Boss-")){
        enemyTeamUIElement.innerHTML=decorateStatusText("💀","Boss",colorRed);
        enemyStatusString=appendEnemyStats();
        cardUIElement.style.background=colorDarkRed;
      }
      break;
  }

  document.getElementById('id_stats').innerHTML = enemyStatusString;
  document.getElementById('id_log').innerHTML = actionLog;

  versusTextUIElement = document.getElementById('id_versus');
  switch (enemyType){
    case "Dream":
      displayPlayerState("Sleeping",colorBlue,"2.5")
      break;

    case "Curse":
    case "Trap":
    case "Trap-Roll":
    case "Trap-Attack":
      displayPlayerState("Suspicious",colorOrange,"1")
      break;

    case "Death":
      displayPlayerState(emptySpace,colorGrey,"0")
      break;

    default:
      displayPlayerState(); //Cautious by default
      if (enemyType.includes("Container") || enemyType.includes("Friend") || enemyType=="Prop" || enemyType=="Item"||enemyType=="Consumable"||enemyType=="Checkpoint"||enemyType=="Altar"||enemyType=="Fishing"){
        if (playerSta>=playerStaMax) displayPlayerState("Relaxed",colorDarkGreen,"2.5"); //I need this to be overwritable by the below
        if (playerSta<=(playerStaMax/2)) displayPlayerState("Fatigued",colorYellow,"2"); //I need this to be overwritable by the below
        if (playerSta==0) displayPlayerState("Exhausted",colorOrange,"2"); //I need this to be overwritable by the below
        if (playerLootString.includes("🪱") && enemyType==="Fishing") displayPlayerState("Bait Ready",colorPink,"0.8");
        if (enemyStatusString.includes("Legendary")) displayPlayerState("Excited",colorDarkYellow,"0.4");
      }
      if (enemyType=="Upgrade") displayPlayerState("Excited",colorGold,"0.5"); //I need this to be overwritable by the below
      if (enemyTeam.includes("Imaginary") || enemyTeam.includes("Turning Point")) displayPlayerState("Sleeping",colorBlue,"2.5"); //Shitty, I know, its the tutorial
      if (enemyHp>0 && (enemyAtk>0 || enemyMgk>0)) displayPlayerState("In Combat",colorRed,"0.8");
      break;
  }

  buttonsContainer = document.getElementById('id_buttons');
  updateXPProgress();
  adjustEncounterButtons();
}

function displayPlayerState(stateString="Cautious",color=colorGrey,time="3"){
  versusTextUIElement.innerHTML = "<div style=\"color:"+color+";\">"+stateString+"</div>"
  animateUIElement(versusTextUIElement,"animate__pulse",time,false,"",true);
}

function displayEnemyType(type){ //TODO Refactor usage or remove
  if ((enemyStatusString.replaceAll("&nbsp;","")!="")&&(!enemyStatusString.includes("</i>"))){
    enemyTeamUIElement.innerHTML=type;
  } else {
    enemyStatusString=type;
  }
}

function appendEnemyStats(){
  var enemyStats = "";
  if (enemyHp > 0) { enemyStats += "❤️ " + fullSymbol.repeat(enemyHp);}
    if (enemyHpLost > 0) { enemyStats = enemyStats.slice(0,-1*enemyHpLost) + emptySymbol.repeat(enemyHpLost); } //YOLO

  if (enemySta > 0) { enemyStats += "&nbsp;&nbsp;🟢 " + fullSymbol.repeat(enemySta);}
    if (enemyStaLost > 0) { enemyStats = enemyStats.slice(0,-1*enemyStaLost) + emptySymbol.repeat(enemyStaLost); } //YOLO

  if (enemyMgk > 0) {enemyStats += "&nbsp;&nbsp;🔵 " + fullSymbol.repeat(enemyMgk);}
    if (enemyMgkLost > 0) { enemyStats = enemyStats.slice(0,-1*enemyMgkLost) + emptySymbol.repeat(enemyMgkLost); } //YOLO

  if ((enemyAtk)>0) {
    enemyStats += "&nbsp;&nbsp;⚔️ " + fullSymbol.repeat(enemyAtk+enemyAtkBonus);
    if (enemyAtkBonus<0) enemyStats += emptySymbol.repeat(-1*enemyAtkBonus);
  }

  return enemyStats;
}

function decorateStatusText(emoji,text,color="#FFFFFF",size=14){
  if (emoji=="") return emoji+"<i style=\"font-weight:600;color:"+color+";font-size:"+size+"px; -webkit-text-stroke: 3px #121212;paint-order: stroke fill;\">"+text+"</i>";
  return emoji+" <i style=\"font-weight:600;color:"+color+";font-size:"+size+"px; -webkit-text-stroke: 3px #121212;paint-order: stroke fill;\">"+text+"</i>";
}

function updateXPProgress(){
  var playerXpProgressUIElement = document.getElementById('id_xp_progress');
  var progressbarWidth=(100/playerXPThreshold)*playerXP;
  if (progressbarWidth>97) progressbarWidth=97;
  playerXpProgressUIElement.style.width=progressbarWidth+"%";
}

//Game logic
function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    var buttonUIElement = document.getElementById(button);
    animateUIElement(buttonUIElement,"animate__pulse","0.15");

    actionString = buttonUIElement.innerHTML;
    actionVibrateFeedback(button);

    //Override boss type for action
    if (enemyType.includes("Boss")){
      enemyType=enemyType.replaceAll("Boss-","");
    }

    switch (button) {
      case 'button_attack': //Attacking always needs stamina
        var enemyAttacked=false;

        if (enemyType=="Death") {
          displayPlayerCannotEffect();
          logPlayerAction(actionString,"There is nothing to attack anymore.");
          break;
        }

        if (enemyType!="Upgrade" && !playerUseStamina(1,"Too tired to attack anything.")){
            break;
          }

        switch (enemyType){
          case "Item":
          case "Consumable":
          case "Container-Consume":
            isFishing=false;
          case "Trap":
          case "Trap-Roll":
            logPlayerAction(actionString,"Smashed it into tiny bits -1 🟢");
            displayEnemyEffect("〽️");
            nextEncounter();
            break;

          case "Trap-Attack": //Attacking causes you damage
            playerChangeStats(0, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
            if (enemyHp<0 || playerHp<=0) playerHit(0,true,true); //Oof
            break;

          case "Spirit":
            displayEnemyEffect("💨");
            enemyAttackOrRest("Impossible to hit, they retaliated -"+enemyAtk+" 💔");
            break;

          case "Friend":
          case "Container-Friend":
            if (enemyAtk>0){
              logPlayerAction(actionString,"Turned them adversary -1 🟢");
              enemyType="Standard";
            } else {
              logPlayerAction(actionString,"Spooked them with an attack -1 🟢");
              displayEnemyEffect("💨");
              playerKarma--;
              isFishing=false;
              nextEncounter();
              break;
            }

          case "Standard": //You hit first, they hit back if they have stamina
          case "Undead":
          case "Demon":
          case "Heavy":
          case "Recruit":
          case "Pet":
          case "Boss":
          case "Small":
            if (enemyCastIfMgk(true)) enemyAttacked=true;

            enemyHit(playerAtk);

            if ((parseInt(enemyHp)-parseInt(enemyHpLost) > 0) && !enemyAttacked) { //If they survive, they counterattack or regain stamina
              enemyAttackOrRest();
            }
            break;

          case "Swift": //They hit you first if they have stamina
            if (enemyCastIfMgk(true)) enemyAttacked=true;

            if ((parseInt(enemySta)-parseInt(enemyStaLost) > 0) && !enemyAttacked) {
              displayEnemyEffect("🌀");
              if ((enemyAtk+enemyAtkBonus)>0){
                enemyStaminaChangeMessage(-1,"They dodged and retaliated -"+enemyAtk+" 💔","n/a");
                playerHit(enemyAtk);
              } else {
                enemyStaminaChangeMessage(-1,"They barely dodged the attack.","n/a");
              }
            } else {
              enemyHit(playerAtk);
              enemyAttackOrRest();
            }
            break;

          case "Upgrade":
            //Health
            logPlayerAction(actionString,"Got more resilient <b>+1 ❤️ Health</b>.");
            displayPlayerGainedEffect();
            displayPlayerEffect("❤️");
            playerName=getVitalName();
            playerHpMax+=1;
            playerHp+=1;
            isFishing=false;
            animateFlipNextEncounter();
            break;

          default:
            if (enemyType.includes("Container") && !enemyType.includes("Locked")){
              var openMessage = "Smashed it wide open -1 🟢";
              if (enemyMsg != ""){
                openMessage = enemyMsg.replaceAll(".","")+" -1 🟢";
              }
              logPlayerAction(actionString,openMessage);
              displayEnemyEffect("〽️");
              nextEncounter();
              break;
            }
            logPlayerAction(actionString,"The attack had no effect -1 🟢");
            displayEnemyEffect("〽️");
      }
      break;

      case 'button_roll': //Stamina not needed for non-enemies + dodge handling per enemy type
        if (enemyType=="Death"){
          displayPlayerCannotEffect();
          logPlayerAction(actionString,"There is nothing to dodge anymore.");
          break;
        }

        const noStaForRollMessage = "Too tired to make any move.";
        var rollMessage;

        switch (enemyType){ //Dodge attack or walk if they are harmless
          case "Curse":
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyMsg);
            if (enemyHp<0 || playerHp<=0) playerHit(0,true,true); //Oof
            break;

          case "Standard":
          case "Undead":
          case "Recruit":
          case "Pet":
          case "Demon":
          case "Spirit":
          case "Boss":
          case "Small":
            if (((enemyAtk+enemyAtkBonus)<=0) && (enemyMgk<=0)){
              logPlayerAction(actionString,"Walked away leaving them behind.");
              nextEncounter();
              isFishing=false;
              break;
            }

            if (playerUseStamina(1,noStaForRollMessage)){

              if (enemyCastIfMgk(false)){
                logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
                displayEnemyCannotEffect();
                displayPlayerEffect("🌀");
                break;
              }

              if (enemyAtk!=0){
                rollMessage="Successfully dodged their attack -1 🟢";
              } else {
                rollMessage="They do not mean no harm -1 🟢";
              }

              enemyStaminaChangeMessage(-1,rollMessage,"The roll was a waste of energy -1 🟢");
              displayEnemyCannotEffect();
              displayPlayerEffect("🌀");
            }
            break;

          case "Swift":
            if (((enemyAtk+enemyAtkBonus)<=0) && (enemyMgk<=0)){
              logPlayerAction(actionString,"Walked away leaving them behind.");
              nextEncounter();
              isFishing=false;
              break;
            }

            if (enemyCastIfMgk(false) && playerUseStamina(1,noStaForRollMessage)){
              logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
              break;
            }

            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"Failed to dodge the attack -"+enemyAtk+" 💔","Rolled into a surprise attack -"+enemyAtk+" 💔");
              playerHit(enemyAtk);
            }
            break;

          case "Heavy":
            if (((enemyAtk+enemyAtkBonus)<=0) && (enemyMgk<=0)){
              logPlayerAction(actionString,"Walked away leaving them behind.");
              nextEncounter();
              isFishing=false;
              break;
            }

            if (enemyCastIfMgk(false) && playerUseStamina(1,noStaForRollMessage)){
              logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
              displayEnemyCannotEffect();
              displayPlayerEffect("🌀");
              break;
            }

            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"Dodged a heavy attack -1 🟢","Rolled around wasting energy  -1 🟢");
              displayEnemyCannotEffect();
              displayPlayerEffect("🌀");
            }
            break;

          case "Item": //You'll simply skip ahead
          case "Consumable":
          case "Checkpoint":
            if (isFishing){
              isFishing=false;
              logPlayerAction(actionString,"Threw it far away.");
            } else {
              logPlayerAction(actionString,"Walked away wasting the potential.");
              if (enemyType=="Checkpoint") encounterIndex++;
            }
            nextEncounter();
            break;
          case "Fishing":
            logPlayerAction(actionString,"Continued alongside the edge.");
            nextEncounter();
            break;
          case "Altar":
            logPlayerAction(actionString,"Continued the adventure.");
            isFishing=false
            nextEncounter();
            break;
          case "Container":
          case "Consumable-Container":
          case "Locked-Container":
          case "Container-Friend":
            logPlayerAction(actionString,"Walked away wasting the potential.");
            encounterIndex++;
            isFishing=false;
            nextEncounter();
            break;
          case "Dream":
            if (playerSta<=0){
              logPlayerAction(actionString,"Cannot walk while asleep.");
              displayPlayerCannotEffect();
            } else {
              logPlayerAction(actionString,"Embarked on a new adventure.");
              nextEncounter();
            }
            break;
          case "Prop":
            isFishing=false;
            if (enemyMsg!=""){
              logPlayerAction(actionString,enemyMsg)
            } else {logPlayerAction(actionString,"Continued on the adventure.");}
            nextEncounter();
            break;
          case "Container-Friend":
          case "Friend":
            logPlayerAction(actionString,"Walked away leaving them behind.");
            isFishing=false;
            nextEncounter();
            break;

          case "Trap-Roll": //Triggers when rolling into it
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
            playerHpMax+=(enemyHp*(-1));
            if (enemyHp<0 || playerHp<=0) playerHit(0,true,true); //Oof
            break;
          case "Trap":
          case "Trap-Attack":
            isFishing=false;
            logPlayerAction(actionString,"Continued on their adventure.");
            nextEncounter();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Felt becoming faster <b>+1 🟢 Stamina</b>.");
            displayPlayerGainedEffect();
            displayPlayerEffect("💨");
            playerName=getSwiftName();
            playerStaMax+=1;
            playerSta+=1;
            isFishing=false;
            animateFlipNextEncounter();
            break;

          case "Error":
            logPlayerAction(actionString,"Skipping to next encounter.");
            nextEncounter();
            break;

          default:
            if (enemyType.includes("Container")){
              logPlayerAction(actionString,"Left without investigating it.");
              encounterIndex+=enemyContainerNumber;
              nextEncounter();
              break;
            }
            logPlayerAction(actionString,"Felt like nothing really happened.");
        }
        break;

      case 'button_block':
        if (enemyType=="Death"){
          displayPlayerCannotEffect();
          logPlayerAction(actionString,"There is nothing to block anymore.");
          break;
        }

        if (enemyType == "Upgrade"){
          logPlayerAction(actionString,"Gained <b>+1 🔵 Mana</b> permanently.");
          displayPlayerCannotEffect();
          displayPlayerEffect("✨");
          playerName=getSorceryName();
          playerMgk+=1;
          playerMgkMax+=1;
          isFishing=false;
          animateFlipNextEncounter();
          break;
        }

        if (!playerUseStamina(1,"Not enough energy for that.")){
            break;
        }

        if (enemyAtk<=0 && enemySta > 0 && enemyType!="Pet" && enemyType!="Small"){
          enemyStaminaChangeMessage(-1,"They cannot do any harm -1 🟢","Blocked just for the sake of it -1 🟢")
          displayEnemyCannotEffect();
          break;
        }

        if (!enemyType.includes("Friend") && enemyCastIfMgk(true,"Could not block their spell")){
          break;
        }

        switch (enemyType){
          case "Pet":
          case "Small":
            if (enemyAtk<=0) {
              enemyStaminaChangeMessage(-1,"Enjoyed a moment together -1 🟢","They needed to catch a breath -1 🟢");
            } else {
              enemyStaminaChangeMessage(-1,"Blocked a normal attack -1 🟢","Blocked just for the sake of it -1 🟢");
            }
            break;
          case "Standard":
          case "Undead":
          case "Recruit":
          case "Demon":
            enemyStaminaChangeMessage(-1,"Blocked a normal attack -1 🟢","Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Swift":
            enemyStaminaChangeMessage(-1,"Blocked a swift attack -1 🟢","Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Heavy": //Too heavy or spirit attack
          case "Boss":
            if (enemyStaminaChangeMessage(-1,"Could not block a heavy attack -"+enemyAtk+" 💔","n/a")){
              playerHit(enemyAtk);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","Blocked, but was not attacked -1 🟢");
            }
            break;

          case "Spirit":
            if (enemyStaminaChangeMessage(-1,"Could not block a spectral attack -"+enemyAtk+" 💔","n/a")){
              playerHit(enemyAtk,true,true);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","Blocked, but was not attacked -1 🟢");
            }
            break;

          default:
            logPlayerAction(actionString,"Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;
        }
        break;

        case 'button_cast':
          if (enemyType=="Death"){
            logPlayerAction(actionString,"Cannot really cast anymore.");
            displayPlayerCannotEffect();
            break;
          }

          if (enemyType=="Upgrade"){
            logPlayerAction(actionString,"Got <b>+2 Mana</b> 🔵 for <b>-1 🟢 Stamina</b>.");
            displayPlayerCannotEffect();
            displayPlayerEffect("✨");
            playerName=getSorceryName();
            playerMgkMax+=2;
            playerMgk+=2;
            playerStaMax-=1;
            if (playerSta>0) playerSta-=1;
            isFishing=false;
            animateFlipNextEncounter();
            break;
          }

          if ((!playerLootString.includes("🧂")) && (playerMgk<1)){
            logPlayerAction(actionString,"Not enough mana, requires +1 🔵");
            displayPlayerCannotEffect();
            break;
          }

          if (enemyType.includes("Locked")){
            if (playerMgk<2){
              logPlayerAction(actionString,"Not enough mana, requires +2 🔵");
              displayPlayerCannotEffect();
              break;
            } else {
              playerMgk-=2;
              var gainedXP=playerGainXP(1,25*playerLevel,"");
              logPlayerAction(actionString,"Unlocked using a spell -2 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
              nextEncounter();
              break;
            }
          }

          if (enemyType!="Death" && playerCooked!=true && (enemyType=="Consumable" && !playerLootString.includes("🧂"))) displayPlayerEffect("🪄"); //I'm lazy

        switch (enemyType){
          case "Friend":
          case "Container-Friend":
            if (enemyAtk>0){
              playerMgk--;
              playerKarma--;
              logPlayerAction(actionString,"Turned them adversary -1 🔵");
              enemyType="Standard";
            } else {
              playerMgk--;
              playerKarma--;
              logPlayerAction(actionString,"Magic spooked them away -1 🔵");
              displayEnemyEffect("💨");
              isFishing=false;
              nextEncounter();
              break;
            }

          case "Recruit": //You should be faster if you have Mgk >= them
          case "Standard":
          case "Swift":
          case "Heavy":
          case "Pet":
          case "Swift":
          case "Spirit":
          case "Demon":
          case "Undead":
          case "Boss":
          case "Small":
            var magicDamage = playerMgk;
            if ((parseInt(enemyHp)-parseInt(enemyHpLost))==1) magicDamage=1; //TODO: No time to do it better now
            if (magicDamage > 2) {
              magicDamage=2;
            }
            playerMgk-=magicDamage;

            if ((enemyMgk-enemyMgkLost)<=magicDamage){
              enemyHit(magicDamage,true);
            } else {
              logPlayerAction(actionString,"They resisted the spell -"+magicDamage+" 🔵");
              enemyMgkLost+=magicDamage;
              if (enemyMgkLost>enemyMgk) enemyMgkLost=enemyMgk;
            }

            if (enemyHp-enemyHpLost > 0) { //If they survive, they counterattack or regain stamina
              if (enemyCastIfMgk()) break;
              enemyAttackOrRest();
            }
            break;

          case "Container-Friend":
          case "Friend": //They'll be hit (above) and then get angry //TODO: Check this, they might not get hit
            playerMgk--;
            logPlayerAction(actionString,"The spell turned them adversary -1 🔵");
            displayEnemyEffect("‼️");
            enemyType="Standard";
            break;

          case "Trap":
          case "Trap-Roll":
          case "Trap-Attack":
          case "Item":
            playerMgk--;
            logPlayerAction(actionString,"Scorched it with a spell -1 🔵");
            displayEnemyEffect("🔥");
            isFishing=false;
            nextEncounter();
            break;

          case "Consumable":
          case "Consumable-Container":
            if (!playerCooked) {
              var logMessage="";

              if (enemyHp<0){
                logMessage="Cooked it with a spell -1 🔵";
                if (!playerLootString.includes("🧂")) playerMgk--;
                enemyHp=0;
                enemyName="Cooked "+enemyName;
                enemyMsg="Actually tasted good";
                displayEnemyEffect("🔥");
              } else {
                logMessage="Roasted a crunchy crust -1 🔵";
                if (!playerLootString.includes("🧂")) playerMgk--;
                enemySta=parseInt(enemySta)+1;
                enemyMsg="That was very tasty";
                displayEnemyEffect("🔥");
              }

              if (playerLootString.includes("🧂")){
                logMessage="Added a tiny pinch of salt.";
                enemyName="Salted "+enemyName;
                displayEnemyEffect("✨");
              } else {
                enemyName="Crispy "+enemyName;
              }

              playerCooked=true;
              logPlayerAction(actionString,logMessage);
              animateUIElement(enemyInfoUIElement,"animate__pulse","0.4"); //Animate cooking
            } else {
              if (!playerPartyString.includes("🧂"))//Regain the lost mana if no salt shaker
              displayPlayerCannotEffect();
              logPlayerAction(actionString, "Already improved this food!")
            }
            break;

          case "Altar":
            logPlayerAction(actionString,"Trashed it with a spell -1 🔵");
            playerMgk--;
            isFishing=false;
            displayEnemyEffect("🔥");
            nextEncounter();
            break;

          default:
            if (enemyType.includes("Container") && !enemyType.includes("Locked")) {
              logPlayerAction(actionString,"Scorched it with a spell -1 🔵");
              playerMgk--;
              displayEnemyEffect("🔥");
              isFishing=false;
              nextEncounter();
              break;
              }
            logPlayerAction(actionString,"The spell had no effect on that -1 🔵");
            displayEnemyEffect("✨");
          }
          break;

        case 'button_pray':
          if (enemyType=="Death"){
            playerReincarnate();
            break;
          }

          if (enemyType=="Upgrade"){
            logPlayerAction(actionString,"Granted gods blessing +1 🧠 +1 🍀");
            displayPlayerGainedEffect();
            displayPlayerEffect("🙏");
            playerName=getFaithName();
            playerLck++;
            playerInt++;
            //playerKarma++; //Hmmm
            animateFlipNextEncounter();
            break;
          }

          if (playerMgk<1 && !isfreePrayEncounter()){
            logPlayerAction(actionString,"Not enough mana, requires +1 🔵");
            displayPlayerCannotEffect();
            break;
          }

          if (enemyType=="Spirit" || enemyType=="Demon" || enemyType=="Undead"){
            if (!playerUseMagic(1,"Not enough mana, requires +2 🔵")) {
              break;
            }
          }

          if (enemyType!="Death" && enemyType!="Dream") {displayPlayerEffect(actionString.substring(0,actionString.indexOf(" ")));}

        switch (enemyType){
          case "Curse": //Breaks only if mind is stronger
            if (playerInt>=(-1*enemyInt)){
              logPlayerAction(actionString,"Managed to keep it together.");
              nextEncounter();
            } else {
              logPlayerAction(actionString,"Giving the best, but no effect.");
              displayPlayerCannotEffect();
            }
            break;

          case "Spirit":
          case "Demon":
            if (enemyInt <= playerInt ){
              var gainedXP=playerGainXP(1.25,0,"")
              logPlayerAction(actionString,"Banished them from the world! "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
              displayEnemyEffect("🔥");
              nextEncounter();
              break;
            } else {
              logPlayerAction(actionString,"Could not overpower this entity!");
            }
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Consumable":
          case "Trap":
          case "Trap-Attack":
          case "Trap-Roll":
          case "Item":
          case "Fishing":
            playerHeal();
            break;
          case "Standard":
          case "Recruit":
          case "Swift":
          case "Heavy":
          case "Pet":
          case "Friend":
          case "Container-Friend":
          case "Boss":
          case "Small":
            playerHeal();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Undead": //Reduce attack if possible
            if (playerMgkMax >= enemyMgk && (enemyAtkBonus+enemyAtk)>0) {
              enemyAtkBonus-=1;
              logPlayerAction(actionString,"Made them -1 ⚔️ weaker for -1 🔵");
              displayEnemyEffect("🔥");
            } else if (playerMgkMax < enemyMgk) {
              logPlayerAction(actionString,"They resisted the prayer -1 🔵");
            } else {
              logPlayerAction(actionString,"The prayer had no effect on them -1 🔵");
            }
            enemyAttackOrRest();
            break;

          case "Dream":
            playerHeal();
            break;

          case "Altar":
            var isSacrifice = (enemyHp<0)

            if (isSacrifice) {
                if (playerUseItem("🔪","overwritten","overwritten",true,true,false)){
                  displayEnemyEffect("🩸");
                  playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
                  playerHit(0,false,true);
                  isFishing=false
                  if (playerHp>0) nextEncounter();
                  break;
                }
                logPlayerAction(actionString,"No effect, missing <b>🔪 Blade</b>.")
                displayPlayerEffect("🤲");
                displayPlayerCannotEffect();
              } else {
                playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
                displayPlayerEffect("✨")
                displayPlayerGainedEffect();
                isFishing=false
                nextEncounter();
              }
            break;

          default:
            var prayLogMessage="The prayer had no visible effect."
            if (!isfreePrayEncounter){
              prayLogMessage.replace("."," -1 🔵");
            } else {
              playerHeal();
              break;
            }
            logPlayerAction(actionString,prayLogMessage);
        }
        break;

      case 'button_curse':
        if (enemyType=="Death"){
          logPlayerAction(actionString,"Cannot really curse anymore.");
          displayPlayerCannotEffect();
          break;
        }

        if (enemyType=="Upgrade"){
            logPlayerAction(actionString,"Gained permanent bonus <b>+2 🍀 Luck</b>.");
            displayPlayerCannotEffect();
            playerName=getLuckyName();
            playerChangeStats(0, 0, 0, 2, 0, 0,"n/a",false,false);
            isFishing=false;
            animateFlipNextEncounter();
            break;
        }

        if (playerMgk<2){
          logPlayerAction(actionString,"Not enough mana, requires +2 🔵");
          displayPlayerCannotEffect();
          break;
        }

        if (!playerUseMagic(2,"Not enough mana, requires +2 🔵")) { //Curse is never free, upgrd handled above
            break;
          }

        if (enemyType!="Death") {displayPlayerEffect("🪬");}

      switch (enemyType){
        case "Demon":
            logPlayerAction(actionString,"The curse made them even stronger!");
            animateUIElement(enemyInfoUIElement,"animate__tada","1"); //Animate enemy gain
            enemyMgk+=1;
            break;

        case "Standard": //Reduce enemy atk if mgk stronger then them
        case "Recruit":
        case "Swift":
        case "Heavy":
        case "Pet":
        case "Undead":
        case "Boss":
        case "Small":
          if (playerMgkMax > enemyMgk && (enemyAtkBonus+enemyAtk)>0) {
            displayEnemyCannotEffect();
            displayEnemyEffect("🪬");

            if (procAbilityChance("🪆",33)){
              var animalEmoji = chooseFrom(["🐁","🦔","🐸","🦎","🐀","🪱","🪱","🪱","🪱","🪱"]); //50% for worm
              logAction("🪆 ▸ ‍🧬 <b>Polymorphed</b> them into a critter -2 🔵");
              displayEnemyCannotEffect();
              displayEnemyEffect("🧬");

              enemyEmoji=animalEmoji; enemyType="Small"; enemyRenew();
              enemyHp=1; enemyAtk=1; enemyAtkBonus=0; enemySta=1; enemyLck=0; enemyInt=-1; enemyMgk=0;
              enemyMsg="They avenged getting polymorphed!";
              break;
            }

            var enemyAtkChange=Math.floor((1+enemyAtk+enemyAtkBonus)/2);
            enemyAtkBonus-=enemyAtkChange;
            if (enemyAtkBonus>enemyAtk) enemyAtkBonus=enemyAtk;
            logPlayerAction(actionString,"Cursed them -"+enemyAtkChange+" ⚔️ weaker for -2 🔵");
            break; //Enemy does not attack if  cursed
          } else if (playerMgkMax <= enemyMgk) {
            logPlayerAction(actionString,"They resisted the curse -2 🔵");
          } else {
            logPlayerAction(actionString,"The curse had no effect on them -2 🔵");
          }

          if (enemyCastIfMgk()) break;
          enemyAttackOrRest();
          break;

        case "Spirit": //They don't care
          logPlayerAction(actionString,"The curse had no effect on it -2 🔵");
          if (enemyCastIfMgk()) break;
          enemyAttackOrRest();
          break;

        case "Container-Friend":
          if (playerMgk >= enemyMgk){
            var gainedXP=playerGainXP(1,25*playerLevel,"");
            logPlayerAction(actionString,"Forced revealed their secrets -2 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
            nextEncounter();
          } else {
            logPlayerAction(actionString,"Could not overpower their will -2 🔵");
            displayPlayerCannotEffect();
          }
          break;

        case "Friend": //They'll boost your stats
          if (playerMgk >= enemyMgk){
            var gainedXP=playerGainXP(1,25*playerLevel,"");
            logPlayerAction(actionString,"Forced revealed their secrets -2 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyMsg);
          } else {
            logPlayerAction(actionString,"Could not overpower their will -2 🔵");
            displayPlayerCannotEffect();
          }
          break;

        case "Altar":
          logPlayerAction(actionString,"The curse has angered the gods -1 🍀");
          playerLck=-1;
          displayPlayerEffect("🪬");
          break;

        default:
          logPlayerAction(actionString,"The curse dispersed into the area -2 🔵");
      }
      break;

      case 'button_grab': //Player vs encounter stamina decides the success
        switch (enemyType){
          case "Curse":
            logPlayerAction(actionString,"Hands reached forward to no effect.");
            displayPlayerCannotEffect();
            break;

          case "Dream":
            logPlayerAction(actionString,"Trying hard but cannot move.");
            displayPlayerCannotEffect();
            break;

          case "Pet": //Can become pet it when the player has higher current stamina
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){
              if ((enemyInt+enemyIntBonus) > playerInt) { //Cannot become a party member if it has higher int than the player
                logPlayerAction(actionString,"Unable to initiate relationship ?? 🧠");
                nextEncounter();
                break;
              }
              enemyJoinedParty();
              break;
            }

          case "Recruit": //Player vs encounter stamina - knockout, dodge or asymmetrical rest
          case "Standard":
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){ //If they are tired and player has stamina
              logPlayerAction(actionString,"Grabbed them into stranglehold.");
              enemyKnockedOut();
              isFishing=false;
            } else if (enemySta - enemyStaLost > 0){ //Enemy dodges if they got stamina
              var touchChance = Math.floor(Math.random(10) * luckInterval); // Chance to make enemy uncomfortable
              if ( touchChance <= playerLck ){ //Generous
                logAction("🍀 ▸ ✋ <b>Luckily</b>, they were spooked.");
                displayEnemyEffect("💨");
                displayPlayerEffect("🍀");
                nextEncounter();
                break;
              }
              else {
                enemyDodged("Missed, it evaded the grasp.");
                if (enemyCastIfMgk()) break;
              }
            } else { //Player and enemy have no stamina - asymetrical rest
              enemyKicked();
              if (enemyType=="Pet"){
                logAction(enemyEmoji+" ▸ 😱 They got spooked and fled!");
                displayEnemyEffect("💨");
                nextEncounter();
              }
            }
            break;

          case "Swift": //Player can only kick tired swift enemies
            if (enemySta-enemyStaLost == 0){
              enemyKicked();
              break;
            }
            enemyDodged("Missed, it evaded the grasp.");
            if (enemyCastIfMgk()) break;
            break;

          case "Heavy":
          case "Boss":
            if (enemySta - enemyStaLost > 0){ //Enemy hits extra hard if they got stamina
              if (enemyCastIfMgk()) break;
              logPlayerAction(actionString,"Overpowered, got hit extra hard -"+enemyAtk*2+" 💔");
              playerHit(enemyAtk+2);
            } else { //Enemy has no stamina - asymetrical rest
              enemyKicked();
            }
            break;

          case "Trap": //Grabbing triggers the effect
          case "Trap-Roll":
          case "Trap-Attack":
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
            playerHpMax+=(enemyHp*(-1));
            if (enemyHp<0 || playerHp<=0) playerHit(0,true,true); //Oof
            break;

          case "Undead": //Grabbing is not safe
            if (enemyCastIfMgk()) break;
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk,true,true);
            displayEnemyEffect("✋");
            break;

          case "Item":
            displayEnemyEffect("👋");

            if (enemyEmoji=="⚖️"){
              var halfHp = Math.floor(playerHpMax/2);
              if (halfHp == 0) {
                logPlayerAction(actionString,"Not enough <b>❤️ Health</b> available.");
                displayPlayerCannotEffect();
                break;
              }
              playerHpMax-=halfHp;
              playerAtk+=halfHp;
              playerHit(halfHp,false,true);
            }

            if (enemyEmoji=="🍭"){
              var halfSta = Math.floor(playerStaMax/2);
              if (halfSta == 0) {
                logPlayerAction(actionString,"Not enough <b>🟢 Energy</b> available.");
                displayPlayerCannotEffect();
                break;
              }
              playerSta=parseInt(playerSta)-halfSta;
              playerStaMax=parseInt(playerStaMax)-halfSta;
              playerMgkMax=parseInt(playerMgkMax)+halfSta;
              playerMgk=parseInt(playerMgk)+halfSta;
            }

            if (enemyEmoji=="🎲"){
              var halfHp = Math.floor(playerHpMax/2);
              if (halfHp == 0) {
                logPlayerAction(actionString,"Not enough <b>❤️ Health</b> available.");
                displayPlayerCannotEffect();
                break;
              }
              playerHpMax=parseInt(playerHpMax)-halfHp;
              playerHit(halfHp,false,true);
            }

            if (enemyEmoji=="🧪"){
              displayPlayerEffect("🌪️");
              var polymorph = chooseFrom(["🗿","🥨","🪰","🦎","🐸","🐁","🐷","🦍","😾","🧞‍♂️","👽","🎃","🪽"]);
              switch (polymorph) {

                case "🦍":
                  playerAtk+=1;
                  playerName="Muscular Ape"
                  enemyMsg="Turned into "+polymorph+" <b>Muscular Ape</b> +1 ⚔️";
                  break;

                case "😾":
                  playerAtk+=2;
                  playerName="Bipedal Feline"
                  enemyMsg="Turned into "+polymorph+" <b>Bipedal Feline</b> +2 ⚔️";
                  break;

                case "🪽":
                  playerSta+=3; playerStaMax+=3;
                  playerName="Winged Hybrid"
                  enemyMsg="Turned into "+polymorph+" <b>"+playerName+"</b> +3 🟢";
                  break;

                case "🧞‍♂️":
                  playerMgk=+3; playerMgkMax=+3;
                  playerName="Blueskin Genie"
                  enemyMsg="Morphed into "+polymorph+" <b>Blueskin Genie</b> +3 🔵";
                  break;

                case "👽":
                  playerName="Ancient Alien"
                  enemyMsg="Turned into "+polymorph+" <b>Ancient Alien</b> +4 🧠";
                  playerInt+=4;
                  break;

                case "🎃":
                  playerName="Hollow Giant"
                  enemyMsg="Turned into "+polymorph+" <b>"+playerName+"</b> +3 ❤️";
                  playerHp+=3; playerHpMax+=3;
                  break;

                case "🐷":
                  playerName="Pighead Hybrid"
                  enemyMsg="Turned into "+polymorph+" <b>Pighead Hybrid</b> -4 🧠";
                  playerInt-=4;
                  break;

                case "🗿":
                  playerName="Petrified Stone"
                  enemyMsg="Turned into "+polymorph+" <b>Petrified Stone</b>";
                  playerHp=0;
                  playerHit(0,false);
                  break;

                case "🥨":
                  playerName="Stale Pretzel"
                  enemyMsg="Turned into "+polymorph+" <b>"+playerName+"</b>";
                  playerHp=0;
                  playerHit(0,false);
                  break;

                default:
                  playerName="Harmless Vermin"
                  enemyMsg="Morphed into "+polymorph+" <b>Harmless Vermin</b> ⇣🔻";
                  playerHp=1; playerHpMax=1;
                  playerSta=2; playerStaMax=2;
                  playerMgk=0; playerMgkMax=0;
                  playerAtk=0;
              }

              playerName=polymorph+" "+playerName;
              displayPlayerCannotEffect();
            }

            playerLootString+=enemyEmoji;
            isFishing=false;
            if (playerHp==0) break;
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyMsg);
            break;

          case "Small":
            if ((enemySta-enemyStaLost)==0 && (enemyMgk-enemyMgkLost)==0) {
              enemyGrabbedIntoLoot();
            } else {
              enemyDodged("Missed, it evaded the grasp.");
              if (enemyCastIfMgk()) break;
            }
            break;

          case "Container-Friend":
            logPlayerAction(actionString,"Touch not appreciated, lost interest.");
            encounterIndex+=1; //Skip next encounter
            displayEnemyEffect("✋");
            nextEncounter();
            break;

          case "Friend":
            logPlayerAction(actionString,"Touch not appreciated, lost interest.");
            displayEnemyEffect("✋");
            nextEncounter();
            break;

          case "Consumable":
            playerConsumed();
            displayEnemyEffect("🍴");
            if (playerHp>0) nextEncounter();
            isFishing=false;
            break;

          case "Fishing":

            if (playerUseItem("🪱","Fished out something "+decorateStatusText("","+"+(10*playerLevel)+" XP",colorGold),"Missing a viable fishing bait.")){
              playerGainXP(1,10*playerLevel,"");

              if (procAbilityChance("🧵",33)) {
                logAction("🧵 ▸ 🪱 Luckily the bait remained hooked.");
                displayPlayerEffect("🧵");
                playerLootString+="🪱";
              }

              getRandomFish();
              displayEnemyEffect("🪝");
            } else {
              displayPlayerCannotEffect();
            }
            break;

          case "Demon":
          case "Spirit":
            logPlayerAction(actionString,"Missed, they are untouchable.");
            displayEnemyEffect("🌀");
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Death":
            logPlayerAction(actionString,"Echoed a message to the universe.");
            redirectToFeedback();
            break;

          case "Upgrade":
            //Hatred
            logPlayerAction(actionString,"Sacrificed <b>-1 💔</b> for <b>+2 🔵 Mana</b>.");
            displayPlayerCannotEffect();
            playerName=getHatredName();
            playerChangeStats(-1, 0, 0, 0, 0, 2,"n/a",false,false);
            playerHit(0,false,true);
            isFishing=false;
            animateFlipNextEncounter();
            break;

          case "Checkpoint": //LVL UP
            //There's now level up effect
            //curtainFadeInAndOut("<p style=\"color:#EEBC1D;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;\">&nbsp;⏀&nbsp;Flame Embraced&nbsp;&nbsp;");
            playerXP+=playerXPThreshold;
            isFishing=false;
            logPlayerAction(actionString,"Embraced the "+enemyName+".");
            playerGetStamina(playerStaMax-playerSta,true);
            playerHp=playerHpMax;
            playerMgk=playerMgkMax;
            animateFlipNextEncounter();
            break;
          default:
            if (enemyType.includes("Container")){
              if (enemyType.includes("Locked")){
                if (playerUseItem("🗝️","Unlocked it with the key "+decorateStatusText("","+"+(25*playerLevel)+" XP",colorGold),"Cannot open, it is locked tight.",false)){
                  playerGainXP(1,25*playerLevel,"");
                  nextEncounter();
                } else {
                  displayPlayerCannotEffect();
                }
                break;
              }
              var openMessage = "Sucessfully found something.";
              displayEnemyEffect("👋");
              if (enemyMsg != ""){
                openMessage = enemyMsg;
              }
              logPlayerAction(actionString,openMessage);
              nextEncounter();
              break;
            }

            logPlayerAction(actionString,"Touched it, nothing happened.");
            displayEnemyEffect("✋");
          }
        break;

      case 'button_speak':

        switch (enemyType){
          case "Recruit": //If you are smarter they join you
            if (enemyInt < playerInt){
              displayPlayerEffect(enemyEmoji);
              playerPartyString+=enemyEmoji
              var gainedXP=playerGainXP(1.5,0,"");
              enemyMsg=playerChangeStats(0, enemyAtk, 0, enemyLck, 0, enemyMgk,"Joined forces together",false); //Cannot get health/sta/int from a recruit
              logPlayerAction(actionString,enemyMsg+decorateStatusText(""," +"+gainedXP+" XP",colorGold))
              break;
            }

          case "Standard": //If they are dumber they will walk away
          case "Swift":
          case "Heavy":
          case "Pet":
          case "Spirit":
          case "Demon":
          case "Boss":
          case "Small":
            var maxEnemyAngryBoost=3;

            if (enemyInt==-1) {
              logPlayerAction(actionString,"They cannot comprehend any words.");
              displayPlayerEffect("💬");
              if (enemyCastIfMgk()) break;
              enemyAttackOrRest();
              break;
            }

            if (enemyInt < playerInt){
              enemyDisengage();
              break;
            } else if ((enemyInt > (playerInt+2)) && enemyAtkBonus <= maxEnemyAngryBoost) {
              logPlayerAction(actionString,"The words made them more upset +1 ⚔️");
              displayPlayerEffect("💬");
              enemyAtkBonus+=1;
            } else {
              var speechChance = Math.floor(Math.random() * luckInterval);
              if ( speechChance <= playerLck ){
                logAction("🍀 ▸ 💬 They believed the lies and left.");
                displayPlayerEffect("💬");
                nextEncounter();
                break;
              } else {
                logPlayerAction(actionString,"They ignored whatever has been said.");
              }
            }
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Undead": //They don't care
            logPlayerAction(actionString,"They cannot comprehend any words.");
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Friend": //They'll boost your stats
            if (playerInt >= enemyInt){
              displayPlayerEffect("💬");
              var gainedXP=playerGainXP(1,25*playerLevel,"");

              if (parseInt(enemyHp+enemyAtk+enemySta+enemyLck+enemyInt+enemyMgk+enemyMsg)==0) {
                logPlayerAction(actionString,enemyMsg+" " + decorateStatusText("","+"+gainedXP+" XP",colorGold));
                nextEncounter();
              } else {
                enemyMsg=playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyMsg+" " + decorateStatusText("","+"+gainedXP+" XP",colorGold),true);
              }
            } else {
              logPlayerAction(actionString,"Unable to initiate conversation ?? 🧠");
              displayPlayerCannotEffect();
            }
            break;

          case "Container-Friend":
            if (playerInt >= enemyInt){
              var openMessage = "Received a gift";
              var gainedXP=playerGainXP(1,25*playerLevel,"");

              displayPlayerEffect("💬");
              if (enemyMsg != ""){
                openMessage = enemyMsg;
              }
              logPlayerAction(actionString,openMessage+" " + decorateStatusText("","+"+gainedXP+" XP",colorGold));
              nextEncounter();
            } else {
             logPlayerAction(actionString,"Unable to initiate a conversation ?? 🧠");
             displayPlayerCannotEffect();
           }
           break;

          case "Death":
            redirectToTweet();
            logPlayerAction(actionString,"Echoed their story to the world!")
            break;

          case "Dream":
            logPlayerAction(actionString,"Cannot speak while asleep.");
            displayPlayerCannotEffect();
            //playerRest();
            //nextEncounter();
            break;

          case "Upgrade":
            //Greed (speak)
            logPlayerAction(actionString,"Became considerably wiser +2 🧠");
            displayPlayerGainedEffect();
            displayPlayerEffect("🧠");
            playerName=getCleverName();
            playerInt+=2;
            isFishing=false;
            animateFlipNextEncounter();
            break;

          default:
            logPlayerAction(actionString,"The voice echoes around the area.");
            displayPlayerCannotEffect();
            displayPlayerEffect("💬");
        }
        break;

      case 'button_sleep':
        switch (enemyType){

          case "Curse": //Waiting triggers the curse
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyMsg);
            if (enemyHp<0 || playerHp<=0) playerHit(0,true,true); //Oof
            break;

          case "Standard": //You get hit if they have stamina
          case "Swift":
          case "Heavy":
          case "Recruit":
          case "Pet":
          case "Spirit":
          case "Demon":
          case "Undead":
          case "Boss":
          case "Small":
            if (playerHp>0){
              displayPlayerEffect("💤");
              playerGetStamina(1);
            }
            if (enemyCastIfMgk()){
              //
            } else {
              enemyAttackOrRest();
            }
            break;

          case "Trap": //Rest to full if out of combat + mana
          case "Trap-Attack":
          case "Trap-Roll":
          case "Item":
          case "Consumable":
          case "Prop":
          case "Checkpoint":
          case "Altar":
          case "Fishing":
            playerRest();
            break;

          case "Dream":
            playerRest();
            nextEncounter();
            break;

          case "Container-Friend":
          case "Friend": //They'll leave if you'll rest
            playerRest();
            logPlayerAction(actionString,"They lost interest tired of waiting.");
            nextEncounter();
            break;

          case "Death":
            copyAdventureToClipboard();
            break;

          case "Upgrade": //TODO refactor to something else
            displayPlayerCannotEffect();
            logPlayerAction(actionString,"Decided against gaining a perk.");
            playerName="Hardcore "+playerName;
            isFishing=false;
            animateFlipNextEncounter();
            break;

          default:
            if (enemyType.includes("Container")){
              playerRest();
              break;
            }
            logPlayerAction(actionString,"Cannot rest, monsters are nearby.");
            displayPlayerCannotEffect();
            displayPlayerEffect("👀");
            break;
        }
    };
    if (isFishing) {
      loadEncounter(lootEncounterIndex,linesLoot);
      encounterIndex=lastEncounterIndex;
    }
    enemyType=enemyBossType;
    redraw();
  };
}

//Enemy
function enemyRest(stamina){
  if (enemyHp - enemyHpLost > 0){
    animateUIElement(enemyInfoUIElement,"animate__pulse","0.4"); //Animate enemy rest
    if (document.getElementById('id_enemy_overlay').innerHTML!= "💢") displayEnemyEffect("⏳")
    enemyStaLost-=stamina;
    if (enemyStaLost < 0) {
      enemyStaLost = 0;
    }
  }
}

function enemyStaminaChangeMessage(stamina,successMessage,failMessage){
  if (enemyStaLost < enemySta) {
    logPlayerAction(actionString,successMessage); //TODO: switch emojis around >> 🐅 > ⚔️
    animateUIElement(enemyInfoUIElement,"animate__headShake","0.7"); //Play attack animation
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

function enemyHit(damage,magicType=false,applyLuck=true,silent=false) {
  animateUIElement(emojiWrapperUIElement,"animate__shakeX","0.5"); //Animate hitreact
  var hitMsg = "Hit them with an attack -"+damage+" 💔";

  if (magicType==true) {
    actionString="🪄"; hitMsg="Scorched them with a spell -"+damage+" 💔";
  } else { //Melee
      actionString="⚔️";
  }

  displayEnemyEffect("💢");
  var critChance = Math.floor(Math.random() * luckInterval);
  if ( (critChance <= playerLck) && applyLuck){
    logAction("🍀 ▸ "+actionString+" The strike was blessed with luck.");
    hitMsg="Attack hit them critically -"+(damage+2)+" 💔";
    displayPlayerEffect("🍀");
    damage+=2;
  }

  if (!silent) logPlayerAction(actionString,hitMsg);
  enemyHpLost = enemyHpLost + damage;

  if (!magicType && procAbilityChance("🀄️",33) && playerHp<playerHpMax){
      logAction("🀄️ "+arrowSymbol+" ✨ The attack syphoned health +1 ❤️");
      playerHp+=1;
  }

  if (enemyHpLost >= enemyHp) {
    enemyKilled();
  }
}

function enemyKilled(){
  var gainedXP=parseInt(playerGainXP(1,0,""));
  logAction(enemyEmoji + " ▸ " + "💀 They received a fatal blow " + decorateStatusText("","+"+gainedXP+" XP",colorGold));
  enemyHpLost=enemyHp; //Negate overkill damage

  playerKarma-=1; console.log("karma-- ("+playerKarma+")");
  playerXP+=gainedXP; console.log("XP++ "+ gainedXP + " ("+playerXP+"/"+playerXPThreshold+")");
  playerKills++;

  isFishing=false;
  animateFlipNextEncounter();
}

function enemyJoinedParty(){
  displayPlayerEffect(enemyEmoji);
  playerPartyString+=" "+enemyEmoji;
  //logPlayerAction(actionString,enemyName+" joined the party!");
  var gainedXP=playerGainXP(1.5,0,"");
  playerKarma++;
  enemyMsg=enemyMsg+decorateStatusText(""," +"+gainedXP+" XP",colorGold)
  playerChangeStats(0, enemyAtk, 0, enemyLck, 0, enemyMgk,enemyMsg); //Cannot get health/sta/int from a pet
}

function enemyKnockedOut(){
  var gainedXP=parseInt(playerGainXP(1.25,0,""));
  logAction(enemyEmoji + "&nbsp;▸&nbsp;" + "💤 Harmlessly knocked them out " + decorateStatusText("","+"+gainedXP+" XP",colorGold));
  if (enemyAtk>0) playerKarma++;
  if (enemyAtk<=0) playerKarma--;

  isFishing=false;
  displayEnemyEffect("💤");
  animateFlipNextEncounter();
}

function enemyDisengage(){
  playerGainXP(1.5,0,"Convinced them to disengage");
  playerKarma+=1;

  isFishing=false;
  displayPlayerEffect("💬");
  animateFlipNextEncounter();
}

function enemyGrabbedIntoLoot(){
  playerGainXP(1.25,0,"Grabbed it into their bag");
  playerLootString+=enemyEmoji;
  //No karma change

  isFishing=false;
  displayEnemyEffect("👋");
  nextEncounter();
}

function enemyKicked(){
  logPlayerAction(actionString,"Kicked them afar regaining +2 🟢");
  displayEnemyCannotEffect();
  displayEnemyEffect("🦶");
  playerGetStamina(2,true);
  enemyRest(1);
}

function playerGainXP(multiplier=1,gainedXP=0, message="Improved their insight "){
  var intBonus=1+playerInt/20;
  var statSum=0;
  var typeMultiplier=1;

  if (enemyType=="Swift"||enemyType=="Heavy") typeMultiplier=1.2;
  if (enemyType=="Demon"||enemyType=="Spirit"||enemyType=="Undead") typeMultiplier=1.3;
  if (enemyBossType.includes("Boss")) typeMultiplier=2;

  statSum+=parseInt(enemyHp);
  statSum+=parseInt(enemySta);
  statSum+=parseInt(enemyAtk);
  //statSum+=enemyLck; - Does not make diff now.
  //statSum+=enemyInt; - This might be OP
  statSum+=parseInt(enemyMgk);

  if (gainedXP==0) {
    gainedXP=parseInt((((parseInt(statSum)*10)/2)*multiplier)*typeMultiplier*intBonus);
  } else {
    gainedXP=parseInt(gainedXP*multiplier*intBonus);
  }

  playerXP+=gainedXP;
  if (message!="") logPlayerAction(actionString,message + decorateStatusText(""," +"+gainedXP+" XP",colorGold));
  var XPString = gainedXP + " ("+playerXP+"/"+playerXPThreshold+")"
  console.log("XP +"+XPString+"\naction x"+multiplier+" type x" +typeMultiplier+" int x" +intBonus);

  return parseInt(gainedXP);
}


function enemyAttackOrRest(message=""){
  var damageReceived=enemyAtk+enemyAtkBonus;
  var staminaChangeMsg;

  if (enemySta>enemyStaLost) {

    if (procAbilityChance("🎲",33)){
      logAction("⚔️ ▸ <b>🎲 Pure Chance</b> averted enemy attack.");
      displayPlayerEffect("🎲");
      return false;
    }

    if (playerLootString.includes("🖤") && (enemyAtk+enemyAtkBonus)>0) {
      logAction("⚔️ ▸ 🖤 Resisted -1 💔 by <b>🖤 Unbreakable</b>.");
      damageReceived--;
      displayPlayerEffect("🖤");
      if (damageReceived<=0) {
        if (enemyStaLost<enemySta) enemyStaLost++;
        return false;
      }
    }

    if (enemyType!="Demon"){
      staminaChangeMsg = "The enemy attacked dealing -"+damageReceived+" 💔"
    } else {
        staminaChangeMsg = "The enemy syphoned some health -"+damageReceived+" 💔";
        if (enemyHpLost >0) {enemyHpLost-=1;}
      }

    if (damageReceived<=0){
      staminaChangeMsg="They are too weak to do any harm."
      if (enemyAtk==0) {
        staminaChangeMsg="They cannot cause any harm."
        if (enemyType=="Pet"){
          enemyIntBonus++; //Harder to befriend

          if ((enemyInt+enemyIntBonus)<=playerInt){
            logAction(enemyEmoji+" ▸ ⁉️ They now seem more concerned.");
            displayEnemyEffect("⁉️")
            enemyRest(1);
          } else {
            logAction(enemyEmoji+" ▸ ‼️ They got bored and left.");
            nextEncounter();
          }
          return;
        }
      }
    } else {
      if (message!="") staminaChangeMsg=message;
      enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a");
      playerHit(damageReceived,true,false);

      if (playerLootString.includes("🥀") && (enemyHp>enemyHpLost) && (enemyAtk+enemyAtkBonus)>0) {
        logAction("⚔️ ▸ 🥀 Dealt -1 💔 by <b>🥀 Thorns Payback</b>.");
        enemyHit(1,false,false,true);
        displayEnemyEffect("🥀");
      }

      return;
    }
    enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a","Shit happened.");
  } else {
    enemyRest(1);
  }
}

function enemyDodged(message="Missed, it evaded the grasp."){
  displayPlayerCannotEffect();
  logPlayerAction(actionString,message);
  displayEnemyEffect("🌀");
  enemyAttackOrRest();
}

function enemyCastIfMgk(hit=true,customHitMessage=""){
  switch (enemyType){
    case "Trap": //Rest to full if out of combat + mana
    case "Trap-Attack":
    case "Trap-Roll":
    case "Item":
    case "Consumable":
    case "Altar":
    case "Curse":
    case "Fishing":
      return false;
      break;
  }

  if (parseInt(enemyMgk)>parseInt(enemyMgkLost)) {
    var damageAndCost=1;
    if (parseInt(enemyMgk)>(parseInt(enemyMgkLost)+1)) damageAndCost=2;

    enemyMgkLost+=damageAndCost;
    displayEnemyCannotEffect(); //Actually can, but this is just for effect

    if (procAbilityChance("💠",33)){
      logAction("🪄 ▸ <b>💠 Reflect Magic</b> resisted the spell.");
      displayPlayerEffect("💠");
      return false;
    }

    if (hit && (customHitMessage=="")) {
      logAction(enemyEmoji+" ▸ 🪄 Got hit by the enemy spell -"+damageAndCost+" 💔");
    } else if (hit) {
      logPlayerAction(actionString,customHitMessage+" -"+damageAndCost+" 💔");
    }

    if (hit) playerHit(damageAndCost,true,true);

    return true;
  }
}

//Encounters
function isfreePrayEncounter(){
  var returnValue = false;
    switch (enemyType){
      case "Death":
      case "Altar":
      case "Curse":
        returnValue=true;
      default:
        //Nothing
    }
  return returnValue;
}

function getRandomFish(){ //TODO refactor into encounters.csv
  isFishing=true;
  previousArea = areaName;
  adventureEncounterCount+=1;

  lastEncounterIndex = encounterIndex-1;
  lootEncounterIndex = getUnseenLootIndex();
  markAsSeenFishing(lootEncounterIndex);

  animateUIElement(cardUIElement,"animate__fadeIn","0.8");
  enemyRenew();
  return
}

function procAbilityChance(abilityEmoji="",abilityChance=100) { //Congrats me!!!
  var success = Math.floor(((Math.random() * 100))<=abilityChance)
  if (success && playerLootString.includes(abilityEmoji)) {
    return true;
  }
}

function nextEncounter(animateArea=true){ //Note: Even generator encounters go through here :)

  if (playerCheckLevelUp()){
    return true;
  }

  if (procAbilityChance("🥻",5)){
    var philosopherThoughts = ["area:"+areaName,"emoji:💭","name:Curious Thought","type:Prop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","note:Epiphany","desc:Stopped to think about the universe.<br>n/a","message:"]
    linesStory.splice(encounterIndex+1,0,philosopherThoughts);
    logAction("🥻 ▸ <b>💭 Curious Thought</b> came on their mind.")
  }

  if (!enemyType.includes("Generator")) markAsSeen(enemyName) //Hacky hacky hack
  previousEnemyType = enemyType;

  if (animateArea) {
    toggleUIElement(areaUIElement,1);
    animateUIElement(areaUIElement,"animate__flipInX","1");
  }

  encounterIndex = getNextEncounterIndex();

  playerRested=false;
  playerCooked=false;
  enemyRenew();
  loadEncounter(encounterIndex);

  //Fullscreen Curtain
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm")){ //Does not animate new area when killed
    curtainFadeInAndOut("<span style=-webkit-text-stroke: 6.5px black;paint-order: stroke fill;>&nbsp;"+areaName+"&nbsp;</span>");
  }
  animateUIElement(cardUIElement,"animate__fadeIn","1");
  previousArea = areaName;
  redraw();
}

function animateFlipNextEncounter(){
  var animationHandler = function(){
    nextEncounter();
    cardUIElement.removeEventListener("animationend",animationHandler);
  }
  cardUIElement.removeEventListener("animationend",animationHandler);

  animateUIElement(areaUIElement,"animate__flipOutX","1.2");
  animateUIElement(cardUIElement,"animate__flipOutY","1.2");

  cardUIElement.addEventListener('animationend',animationHandler);
}

//Player
function playerCheckLevelUp(){
  var levelUp = ["area:"+areaName,"emoji:🎉","name:Level Up!","type:Upgrade","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","note:Character Upgrade","desc:<b>Choose a perk</b> to shape your character.<br>","message:"]

  if (playerXP>=playerXPThreshold){
    curtainFadeInAndOut("<p style=\"color:"+colorGold+";-webkit-text-stroke: 6.5px black;paint-order: stroke fill;\">Level Increased!<br>"+decorateStatusText("","New perk available.",colorWhite))+"</p>";
    if (playerHp<playerHpMax) playerHp=playerHpMax;
    playerRest(true);
    playerLevel++;
    playerXP=playerXP-playerXPThreshold;
    playerXPThreshold=playerLevel*150;
    updateXPProgress();
    linesStory.splice(encounterIndex+1,0,levelUp);
    logAction("✨ ▸ <b>🎉 Level Up!</b> Select a character perk.")
  }
}

function playerRest(silent=false){
  if (!playerRested){
    if (((playerStaMax-playerSta)>0) || ((playerMgkMax-playerMgk)>0)){
      playerGetStamina(playerStaMax-playerSta,true);
      if (playerMgk<playerMgkMax) playerMgk=playerMgkMax;
      playerRested=true;

      if (!silent) {
        logPlayerAction(actionString,"Rested well, recovering all resources.");
        displayPlayerEffect("💤");
        displayPlayerRestedEffect();
      }
    } else {
      playerRested=true;

      if (!silent) {
        logPlayerAction(actionString,"Wasted some time sleeping.");
        displayPlayerEffect("💤");
      }
    }
    if (!silent && procAbilityChance("🔮",33)){
      logAction("🔮 ▸ <b>👁️ Vivid Dream</b> provided bonus +1 🔵")
      playerMgk++;
      displayPlayerRestedEffect();
    }
  } else {
    if (!silent) logPlayerAction(actionString,"Not feeling sleepy at this time.");
    displayPlayerCannotEffect();
  }
}

function playerHeal(){
  var missingHp=playerHpMax-playerHp;
  if (missingHp<0) missingHp=0;

  if (missingHp>0) {
    var healAmount=missingHp;
    if (healAmount>(playerMgk)) healAmount=(playerMgk);
    if (healAmount>2) healAmount=2;
    playerHp+=healAmount;
    playerMgk-=healAmount;

    logPlayerAction(actionString,"Cast a +"+healAmount+" ❤️‍🩹 healing spell -"+healAmount+" 🔵");
    displayPlayerGainedEffect();
  } else {
    logPlayerAction(actionString,"Wasted a healing spell -1 🔵");
    playerMgk-=1;
    displayPlayerCannotEffect();
  }
}

function playerGetStamina(stamina,silent = false){
  if (playerSta >= playerStaMax) { //Cannot get more
    if (!silent){
      logPlayerAction(actionString,"Wasted a moment of their life.");
    }
    return false;
  } else {
    if (!silent){
      logPlayerAction(actionString,"Rested and regained +" + stamina + " 🟢");
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
    if (procAbilityChance("🪶",33)){
      logAction("🪶  ▸ <b>⚡️ Quick Reflexes</b> kicked in +"+stamina+" 🟢");
      playerSta+=stamina;
    }
    return true;
  }
}

function playerUseMagic(magic, message = ""){
  if (playerMgk <= 0) { //Cannot lose more
    if (message != ""){ //Display specific "too tired message"
      logPlayerAction(actionString,message);
    }
    displayPlayerCannotEffect();
    return false;
  } else {
    playerMgk -= magic;
    return true;
  }
}

function playerChangeStats(bonusHp=enemyHp,bonusAtk=enemyAtk,bonusSta=enemySta,bonusLck=enemyLck,bonusInt=enemyInt,bonusMgk=enemyMgk,gainedString = "Might come in handy later.",logMessage=true,moveForward=true,actionIcon=actionString){
  var totalBonus=bonusHp+bonusAtk+bonusSta+bonusLck+bonusInt+bonusMgk;
  var changeSign=" +";
  if (gainedString=="") gainedString="Might come in handy later."

  if ((totalBonus >= 0) && (gainedString=="Might come in handy later.")) {
    if (totalBonus !=0){
      gainedString="Felt becoming stronger";
    }
  } else if (gainedString=="Might come in handy later.") {
    gainedString="Got cursed by it";
    if (enemyType.includes("Trap")) gainedString="That was a mistake"
  }

  if (enemyMsg != "" && gainedString == "") {
    gainedString = enemyMsg;
  }

  if (totalBonus!=0){
    gainedString = gainedString.replace("."," ");
  }

  if (bonusLck != 0){
    if (bonusLck<0) {
      changeSign=" "
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      displayPlayerGainedEffect();
    }
    playerLck += parseInt(bonusLck);
    gainedString += changeSign+bonusLck + " 🍀";
    displayPlayerEffect("🍀");
    displayPlayerGainedEffect();
  }

  if (bonusInt != 0){
    if (bonusInt<0) {
      changeSign=" "
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      displayPlayerGainedEffect();
    }
    playerInt += parseInt(bonusInt);
    gainedString += changeSign+bonusInt + " 🧠";
    displayPlayerEffect("🧠");
    displayPlayerGainedEffect();
  }

  if (bonusMgk != 0){
    if (bonusMgk<0) {
      changeSign=" "
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      displayPlayerGainedEffect();
    }
    playerMgkMax += parseInt(bonusMgk);
    playerMgk += parseInt(bonusMgk);
    gainedString += changeSign+bonusMgk + " 🔵";
    displayPlayerEffect("🪬");
    displayPlayerGainedEffect();
  }

  if (bonusSta != 0){
    if (bonusSta<0) {
      changeSign=" "
      displayPlayerEffect("🐢");
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      playerSta += parseInt(bonusSta);
      displayPlayerEffect("💨");
      displayPlayerGainedEffect();
    }
    playerStaMax += parseInt(bonusSta);
    gainedString += changeSign+bonusSta + " 🟢";
  }

  if (bonusAtk != 0){
    if (bonusAtk<0) {
      changeSign=" ";
      displayPlayerEffect("🪬");
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      displayPlayerEffect("⚔️");
      displayPlayerGainedEffect();
    }
    playerAtk += parseInt(bonusAtk);
    gainedString += changeSign+bonusAtk + " ⚔️";
  }

  if (bonusHp != 0) {
    var hpEmoji = "❤️"

    if (bonusHp<0) {
      changeSign=" ";
      displayPlayerEffect("💢");
      hpEmoji = "💔"
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      displayPlayerEffect("❤️");
      displayPlayerGainedEffect();
    }
    playerHp+=parseInt(bonusHp);
    playerHpMax += parseInt(bonusHp);
    if (playerHp>playerHpMax) playerHp = playerHpMax
    gainedString += changeSign+bonusHp + " "+hpEmoji;
    if (playerHp<=0) {
      enemyMsg=gainedString;
      playerHit(0,false,true);
      return;
    }
  }

  if (logMessage) {
    logPlayerAction(actionIcon,gainedString);
  }
  if (moveForward) nextEncounter();
  return gainedString;
}

function playerConsumed(){
  var consumedString="Replenished resources"
  var sign = "";
  var eatEmoji= "🍴"

  var missingHp=0
  if (playerHp<playerHpMax) missingHp=parseInt(playerHpMax)-parseInt(playerHp);
  var missingSta=parseInt(playerStaMax)-parseInt(playerSta);
  var gainStamina=0

  if (enemyMsg!="") consumedString=enemyMsg;

  if (enemyHp>0 || enemySta>0 || enemyAtk>0  || enemyLck>0  || enemyInt>0  || enemyMgk>0) {
    if (enemyMsg=="") consumedString="That was actually tasty";
  }

  //Gain stamina only if not bad food and not hurt
  if ((playerHp>=playerHpMax)&&enemyHp>=0 && enemySta>=0 && enemyAtk>=0  && enemyLck>=0  && enemyInt>=0  && enemyMgk>=0){
    if (parseInt(missingSta)<=0) {
      gainStamina+=1;
      if (enemyMsg=="") consumedString="Got an energy bonus";
    } else {
      gainStamina+=parseInt(missingSta);
    }
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
  }

  if (enemyHp<0 || enemySta<0 || enemyAtk<0  || enemyLck<0  || enemyInt<0  || enemyMgk<0) {
    if (enemyMsg=="") consumedString="That did not taste good";
    eatEmoji="🤮";
    animateUIElement(playerInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  }

  gainStamina+=parseInt(enemySta);
  if (gainStamina<0) sign=" "
  if (gainStamina>=0) sign=" +"
  if (gainStamina!=0) consumedString +=" "+sign+(parseInt(gainStamina)) + " 🟢";
  playerSta+=parseInt(gainStamina);

  if (missingHp > 0 || parseInt(enemyHp)!=0){
    var heart = "❤️"
    var hpChange=parseInt(enemyHp);
    if (enemyHp>=0) hpChange+=parseInt(missingHp); //Another nasty hack, why is this so spaghetti
    if (hpChange<0) {
      sign="";
      heart="💔";
    }
    if (hpChange>0) playerHp += hpChange;
    consumedString += " "+sign+parseInt(hpChange) + " "+heart+" ";
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
  }

  //Apply stat changes (except hp & sta)
  playerChangeStats(0,enemyAtk,0,enemyLck,enemyInt,enemyMgk,consumedString,true,false,eatEmoji);

  //Actually damages here, to log potential lucky dmg avoidance at the right time
  if (enemyHp<0) playerHit(-1*enemyHp,true,true);
}

function playerHit(incomingDamage,applyLuck=true,typeMagic=false) {
  var hitChance = Math.floor(Math.random() * luckInterval);

  if (applyLuck && ( hitChance <= playerLck )){
    logAction("🍀 ▸ 💢 <b>Luckily</b> avoided receiving the damage.");
    displayPlayerEffect("🍀");
    return;
  }

  if (procAbilityChance("🛡️",33) && !typeMagic) {
    logAction("🛡️ ▸ 💢 Attack deflected by <b>🛡 Random Block</b>.");
    displayPlayerCannotEffect();
    displayPlayerEffect("🛡️");
    return;
  }

  playerHp = playerHp - incomingDamage;
  animateUIElement(playerInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  if (playerHp <= 0){
    playerHp=0; //Prevent redraw issues post-overkill

    var deathChance = Math.floor(Math.random() * luckInterval * 3); //Small chance to not die
    if (applyLuck && ( deathChance <= playerLck )){
      playerHp+=1;
      logAction("🍀 ▸ 💀 <b>Luckily</b> got a second chance to live.");
      displayPlayerEffect("🍀");
      return;
    }

    if (playerLootString.includes("🫀")) {
      playerUseItem("🫀","n/a","n/a",true,true)
      logAction("💀 ▸ 🫀 Still allive thanks to <b>💀 Cheat Death</b>.");
      displayPlayerGainedEffect();
      playerHp+=1;
      return;
    }

    if (procAbilityChance("📦",50)) {
      logAction("📦 ▸ ❤️‍🩹 Turned out <b>📦 <s>Dead or</s> Alive</b>.");
      displayPlayerGainedEffect();
      playerHp+=enemyAtk+enemyAtkBonus;
      if (playerHp>playerHpMax) playerHp=playerHpMax;
      return;
    }

    if (playerLootString.includes("📦")) {
      logAction("📦 ▸ 💀 Turned out <b>📦 Dead <s>or Alive</s></b>.");
      displayPlayerCannotEffect();
      displayPlayerEffect("📦");
      gameOver(true);
      return;
    }

    gameOver();
    return;
  }
  displayPlayerEffect("💢");
}

function playerUseItem(item,messageSuccess = "Used "+item+" from the inventory.",messageFail = "Requires "+item+" to continue.",effect=true,silent=false,consumeItem=true){
  if (playerLootString.includes(item)){
    if (enemyMsg!="") messageSuccess=enemyMsg;
    if (effect) displayEnemyEffect(item);
    if (consumeItem) playerLootString=playerLootString.replace(item,"");
    displayPlayerEffect(item);
    if (!silent) logPlayerAction(actionString,messageSuccess);
    return true;
  } else {
    if (!silent) logPlayerAction(actionString,messageFail);
    displayPlayerCannotEffect();
    return false;
  }
}

function playerReincarnate(){
  playerNumber++;
  displayPlayerEffect("✨");
  renewPlayer();
  encounterIndex=3; //Skip tutorial
  playerSta=playerStaMax; //Renew stamina (its empty initially)
  adventureEncounterCount = -1; //Death + tutorial
  logPlayerAction("🫶","Reincarnated for a new adventure.<br>&nbsp;<br>&nbsp;");
  nextEncounter();

  if (playerKarma>0){
    var bonusItem=getRandomEncounter(["Item"],["Artifact"],"Forsaken Village");
    var bonusWrapper=["area:Forsaken Village","emoji:🎁","name:Pleasant Surprise","type:Container","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","note:Karma Bonus","desc:Received for being a good boy!<br>","message:Opened the gift box."]

    logAction("💚 ▸ 🎁 Eligible for a good karma bonus!");
    pushEncounter(bonusWrapper,1); //Adjust to tutorial length (below as well)
    pushEncounter(bonusItem,2);
  }
}

//End Game
function gameOver(silent=false){
  //Reset progress to death encounter
  if ((enemyMsg=="")||(enemyType=="Undead")||(enemyType=="Trap")||(enemyType=="Trap-Roll")||(enemyType=="Trap-Attack")||(enemyType=="Consumable")||(enemyType=="Pet")) enemyMsg="Got killed, ending the adventure.";
  if (!silent) logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 "+enemyMsg);
  adventureEndTime=getTime();
  adventureEndReason="\nReason: "+enemyEmoji+" "+enemyName;
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  playerSta=0; //You are just tired when dead :)
  playerMgk=0;
  nextEncounter();
  animateUIElement(cardUIElement,"animate__flipInY","1.2");

  //Reset generated data
  resetSeenEncounters();
  processStoryData(storyData,false);
}

function gameEnd(){ //TODO: Proper credits + legend download prompt!!!
  var winMessage="👤 ▸ 👑 Unbelievable, completed the adventure!";
  logAction(winMessage);
  adventureEndTime=getTime();

  //Reset progress to game start
  resetSeenEncounters();
  processStoryData(storyData,false);
}

//Logging
function logPlayerAction(actionString,message){
  actionString = actionString.split(" ")[0] + "&nbsp;▸&nbsp;" + enemyEmoji + " " + message + "<br>";
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

function getTime(){
  var currentDate = new Date();
  var time = currentDate.getDate() + "/"
                  + currentDate.getMonth() + "/"
                  + String(currentDate.getFullYear()).substr(-2) + " • "
                  + currentDate.getHours() + ":"
                  + currentDate.getMinutes()+ ":"
                  + currentDate.getSeconds();
  return time;
}

//UI Buttons
function setButton(elementID,text,color=colorWhite){
  document.getElementById(elementID).innerHTML=text.replace(" "," <b style=\"color:"+color+";\">")+"</b>";
}

function resetEncounterButtons(){
  if (playerSta>0){
    setButton('button_attack',"⚔️ Attack");
    setButton('button_block',"🔰 Block");
    setButton('button_roll',"🌀 Dodge");
  } else {
    setButton('button_attack',"⚔️ Attack",colorDarkGrey);
    setButton('button_block',"🔰 Block",colorDarkGrey);
    setButton('button_roll',"🌀 Dodge",colorDarkGrey);
  }

  if ((((enemyAtk+enemyAtkBonus)<=0)&&(enemyMgk<=0)&&(enemyType!="Death"))||enemyType=="Friend")  setButton('button_roll',"👣 Leave");
  setButton('button_grab',"👋 Grab");
  setButton('button_sleep',"💤 Rest");
  if (playerRested || playerSta>=playerStaMax) setButton('button_sleep',"💤 Rest",colorDarkGrey);
  setButton('button_speak',"💬 Speak");

  setButton('button_cast',"💫 Cast");
  setButton('button_curse',"🪬 Curse");
  setButton('button_pray',"❤️‍🩹 Heal");
  if (playerMgk<=0){
    setButton('button_cast',"💫 Cast",colorDarkGrey);
    setButton('button_pray',"❤️‍🩹 Heal",colorDarkGrey);
  }
  if (playerMgk<=1) setButton('button_curse',"🪬 Curse",colorDarkGrey);
}

function adjustEncounterButtons(){
  resetEncounterButtons();
  switch (enemyType){
    case "Upgrade":
      setButton('button_attack',"❤️ Health",colorPink);
      setButton('button_roll',"🟢 Energy",colorDarkGreen);
      setButton('button_block',"🔵 Mana",colorLightBlue);
      setButton('button_cast',"🔮 Sorcery");
      setButton('button_grab',"🩸 Hatred");
      setButton('button_curse',"🍀 Fortune");
      setButton('button_speak',"🧠 Psyche");
      setButton('button_pray',"📿 Faith");
      setButton('button_sleep',"💀 Pain",colorDarkGrey); //TODO: Invent new perk
      break;

    case "Consumable":
    case "Consumable-Container":
      setButton('button_cast',"🔥 Cook",colorDarkGrey);
      if (playerMgk>0 && !playerCooked) setButton('button_cast',"🔥 Cook");
      if (playerLootString.includes("🧂")) {
        setButton('button_cast',"🧂 Salt");
        if (playerCooked) setButton('button_cast',"🧂 Salt",colorDarkGrey);
      }
      setButton('button_roll',"❌ Ditch");
      setButton("button_grab","🍴 Eat",eatColor);

      if (playerSta<playerStaMax  || playerMgk<playerMgkMax) setButton('button_sleep',"💤 Rest",colorLightBlue);
      if (playerRested || (playerSta>=playerStaMax)) setButton('button_sleep',"💤 Rest",colorDarkGrey);
      break;

    case "Altar":
      setButton('button_pray',"🙏 Pray",colorYellow);
      if (playerLootString.includes("🔪")&&enemyHp<0) document.getElementById('button_pray').innerHTML="🩸 Offer";
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋ Touch";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      if (isFishing) setButton('button_roll',"❌ Ditch");
      if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',"💤 Rest",colorLightBlue);
      if (playerRested || (playerSta>=playerStaMax)) setButton('button_sleep',"💤 Rest",colorDarkGrey);
      if (enemyEmoji=="🛶") setButton("button_roll","🛶 Sail");
      break;

    case "Curse":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      document.getElementById('button_roll').innerHTML="👣 Ignore";
      document.getElementById('button_pray').innerHTML="🧠 Endure";
      setButton('button_sleep',"😱 Faint",colorPink);
      break;

    case "Item":
      grabColor=colorWhite;
      if (enemyStatusString.includes("Valuable")) grabColor=colorYellow;
      if (enemyStatusString.includes("Magnificient")) grabColor=colorLightBlue;
      if (enemyStatusString.includes("Exquisite")) grabColor=colorPurple;
      if (enemyStatusString.includes("Legendary")) grabColor=colorOrange;
      setButton('button_grab',"👋 Grab",grabColor);

      setButton('button_roll',"❌ Ditch");
      if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',"💤 Rest",colorLightBlue);
      if (playerRested || (playerSta>=playerStaMax)) setButton('button_sleep',"💤 Rest",colorDarkGrey);
      break;

    case "Trap":
    case "Trap-Roll":
    case "Trap-Attack":
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',"💤 Rest",colorLightBlue);
      if (playerRested || (playerSta>=playerStaMax)) setButton('button_sleep',"💤 Rest",colorDarkGrey);
      break;

    case "Dream":
      setButton('button_grab',"✋ Reach",colorDarkGrey);
      setButton('button_roll',"👣 Walk");
      if (playerSta==0) setButton('button_roll',"👣 Walk",colorDarkGrey);
      setButton('button_speak',"💬 Speak",colorDarkGrey);
      setButton('button_sleep',"💤 Sleep",colorYellow);
      break;

    case "Fishing":
      document.getElementById('button_roll').innerHTML="👣 Walk";
      setButton('button_grab',"🎣 Fish",colorDarkGrey);
      if (playerLootString.includes("🪱")) setButton('button_grab',"🎣 Fish",colorYellow);
      if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',"💤 Rest",colorLightBlue);
      if (playerRested || (playerSta>=playerStaMax)) setButton('button_sleep',"💤 Rest",colorDarkGrey);
      break;

    case "Small":
      if (playerSta>0){
        if ((enemyAtk+enemyAtkBonus)<=0) setButton('button_block',"🫶 Play")
      } else {
        if ((enemyAtk+enemyAtkBonus)<=0) setButton('button_block',"🫶 Play",colorDarkGrey)
      }
      break;

    case "Recruit":
      if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){ //If they are tired and you are smarter they join you
        document.getElementById('button_speak').innerHTML="💬 Recruit";
      }
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) document.getElementById('button_grab').innerHTML="🦶 Kick";
      break;

    case "Pet":
      if ((enemyAtk+enemyAtkBonus)<=0) setButton('button_block',"🫶 Play")
      if (playerSta<=0) setButton('button_block',"🫶 Play",colorDarkGrey)
      if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)) document.getElementById('button_grab').innerHTML="👋 Pet";
    case "Standard":
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) { //Applies for all above without "break;"
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      break;

    case "Heavy":
    case "Swift":
    case "Boss":
      if (enemySta-enemyStaLost==0) {
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      break;

    case "Undead":
    case "Spirit":
    case "Demon":
      if (playerMgk>1) {
        setButton('button_pray',"🔥 Banish");
      } else {
        setButton('button_pray',"🔥 Banish",colorDarkGrey);
      }
      break;

    case "Death":
      setButton('button_grab',"💌 Review",colorPink);
      setButton('button_speak',"‍🦆 Tweet",colorLightBlue);
      document.getElementById('button_sleep').innerHTML="📜 Legend";
      setButton('button_pray',"✨ Revive",colorYellow);
      break;

    default:
      if (enemyType=="Checkpoint") setButton('button_grab',"✨ Embrace",colorYellow)
      if (enemyType.includes("Boss")) {
        if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) document.getElementById('button_grab').innerHTML="🦶 Kick";
      } else {
        setButton('button_roll',"👣 Walk");
        if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',"💤 Rest",colorLightBlue);
        if (playerRested || (playerSta>=playerStaMax)) setButton('button_sleep',"💤 Rest",colorDarkGrey);

        if (enemyType.includes("Container")) setButton('button_grab',"👀 <b style=\"color:"+colorYellow+";\">Search</b>");
        if (enemyType.includes("Locked")){
          setButton('button_cast',"🪄 Unlock");
          if (playerMgk<2) setButton('button_cast',"🪄 Unlock",colorDarkGrey)
          if (playerLootString.includes("🗝️")){
            document.getElementById('button_grab').innerHTML="🗝️ Unlock";
          } else {
          document.getElementById('button_grab').innerHTML="👋 Reach";
          }
        }
      }
      break;
  }
}

//UI Effects
function toggleUIElement(UIElement,opacity = "0"){
  var elementDisplayState = UIElement.style.opacity;
  if (elementDisplayState != "0"){
    UIElement.style.opacity=opacity;
  } else {
    UIElement.style.opacity=opacity;
  }
}

function curtainFadeInAndOut(message=""){
  var curtainUIElement = document.getElementById('id_fullscreen_curtain');
  var fullscreenTextUIElement = document.getElementById('id_fullscreen_text');

  animateUIElement(fullscreenTextUIElement,"animate__fadeIn",1.6,true,message);
  animateUIElement(curtainUIElement,"animate__fadeIn",1.5,true);

  var animationHandler = function(){
    animateUIElement(curtainUIElement,"animate__fadeOut",2.2,true);
    animateUIElement(fullscreenTextUIElement,"animate__fadeOut",2.2,true,message);
    curtainUIElement.removeEventListener("animationend",animationHandler);
  }
  curtainUIElement.addEventListener('animationend',animationHandler);
}

function displayEnemyEffect(message){
  displayEffect(message,document.getElementById('id_enemy_overlay'),"1.5");
}

function displayPlayerEffect(message){
  displayEffect(message,document.getElementById('id_player_overlay'));
}

function displayPlayerCannotEffect(){
  animateUIElement(playerInfoUIElement,"animate__headShake","0.7"); //Animate Player not enough stamina
}

function displayEnemyCannotEffect(){
  animateUIElement(document.getElementById('id_enemy_info'),"animate__headShake","0.7"); //Animate enemy not enough stamina
}

function displayPlayerGainedEffect(){
  animateUIElement(playerInfoUIElement,"animate__tada","1"); //Animate player gain
}

function displayPlayerRestedEffect(){
  animateUIElement(playerInfoUIElement,"animate__pulse","0.5"); //Animate player gain
}

function displayEffect(message,documentElement,time=2){
  animateUIElement(documentElement,"animate__fadeOut",time,true,message)
}

function animateUIElement(documentElement,animation,time="0s",hidden = false,message="",animateInfinite=false){
  var typeOfTime = typeof time; //To not forget anymore
  if (typeof time != "string"){
    time = String(time)
    typeOfTime = typeof time
  }

  if (hidden){
    documentElement.innerHTML = message;
    documentElement.style.display = "block";
  }
documentElement.classList.remove(animation);
void documentElement.offsetWidth; // trigger a DOM reflow

  if (animateInfinite) {
    documentElement.classList.add("animate__infinite");
    } else {
      documentElement.classList.remove("animate__infinite");
    }
  documentElement.style.setProperty("--animate-duration","0.0001s");
  //Wow, this is nice - https://animate.style
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

function logGenerator(generatorName="none"){
  console.log("Gnrt:"+generatorName);
  lastGeneratorName=generatorName;
}

//Button click listeners
function registerClickListeners(){
  //Essential, onTouchEnd event type usage is needed on mobile to enable vibration effects
  //Breaks interactions on loading the page using Dev Tools "mobile preview" followed by switching it off
  var eventType = 'click';

  //Disabled: Event type switch needed for vibration feedback on Android
  //This seems to be the cause why interactions stopped working recently on Android/Chrome
  //if (String(navigator.userAgentData) != "undefined"){ //Any browser except Chrome needs this, it took only 3 hours to realize
  //  if (navigator.userAgentData.mobile){
  //    eventType = 'touchend';
  //  }
  //}

  document.getElementById('button_attack').addEventListener(eventType, resolveAction('button_attack'));
  document.getElementById('button_block').addEventListener(eventType, resolveAction('button_block'));
  document.getElementById('button_roll').addEventListener(eventType, resolveAction('button_roll'));
  document.getElementById('button_cast').addEventListener(eventType, resolveAction('button_cast'));
  document.getElementById('button_curse').addEventListener(eventType, resolveAction('button_curse'));
  document.getElementById('button_pray').addEventListener(eventType, resolveAction('button_pray'));
  document.getElementById('button_grab').addEventListener(eventType, resolveAction('button_grab'));
  document.getElementById('button_sleep').addEventListener(eventType, resolveAction('button_sleep'));
  document.getElementById('button_speak').addEventListener(eventType, resolveAction('button_speak'));

  versionIDUIElement.addEventListener(eventType, ()=> {
    actionString="⚙️"
    adventureEndTime=getTime();
    copyAdventureToClipboard();
    redraw();
  });

  document.getElementById('id_player_name').addEventListener(eventType, ()=>{
    var newPlayerName = prompt("Rename your character: ", playerName);
    if (newPlayerName==="") {
      newPlayerName="Nameless";
    } else if (newPlayerName) {
      //Name changed
    } else {
      newPlayerName=playerName;
    }
    playerName=newPlayerName;
    redraw();
  });
}

//Social features
function generateCharacterShareString(){
  var characterShareString="";
    characterShareString+="<b>"+playerName+"</b> "+"•  Lvl "+playerLevel;
    characterShareString+="\n❤️ "+fullSymbol.repeat(playerHpMax)+"  🟢 "+fullSymbol.repeat(playerStaMax)+"  ⚔️ " + fullSymbol.repeat(playerAtk);
    if (playerMgkMax>0) characterShareString+="  🔵 " + fullSymbol.repeat(playerMgkMax);
    if ((playerPartyString.length+playerLootString.length)>0) characterShareString+="\n";
    if (playerPartyString.length > 0) characterShareString += playerPartyString;
    if (playerLootString.length > 0) characterShareString += playerLootString;
    characterShareString += "\nAwoken: "+adventureStartTime;
    characterShareString += "\nKillcount: "+playerKills;
    characterShareString += "\nDeceased: "+adventureEndTime;
    characterShareString += adventureEndReason+" (#"+adventureEncounterCount+")";

  return characterShareString;
}

function generateCharacterLegend(logLength=0) {
  var characterLegend="";
  characterLegend = adventureLog.replaceAll("<br>","\n");
  var tempString = characterLegend.split("\n").slice(2);
  characterLegend = tempString.join("\n");
  characterLegend = characterLegend.replaceAll("&nbsp;"," ").substring(1);
  if (parseInt(logLength)>0) {
    characterLegend="Limited to last "+logLength+" events...\n"+characterLegend.split("\n").slice(-logLength-1).join("\n");
  }

  characterLegend=generateCharacterShareString()+"\n\n"+characterLegend;
  characterLegend += "\nhttps://igpenguin.github.io/webcrawler";
  characterLegend +=  "\n"+ versionCode;

  return characterLegend;
}

function copyAdventureToClipboard(){
  var adventureLogClipboard = generateCharacterLegend();
  displayPlayerEffect("📜");
  logPlayerAction(actionString,"Recapped their legendary story.");

  //Copy to clipboard
  navigator.clipboard.writeText(adventureLogClipboard);

  //Download as .txt
  var fileName = "WebCrawler-"+playerName.replaceAll(" ","-")+"-"+adventureEndTime.replaceAll(" at ","-").replaceAll(":","-")+".txt";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(adventureLogClipboard));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  //Open in new window
  var legendTab = window.open('about:blank','data:text/plain;charset=utf-8,');
  legendTab.document.write("<p style=\"background-color:#272727;padding:8px;padding-left:24px;overflow:auto;height:100%;margin:-8px;color:"+colorWhite+"\">" + adventureLogClipboard.replaceAll("\n","<br>")+"</p>");
  legendTab.document.close();
}

function redirectToTweet(){
  var tweetUrl = "http://twitter.com/intent/tweet?url=https://igpenguin.github.io/webcrawler&text=";
  window.open(tweetUrl+encodeURIComponent("Hey @IGPenguin, check out my WebCrawler run!"+"\n\n"+generateCharacterShareString().replaceAll("<b>","").replaceAll("</b>","")+"\n"));
}

function redirectToFeedback(){
  //var googleFormUrl="https://forms.gle/zekjajGcVztxwTdX9"
  var characterLegend=generateCharacterLegend(50);
  console.log(characterLegend);
  var gameLog=encodeURIComponent(characterLegend.replaceAll("<b>","").replaceAll("</b>",""));
  var googleFormUrl="https://docs.google.com/forms/d/e/1FAIpQLSc46BJ-S_EBmXxZgzVYLCC8l2Wece0hWXJESiRMpuMlXTC3Cw/viewform?usp=pp_url&entry.1788435593="+gameLog;
  window.open(googleFormUrl);
}

//Prevent data loss warning if not running on localhost
if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1"){
  window.onbeforeunload = function() {
      return true;
  };
}

//Mobile specific - vibrate
function vibrateButtonPress(){
  if (!("vibrate" in window.navigator)){
    console.log("WARNING: Vibrate not supported!");
    return;
  }
  window.navigator.vibrate([5,20,10]);
}

async function actionVibrateFeedback(buttonID){
  vibrateButtonPress();
  await new Promise(resolve => setTimeout(resolve, 100)); // muhehe
}
