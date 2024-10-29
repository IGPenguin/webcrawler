//Having all this in a one file is truly shameful
//...submit a pull request if you dare

//Debug
var versionCode = "fpm 10/29/24 • 7:54 pm"
var initialEncounterOverride=7; //7 skips tutorial
if (initialEncounterOverride!=0) initialEncounterOverride-=3; //To handle notes and death in .csv

//Colors
var colorWhite = "#FFFFFF";
var colorGold = "#FFD940";
var colorGreen = "#22BF22";
var colorDarkGreen = "#509920";
var colorRed = "#FF0000";
var colorGrey = "#CCCCCC";
var colorDarkGrey = "#888888";
var colorOrange = "orange";
var colorYellow = "#F7D147";
var colorBlue = "#1059AA";
var colorPurple = "#BF40BF";

//Symbols
var fullSymbol = "●";
var emptySymbol = "○";
var enemyStatusString = "";
var newline="<br>";
var emptySpace="&nbsp";

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
var playerRested = false;
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
  playerDef = 0; //TODO: Make use of when getting hit not by magic
  playerLck = 1;
  playerInt = 1;
  playerMgk = playerMgkMax;
  playerRested = false;
  playerLootString = "";
  playerPartyString = "";

  playerKills = 0;
  seenLoot = [];
  adventureLog = "";
}

//Global vars
var storyData;
var linesStory;
var linesLoot;
var linesGenerator;

var encounterIndex;
var lastEncounterIndex;
var lootTotal;
var randomEncounterIndex;
var lootEncounterIndex;
var isLooting = false;

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

//String generators
function getFirstName(){
  const random_names = ["Straggler","Freak","Initiate","Savior","Nameless", "Hero", "Peasant", "Human", "Stranger", "Villain", "Soldier", "Traveller", "Wanderer", "Mortal", "Guerilla", "Lizardperson", "Casual", "Lady", "Lord", "Duke", "Mercenary", "Survivor", "Prophet", "Drifter", "Vagabond", "Straggler", "Bandit"];
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

function getGreedyName(name=playerName){
  if (name.includes(" ")) return name;

  const random_names = ["Disgusting "+name, "Worthless "+name, "Dirty "+name, "Greedy "+name];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

function getProphecy(){
  const random_quotes = ["<b>👀 Search</b> for valuables in places of interest."+newline,"<b>💤 Sleep</b> whenever you get a chance."+newline,"<b>💨 Hasty</b> attacks can only be <b>🔰 Blocked</b>."+newline,"<b>🔺 Heavy</b> attacks can only be <b>🌀 Dodged</b>."+newline,"<b>🔻 Small</b> creatures can be <b>👋 Grabbed</b>."+newline,"<b>👋 Grab</b> tired enemies to knock them out."+newline,"<b>🧠 Intellect</b> helps befreinding companions."+newline,"<b>💫 Cast</b> spells always hit before retaliation.<br>","<b>🍴 Eating</b> when relaxed provides a bonus."+newline,"Focus on <b>🔰 Block</b> / <b>🌀 Dodge</b> over <b>⚔️ Attack</b>."+newline,"<b>💤 Sleep</b> recovers <b>🟢 Stamina</b> and <b>🔵 Mana</b>."+newline,"<b>🍀 Luck</b> provides a chance on a critical hit."+newline,"<b>👋 Grab</b> 🪱 to do some <b>🎣 Fishing</b>."+newline,"<b>✏️ Report</b> any issues to make a difference."+newline,"<b>💬 Speaking</b> can sometimes stop the fight."+newline,"<b>🍀 Luck</b> may help to  survive a fatal hit."+newline, "Some <b>🔱 Altars</b> require 🔪 for <b>Sacrifice<b>"+newline];

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
function processStoryData(allText, initNextEncounter=true) {
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
    loadEncounter(1+initialEncounterOverride);//Start from the first encounter (0 is dead)
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

function getRandomEncounter(type="") {
  var tempLinesGenerator = linesGenerator;

  //drop anything but areaName
  tempLinesGenerator = $.grep(tempLinesGenerator, function (item) { return item.indexOf("area:"+areaName) === 0; });

  //drop anything but type
  //console.log("Encounter type: "+type);
  if (type != "") tempLinesGenerator = $.grep(tempLinesGenerator, function (item) { return item.indexOf("type:"+type) === 3; });

  //drop all seen names
  console.log("Seen: "+seenEncounters);
  seenEncounters.forEach(seenEncounterName => {
    //console.log("Dropping: "+seenEncounterName);
    tempLinesGenerator= tempLinesGenerator.filter(function(line) {
      //console.log(a);
      var lineEnemyName= line[2].split("name:")[1]
      if (lineEnemyName!==seenEncounterName) {
        console.log(lineEnemyName+" vs "+seenEncounterName);
        return line
      }
    })
    console.log(tempLinesGenerator);
    //Hopefully this finally works, backups below 🤣
    //TODO: FIX (maybe check fishing loot seen?) - tempLinesGenerator = tempLinesGenerator.filter(a => a !== seenEncounterName)


    //tempLinesGenerator = tempLinesGenerator.filter(function(a){return a !== seenEncounterName})
    //var index = tempLinesGenerator.splice(tempLinesGenerator.indexOf("name:"+seenEncounterName))
    //if (index !== -1) tempLinesGenerator.splice(index, 1);
  });
  //console.log("Options post-dropping:\n"+tempLinesGenerator);

  var tempLinesGeneratorTotal = tempLinesGenerator.length;
  var max = tempLinesGeneratorTotal;
  randomEncounterIndex = Math.floor(Math.random() * max);
  //console.log("Random encounter index: "+randomEncounterIndex)

  var randomEncounter = String(tempLinesGenerator[randomEncounterIndex])
  console.log("Options: "+tempLinesGeneratorTotal+"\nChosen #"+randomEncounterIndex+":\n"+randomEncounter.split(",h")[0])

  //mark as seen (by name)
  //var seenEncounterName = randomEncounter.split("name:").pop().split(',')[0]
  return randomEncounter;
}

function markAsSeen(seenName){
  //console.log("Marking as seen: \n"+seenName);
  if (!seenEncounters.includes(seenName)) seenEncounters.push(seenName);
}

function markAsSeenLoot(seenID){  //TODO: remove and reuse the fn above?
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
  if (enemyType.includes("Generator")) {
    var number = enemyType.match(/\d+$/);
    console.log("Generator type: "+number);
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
  if (enemyTeam.includes("Prophecy") || enemyTeam.includes("Knowledge") || enemyTeam.includes("Epiphany")) enemyDesc=getProphecy();
  if (enemyTeam.includes("Prophet")) enemyDesc="<i>Says:</i><br>"+getProphecy().replace("<br>","");
  enemyMsg = String(selectedLine.split(",")[12].split(":")[1]);
}

function generateNextEncounters(count=1){
  //TODO: Add: Recruit
  switch (count) {

    case 0: //Prop
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Prop"));
      break;

    case 1: //Easy Enemy
      linesStory.splice(encounterIndex+1,0,getRandomEncounter(chooseFrom(["Small","Standard"])));
      break;

    case 2: //Standard Enemy
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Standard"));
      break;

    case 3: //Advanced Enemy
      linesStory.splice(encounterIndex+1,0,getRandomEncounter(chooseFrom(["Swift","Heavy"])));
      break;

    case 4: //Swift Enemy
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Swift"));
      break;

    case 5: //Random Trap Type (same chances for all)
      //TODO: Apply this approach to all generators (=same change to pick any of all matching types)
      var trapsArray=[]
      trapsArray.push(getRandomEncounter("Trap"));
      trapsArray.push(getRandomEncounter("Trap-Attack"));
      trapsArray.push(getRandomEncounter("Trap-Roll"));
      var chosenTrap=chooseFrom(trapsArray)

      linesStory.splice(encounterIndex+1,0,chosenTrap);
      break;

    case 6: //Demon Enemy
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Demon"));
      break;

    case 7: //Friend
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Friend"));
      break;

    case 8: //Pet
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Pet"));
      break;

    case 9: //Item
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Item"));
      break;

    case 10: //Container
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container"));
      break;

    case 69: //Fishing
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Fishing"));
      break;

    case 666: //Altar
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Altar"));
      break;

    case 11: //Container Small
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter("Small"));
      break;

    case 20: //Standard Enemy + Consumable
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Standard"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter("Consumable"));
      break;

    case 21: //Skippable Enemy
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter(chooseFrom(["Standard","Swift","Heavy"])));
      break;

    case 22: //Mid Enemy + Loot
      linesStory.splice(encounterIndex+1,0,getRandomEncounter(chooseFrom(["Standard","Swift","Heavy","Demon"])));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter("Item"));
      break;

    case 23: //Mid Enemy + Consumable
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Standard"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter("Consumable"));
      break;


    case 17: //Container Pet/Friend/Container Friend
      var typeDetail = chooseFrom(["Pet","Friend","Container-Friend"])

      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter(typeDetail));
      if (typeDetail=="Container-Friend") linesStory.splice(encounterIndex+3,0,getRandomEncounter("Item"));
      break;

    case 18: //Container Consumable
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter("Consumable"));
      break;

    case 30: //Container-3 Empty
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container-3"));
      break;

    case 31: //Container >> Mid Enemy >> Loot
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container-2"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter(chooseFrom(["Standard","Swift","Heavy","Demon"])));
      linesStory.splice(encounterIndex+3,0,getRandomEncounter("Item"));
      break;

    case 36: //Cursed house: Curse >> Consumable
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container-3"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter("Curse"));
      linesStory.splice(encounterIndex+3,0,getRandomEncounter("Consumable"));
      break;

    case 45: //Trapped House: Container >> Trap >> Mid Enemy >> Loot/Consumable
      //TODO: RM below when solving Case: 5
      var trapsArray=[]
      trapsArray.push(getRandomEncounter("Trap"));
      trapsArray.push(getRandomEncounter("Trap-Attack"));
      trapsArray.push(getRandomEncounter("Trap-Roll"));
      var chosenTrap=chooseFrom(trapsArray)

      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container-3"));
      linesStory.splice(encounterIndex+2,0,chosenTrap);
      linesStory.splice(encounterIndex+3,0,getRandomEncounter(chooseFrom(["Heavy","Demon"])));
      linesStory.splice(encounterIndex+4,0,getRandomEncounter(chooseFrom(["Item","Consumable"])));
      break;

    case 4666: //Altar House: Container >> Mid Enemy >> Loot >> Altar
      linesStory.splice(encounterIndex+1,0,getRandomEncounter("Container-3"));
      linesStory.splice(encounterIndex+2,0,getRandomEncounter(chooseFrom(["Swift","Heavy","Demon"])));
      linesStory.splice(encounterIndex+3,0,getRandomEncounter(chooseFrom(["Item","Consumable"])));
      linesStory.splice(encounterIndex+4,0,getRandomEncounter("Altar"));
      break;

    default:
      console.log("ERROR: Missing generator definition!");
  }
}

function chooseFrom(array=[]){
  //console.log("Choices: "+array);
  var options = array.length
  var choice = array[Math.floor(Math.random() * options)];
  //console.log("Chosen: "+choice+"\nFrom: "+array);
  return choice;
}

//UI DRAW FUNCTIONS
function redraw(){
  //Version
  versionIDUIElement = document.getElementById('id_version')
  versionIDUIElement.innerHTML = versionCode+" <br>(#"+adventureEncounterCount+")";

  //Player UI
  playerInfoUIElement = document.getElementById('id_player_info');
  toolbarCardUIElement = document.getElementById('id_toolbar_card');
  document.getElementById('id_player_name').innerHTML = playerName;

  var playerStatusString = "❤️ " + fullSymbol.repeat(playerHp) + emptySymbol.repeat((-1)*(playerHp-playerHpMax));
  playerStatusString += "&nbsp;&nbsp;"

  playerStatusString += "&nbsp;&nbsp;🟢 " + fullSymbol.repeat(playerSta)
  if ((playerStaMax-playerSta)>0) playerStatusString += emptySymbol.repeat(playerStaMax-playerSta);
  playerStatusString += "&nbsp;&nbsp;"

  if (playerMgkMax>0){ playerStatusString += "&nbsp;&nbsp;🔵 " + fullSymbol.repeat(playerMgk) + emptySymbol.repeat(playerMgkMax-playerMgk);playerStatusString += "&nbsp;&nbsp;"}
  if (playerAtk>0) playerStatusString += "&nbsp;&nbsp;⚔️ " + fullSymbol.repeat(playerAtk);

  document.getElementById('id_player_status').innerHTML = playerStatusString;
  document.getElementById('id_player_party_loot').innerHTML = "";
  if (playerPartyString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "<b>Party:</b> " +playerPartyString+"&nbsp;";
  }
  if (playerLootString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "<b>Bag: </b> "+playerLootString;
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
  var totalEffect=enemyHp+enemyAtk+enemySta+enemyLck+enemyInt+enemyMgk;
  enemyTeamUIElement.innerHTML="";
  switch(enemyType){
    case "Boss":
      enemyTeamUIElement.innerHTML=decorateStatusText("👑","Boss",colorGold);
      enemyStatusString=appendEnemyStats()
      break;
    case "Pet":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔸","Companion",colorOrange);
      enemyStatusString=appendEnemyStats()
      break;
    case "Swift": //TODO: Perhaps there should also be "Flying"??
      enemyTeamUIElement.innerHTML=decorateStatusText("💨","Hasty",colorGreen);
      enemyStatusString=appendEnemyStats()
      break;
    case "Heavy":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔺","Strong",colorRed);
      enemyStatusString=appendEnemyStats()
      break;
    case "Spirit":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔘","Spirit",colorWhite);
      enemyStatusString=appendEnemyStats()
      break;
    case "Friend":
    case "Container-Friend":
      var neutralType=decorateStatusText("▪️","Neutral",colorGrey);
      //enemyStatusString=appendEnemyStats() //Do not display stats = reward hidden
      displayEnemyType(neutralType);
      break;
    case "Small":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔻","Small",colorWhite);
      enemyStatusString=appendEnemyStats()
      break;
    case "Recruit":
    case "Standard":
      enemyTeamUIElement.innerHTML=decorateStatusText("▫️","Normal",colorWhite);
      enemyStatusString=appendEnemyStats()
      break;
    case "Demon":
      enemyTeamUIElement.innerHTML=decorateStatusText("👺","Demon",colorRed);
      enemyStatusString=appendEnemyStats()
      break;
    case "Undead":
      enemyTeamUIElement.innerHTML=decorateStatusText("💀","Undead",colorGrey);
      enemyStatusString=appendEnemyStats()
      break;

    case "Item":
      if ((totalEffect > 0) || (enemyEmoji=="🗝️") || (enemyHp>0) || (enemyAtk>0) || (enemySta>0) || (enemyInt>0) || (enemyLck>0) || (enemyMgk>0)){
        enemyStatusString=decorateStatusText("⚜️","Valuable",colorGold);
      } else {
        enemyStatusString=decorateStatusText("🕸️","Rubbish","lightgrey");
      }
      if (enemyTeam.includes("Artifact")) enemyStatusString=decorateStatusText("🟠","Legendary",colorOrange);
      break;

    case "Trap":
    case "Trap-Attack":
    case "Trap-Roll":
      enemyStatusString=decorateStatusText("‼️","Dangerous",colorRed);
      break;
    case "Dream":
      enemyStatusString=decorateStatusText("💭","Guidance","#FFFFFF");
      break;
    case "Upgrade":
      enemyStatusString=decorateStatusText("⭐️","Advancement",colorGold);
      break;
    case "Prop":
      enemyStatusString=decorateStatusText("⚪️","Unremarkable",colorWhite);
      break;
    case "Altar":
      if (totalEffect>0){
        enemyStatusString=decorateStatusText("🌙","Place of Worship",colorGold);
      } else {
        enemyStatusString=decorateStatusText("♦️","Place of Worship",colorRed);
      }
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
      break;
    default:
      enemyStatusString=decorateStatusText("⁉️","No Details","red");
      //Multi-match
      if (enemyType.includes("Container")) enemyStatusString=decorateStatusText("🟡","Interesting",colorYellow);
      if (enemyType.includes("Locked")) enemyStatusString=decorateStatusText("🗝️","Locked",colorGrey);
      if (enemyType.includes("Consumable")) {
        enemyStatusString=decorateStatusText("❤️","Refreshment",colorWhite)
        if (enemyHp<0) enemyStatusString=decorateStatusText("🚩","Hazardous",colorRed)
        }
      break;
  }

  document.getElementById('id_stats').innerHTML = enemyStatusString;
  document.getElementById('id_log').innerHTML = actionLog;

  versusTextUIElement = document.getElementById('id_versus');
  if (enemyType!=previousEnemyType){
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
        if (enemyType.includes("Container") || enemyType=="Prop" || enemyType=="Item"||enemyType=="Consumable"||enemyType=="Checkpoint"||enemyType=="Altar"||enemyType=="Fishing"){
          if (playerSta>=playerStaMax) displayPlayerState("Relaxed",colorDarkGreen,"2.5"); //I need this to be overwritable by the below
          if (playerSta<=(playerStaMax/2)) displayPlayerState("Fatigued",colorYellow,"2"); //I need this to be overwritable by the below
          if (playerSta==0) displayPlayerState("Exhausted",colorOrange,"2"); //I need this to be overwritable by the below
          if (playerLootString.includes("🪱") && enemyType=="Fishing") displayPlayerState("Bait Ready",colorDarkGreen,"0.8");
        }
        if (enemyType=="Upgrade") displayPlayerState("Level Up",colorGold,"0.5"); //I need this to be overwritable by the below
        if (enemyTeam.includes("Imaginary") || enemyTeam.includes("Turning Point")) displayPlayerState("Sleeping",colorBlue,"2.5"); //Shitty, I know, its the tutorial
        if (enemyHp>0 && (enemyAtk>0 || enemyMgk>0)) displayPlayerState("In Combat",colorRed,"0.8");
        break;
    }
  }

  buttonsContainer = document.getElementById('id_buttons');
  adjustEncounterButtons();
}

function displayPlayerState(stateString="Cautious",color=colorGrey,time="3"){
  versusTextUIElement.innerHTML = "<div style=\"color:"+color+";\">"+stateString+"</div>"
  animateUIElement(versusTextUIElement,"animate__pulse",time,false,"",true);
}

function displayEnemyType(type){
  if ((enemyStatusString.replaceAll("&nbsp;","")!="")&&(!enemyStatusString.includes("</i>"))){
    enemyTeamUIElement.innerHTML=type;
  } else {
    enemyStatusString=type;
  }
}

function appendEnemyStats(){
  var enemyStats;
  enemyStats="&nbsp;";
  if (enemyHp > 0) { enemyStats += "❤️ " + fullSymbol.repeat(enemyHp);}
  if (enemyHpLost > 0) { enemyStats = enemyStats.slice(0,-1*enemyHpLost) + emptySymbol.repeat(enemyHpLost); } //YOLO

  enemyStats += "&nbsp;&nbsp;"

  if (enemySta > 0) { enemyStats += "&nbsp;🟢 " + fullSymbol.repeat(enemySta);}
    if (enemyStaLost > 0) { enemyStats = enemyStats.slice(0,-1*enemyStaLost) + emptySymbol.repeat(enemyStaLost); } //YOLO

  enemyStats += "&nbsp;&nbsp;"

  if ((enemyAtk)>0) {
    enemyStats += "&nbsp;⚔️ " + fullSymbol.repeat(enemyAtk+enemyAtkBonus);
    if (enemyAtkBonus<0) { enemyStats += emptySymbol.repeat(-1*enemyAtkBonus);
    }
    enemyStats += "&nbsp;&nbsp;"
  }

  if (enemyMgk > 0) {enemyStats += "&nbsp;🔵 " + fullSymbol.repeat(enemyMgk);}
  if (enemyMgkLost > 0) { enemyStats = enemyStats.slice(0,-1*enemyMgkLost) + emptySymbol.repeat(enemyMgkLost); } //YOLO

  return enemyStats;
}

function decorateStatusText(emoji,text,color="#FFFFFF",size=14){
  return emoji+"&nbsp;<i style=\"font-weight:600;color:"+color+";font-size:"+size+"px; -webkit-text-stroke: 3px #121212;paint-order: stroke fill;\">"+text+"</i>";
}

//Game logic
function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    var buttonUIElement = document.getElementById(button);
    animateUIElement(buttonUIElement,"animate__pulse","0.15");

    actionString = buttonUIElement.innerHTML;
    actionVibrateFeedback(button);

    switch (button) {
      case 'button_attack': //Attacking always needs stamina
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
            isLooting=false;
          case "Trap":
          case "Trap-Roll":
            logPlayerAction(actionString,"Smashed it into tiny bits -1 🟢");
            displayEnemyEffect("〽️");
            animateFlipNextEncounter();
            break;

          case "Trap-Attack": //Attacking causes you damage
            //logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" ❤️");
            //playerHit(enemyAtk);

            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
            playerHpMax+=(enemyHp*(-1)); playerHp+=(enemyHp*(-1));
            if (enemyHp<0) playerHit(enemyHp*(-1));
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
            enemyHit(playerAtk);
            if (enemyHp-enemyHpLost > 0) { //If they survive, they counterattack or regain stamina
              enemyAttackOrRest();
            }
            break;

          case "Swift": //They hit you first if they have stamina
            if (enemySta-enemyStaLost > 0) {
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
            logPlayerAction(actionString,"Felt becoming a bit stronger +1 ❤️");
            displayPlayerGainedEffect();
            displayPlayerEffect("❤️");
            playerName=getVitalName();
            playerHpMax+=1;
            playerHp+=1;
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
              animateFlipNextEncounter();
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
          case "Standard":
          case "Undead":
          case "Recruit":
          case "Pet":
          case "Demon":
          case "Spirit":
          case "Boss":
          case "Small":
            if ((enemyAtk<=0) && (enemyMgk<=0)){
              logPlayerAction(actionString,"Walked away leaving them behind.");
              nextEncounter();
              break;
            }

            if (playerUseStamina(1,noStaForRollMessage)){

              if (enemyCastIfMgk(false)){
                logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
                displayPlayerEffect("🌀");
                break;
              }

              if (enemyAtk!=0){
                rollMessage="Successfully dodged their attack -1 🟢";
              } else {
                rollMessage="They do not mean no harm -1 🟢";
              }

              enemyStaminaChangeMessage(-1,rollMessage,"The roll was a waste of energy -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;

          case "Swift":
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
            if (enemyCastIfMgk(false) && playerUseStamina(1,noStaForRollMessage)){
              logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
              break;
            }

            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"Dodged a heavy attack -1 🟢","Rolled around wasting energy  -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;

          case "Item": //You'll simply skip ahead
          case "Consumable":
          case "Checkpoint":
            if (isLooting){
              isLooting=false;
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
            nextEncounter();
            break;
          case "Container":
          case "Consumable-Container":
          case "Locked-Container":
          case "Container-Friend":
            logPlayerAction(actionString,"Left without investigating it.");
            encounterIndex++;
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
            isLooting=false;
            if (enemyMsg!=""){
              logPlayerAction(actionString,enemyMsg)
            } else {logPlayerAction(actionString,"Continued on the adventure.");}
            nextEncounter();
            break;
          case "Container-Friend":
          case "Friend":
            logPlayerAction(actionString,"Walked away leaving them behind.");
            nextEncounter();
            break;

          case "Trap-Roll": //Triggers when rolling into it
            //logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            //playerHit(enemyAtk);

            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
            playerHpMax+=(enemyHp*(-1)); playerHp+=(enemyHp*(-1));
            if (enemyHp<0) playerHit(enemyHp*(-1));
            break;
          case "Trap":
          case "Trap-Attack":
            isLooting=false;
            logPlayerAction(actionString,"Continued onwards, away from that.");
            nextEncounter();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Felt the body becoming faster +1 🟢");
            displayPlayerGainedEffect();
            displayPlayerEffect("💨");
            playerName=getSwiftName();
            playerStaMax+=1;
            playerSta+=1;
            animateFlipNextEncounter();
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
          logPlayerAction(actionString,"Granted gods blessing +1 🧠 +1 🍀");
          displayPlayerGainedEffect();
          displayPlayerEffect("🙏");
          playerName=getFaithName();
          playerLck++;
          playerInt++;
          animateFlipNextEncounter();
          break;
        }

        if (!playerUseStamina(1,"Not enough energy for that.")){
            break;
        }

        if (enemyAtk<=0 && enemyType!="Pet" && enemySta > 0){
          enemyStaminaChangeMessage(-1,"They cannot do any harm -1 🟢","Blocked just for the sake of it -1 🟢")
          displayEnemyCannotEffect();
          break;
        }

        if (enemyCastIfMgk(false)){
          logPlayerAction(actionString,"Could not block their spell -1 💔");
          playerHit(1);
          break;
        }

        switch (enemyType){
          case "Pet":
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
          case "Small":
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
              playerHit(enemyAtk);
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
            logPlayerAction(actionString,"Cast out a powerful message.");
            redirectToFeedback();
            break;
          }

          if (enemyType=="Upgrade"){
            logPlayerAction(actionString,"Chose magic +1 🔵 over agility -1 🟢");
            displayPlayerCannotEffect();
            displayPlayerEffect("✨");
            playerName=getSorceryName();
            playerMgkMax+=1;
            playerMgk+=1;
            playerStaMax-=1;
            if (playerSta>0) playerSta-=1;
            animateFlipNextEncounter();
            break;
          }

          if (enemyType.includes("Locked")){
            if (playerMgkMax<2){
              logPlayerAction(actionString,"Not enough mana, requires +2 🔵");
              displayPlayerCannotEffect();
              break;
            } else {
              playerMgk-=2;
              logPlayerAction(actionString,"Unlocked using a spell -2 🔵");
              animateFlipNextEncounter();
              break;
            }
          }

          if (playerMgkMax<1){
            logPlayerAction(actionString,"Not enough mana, requires +1 🔵");
            displayPlayerCannotEffect();
            break;
          }

          if (!playerUseMagic(1,"Not enough mana, requires +1 🔵")) { break; } //Casting is never free, upgrd handled above
          if (enemyType!="Death") {displayPlayerEffect("🪄");} //I'm lazy

        switch (enemyType){
          case "Friend":
          case "Container-Friend":
            if (enemyAtk>0){
              logPlayerAction(actionString,"Turned them adversary -1 🔵");
              enemyType="Standard";
            } else {
              logPlayerAction(actionString,"Magic spooked them away -1 🔵");
              displayEnemyEffect("💨");
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
            if (enemyMgk<=playerMgk){
              enemyHit(1,true); //Deal just 1 Mgk dmg to not overpower shit
            } else {
              logPlayerAction(actionString,"They resisted the spell -1 🔵");
            }
            if (enemyHp-enemyHpLost > 0) { //If they survive, they counterattack or regain stamina
              if (enemyCastIfMgk()) break;
              enemyAttackOrRest();
            }
            break;

          case "Friend": //They'll be hit (above) and then get angry //TODO: Check this, they might not get hit
            logPlayerAction(actionString,"The spell turned them adversary -1 🔵");
            displayEnemyEffect("‼️");
            enemyType="Standard";
            break;

          case "Trap":
          case "Trap-Roll":
          case "Trap-Attack":
          case "Item":
          case "Consumable":
            logPlayerAction(actionString,"Scorched it with a spell -1 🔵");
            displayEnemyEffect("🔥");
            animateFlipNextEncounter();
            break;

          case "Dream":
            logPlayerAction(actionString,"Spent magic power on dreaming -1 🔵");
            break;

          case "Altar":
            logPlayerAction(actionString,"The spell has trashed the place -1 🔵");
            nextEncounter();
            break;

          default:
            if (enemyType.includes("Container") && !enemyType.includes("Locked")){
              logPlayerAction(actionString,"Scorched it with a spell -1 🔵");
              displayEnemyEffect("🔥");
              animateFlipNextEncounter();
              }
            logPlayerAction(actionString,"The spell had no effect on that -1 🔵");
            displayEnemyEffect("✨");        }
        break;

        case 'button_pray':
          if (enemyType=="Death"){
            playerReincarnate();
            break;
          }

          if (enemyType=="Upgrade"){
              logPlayerAction(actionString,"Felt getting somewhat wiser +1 🧠");
              displayPlayerGainedEffect();
              displayPlayerEffect("🧠");
              playerName=getCleverName();
              playerInt+=1;
              animateFlipNextEncounter();
              break;
          }

          if (playerMgkMax<1 && !isfreePrayEncounter()){
            logPlayerAction(actionString,"Not enough mana, requires +1 🔵");
            displayPlayerCannotEffect();
            break;
          }

          if (!isfreePrayEncounter()) {
            if (!playerUseMagic(1,"Not enough mana, requires +1 🔵")) {
              break;
            }
          }

          if (enemyType=="Spirit" || enemyType=="Demon"){
            if (!playerUseMagic(1,"Not enough mana, requires +2 🔵")) {
              break;
            }
          }

          if (enemyType!="Death" && enemyType!="Dream") {displayPlayerEffect(actionString.substring(0,actionString.indexOf(" ")));}

        switch (enemyType){
          case "Curse": //Breaks only if mind is stronger
            if (playerInt>=(-1*enemyInt)){
              logPlayerAction(actionString,"Managed to keep it together.");
              animateFlipNextEncounter();
            } else {
              logPlayerAction(actionString,"Giving the best, but no effect.");
              displayPlayerCannotEffect();
            }
            break;

          case "Spirit":
          case "Demon":
            if ( (enemyMgk-enemyMgkLost) <= playerMgkMax ){
              logPlayerAction(actionString,"Banished them from this world!");
              displayEnemyEffect("🔥");
              animateFlipNextEncounter();
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
                if (playerUseItem("🔪","overwritten","overwritten",true,false)){
                  displayEnemyEffect("🩸");

                  playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true);
                  playerHit(0,false);
                }
                displayPlayerCannotEffect();
              } else {
                playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true);
                displayPlayerEffect("✨")
                displayPlayerGainedEffect();
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

      case 'button_curse': //TODO: Boosts undead and demon, curse basic enemies if Mgk > them, what else?
        if (enemyType=="Death"){
          logPlayerAction(actionString,"Decided to make a complaint.");
          redirectToFeedback();
          break;
        }

        if (enemyType=="Upgrade"){
            logPlayerAction(actionString,"Offered blood -1 💔 for power +1 🔵");
            displayPlayerCannotEffect();
            playerName=getHatredName();
            playerChangeStats(-1, 0, 0, 0, 0, 1,"n/a",false,false);
            playerHit(0,false);
            animateFlipNextEncounter();
            break;
        }

        if (playerMgkMax<2){
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
            enemyAtkBonus-=1;
            logPlayerAction(actionString,"Cursed them -1 ⚔️ weaker for -2 🔵");
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
            logPlayerAction(actionString,"Forced revealed their secrets -2 🔵");
            nextEncounter();
          } else {
            logPlayerAction(actionString,"Could not overpower their will -2 🔵");
            displayPlayerCannotEffect();
          }
          break;

        case "Friend": //They'll boost your stats
          if (playerMgk >= enemyMgk){
            logPlayerAction(actionString,"Forced revealed their secrets -2 🔵");
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyMsg);
          } else {
            logPlayerAction(actionString,"Could not overpower their will -2 🔵");
            displayPlayerCannotEffect();
          }
          break;

        case "Dream": //Likely never happens, not sure if I should fix that
          logPlayerAction(actionString,"Conjured a terrible nightmare -1 💔");
          playerHit(1);
          displayPlayerCannotEffect();
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
              displayPlayerEffect(enemyEmoji);
              playerPartyString+=" "+enemyEmoji;
              playerChangeStats(0, enemyAtk, 0, enemyLck, 0, enemyMgk,"New pet has joined the party"); //Cannot get health/sta/int from a pet
              break;
            }

          case "Recruit": //Player vs encounter stamina - knockout, dodge or asymmetrical rest
          case "Standard":
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){ //If they are tired and player has stamina
              logPlayerAction(actionString,"Grabbed them into stranglehold.");
              enemyKnockedOut();
            } else if (enemySta - enemyStaLost > 0){ //Enemy dodges if they got stamina
              var touchChance = Math.floor(Math.random(10) * luckInterval); // Chance to make enemy uncomfortable
              if ( touchChance <= playerLck ){ //Generous
                logAction("🍀 ▸ ✋ Touched them. <b>Luckily</b>, they were spooked.");
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
            //logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            //playerHit(enemyAtk);

            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyMsg,true,false);
            playerHpMax+=(enemyHp*(-1)); playerHp+=(enemyHp*(-1));
            if (enemyHp<0) playerHit(enemyHp*(-1));
            break;

          case "Undead": //Grabbing is not safe
            if (enemyCastIfMgk()) break;
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            displayEnemyEffect("✋");
            break;

          case "Item":
            displayEnemyEffect("👋");

            if (enemyEmoji=="⚖️"){
              var halfHp = Math.floor(playerHp/2);
              if (halfHp == 0) {
                logPlayerAction(actionString,"Not enough <b>❤️ Health</b> available.");
                displayPlayerCannotEffect();
                break;
              }
              playerHpMax-=halfHp;
              playerAtk+=halfHp;
              playerHit(halfHp);
            }

            if (enemyEmoji=="🍭"){
              var halfSta = Math.floor(playerSta/2);
              if (halfSta == 0) {
                logPlayerAction(actionString,"Not enough <b>🟢 Stamina</b> available.");
                displayPlayerCannotEffect();
                break;
              }
              playerSta-=halfSta;
              playerStaMax-=halfSta;
              playerMgkMax+=halfSta;
              playerMgk+=halfSta;
            }

            if (enemyEmoji=="🎲"){
              var halfHp = Math.floor(playerHp/2);
              if (halfHp == 0) {
                logPlayerAction(actionString,"Not enough <b>❤️ Health</b> available.");
                displayPlayerCannotEffect();
                break;
              }
              playerHpMax-=halfHp;
              playerHit(halfHp);
            }

            playerLootString+=enemyEmoji;
            isLooting=false;
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyMsg);
            break;

          case "Small":
            if ((enemySta-enemyStaLost)==0) {
              logPlayerAction(actionString,"Grabbed it into their bag.");
              playerLootString+=" "+enemyEmoji;
              displayEnemyEffect("👋");
              nextEncounter();
            } else {
              enemyDodged("Missed, it evaded the grasp.");
              if (enemyCastIfMgk()) break;
            }
            break;

          case "Container-Friend":
            logPlayerAction(actionString,"Touch not appreciated, they left.");
            encounterIndex+=1; //Skip next encounter
            displayEnemyEffect("✋");
            nextEncounter();
            break;

          case "Friend":
            logPlayerAction(actionString,"Touch not appreciated, they left.");
            displayEnemyEffect("✋");
            nextEncounter();
            break;

          case "Consumable":
            playerConsumed();
            displayEnemyEffect("🍴");
            if (playerHp>0) nextEncounter();
            isLooting=false;
            break;

          case "Fishing":
            if (playerUseItem("🪱","Successfully fished out something.","Missing a viable fishing bait.")){
              getRandomLoot();
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
            logPlayerAction(actionString,"Born to get extra lucky +2 🍀");
            displayPlayerCannotEffect();
            displayPlayerEffect("🍀");
            playerName=getLuckyName();
            playerLck+=2;
            animateFlipNextEncounter();
            break;

          case "Checkpoint": //Move to upgrade
            isLooting=false;
            logPlayerAction(actionString,"Embraced the "+enemyName+".");
            playerGetStamina(playerStaMax-playerSta,true);
            playerHp=playerHpMax;
            playerMgk=playerMgkMax;
            nextEncounter();
            curtainFadeInAndOut("<p style=\"color:#EEBC1D;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;\">&nbsp;⏀&nbsp;Flame Embraced&nbsp;&nbsp;");
            break;
          default:
            if (enemyType.includes("Container")){
              if (enemyType.includes("Locked")){
                if (playerUseItem("🗝️","Unlocked it with the key.","Cannot open, it is locked tight.",false)){
                  animateFlipNextEncounter();
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
              playerChangeStats(0, enemyAtk, 0, enemyLck, 0, enemyMgk,"Convinced them to join the adventure"); //Cannot get health/sta/int from a pet
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
              logPlayerAction(actionString,"Convinced them to disengage.");
              displayPlayerEffect("💬");
              nextEncounter();
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
              playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyMsg);
              displayPlayerEffect("💬");
            } else {
              logPlayerAction(actionString,"Unable to initiate conversation ?? 🧠");
              displayPlayerCannotEffect();
            }
            break;

          case "Container-Friend":
            if (playerInt >= enemyInt){
              var openMessage = "Sucessfully found something.";
              displayPlayerEffect("💬");
              if (enemyMsg != ""){
                openMessage = enemyMsg;
              }
              logPlayerAction(actionString,openMessage);
              nextEncounter();
            } else {
             logPlayerAction(actionString,"Unable to initiate a conversation ?? 🧠");
             displayPlayerCannotEffect();
           }
           break;

          case "Death":
            redirectToTweet();
            break;

          case "Dream":
            playerRest();
            nextEncounter();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Sacrificed health -1 💔 for luck +3 🍀");
            displayPlayerCannotEffect();
            displayPlayerEffect("🪙");
            playerUseStamina(1);
            playerName=getGreedyName();
            playerChangeStats(-1, 0, 0, 3, 0, 0,"n/a",false,false);
            playerHit(0,false);
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
            if (enemyCastIfMgk()){
              //
            } else {
              enemyAttackOrRest();
            }

            if (playerHp>0){
              displayPlayerEffect("💤");
              playerGetStamina(1);
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
            logPlayerAction(actionString,"They got tired of waiting and left.");
            nextEncounter();
            break;

          case "Death":
            copyAdventureToClipboard();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Decided against gaining a perk.");
            playerName="Hardcore "+playerName;
            displayPlayerCannotEffect();
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
    if (isLooting) {
      loadEncounter(lootEncounterIndex,linesLoot);
      encounterIndex=lastEncounterIndex;
    }
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

function enemyHit(damage,magicType=false) {
  animateUIElement(emojiWrapperUIElement,"animate__shakeX","0.5"); //Animate hitreact
  var hitMsg = "Hit them with an attack -"+damage+" 💔";
  if (magicType==true) {actionString="🪄 "; hitMsg="Scorched them with a spell -"+damage+" 💔";}

  displayEnemyEffect("💢");
  var critChance = Math.floor(Math.random() * luckInterval);
  if ( critChance <= playerLck ){
    logAction("🍀 ▸ ⚔️ The strike was blessed with luck.");
    hitMsg="Attack hit them critically -"+(damage+2)+" 💔";
    displayPlayerEffect("🍀");
    damage+=2;
  }

  logPlayerAction(actionString,hitMsg);
  enemyHpLost = enemyHpLost + damage;

  if (enemyHpLost >= enemyHp) {
    enemyHpLost=enemyHp; //Negate overkill damage
    logAction(enemyEmoji + "&nbsp;▸&nbsp;" + "💀 They received a fatal blow.");
    playerKills++;
    animateFlipNextEncounter();
    isLooting=false;
  }
}

function enemyKicked(){
  logPlayerAction(actionString,"Kicked them afar regaining +2 🟢");
  displayEnemyEffect("🦶");
  playerGetStamina(2,true);
  enemyRest(1);
}

function enemyKnockedOut(){
  logAction(enemyEmoji + "&nbsp;▸&nbsp;" + "💤 Harmlessly knocked them out.");
  displayEnemyEffect("💤");
  animateFlipNextEncounter();
}

function enemyAttackOrRest(message=""){
  var damageReceived=enemyAtk+enemyAtkBonus;
  var staminaChangeMsg;

  if (enemySta>enemyStaLost) {

    if (procAbilityChance("🎲",33)){
      logAction("🪄 ▸ 🎲 Attack resisted by <b>🎲 Pure Chance</b>.");
      displayPlayerEffect("🎲");
      return false;
    }

    if (playerLootString.includes("🖤") && (enemyAtk+enemyAtkBonus)>0) {
      logAction("⚔️ ▸ 🖤 Resisted -1 💔 due to <b>🖤 Unbreakable</b>.");
      damageReceived--;
      displayPlayerEffect("🖤");
      if (damageReceived<=0) return false;
    }

    if (enemyType!="Demon"){
      staminaChangeMsg = "The enemy attacked dealing -"+damageReceived+" 💔"
    } else {
        staminaChangeMsg = "The enemy siphoned some health -"+damageReceived+" 💔";
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
      playerHit(damageReceived);
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

function enemyCastIfMgk(hit=true){
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

  if (enemyMgk>enemyMgkLost) {
    enemyMgkLost++

    if (procAbilityChance("💠",33)){
      logAction("🪄 ▸ 💠 Enemy spell resisted by <b>💠 Reflect Magic</b>.");
      displayPlayerEffect("💠");
      return false;
    }

    if (hit) {
      logAction(enemyEmoji+" ▸ 🪄 Got hit by the enemy spell -1 💔");
      playerHit(1);
    }
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

function getRandomLoot(){
  isLooting=true;
  //toggleUIElement(versusTextUIElement,1); animateVersus();
  previousArea = areaName;
  adventureEncounterCount+=1;

  lastEncounterIndex = encounterIndex-1;
  lootEncounterIndex = getUnseenLootIndex();
  markAsSeenLoot(lootEncounterIndex);

  animateUIElement(cardUIElement,"animate__fadeIn","0.8");
  enemyRenew();
  return
}

function procAbilityChance(abilityEmoji="",abilityChance=100) { //Congrats me!!!
  var success = Math.floor(((Math.random() * 100))<=abilityChance)
  if (success && playerLootString.includes(abilityEmoji)) {

    if (abilityEmoji=="🥻"){
      var philosopherThoughts = ["area:"+areaName,"emoji:💭","name:Random Thought","type:Prop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","note:Epiphany","desc:n/a<br>","message:"]
      linesStory.splice(encounterIndex+1,0,philosopherThoughts);
      //console.log(philosopherThoughts)
      //console.log(linesStory);

      logPlayerAction(abilityEmoji,"Got stuck in a <b>💭 Random Thought</b>.")
      return true;
      }

    if (abilityEmoji=="💠"){
      return true;
      }

    if (abilityEmoji=="🎲"){
      return true;
    }

  }
}

function nextEncounter(animateArea=true){ //Note: Even generator encounters go through here :)
  //console.log("EnemyType: \n"+enemyType);
  procAbilityChance("🥻",5);

  if (!enemyType.includes("Generator")) markAsSeen(enemyName) //Hacky hacky hack
  previousEnemyType = enemyType;

  if (animateArea) {
    toggleUIElement(areaUIElement,1);
    animateUIElement(areaUIElement,"animate__flipInX","1");
  }

  encounterIndex = getNextEncounterIndex();

  playerRested=false;
  enemyRenew();
  loadEncounter(encounterIndex);

  //Fullscreen Curtain
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm")){ //Does not animate new area when killed
    curtainFadeInAndOut("<span style=-webkit-text-stroke: 6.5px black;paint-order: stroke fill;>&nbsp;"+areaName+"&nbsp;</span>");
  }
  animateUIElement(cardUIElement,"animate__fadeIn","1");
  previousArea = areaName;
}

function animateFlipNextEncounter(){
  animateUIElement(areaUIElement,"animate__flipOutX","1.2");
  animateUIElement(cardUIElement,"animate__flipOutY","1.2");

  var animationHandler = function(){
    nextEncounter();
    redraw();
    cardUIElement.removeEventListener("animationend",animationHandler);
  }
  cardUIElement.addEventListener('animationend',animationHandler);
}

function animateVersus(time = "1"){ //TODO: Remove this and all commented out calls?
  animateUIElement(versusTextUIElement,"animate__flipInX","1.2");
  //animateUIElement(versusTextUIElement,"animate__flash",time);
}

//Player
function playerRest(){
  if (!playerRested){
    if (((playerStaMax-playerSta)>0) || ((playerMgkMax-playerMgk)>0)){
      playerGetStamina(playerStaMax-playerSta,true);
      playerMgk=playerMgkMax;
      playerRested=true;

      logPlayerAction(actionString,"Rested well, recovering all resources.");
      displayPlayerEffect("💤");
    } else {
      playerRested=true;

      logPlayerAction(actionString,"Wasted a precious moment of life.");
      displayPlayerEffect("💤");
    }
  } else {
    logPlayerAction(actionString,"Already rested at this spot.");
    displayPlayerCannotEffect();
  }
}

function playerHeal(){
  if (playerHp<playerHpMax) {
    logPlayerAction(actionString,"Cast a healing spell +"+(playerHpMax-playerHp)+" ❤️‍🩹");
    playerHp=playerHpMax; //Lay on hands
    displayPlayerGainedEffect();
  } else {
    logPlayerAction(actionString,"Wasted a healing spell -1 🔵");
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
      logPlayerAction(actionString,"Rested and regained energy +" + stamina + " 🟢");
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
      playerHp+=bonusHp;
      displayPlayerEffect("❤️");
      displayPlayerGainedEffect();
    }
    playerHpMax += parseInt(bonusHp);
    if (playerHp>playerHpMax) playerHp = playerHpMax
    gainedString += changeSign+bonusHp + " "+hpEmoji;
  }

  if (logMessage) {
    logPlayerAction(actionIcon,gainedString);
  }
  if (moveForward) nextEncounter();
}

function playerConsumed(){
  var consumedString="Replenished resources"
  var sign = "";

  if (enemyMsg!="") consumedString=enemyMsg;

  if (enemyHp<0 || enemySta<0 || enemyAtk<0  || enemyLck<0  || enemyInt<0  || enemyMgk<0){
    if (enemyMsg=="") consumedString="That did not taste good";

    //Just sets up the consumed string
    if (enemyHp!=0) {
      if (enemyHp > 0) sign="+"
      consumedString+=" "+enemyHp+" 💔"
    }

    if (enemySta!=0){
      if (enemySta > 0) sign="+"
      consumedString+=" "+sign+enemySta+" 🟢"
      playerUseStamina(-1*enemySta);
    }

    playerChangeStats(0,enemyAtk,0,enemyLck,enemyInt,enemyMgk,consumedString,true,false,"🤮");
    //Actually danages here, to log potential lucky dmg avoidance at the right  time
    if (enemyHp<0){
      playerHit(-1*enemyHp);
    } else if (enemyHp>0) {
      playerHp+=enemyHp;
    }
    return;
  }

  var missingHp=playerHpMax-playerHp;
  var missingSta=playerStaMax-playerSta;

  if ((missingHp > 0) || (missingSta > 0)){

    if (missingHp > 0){
      playerHp += missingHp;
      consumedString += " +"+missingHp + " ❤️ ";
    }

    if (missingSta > 0){
      playerGetStamina(missingSta,true);
      consumedString += " +"+missingSta + " 🟢";
    }
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
  } else {
    playerSta+=1; //Gain bonus stamina
    consumedString="Got a temporary energy bonus +1 🟢";
    //consumedString="Actively digesting the food -1 🟢";
    //animateUIElement(toolbarCardUIElement,"animate__shakeX","0.5"); //Animate hitreact
    //playerUseStamina(1);
  }
  logPlayerAction(actionString,consumedString);
}

function playerHit(incomingDamage,applyLuck=true){
  var hitChance = Math.floor(Math.random() * luckInterval);

  if (applyLuck && ( hitChance <= playerLck )){
    logAction("🍀&nbsp;▸&nbsp;💢 <b>Luckily</b> avoided receiving the damage.");
    displayPlayerEffect("🍀");
    return;
  }

  playerHp = playerHp - incomingDamage;
  animateUIElement(playerInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  if (playerHp <= 0){
    playerHp=0; //Prevent redraw issues post-overkill

    var deathChance = Math.floor(Math.random() * luckInterval * 3); //Small chance to not die
    if (applyLuck && ( deathChance <= playerLck )){
      playerHp+=1;
      logAction("🍀&nbsp;▸&nbsp;💀 <b>Luckily</b> got a second chance to live.");
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

    gameOver();
    return;
  }
  displayPlayerEffect("💢");
}

function playerUseItem(item,messageSuccess = "Used "+item+" from the inventory.",messageFail = "Requires "+item+" to continue.",effect=true,silent=false){
  if (playerLootString.includes(item)){
    if (enemyMsg!="") messageSuccess=enemyMsg;
    if (effect) displayEnemyEffect(item);
    playerLootString=playerLootString.replace(item,"");
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
  logPlayerAction("👋","Reincarnated for a new adventure.<br>&nbsp;<br>&nbsp;");
  playerNumber++;
  displayEnemyEffect("❤️‍🩹");
  renewPlayer();
  encounterIndex=3; //Skip tutorial
  playerSta=playerStaMax; //Renew stamina (its empty initially)
  adventureEncounterCount = -1; //Death + tutorial
  nextEncounter();
}

//End Game
function gameOver(){
  //Reset progress to death encounter
  if ((enemyMsg=="")||(enemyType=="Undead")||(enemyType=="Trap")||(enemyType=="Trap-Roll")||(enemyType=="Trap-Attack")||(enemyType=="Consumable")) enemyMsg="Got killed, ending the adventure.";
  logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 "+enemyMsg);
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
  //alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!\nSpecial thanks: 0melapics on Freepik.com, https://animate.style and Stackoverflow.com");
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
function setButton(elementID,text){
  //document.getElementById(elementID).innerHTML=text.split(" ")[0]; //NO TEXT
  document.getElementById(elementID).innerHTML=text;
}

function resetEncounterButtons(){
  setButton('button_attack',"⚔️ Attack");
  setButton('button_block',"🔰 Block");
  setButton('button_roll',"🌀 Dodge");
  if ((enemyAtk<=0)&&(enemyMgk<=0)&&(enemyType!="Death"))  setButton('button_roll',"👣 Leave");
  setButton('button_cast',"💫 Cast");
  setButton('button_curse',"🪬 Curse");
  setButton('button_pray',"❤️‍🩹 Heal");
  setButton('button_grab',"👋 Grab");
  setButton('button_sleep',"💤 Rest");
  setButton('button_speak',"💬 Speak");
}

function adjustEncounterButtons(){
  resetEncounterButtons();
  switch (enemyType){
    case "Upgrade":
      setButton('button_attack',"❤️ Vitality");
      setButton('button_roll',"🟢 Agility");
      setButton('button_block',"📿 Faith");
      setButton('button_cast',"🔮 Sorcery");
      setButton('button_curse',"🩸 Hatred");
      setButton('button_pray',"🧠 Psyche");
      setButton('button_grab',"🍀 Fortune");
      setButton('button_speak',"🪙 Greed");
      setButton('button_sleep',"💀 Pain"); //TODO: Refactor below
      break;

    case "Consumable":
    case "Consumable-Container":
      setButton('button_roll',"❌ Ditch");

      document.getElementById('button_grab').innerHTML="🍴 Eat";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      break;

    case "Altar":
      document.getElementById('button_pray').innerHTML="🙏 Pray";
      if (playerLootString.includes("🔪")&&enemyHp<0) document.getElementById('button_pray').innerHTML="🩸 Offer";
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋ Touch";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      if (isLooting) setButton('button_roll',"❌ Ditch");
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      if (enemyEmoji=="🛶") setButton("button_walk","🛶 Sail");
      break;

    case "Curse":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      document.getElementById('button_roll').innerHTML="👣 Ignore";
      document.getElementById('button_pray').innerHTML="🧠 Endure";
      document.getElementById('button_sleep').innerHTML="😱 Faint";
      break;

    case "Item":
      document.getElementById('button_grab').innerHTML="👋 Grab";
      setButton('button_roll',"❌ Ditch");
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      break;

    case "Trap":
    case "Trap-Roll":
    case "Trap-Attack":
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      break;

    case "Dream":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_speak').innerHTML="💭 Dream";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      break;

    case "Fishing":
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_grab').innerHTML="🎣 Fish";
      break;

    case "Recruit":
        if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){ //If they are tired and you are smarter they join you
          document.getElementById('button_speak').innerHTML="💬 Recruit";
        }
        if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) {
          document.getElementById('button_grab').innerHTML="🦶 Kick";
        }
        document.getElementById('button_pray').innerHTML="❤️‍🩹 Heal";
        break;

    case "Pet":
      if ((enemyAtk+enemyAtkBonus)<=0) document.getElementById('button_block').innerHTML="🫶 Play";
      if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)) document.getElementById('button_grab').innerHTML="👋 Pet";
    case "Standard":
      document.getElementById('button_pray').innerHTML="❤️‍🩹 Heal";
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) { //Applies for all above without "break;"
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      break;

    case "Heavy":
    case "Swift":
    case "Boss":
      document.getElementById('button_pray').innerHTML="❤️‍🩹 Heal";
      if (enemySta-enemyStaLost==0) {
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      break;

    case "Spirit":
    case "Demon":
      document.getElementById('button_pray').innerHTML="🔥 Banish";
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) {
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      break;

    case "Undead":
      document.getElementById('button_pray').innerHTML="🔥 Banish";
      break;

    case "Death":
      document.getElementById('button_cast').innerHTML="🫶 Praise";
      document.getElementById('button_grab').innerHTML="✏️ Report";
      document.getElementById('button_speak').innerHTML="🦆 Tweet";
      document.getElementById('button_sleep').innerHTML="📜 Legend";
      break;

    case "Checkpoint":
      document.getElementById('button_grab').innerHTML="✨ Praise";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
    default:
      if (enemyType.includes("Container")){
        setButton('button_grab',"👀 Search");
        setButton('button_roll',"👣 Walk");
        setButton('button_sleep',"💤 Sleep");
        if (enemyType.includes("Locked")){
          document.getElementById('button_cast').innerHTML="🪄 Unlock";
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

  //console.log("platform interaction event type="+eventType); //This was for troubleshooting various platforms

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
    playerName=prompt("Name your character: ");
    if (playerName.length<=0 || playerName==null) playerName="Nameless Character";
    redraw();
  });
}

//Social features
function generateCharacterShareString(){
  var characterShareString="";
    characterShareString+="<b>"+playerName+"</b>";
    characterShareString+="\n❤️ "+fullSymbol.repeat(playerHpMax)+"  🟢 "+fullSymbol.repeat(playerStaMax)+"  ⚔️ " + fullSymbol.repeat(playerAtk);
    if (playerMgkMax>0) characterShareString+="  🔵 " + fullSymbol.repeat(playerMgkMax);
    if ((playerPartyString.length+playerLootString.length)>0) characterShareString+="\n";
    if (playerPartyString.length > 0) characterShareString += playerPartyString;
    if (playerLootString.length > 0) characterShareString += playerLootString;
    characterShareString += "\nAwoken: "+adventureStartTime;
    characterShareString += "\nKillcount: "+playerKills;
    characterShareString += "\n\nDeceased: "+adventureEndTime;
    characterShareString += adventureEndReason+" (#"+adventureEncounterCount+")";

  return characterShareString;
}

function generateCharacterLegend(logLength=0) {
  var characterLegend="";
  characterLegend = adventureLog.replaceAll("<br>","\n");
  var tempString = characterLegend.split("\n").slice(2);
  characterLegend = tempString.join("\n");
  characterLegend = characterLegend.replaceAll("&nbsp;"," ").substring(1);
  if (logLength>0) characterLegend = characterLegend.slice(-logLength);

  characterLegend=generateCharacterShareString()+"\n\n"+characterLegend;
  characterLegend += "\nhttps://igpenguin.github.io/webcrawler";
  characterLegend +=  "\n"+ versionCode;

  return characterLegend;
}

function copyAdventureToClipboard(){
  var adventureLogClipboard = generateCharacterLegend();
  displayPlayerEffect("📜");
  logPlayerAction(actionString,"Written the legend to hard drive.");

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

function redirectToFeedback(prefillLog=""){
  //var googleFormUrl="https://forms.gle/zekjajGcVztxwTdX9"
  var googleFormUrl="https://docs.google.com/forms/d/e/1FAIpQLSc46BJ-S_EBmXxZgzVYLCC8l2Wece0hWXJESiRMpuMlXTC3Cw/viewform?usp=pp_url&entry.1788435593="+encodeURIComponent(generateCharacterLegend(50).replaceAll("<b>","").replaceAll("</b>",""));
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
