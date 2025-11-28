//Having all this in a one file is truly shameful
//...submit a pull request if you dare

//Debug
var versionCode = "ver. 11/28/2025 @ 02:06 AM"
var initialEncounterOverride=0; //6 skips tutorial
if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "192.168.1.120" ) initialEncounterOverride=4;

//Colors & Symbols
var colorWhite = "#FFFFFF"; var colorGold = "#FFD940"; var colorDarkGold = "#4d4112"; var colorGreen = "#22BF22"; var colorDarkGreen = "#509920"; var colorLime="#91bf08"; var colorGrapefruit="#db432c"; var colorRed = "#FF0000"; var colorDarkRed = "#690000"; var colorGrey = "#CCCCCC"; var colorDarkGrey = "#888888"; var colorSemiDarkGrey = "#999999"; var colorOrange = "orange"; var colorDarkOrange = "#523501"; var colorYellow = "#F7D147"; var colorDarkYellow = "#d6b53c"; var colorBlue = "#1059AA"; var colorLightBlue = "#487bb5"; var colorDarkBlue = "#072a52"; var colorPurple = "#BF40BF"; var colorDarkPurple = "#381338"; var colorPink = "#c9594f"; var colorLightPink = "#e38aac"; var colorDarkPink = "#a1111a"; var colorShadeBlue = "#556f90"; var colorLightShadeBlue = "#7193bf"; var colorCardBackground = "#202020";
var fullSymbol = "<p style=\"color:"+colorGrey+";"+"font-size:18px;display:inline;\">●</p>"; var emptySymbol = "<p style=\"color:"+colorGrey+";"+"font-size:18px;display:inline;\">○</p>"; var enemyStatusString = ""; var newline="<br>"; var emptySpace="&nbsp"; narrowSpace="&#8239;"; var arrowSymbol="▸";

//Savedata
var savedCoins = parseInt(localStorage.getItem('coins'));
if (isNaN(savedCoins)) {
  localStorage.setItem('coins', 0);
  savedCoins=0;
}
var spentCoins = 0;
console.log("Drachmae: "+savedCoins);

//Stats
var adventureStartTime = getTime();
var adventureEndTime = "Unfinished";
var seenLoot;

//Player stats init
var playerName = getFirstName();
var playerNumber = 1; //Increments on revival
var playerKills = 0;
var playerLootString;
var playerPartyString;
var playerHpMax;
var playerStaMax;
var playerMgkMax;
var playerHp;
var playerSta;
var playerLck;
var luckInterval = 33; //Lower to increase chances
var playerInt;
var playerAtk;
var playerAtkBonus;
var playerDef;
var playerXP;
var playerLevel;
var playerXPThreshold;
var playerLove=0;
var playerKarma=1;
var playerRested = false;
var playerCooked = false;
var playerShopped = false;
var bubblesUsed = false;
var playerAttackType = "⚔️";
var playerRollType = "🌀";
var playerBlockType = "🔰";
var playerSleepType = "💤";
var playerSpeakType = "💬";
var playerCastType = "💫";
var playerHealType = "❤️‍🩹";
var playerCurseType = "🪬";

var drachmaCoin=["area:Wherever","emoji:🪙","name:Ethereal Drachma","type:Item","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Transient Currency","desc:Entangles with one's soul on touch.<br>","message:Claimed an <b>Ethereal Drachma +1 🪙</b>"]
var drachmaShop=["area:Wherever","emoji:👤","name:Riverwatch Shade","type:Shop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Undertaker","desc:Well met\ what's it gonna be this time?<br>","message:Set out on another adventure!"]
var usedShopMessages=[];

var attackTypes=(["🔪","🗡️","🔧","⛏️","🪚","🔨","🪓","🪛","🖋️","✂️","🪃","🪨","🌂","🦯","🥊","🪝","🦷"])
var validBlades=(["🔪","🗡️","🪛","🪚","🪓","✒️","🖋️","🖊️","🏹","🪝","🦷"])
var castTypes=(["⚡️","☄️","🍭","🔥"])
var validBaits=(["🪱","🦋","🐝","🐞","🦟","🦗","🐜","🪲","🪰","🪳","🕷","️🐌","🦐","🦂","🍤","🐙","🐛","🦑"])
var validRess=["🫀","💾","♥️","🫁","🏵️","🛟","📼","💿"];

renewPlayer();
function renewPlayer(){ //Default values
  playerName = getFirstName();
  playerHpMax=3;
  playerHp = playerHpMax;
  playerStaMax = 3;
  playerSta = playerStaMax;
  playerMgkMax = 0;
  playerAtk = 1;
  playerAtkBonus = 0;
  playerDef = 0;
  playerLck = 0;
  playerInt = 1;
  playerXP=0;
  playerLevel=1;
  playerXPThreshold=400;
  playerMgk = playerMgkMax;
  playerRested = false;
  playerCooked = false;
  playerShopped = false;
  playerLootString = "";
  playerPartyString = "";
  playerAttackType = "⚔️";
  playerRollType = "🌀";
  playerBlockType = "🔰";
  playerSleepType = "💤";
  playerSpeakType = "💬";
  playerCastType = "💫";
  playerHealType = "❤️‍🩹";
  playerCurseType = "🪬";

  playerKills = 0;
  playerKarma=1;
  playerLove=0;
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
var encounterUsed=false;
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

function renameCharacter(){
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
  return playerName;
}

//String generators
function getFirstName(){
  const random_firstnames = [
    "Tattered",
    "Hopeful",
    "Hopeless",
    "Lost",
    "Silent",
    "Faded",
    "Grieving",
    "Shadowed",
    "Tired",
    "Lone",
    "Forsaken",
    "Ashen",
    "Nameless",
    "Weary",
    "Shrouded",
    "Forgotten",
    "Mourning",
    "Veiled"];

  const random_lastnames = [
    "Explorer",
    "Seeker",
    "Wanderer",
    "Shade",
    "Pilgrim",
    "Drifter",
    "Stranger",
    "Prophet",
    "Redeemer",
    "Nomad",
    "Vagrant",
    "Drifter",
    "Outcast",
    "Stranger",
    "Vagabond"];
  return random_firstnames[Math.floor(Math.random() * random_firstnames.length)]+" "+random_lastnames[Math.floor(Math.random() * random_lastnames.length)];
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

  const random_names = ["Intelligent "+name,"Resolute "+name, "Thoughful "+name, "Clever "+name, "Ambitious "+name, "Curious "+name];
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

function getGameTip(){
  const random_quotes = ["<b>👀 Search</b> for loot in places of interest.","Always <b>💤 Sleep</b> when you get a chance.","<b>💨 Hasty</b> attacks can only be <b>🔰 Blocked</b>.","<b>🔺 Heavy</b> attacks can only be <b>🌀 Dodged</b>.","<b>🔻 Small</b> creatures can be <b>👋 Grabbed</b>.","<b>👋 Grab</b> exhausted enemies to <b>knock them out</b>.","<b>🧠 Intellect</b> helps befreinding companions.","<b>💫 Cast</b> spells always hit before retaliation.","<b>🍴 Eating</b> when relaxed provides a bonus.","Use <b>🔰 Block</b> or <b>🌀 Dodge</b> before <b>⚔️ Attack</b>.","<b>💤 Sleep</b> recovers <b>🟢 Energy</b> and <b>🔵 Mana</b>.","<b>🍀 Luck</b> rises the chance for a critical hit.","<b>👋 Grab</b> bait 🪱 to do some <b>🎣 Fishing</b>.","<b>✏️ Report</b> any issues to make a difference.","<b>💬 Speaking</b> can sometimes stop the fight.","<b>🍀 Luck</b> may help to  survive a fatal hit.", "Some <b>🔱 Altars</b> require 🔪  for a <b>Sacrifice<b>.","<b>🎣 Fishing </b> provides a variety of unique items.", "<b>✏️ Rename</b> your hero by clicking their name.","<b>🐞 Report</b> issues by clicking the version code.","Pick up 🗝️ <b>Keys</b> to unlock secrets later.","🪄 <b>Cast</b> a spell to open lock for -2 🔵 <b>Mana</b>.","🪬 <b>Curse</b> lowers the enemy damage by half.","Casting ❤️‍🩹 <b>Heal</b> restores up to <b>+2 ❤️ Health</b>.","<b>🟠 Legendary</b> items provide unique advantage.","🔥 <b>Heat</b> raw food to remove negative effects.","<b>🍀 Luck</b> affects your chances for getting loot.","Open <b>🗝️ Locked</b> objects by <b>🪄 Cast</b> for -2 🔵","<b>❤️‍🩹 Heal</b> uses up to all available <b>🔵 Mana</b>.","Non-deadly options always award more "+decorateStatusText("","XP",colorGold)+".","Gain "+decorateStatusText("","XP",colorGold)+" to <b>🎉 Level Up</b> and get stronger.","<b>🧠 Intellect</b> affects "+decorateStatusText("","XP",colorGold)+" gains both ways.","<b>💀 Killing</b> enemies affects <b>karma negatively</b>.","<b>Good karma</b> grants <b>🎁 Bonus</b> on <b>✨ Revival</b>.","You need to <b>💤 Sleep</b> to <b>🎉 Level Up</b>.","Pending <b>🎉 Level Up</b> is marked by <b>⇡</b> symbol.","No one likes to be called a <b>Cheater</b>."];
  return random_quotes[Math.floor(Math.random() * random_quotes.length)];
}

function getPoem(){
  const random_quotes = ["Please\\ be careful what you wish for\\ my love.<br>It might as well be exactly what you get.","Do not ever follow where I fell\\ my heart.<br>The ground has swallowed my beauty.","My vows outlived my breath\\ it seems.<br>They whisper still\\ beneath the soil.","The earth tried to keep me\\ but not anymore.<br>I rose with your name on my lips.","You whispered into the grave like a prayer.<br>And I came\\ half dream\\ half devotion.","I drank from the chalice of sorrow.<br>It tasted like you — and I awoke.","I stitched myself from bones and vows.<br>Just to stand where you once wept.","You said 'forever' with a mortal tongue.<br>I kept my promise — what's your excuse?","The mirror cracked when I passed.<br>It still shows me, just not the same way.","The bells no longer ring for weddings.<br>Not since you spoke my name.","The trees hum softly where I fell and rose.<br>No birds have sung there since.","I left a kiss upon the oak we carved.<br>The bark split down the middle.","Don't reach for the old book\\ my love.<br> Some secrets should remain hidden forever.","You’ll want to fix what was never broken.<br>But disturbing the peace won't help.","You did this to me... did this to us!<br>Why wouldn't you let me go?","The world could remain peaceful.<br>If only you would listen to me.",  "I still wear your name like a veil.<br>Even the worms dare not touch it.","You called me back with love.<br>But love does not know mercy.","I waited in the soil so long.<br>The stars forgot my name.","Every petal you left on my grave<br>grew thorns when you turned away.","Your healing hands became my undoing.<br>But I am not fully gone.","The endless cold welcomed me first.<br>Then I remembered your warmth.","You begged the ancient gods to give me back.<br>They laughed and released the darkness.","I came the way you asked.<br>Not fully whole — but yours.","Our vow didn't end with my death.<br>Only my breathing did.","They buried me with lovely roses.<br>But I bloomed with something else.","You desperately prayed for an act of god.<br>I became one you could not bear.","Even now\ I reach for you - nowhere to find you.<br>Only shadows take my hand.","The stars we used to watch together...\<br>They now turn their faces away.","Your twisted love outlived my breath.<br>Then cursed me forever.","You called me back with trembling hands.<br>Now tremble for what you've done.","I hoped you'd mourn me.<br>Not try to fix me.","You wanted me to never leave.<br>I'll soon fulfill your wish.","Love me as I am now.<br>Or rot beside me.", "You broke me with foul magic.<br>Now I return with justice.", "I died believing in your endless love.<br>Now I rise certain of your betrayal.","The wicked altar remembers what you forgot.<br>And so do I\ my love."];
  return "<i>"+random_quotes[Math.floor(Math.random() * random_quotes.length)]+"</i>";
}

function getShopMessage(){
  var random_quotes = ["Well met, what's it gonna be this time?","Oh, its you again... take your pick carefully.","Back so soon? I guess you need better gear.","You again? I guess you failed your quest then."].filter(item => !usedShopMessages.includes(item));
  if (playerShopped) random_quotes = ["Sure sure, I got plenty more in stock.","Seems like you have more to spend.","There's no discount for returning customers.","Not done yet? Still got plenty more."].filter(item => !usedShopMessages.includes(item));

  if (random_quotes.length==0) random_quotes.push("Ugh, hate to see you here all the time.")
  var message = random_quotes[Math.floor(Math.random() * random_quotes.length)]+"<br>";
  usedShopMessages+=message;

  return message
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
var enemyDef;
var enemyType;
var previousEnemyType;
var enemyContainerNumber = 0;
var enemyTeam;
var enemyDesc;
var enemyMsg;
var enemyQuestItems;

var enemyHpLost = 0;
var enemyStaLost = 0;
var enemyAtkBonus = 0;
var enemyIntBonus = 0;
var enemyMgkLost = 0;
var currentProphercy;
var enemyEmojiScaleX;
var enemyBossType = "";
var enemyCursed=false;

var totalBonus=0;
var totalMalus=0;

encounterRenew()
function encounterRenew(){
  playerRested=false;
  playerCooked=false;

  enemyStaLost = 0;
  enemyHpLost = 0;
  enemyAtkBonus = 0;
  enemyIntBonus = 0;
  enemyMgkLost = 0;
  enemyDef = 0;
  enemyBossType = "";
  enemyCursed=false;
  encounterUsed=false;
  bubblesUsed = false;
  currentProphercy = getGameTip();
  enemyEmojiScaleX = chooseFrom(['scaleX(-1)','scaleX(1)']);

  totalBonus=0;
  totalMalus=0;
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
    if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") curtainFadeInAndOut("<p style=\"color:"+colorRed+";-webkit-text-stroke: 6.5px black;paint-order: stroke fill;letter-spacing:1.8px;line-height:1px;font-size:74px;\">Stay Dead</p><p style=\"font-size:16px;line-height:18px;letter-spacing:1.2px\""+decorateStatusText("","<br>"+emptySpace.repeat(41)+"by IGPenguin",colorWhite),5);
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
  enemyName = enemyName.replaceAll("((",":");
  if (enemyName.includes("You are dead!")) enemyName="<text style=color:"+colorRed+";>"+enemyName+"</text>";
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  if (enemyType.includes("Boss")) {
    enemyBossType = enemyType; //I'll end up in hell for these hacks
    //enemyName="<text style=color:"+colorRed+";>"+enemyName+"</text>";
  }
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
  enemyDef = String(selectedLine.split(",")[10].split(":")[1]);
  enemyTeam = String(selectedLine.split(",")[11].split(":")[1]);
  enemyDesc = String(selectedLine.split(",")[12].split(":")[1]);
  if (enemyDesc.includes("po/em")) enemyDesc=getPoem();
  if (enemyTeam.includes("Prophe") || enemyTeam.includes("Knowledge") || enemyTeam.includes("Epiphany") || enemyTeam.includes("Note")) {
    enemyDesc=enemyDesc.replaceAll("n/a","");
    enemyDesc+="<i>"+getGameTip()+"</i>";
  }
  if (enemyType.includes("Friend")){
    enemyQuestItems=enemyType.replace("Friend","").split('\\');
    if (String(enemyQuestItems).length>0){
      var heldItem=checkPlayerHasItem(enemyQuestItems);
      if (heldItem==""){
        enemyDesc="If you see me again, <b>bring something good</b>.<br>How some of this? "+String(enemyQuestItems).replaceAll(",","");
      }
      enemyDesc=enemyDesc.replaceAll("n/a",heldItem);
      enemyDesc=enemyDesc.replaceAll("<br>","<br><b>Looks like this might do: "+heldItem)
    }

    enemyType="Friend";
  }
  enemyDesc = enemyDesc.replaceAll("\\",",");
  enemyDesc = enemyDesc.replaceAll("((",":");
  if (enemyTeam=="Undertaker") {
    enemyDesc=getShopMessage();
    enemyDesc=enemyDesc+"<i><b>Unspent Drachmae: "+parseInt(savedCoins-spentCoins)+"</i><b> 🪙";
  }
  if (enemyEmoji=="🪙") enemyDesc=enemyDesc+"<i><b>Total Drachmae: "+parseInt(savedCoins)+"</i><b> 🪙";


  enemyMsg = String(selectedLine.split(",")[13].split(":")[1]).replaceAll("\\",",");

  switch (enemyType){
    case "Small":
    case "Standard":
    case "Swift":
    case "Heavy":
    case "Recruit":
    case "Pet":
    case "Spirit":
    case "Demon":
    case "Undead":
    case "Small":
    case "Stingy":
    case "Toxic":
      if ((enemyAtk+enemyAtkBonus>0)||enemyMgk>0) {
        logAction("💢 ▸ "+enemyEmoji+" Engaged an enemy: <b>"+enemyName+"</b>")
      } else {
        logAction("👁️ ▸ "+enemyEmoji+" Spotted a critter: <b>"+enemyName+"</b>")
      }
      break;
    case "Item":
      if (enemyTeam.includes("Artifact")){
        logAction("🟠 ▸ "+enemyEmoji+"<text style=color:"+colorOrange+";>" + " Unveiled artifact: <b>"+enemyName+"</b></text>")
      } else {
        if (enemyTeam.includes("Possesion")) {
          logAction("⭐️ ▸ "+enemyEmoji+" Found a possesion: <b>"+enemyName+"</b>")
        } else {
         if (!enemyTeam.includes("Lover's Memento")) {
           if (enemyEmoji=="🪙"){
             logAction("🌀 ▸ "+enemyEmoji+"<text style=color:"+colorLightShadeBlue+";>" + " Shape spawned: <b>"+enemyName+"</b></text>")
           } else {
             logAction("🎉 ▸ "+enemyEmoji+" Found some loot: <b>"+enemyName+"</b>")
           }
         } else {
          logAction("🫀 ▸ "+enemyEmoji+" Found a clue: <b>"+enemyName+"</b>")
         }
        }
      }
      break;
    case "Consumable":
      if (enemyTeam.includes("Artifact")){
        logAction("🟠 ▸ "+enemyEmoji+"<text style=color:"+colorOrange+";>" +" Unveiled artifact: <b>"+enemyName+"</b></text>")
      } else {
        logAction("👁️ ▸ "+enemyEmoji+" Found a snack: <b>"+enemyName+"</b>")
      }
      break;
    case "Curse":
    case "Trap":
    case "Trap-Attack":
    case "Trap-Roll":
    case "Trap-Sleep":
      if (totalBonus>0 && totalMalus<=0) logAction("🎀 ▸ "+enemyEmoji+" Noticed a curiosity: <b>"+enemyName+"</b>")
      if (totalMalus<0) logAction("⁉️ ▸ "+enemyEmoji+" Noticed a hazard: <b>"+enemyName+"</b>")
      break;
    case "Container":
      if (enemyHp<0 || enemyAtk<0 || enemySta<0 || enemyLck<0 || enemyInt<0 || enemyMgk<0) logAction("⁉️ ▸ "+enemyEmoji+" Noticed hazard: <b>"+enemyName+"</b>")
      break;
    case "Altar":
      logAction("👁️ ▸ "+enemyEmoji+" Noticed a curiosity: <b>"+enemyName+"</b>")
      break;
    case "Friend":
      if (!enemyName.includes("Bride")) logAction("👁️ ▸ "+enemyEmoji+" Met a creature: <b>"+enemyName+"</b>")
      break;
    case "Shop": //I just did HAAAACKKKK, and it feelt sooo WRONG (really, needs fixing... later)
      if (!adventureLog.includes("Silhouette appeared:")) logAction("🌀 ▸ "+enemyEmoji+"<text style=color:"+colorLightShadeBlue+";>" + " Silhouette appeared: <b>"+enemyName+"</b></text>")
      break;
    default:
      if (enemyType.includes("Boss") && !adventureLog.includes("Bride")) logAction("💢 ▸ "+enemyEmoji+" <text style=color:"+colorRed+";>"+"Engaged a boss: <b>"+enemyName+"</b></text>")
      break;
  }

  //Specific encounter starts
  if (enemyType=="Dream" && (!enemyName.includes("Waking Moment")) && (!enemyName.includes("Terrific Realization")) && (!enemyName.includes("Horrific Realization"))) playerSta=0;

  //Decrase final bass attack/mana based on player love
  if (enemyName.includes("Bride") && playerLove>2) {
    console.log("playerlove: "+playerLove);

    //Meh, I just wanna consider this game finished now
    enemyMgk-=playerLove;
    if (enemyMgk<0) enemyMgk=0;

    if (enemyAtk<=playerLove) {
      if (enemyAtk>0) {
        logAction("♥️ ▸ "+enemyEmoji+" <text style=color:"+colorGold+";>Your true love has calmed her down.</text>")
        enemyAtkBonus=-enemyAtk
        enemyName="Merciful Bride"
        enemyMsg="There's still hope for this to end well."
        enemyInt=0;
        enemyType="Boss-Standard"
      }
      if (enemyName.includes("Defeated Bride")) {
        encounterIndex++; //Skip second phase
        enemyMsg="I'm glad that you didn't forget me."
      }
    } else if (playerLove>0){
      enemyAtkBonus-=playerLove;
      logAction("♥️ ▸ "+enemyEmoji+" She is showing some signs of mercy -"+playerLove+" ⚔️")
    }
  }
}

function generateRandomItem(item=""){
  var randomItem=getRandomEncounter(["Item"],[],"ALL",["Artifact","Lover's Memento","Lost Possesion"]); //arg #2 empty = no required text; arg #4 excludes specific texts
  if (item=="Artifact")   var randomItem=getRandomEncounter(["Item"],["Artifact"],"ALL",["Lover's Memento","Lost Possesion"]); //arg #2 = artifact only, arg #4 excludes specific texts
  if (item=="Food")   var randomItem=getRandomEncounter(["Consumable"],[],"ALL"); //arg #2 = artifact only, arg #4 excludes specific texts
  return randomItem;
}

function drachmaeBuy(price=1,item=""){
  var availableCoins = savedCoins-spentCoins;
  if (availableCoins>=price) {
    playerShopped=true;
    spentCoins+=price;
    displayEnemyEffect("🪙");
    displayPlayerGainedEffect();

    if (item!="Level") {
    logPlayerAction(actionString,"Ya ya ya, bought MUCH GOOD!");
    drachmaShop[0]="area:"+areaName
    pushEncounter(drachmaShop);
    var item=generateRandomItem(item).split(",");
    item[0]="area:"+areaName;
    item=String(item);
    pushEncounter(item);
    } else {
      logPlayerAction(actionString,"Sure, grow stronger as you need!");
      playerXP+=playerXPThreshold;
      playerRest(true);
      return;
    }
    nextEncounter();
    return;
  } else {
    logAction("👤 ▸ ⁉️ "+"<text style=color:"+colorRed+";>YOU ARE VERY MUCH BROKE!</text>")
    displayEnemyDodgeEffect();
    displayPlayerCannotEffect();
    return;
  }
}

function generateNextEncounters(generatorID=0, logCall=true){
  switch (generatorID) {

    case 0: //Prop/Small/Lockbox
      if (logCall) logGenerator("prop/small");
      var type="Prop"
      if (procAbilityChance("",25+playerLck)) type="Small"; //25% Small

      if (procAbilityChance("",5-playerLck)) { //5% Trap chance, lowers with luck
        pushEncounter(getRandomEncounter(["Trap","Trap-Attack","Trap-Roll","Trap-Sleep"]));
      } else {
        pushEncounter(getRandomEncounter(["Prop"]));
      }

      if (type=="Small") {
        pushEncounter(getRandomEncounter(["Small"]));
        pushEncounter(getRandomEncounter(["Container"]));
      }

      if (!areaName.includes("Meadow") && (procAbilityChance("",3+playerLck))){ //3% chance for a locked container with artifact
        pushEncounter(getRandomEncounter(["Item"],["Artifact"]));
        pushEncounter(getRandomEncounter(["Locked-Container"]));
      }
      break;

    case 1://Random story letter
      var randomSlot=chooseFrom([3,4,5])
      pushEncounter(getRandomEncounter(["Item"],["Memento"]),randomSlot);
      if (chooseFrom([true,false])) pushEncounter(getRandomEncounter(["Container"]),randomSlot);
      console.log("pushing letter at pos: "+randomSlot);
      break;

    case 2: //Easy Encounter
      if (logCall) logGenerator("easy/pet");
      var encounterPool=["Standard","Stingy"]
      //generateNextEncounters(0,false); //Prop or Contained Small
      if (procAbilityChance("",5+playerLck)) encounterPool = ["Pet"]; //5% pet
      pushEncounter(getRandomEncounter(encounterPool));
      break;

    case 3: //Mid Encounter
      if (logCall) logGenerator("mid");
      var encounterPool=["Standard","Stingy","Toxic","Hot","Reflective"]
      if (procAbilityChance("",50+playerLck)) generateNextEncounters(0,false); //50% Prop or Contained Small
      if (procAbilityChance("",10+playerLck)) encounterPool = ["Recruit","Pet"]; // 10% recruit/pet
      if (procAbilityChance("",3+playerLck)) pushEncounter(getRandomEncounter(["Item"])) //3% item
      if (procAbilityChance("",10+playerLck)) pushEncounter(getRandomEncounter(["Consumable"])); //10% consumable
      pushEncounter(getRandomEncounter(encounterPool));
      break;

    case 4: //Hard Encounter
      if (logCall) logGenerator("hard");
      if (procAbilityChance("",70+playerLck)) generateNextEncounters(0,false); //70% Prop or Contained Small
      if (procAbilityChance("",5+playerLck)) pushEncounter(getRandomEncounter(["Item"])) //5% item
      if (procAbilityChance("",30+playerLck)) pushEncounter(getRandomEncounter(["Consumable"])); //30% consumable
      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Reflective","Demon","Spirit"]));
      break;

    case 9: //Boss
      if (logCall) logGenerator("boss");

      //Prop or Contained Small after fight (not in Necropolis)
      if (!areaName.includes("Shrouded")) generateNextEncounters(0,false);

      if (areaName.includes("Shrouded")) {
        //No item
      } else {
        if (procAbilityChance("",33+playerLck)) { //33% Artifact
          pushEncounter(getRandomEncounter(["Item"],["Artifact"]));
        } else {
          pushEncounter(getRandomEncounter(["Item"]))
        }
      }
      pushEncounter(drachmaCoin);
      pushEncounter(getRandomEncounter(["Boss-Standard","Boss-Swift","Boss-Demon","Boss-Heavy","Boss-Spirit","Boss-Undead","Boss-Toxic","Boss-Tough","Boss-Hot","Boss-Stingy","Boss-Reflective","Boss-Pet"]));
      break;

    case 11: //Any Enemy
      if (logCall) logGenerator("any");
      if (procAbilityChance("",50+playerLck)) generateNextEncounters(0,false); //50% Prop or Contained Small
      if (procAbilityChance("",5+playerLck)) pushEncounter(getRandomEncounter(["Item"])) //5% item
      if (procAbilityChance("",20+playerLck)) pushEncounter(getRandomEncounter(["Consumable"])); //20% consumable
      pushEncounter(getRandomEncounter(["Small","Standard","Stingy","Toxic","Hot","Recruit","Pet","Swift","Heavy","Tough","Demon","Spirit"]));
      break;

    case 20: //House Small
      if (logCall) logGenerator("h-small");
      if (procAbilityChance("",10+playerLck)) { //10% item
        pushEncounter(getRandomEncounter(["Item"]))
      } else if (procAbilityChance("",20+playerLck)) { //20% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
      } else {
        generateNextEncounters(0,false); //Prop or Contained Small
      }
      pushEncounter(getRandomEncounter(["Standard","Recruit","Stingy","Toxic","Hot","Tough"]));
      pushEncounter(getRandomEncounter(["Container-2"]));
      break;

    case 30: //House Mid
      if (logCall) logGenerator("h-mid");
      if (procAbilityChance("",15+playerLck)) { //15% item
        pushEncounter(getRandomEncounter(["Item"]))
      } else if (procAbilityChance("",25+playerLck)) { //25% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
      } else {
        generateNextEncounters(0,false); //Prop or Contained Small
      }

      var possibleEncounters=["Friend","Recruit","Standard","Stingy","Toxic","Hot","Tough","Swift","Heavy","Demon","Spirit","Curse","Trap","Trap-Attack","Trap-Roll","Trap-Sleep","Altar"];
      var firstEncounter=[getRandomEncounter(possibleEncounters)];
      pushEncounter(firstEncounter);

      var filterType=firstEncounter[0].split("type:")[1].split(",")[0];
      possibleEncounters = possibleEncounters.filter(string => string !== filterType); // Prevents duplicate encounter types twice in a row

      pushEncounter(getRandomEncounter(possibleEncounters)); // Push second encounter which is guaranteed different type
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 31: //House Locked
      if (logCall) logGenerator("h-lock");
      var type=chooseFrom(["Item","Pet","Friend"]);
      if (type=="Item") {
        pushEncounter(getRandomEncounter([type],["Artifact"]));
      } else {
        pushEncounter(getRandomEncounter([type,"Checkpoint"]));
      }
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Attack","Trap-Roll","Trap-Sleep"]));
      pushEncounter(getRandomEncounter(["Small","Standard","Stingy","Toxic","Hot","Recruit","Pet","Swift","Heavy","Tough","Demon","Spirit"]));
      pushEncounter(getRandomEncounter(["Locked-Container-3"]));
      break;

    case 40: //House Hard
      if (logCall) logGenerator("h-hard");
      if (procAbilityChance("",20+playerLck)) { //20% item, 100% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Item"]))
      } else {
        pushEncounter(getRandomEncounter(["Altar"])); //80% altar, 100% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Demon","Spirit","Curse","Trap","Trap-Attack","Trap-Roll","Trap-Sleep"]));
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 50: //House Big
      if (logCall) logGenerator("h-big");
      if (procAbilityChance("",30+playerLck)) { //30% item, 100% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Item"]))
      } else {
        pushEncounter(getRandomEncounter(["Altar"])); //70% altar, 100% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Demon","Spirit"]));
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Attack","Trap-Roll","Trap-Sleep"]));
      pushEncounter(getRandomEncounter(["Container-4"]));
      break;

    case 60: //House Huge
      if (logCall) logGenerator("h-huge");
      if (procAbilityChance("",40+playerLck)) { //40% item/friend/checkpoint, 100% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Friend","Item","Checkpoint"]))
      } else {
        pushEncounter(getRandomEncounter(["Altar"])); //60% altar, 100% consumable
        pushEncounter(getRandomEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Demon","Spirit"]));
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Attack","Trap-Roll","Trap-Sleep"]));
      pushEncounter(getRandomEncounter(["Small","Standard","Stingy","Toxic","Hot","Recruit","Pet"]));
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
  var lvlSymbol= ""
  if (playerXP>=playerXPThreshold) lvlSymbol="⇡ "
  playerLevelUIELement.innerHTML = decorateStatusText("","Level "+playerLevel+lvlSymbol,colorGold);

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
    document.getElementById('id_player_party_loot').innerHTML += "<b>Loot:</b> "+playerLootString;
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
  enemyDescUIElement.innerHTML+="<br><center><i style=\"color:"+colorGrey+";"+"font-size:13px;\">"+"» "+enemyTeam+" «"+"</i></center>"; //enemyTeamUIElement.innerHTML=enemyTeam;

  //Encounter Statusbar UI
  var effectArray = [enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef];
  var effectArrayBonus=effectArray.filter(function(x){ return x > 0 });
  var effectArrayMalus=effectArray.filter(function(x){ return x < 0 });
  totalBonus=effectArrayBonus.reduce((partialSum, a) => partialSum + a, "");
  totalMalus=effectArrayMalus.reduce((partialSum, a) => partialSum + a, "");
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
      enemyTeamUIElement.innerHTML=decorateStatusText("💨","Swift",colorGreen);
      enemyStatusString=appendEnemyStats();
      break;
    case "Heavy":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔺","Strong",colorRed);
      enemyStatusString=appendEnemyStats();
      break;
    case "Spirit":
      enemyTeamUIElement.innerHTML=decorateStatusText("🎐","Spectral",colorWhite);
      enemyStatusString=appendEnemyStats();
      break;
    case "Friend":
      enemyStatusString=decorateStatusText("💚","Friend",colorDarkGreen);
      if (totalMalus<0) enemyStatusString=decorateStatusText("💔","Adversary",colorRed);
      if (areaName.includes("Shrouded")) {
        enemyStatusString=decorateStatusText("⁉️","Stranger",colorRed);
        cardUIElement.style.background=colorDarkRed;
      }

      //Do not display stats = reward hidden
      break;
    case "Small":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔻","Small",colorWhite);
      enemyStatusString=appendEnemyStats();
      break;
    case "Recruit":
    case "Standard":
      enemyTeamUIElement.innerHTML=decorateStatusText("▫️","Standard",colorWhite);
      if (areaName.includes("Depths of Slumber"))enemyTeamUIElement.innerHTML=decorateStatusText("👺","Demon",colorRed); //Tutorial hack
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
    case "Stingy":
      enemyTeamUIElement.innerHTML=decorateStatusText("📌","Stingy",colorGrapefruit);
      enemyStatusString=appendEnemyStats();
      break;
    case "Toxic":
      enemyTeamUIElement.innerHTML=decorateStatusText("🦠","Toxic",colorLime);
      enemyStatusString=appendEnemyStats();
      break;
    case "Tough":
      var enemyDefString = "";
      if (enemyDef>1) enemyDefString = romanNumber(enemyDef);
      enemyTeamUIElement.innerHTML=decorateStatusText("🐚","Tough "+enemyDefString,colorSemiDarkGrey);
      enemyStatusString=appendEnemyStats();
      break;
    case "Hot":
      enemyTeamUIElement.innerHTML=decorateStatusText("♨️","Blazing",colorGrapefruit);
      enemyStatusString=appendEnemyStats();
      break;
    case "Reflective":
      enemyTeamUIElement.innerHTML=decorateStatusText("🔹","Reflective",colorLightBlue);
      enemyStatusString=appendEnemyStats();
      break;

    case "Shop": //Undertaker, Fatebound, Pactbound
      enemyStatusString=decorateStatusText("⚖️","Fatekeeper",colorLightShadeBlue);
      cardUIElement.style.background=colorShadeBlue;
      break;

    case "Item":
      if ((totalBonus > 0) || (enemyEmoji=="🗝️") || (enemyEmoji=="🔑")){
        enemyStatusString=decorateStatusText("⚜️","Valuable",colorGold);
        if (enemyMgk>0 || (parseInt(totalBonus)+parseInt(totalMalus))>=1 || (parseInt(totalMalus)>=0 && parseInt(totalBonus>0))){
          enemyStatusString=decorateStatusText("🔷","Magnificent",colorLightBlue);
          cardUIElement.style.background=colorDarkBlue;
        }
        if ((parseInt(totalBonus)+parseInt(totalMalus))>=2 || enemyHp>=2 || enemyAtk>=2 || enemySta>=2 || enemyMgk>=1){
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
      if (enemyTeam.includes("Lover's Memento")) {
        enemyStatusString=decorateStatusText("💔","Remembrance",colorPink);
        cardUIElement.style.background=colorDarkPink;
      }
      if (enemyEmoji=="🪙"){
        enemyStatusString=decorateStatusText("🧬","Everlasting",colorLightShadeBlue);
        cardUIElement.style.background=colorShadeBlue;
      }
      if (enemyTeam.includes("Possesion")) enemyStatusString=decorateStatusText("⭐️","Quest Item",colorYellow);
      break;

    case "Consumable":
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
      if (enemyTeam.includes("Artifact") || enemyTeam.includes("Essence")){
        enemyStatusString=decorateStatusText("🟠","Legendary",colorOrange);
        cardUIElement.style.background=colorDarkOrange;
        eatColor=colorOrange;
      }
      break;

    case "Trap":
    case "Trap-Attack":
    case "Trap-Roll":
    case "Trap-Sleep":
      enemyStatusString=decorateStatusText("⚫️","Obstacle",colorSemiDarkGrey);
      if (totalBonus>0) enemyStatusString=decorateStatusText("🎀","Curiosity",colorLightPink);
      if (totalMalus<0) enemyStatusString=decorateStatusText("🚩","Hazardous",colorRed);
      break;
    case "Dream":
      enemyStatusString=decorateStatusText("💭","Guidance","#FFFFFF");
      if (areaName.includes("Shrouded")) enemyStatusString=decorateStatusText("⁉️","Unsettling Anxiety",colorRed);

      break;
    case "Upgrade":
      enemyStatusString=decorateStatusText("⭐️","Advancement",colorGold);
      cardUIElement.style.background=colorDarkGold;
      break;
    case "Prop":
      enemyStatusString=decorateStatusText("⚪️","Unremarkable",colorWhite);
      if (enemyName.includes("Bride")) enemyStatusString=decorateStatusText("💔","Stranger",colorRed);
      break;
    case "Altar":
      if (totalBonus>0) enemyStatusString=decorateStatusText("🌙","Place of Worship",colorGold);
      if (totalMalus<0) enemyStatusString=decorateStatusText("♦️","Sacrificial Altar",colorRed);
      break;
    case "Fishing":
      enemyStatusString=decorateStatusText("🪝","Fishing Spot",colorGold);
      cardUIElement.style.background=colorDarkBlue;
      //emojiWrapperUIElement.style.background=colorDarkBlue;
      break;
    case "Curse":
      if (parseInt(totalMalus)<0)enemyStatusString=decorateStatusText("♣️","Mystery",colorDarkGrey);
      enemyStatusString=decorateStatusText("🔆","Condition",colorYellow);
      break;
    case "Death":
      enemyStatusString=decorateStatusText("🦴","Deceased","lightgrey");
      if (areaName.includes("Ⱥᵾӿīłīⱥɍɏ")) enemyStatusString=decorateStatusText("🎉","Ⱥȼħīēꝟēᵯēꞥⱦ",colorYellow);
      break;
    case "Checkpoint":
      enemyStatusString=decorateStatusText("🌙","Source of Power",colorGold);
      cardUIElement.style.background=colorDarkOrange;
      break;

    default:
      enemyStatusString=decorateStatusText("⚠️","No Details","red");
      //Multi-match
      if (enemyType.includes("Container")) enemyStatusString=decorateStatusText("🟡","Interesting",colorYellow);
      if (enemyType.includes("Container")&&(parseInt(totalMalus)<0)) enemyStatusString=decorateStatusText("🚩","Hazardous",colorRed);

      if (enemyType.includes("Locked")) enemyStatusString=decorateStatusText("🗝️","Locked",colorGrey);

      if (enemyBossType.includes("Boss")){
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
      if (areaName.includes("Shrouded")) displayPlayerState("Frightened",colorDarkGrey,"0.4");
      break;

    case "Curse":
    case "Trap":
    case "Trap-Roll":
    case "Trap-Attack":
    case "Trap-Sleep":
      displayPlayerState("Suspicious",colorOrange,"1")
      break;

    case "Shop":
      displayPlayerState("Deciding",colorDarkYellow,"2.5")
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
        if ((enemyType==="Fishing" && checkPlayerHasItem(validBaits)!="")) displayPlayerState("Bait Ready",colorPink,"0.8");
        if (enemyStatusString.includes("Legendary") || enemyEmoji=="🪙") displayPlayerState("Excited",colorDarkYellow,"0.4");
      }
      if (enemyType=="Upgrade") displayPlayerState("Excited",colorGold,"0.5"); //I need this to be overwritable by the below
      if (enemyTeam.includes("Imaginary") || enemyTeam.includes("Turning Point")) displayPlayerState("Sleeping",colorBlue,"2.5"); //Shitty, I know, its the tutorial
      if (enemyTeam.includes("Lover's Memento")&&!encounterUsed) displayPlayerState("Frightened",colorDarkGrey,"0.4");
      if (enemyTeam.includes("Lover's Memento")&&encounterUsed) displayPlayerState("Reminiscing",colorPink,"2.5");
      if (enemyHp>0 && ((enemyAtk+enemyAtkBonus)>0 || enemyMgk>0)) {
        displayPlayerState("In Combat",colorRed,"0.8");
        setButton('button_sleep',"💤 Rest"); //Hack
      }
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
  if (enemyHp > 0) { enemyStats += "❤️ " + fullSymbol.repeat(enemyHp-enemyHpLost);}
    if (enemyHpLost > 0) { enemyStats += emptySymbol.repeat(enemyHpLost); } //YOLO

  if (enemySta > 0) { enemyStats += "&nbsp;&nbsp;🟢 " + fullSymbol.repeat(enemySta-enemyStaLost);}
    if (enemyStaLost > 0) { enemyStats += emptySymbol.repeat(enemyStaLost); } //YOLO

  //if (enemyDef > 0) { enemyStats += "&nbsp;&nbsp;🔰 " + fullSymbol.repeat(enemyDef);} //Hmm... maybe not?
    //if (enemyDefLost > 0) { enemyStats += emptySymbol.repeat(enemyDefLost); }

  if (enemyMgk > 0) {enemyStats += "&nbsp;&nbsp;🔵 " + fullSymbol.repeat(enemyMgk-enemyMgkLost);}
    if (enemyMgkLost > 0) { enemyStats += emptySymbol.repeat(enemyMgkLost); } //YOLO

  if ((enemyAtk+enemyAtkBonus)>0 || enemyAtk!=0) {
    if (enemyHp>0) enemyStats += "&nbsp;&nbsp;"
    enemyStats += "⚔️ " + fullSymbol.repeat(enemyAtk+enemyAtkBonus);
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

        if (enemyType=="Dream") {
          displayPlayerCannotEffect();
          logPlayerAction(actionString,"Cannot attack while asleep.");
          break;
        }

        if (enemyType=="Shop") {
          drachmaeBuy(1,"Food");
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
          case "Trap-Sleep":
            logPlayerAction(actionString,"Your attack had no effect -1 🟢");
            displayEnemyEffect("〽️");
            displayEnemyCannotEffect();
            break;
          case "Trap-Roll":
            logPlayerAction(actionString,"Smashed it into tiny bits -1 🟢");
            displayEnemyEffect("〽️");
            displayEnemyCannotEffect();
            isFishing=false;
            nextEncounter();
            break;

          case "Trap-Attack": //Attacking causes you damage
            displayEnemyEffect("〽️");
            displayEnemyCannotEffect();

            if (encounterUsed){
                logPlayerAction(actionString,"Seems like that was it for now.")
                break;
              }
            if (totalBonus>0) {
              encounterUsed=true;
            }

            if (enemyHp<=0) playerHpMax-=enemyHp; //Don't lose max hp
            if (enemySta<=0) playerStaMax-=enemySta; //Don't lose max sta
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg,true,false);
            break;

          case "Spirit":
            displayEnemyEffect("💨");
            displayEnemyCannotEffect();
            if ((enemySta+enemyStaLost)==0){
              atckmsg="Seems to be impossible to hit.";
            } else {
              atckmsg="Impossible to hit, they retaliated -"+enemyAtk+" 💔";
            }
            if (enemyCastIfMgk(true)) enemyAttacked=true;
            if (!enemyAttacked) enemyAttackOrRest(atckmsg);
            break;

          case "Friend":
            enemyTurnAggressive("Your attack turned them adversary!");
            enemyHit(playerAtk);
            break;

          case "Undead": //You hit first, they hit back if they have stamina
            if (playerLootString.includes("📿")) {
              playerAtkBonus=2;
              logAction("📿 ▸ ⚔️ Your attack was blessed with +2 ⚔️")
            }
          case "Standard":
          case "Demon":
          case "Heavy":
          case "Recruit":
          case "Pet":
          case "Boss":
          case "Small":
          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Tough":
          case "Reflective":
            if (enemyCastIfMgk(true)) enemyAttacked=true;

            //if (enemyType=="Tough") enemyDef=1; //Hehe, should Tough have something špeci?
            enemyHit(playerAtk+playerAtkBonus-enemyDef);

            if ((parseInt(enemyHp)-parseInt(enemyHpLost) > 0) && !enemyAttacked) { //If they survive, they counterattack or regain stamina
              enemyAttackOrRest();
            }
            break;

          case "Swift": //They hit you first if they have stamina
            if (enemyCastIfMgk(true)) enemyAttacked=true;

            if ((parseInt(enemySta)-parseInt(enemyStaLost) > 0) && !enemyAttacked) {
              displayEnemyEffect("🌀");
              if ((enemyAtk+enemyAtkBonus)>0){
                enemyStaminaChangeMessage(-1,"They dodged that and retaliated -"+(enemyAtk+enemyAtkBonus)+" 💔","n/a");
                playerHit(enemyAtk+enemyAtkBonus);
              } else {
                enemyStaminaChangeMessage(-1,"They barely dodged your attack.","They needed to catch a breath.");
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
            if (enemyType.includes("Container")){
              var openMessage = "Smashed it wide open -1 🟢";

              enemyHp-=playerAtk;
              displayEnemyEffect("〽️");
              displayEnemyCannotEffect();

              if (enemyType.includes("Locked")&&(enemyHp>(-3))){
                openMessage = "Smashed it, but it still holds -1 🟢";
                logPlayerAction(actionString,openMessage);
              } else {
                logPlayerAction(actionString,openMessage);
                nextEncounter();
              }
              break;
            }
            logPlayerAction(actionString,"Your attack had no effect -1 🟢");
            displayEnemyEffect("〽️");
      }
      break;

      case 'button_roll': //Stamina not needed for non-enemies + dodge handling per enemy type
        if (enemyType=="Death"){
          playerReincarnate();
          break;
        }

        const noStaForRollMessage = "Too tired to make any move.";
        var rollMessage;

        switch (enemyType){ //Dodge attack or walk if they are harmless
          case "Curse":
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg);
            break;

          case "Standard":
          case "Undead":
          case "Recruit":
          case "Pet":
          case "Demon":
          case "Spirit":
          case "Boss":
          case "Small":
          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Tough":
          case "Reflective":
            if (((enemyAtk+enemyAtkBonus)<=0) && ((enemyMgk-enemyMgkLost)<=0)){
              if (enemyAtkBonus<0){
                playerGainXP(1.5,0,"They let you walk away");
              } else {
                logPlayerAction(actionString,"Walked away leaving them behind.");
              }
              animateFlipNextEncounter();
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

              if ((enemyAtk+enemyAtkBonus)!=0){
                rollMessage="Successfully dodged their attack -1 🟢";
              } else {
                rollMessage="They do not mean any harm -1 🟢";
              }

              enemyStaminaChangeMessage(-1,rollMessage,"Your roll was a waste of energy -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;

          case "Swift":
            if (((enemyAtk+enemyAtkBonus)<=0) && ((enemyMgk-enemyMgkLost)<=0)){
              if (enemyAtkBonus<0){
                playerGainXP(1.5,0,"They let you walk away");
              } else {
                logPlayerAction(actionString,"Walked away leaving them behind.");
              }
              nextEncounter();
              isFishing=false;
              break;
            }

            if (enemyCastIfMgk(false) && playerUseStamina(1,noStaForRollMessage)){
              logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
              break;
            }

            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"Failed to dodge their attack -"+enemyAtk+" 💔","Rolled into a surprise attack -"+enemyAtk+" 💔");
              playerHit(enemyAtk);
            }
            break;

          case "Heavy":
            if (((enemyAtk+enemyAtkBonus)<=0) && ((enemyMgk-enemyMgkLost)<=0)){
              if (enemyAtkBonus<0){
                playerGainXP(1.5,0,"They let you walk away");
              } else {
                logPlayerAction(actionString,"Walked away leaving them behind.");
              }
              animateFlipNextEncounter();
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
              if (enemyTeam.includes("Lover's Memento")){
                playerAtk++;
                playerLove-=2;
                playerKarma-=2;
                logPlayerAction(actionString,"<text style=color:"+colorRed+";>You tossed it aside with hatred! +1 ⚔️</text>");
                displayPlayerCannotEffect();
                nextEncounter();
                break;
              }

              logPlayerAction(actionString,"Walked away wasting the potential.");
            }
            nextEncounter();
            break;
          case "Fishing":
            logPlayerAction(actionString,"Continued away from the water.");
            nextEncounter();
            break;
          case "Altar":
            logPlayerAction(actionString,"Continued on your adventure.");
            isFishing=false
            nextEncounter();
            break;
          case "Container":
          case "Consumable-Container":
          case "Locked-Container":
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
              logPlayerAction(actionString,enemyMsg);
              nextEncounter();
            }
            break;
          case "Prop":
            isFishing=false;
            if (enemyMsg!=""){
              logPlayerAction(actionString,enemyMsg)
            } else {
              logPlayerAction(actionString,"Continued on your adventure.");
            }
            nextEncounter();
            break;
          case "Friend":
            var msg="Walked away leaving them behind.";
            if (areaName.includes("Shrouded")) msg="They did not let you leave!"
            logPlayerAction(actionString,msg);
            isFishing=false;
            nextEncounter();
            break;

          case "Trap-Roll": //Triggers when rolling into it, next encounter
            if (!encounterUsed) {
              if (enemyHp<=0) playerHpMax-=enemyHp; //Don't lose max hp
              if (enemySta<=0) playerStaMax-=enemySta; //Don't lose max sta
              playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyDef,enemyMsg,true,false);
              }
            //nextEncounter(); //Blocks the path ahead
            displayPlayerCannotEffect();
            break;
          case "Trap":
          case "Trap-Attack":
          case "Trap-Sleep":
            isFishing=false;
            logPlayerAction(actionString,"Continued on your adventure.");
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

          case "Shop":
            logPlayerAction(actionString,enemyMsg);
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
        if (enemyType=="Shop") {
          drachmaeBuy(2);
          break;
        }

        if (enemyType=="Death"){
          displayPlayerCannotEffect();
          logPlayerAction(actionString,"There's no point in blocking anymore.");
          break;
        }

        if (enemyType=="Dream") {
          displayPlayerCannotEffect();
          logPlayerAction(actionString,"Cannot block while asleep.");
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

        if ((enemyAtk+enemyAtkBonus)<=0 && enemySta > 0 && enemyType!="Pet" && enemyType!="Small"){
          enemyStaminaChangeMessage(-1,"They dodged out of your reach -1 🟢","They needed to catch a breath -1 🟢");
          displayPlayerEffect("☝️");
          displayEnemyCannotEffect();
          break;
        }

        if (!enemyType.includes("Friend") && enemyCastIfMgk(true,"Could not block their spell")){
          break;
        }

        switch (enemyType){
          case "Pet":
          case "Small":
            if (enemySta<=0){
              logPlayerAction(actionString,"They cannot do much about that.")
              displayPlayerEffect("☝️");
              displayEnemyCannotEffect();
              break;
            }
            if ((enemyAtk+enemyAtkBonus)<=0) {
              enemyStaminaChangeMessage(-1,"They dodged out of your reach -1 🟢","They needed to catch a breath -1 🟢");
              displayPlayerEffect("☝️");
            } else {
              enemyStaminaChangeMessage(-1,"Blocked a regular attack -1 🟢","Blocked just for the sake of it -1 🟢");
              displayPlayerEffect("🔰");
            }
            break;
          case "Standard":
          case "Undead":
          case "Recruit":
          case "Demon":
          case "Stingy":
          case "Tough":
          case "Reflective":
            enemyStaminaChangeMessage(-1,"Blocked a regular attack -1 🟢","Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Swift":
            enemyStaminaChangeMessage(-1,"Blocked a swift attack -1 🟢","Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Heavy": //Too heavy or spirit attack
            if (enemyStaminaChangeMessage(-1,"Could not block a heavy attack -"+enemyAtk+" 💔","They needed to catch a breath.")){
              playerHit(enemyAtk);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","Blocked, but was not attacked -1 🟢");
              displayPlayerEffect("🔰");
            }
            break;

          case "Spirit":
          case "Hot":
          case "Toxic":
            var attackMsg="Could not block a spectral attack";
            if (enemyType=="Hot") attackMsg="Could not block a burning attack";
            if (enemyType=="Toxic") attackMsg="Could not block a toxic attack";
            if (enemyStaminaChangeMessage(-1,attackMsg+" -"+enemyAtk+" 💔","They needed to recover some energy.")){
              playerHit(enemyAtk,true,true);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","Blocked, but was not attacked -1 🟢");
              displayPlayerEffect("🔰");
            }
            break;

          default:
            logPlayerAction(actionString,"Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;
        }
        break;

        case 'button_cast':
          var mkgCost=1;
          if (enemyType.includes("Locked")) mkgCost=2;

          if (enemyType=="Death"){
            redirectToTweet();
            logPlayerAction(actionString,"Echoed your story to the world!")
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

          if ((!playerLootString.includes("🧂")) && (playerMgk<mkgCost)){
            logPlayerAction(actionString,"Not enough mana, requires +"+mkgCost+" 🔵");
            displayPlayerCannotEffect();
            break;
          }

          if (enemyType.includes("Locked")){
            if (playerMgk<mkgCost){
              logPlayerAction(actionString,"Not enough mana, requires +"+mkgCost+" 🔵");
              displayPlayerCannotEffect();
              break;
            } else {
              playerMgk-=mkgCost;
              var gainedXP=playerGainXP(1,25*playerLevel,"");
              logPlayerAction(actionString,"Unlocked it with a spell -"+mkgCost+" 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
              nextEncounter();
              break;
            }
          }

          if (enemyType!="Death" && playerCooked!=true && (enemyType=="Consumable" && !playerLootString.includes("🧂"))) displayPlayerEffect("🪄"); //I'm lazy

        switch (enemyType){
          case "Friend":
            enemyTurnAggressive("Your spell turned them adversary!");
            enemyHit(magicDamage,true);
            break;

          case "Reflective": //Copy pasted half of this shizz, damnnn
            var magicDamage = playerMgk;
            if ((parseInt(enemyHp)-parseInt(enemyHpLost))==1) magicDamage=1; //TODO: No time to do it better now
            if (magicDamage > 2) {
              magicDamage=2;
            }
            playerMgk-=magicDamage;
            displayEnemyEffect("🔷");
            displayEnemyCannotEffect();
            if ((enemySta+enemyStaLost)==0){
              atckmsg="They reflected the spell.";
            } else {
              atckmsg="They reflected the spell and attacked -"+enemyAtk+" 💔";
            }
            if (enemyCastIfMgk(true)) enemyAttacked=true;
            if (!enemyAttacked) enemyAttackOrRest(atckmsg);
            break;

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
          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Tough":
            var magicDamage = playerMgk;
            if ((parseInt(enemyHp)-parseInt(enemyHpLost))==1) magicDamage=1; //TODO: No time to do it better now
            if (magicDamage > 2) {
              magicDamage=2;
            }
            playerMgk-=magicDamage;

            if ((enemyMgk-enemyMgkLost)<=magicDamage){
              enemyHit(magicDamage,true);
            } else {
              logPlayerAction(actionString,"They resisted your spell -"+magicDamage+" 🔵");
              enemyMgkLost+=magicDamage;
              if (enemyMgkLost>enemyMgk) enemyMgkLost=enemyMgk;
            }

            if (enemyHp-enemyHpLost > 0) { //If they survive, they counterattack or regain stamina
              if (enemyCastIfMgk()) break;
              enemyAttackOrRest();
            }
            break;

          case "Trap":
          case "Trap-Roll":
          case "Trap-Attack":
          case "Trap-Sleep":
          case "Item":
            playerMgk--;
            logPlayerAction(actionString,"Scorched it with a spell -1 🔵");
            displayEnemyEffect("🔥");
            isFishing=false;
            animateFlipNextEncounter();
            break;

          case "Consumable":
          case "Consumable-Container":
            if (!playerCooked) {
              var logMessage="";

              if (enemyHp<0){
                logMessage="Cooked it with a spell -1 🔵";
                enemyHp=0;
                enemyMsg="Actually tasted good";
                displayEnemyEffect("🔥");
              } else {
                logMessage="Roasted a crispy crust -1 🔵";
                enemySta=parseInt(enemySta)+1;
                enemyMsg="That was very tasty";
                displayEnemyEffect("🔥");
              }

              if (playerLootString.includes("🧂")){
                logMessage="Added a tiny pinch of salt.";
                playerMgk+=magicDamage;
                enemyName=enemyName+" (Salty)";
                displayEnemyEffect("✨");
              } else {
                enemyName=enemyName+" (Crispy)";
                playerMgk+=(magicDamage-1);
              }

              playerCooked=true;
              logPlayerAction(actionString,logMessage);
              animateUIElement(enemyInfoUIElement,"animate__pulse","0.4"); //Animate cooking
            } else {
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
            logPlayerAction(actionString,"Your spell had no effect on that -1 🔵");
            playerMgk--;
            displayEnemyEffect("✨");
          }
          break;

        case 'button_pray':
          if (enemyType=="Death"){
            logPlayerAction(actionString,"It's kinda too late for healing now.");
            displayPlayerCannotEffect();
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
              logPlayerAction(actionString,"Giving your best, but no effect.");
              displayPlayerCannotEffect();
            }
            break;

          case "Spirit":
          case "Demon":
            if ((playerMgk>0)&&(enemyInt <= playerInt )){
              var gainedXP=playerGainXP(1.25,0,"")
              logPlayerAction(actionString,"Banished them from this world! "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
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
          case "Trap-Sleep":
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
          case "Boss":
          case "Small":
          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Tough":
            playerHeal();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Undead": //Reduce attack if possible
            if (playerMgkMax >= enemyMgk && (enemyAtkBonus+enemyAtk)>0) {
              enemyAtkBonus-=1;
              logPlayerAction(actionString,"Made them -1 ⚔️ weaker for -1 🔵");
              enemyName=enemyName+" (Weakened)";
              displayEnemyEffect("🔥");
            } else if (playerMgkMax < enemyMgk) {
              logPlayerAction(actionString,"They resisted your prayer -1 🔵");
            } else {
              logPlayerAction(actionString,"Your prayer had no effect on them -1 🔵");
            }
            enemyAttackOrRest();
            break;

          case "Dream":
            playerHeal();
            break;

          case "Altar":
            var isSacrifice = (enemyHp<0)

            if (isSacrifice) {
              var blade=checkPlayerHasItem(validBlades);
              if (blade!=""){
                playerLootString+=blade; //Blade is not lost
                displayEnemyEffect("🩸");
                playerHit(1,false,true);

                if (encounterUsed){
                  logPlayerAction(actionString,"Your sacrifice had no effect -1 💔")
                  displayPlayerCannotEffect();
                  break;
                }

                playerChangeStats(0, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyDef,enemyMsg+" -1 💔",true,false);
                playerGainXP(1,10*playerLevel,"");

                isFishing=false
                encounterUsed=true;
              } else {
                logPlayerAction(actionString,"No effect, missing a viable <b>🔪 Blade</b>.")
                displayPlayerCannotEffect();
              }
            } else {
                if (encounterUsed){
                  logPlayerAction(actionString,"Your prayer had no further effect.")
                  displayPlayerEffect("🤲");
                  displayPlayerCannotEffect();
                  break;
                }
                playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyDef,enemyMsg,true,false);
                displayPlayerEffect("✨")
                displayPlayerGainedEffect();
                displayEnemyCannotEffect();
                isFishing=false
                encounterUsed=true;
            }
            break;

          default:
            var prayLogMessage="Your prayer had no visible effect."
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
          shareLinkedIn();
          logPlayerAction(actionString,"Shared your story to LinkedIn!");
          break;
        }

        if (enemyType=="Upgrade"){
            logPlayerAction(actionString,"Gained permanent bonus <b>+2 🍀 Luck</b>.");
            displayPlayerCannotEffect();
            playerName=getLuckyName();
            playerChangeStats(0, 0, 0, 2, 0, 0,0,"n/a",false,false);
            isFishing=false;
            animateFlipNextEncounter();
            break;
        }

        if (!playerUseMagic(1,"Not enough mana, requires +1 🔵")) { //Curse is never free, upgrd handled above
            break;
          }

        if (enemyType!="Death") {displayPlayerEffect("🪬");}

      switch (enemyType){
        case "Reflective":
          displayEnemyEffect("🔷");
          displayEnemyCannotEffect();
          if ((enemySta+enemyStaLost)==0){
            atckmsg="They reflected the curse.";
          } else {
            atckmsg="They reflected the curse and attacked -"+enemyAtk+" 💔";
          }
          if (enemyCastIfMgk(true)) enemyAttacked=true;
          if (!enemyAttacked) enemyAttackOrRest(atckmsg);
          break;

        case "Demon":
            logPlayerAction(actionString,"Your curse has made them stronger!");
            enemyName=enemyName+" (Cursed)";
            animateUIElement(enemyInfoUIElement,"animate__tada","1"); //Animate enemy gain
            enemyAtk+=1;
            break;

        case "Standard": //Reduce enemy atk if mgk stronger then them
        case "Recruit":
        case "Swift":
        case "Heavy":
        case "Pet":
        case "Undead":
        case "Spirit":
        case "Boss":
        case "Small":
        case "Stingy":
        case "Toxic":
        case "Hot":
        case "Tough":
          if (playerMgkMax > enemyMgk && (enemyAtkBonus+enemyAtk)>0) {
            displayEnemyCannotEffect();
            displayEnemyEffect("🪬");

            if (procAbilityChance("🪆",33)){
              var animalEmoji = chooseFrom(["🐁","🦔","🐸","🦎","🐀","🪱","🪰","🪲","🪳","🐌"]);
              logAction("🪆 ▸ ‍🧬 <b>Polymorphed</b> them into a critter -1 🔵");
              displayEnemyCannotEffect();
              displayEnemyEffect("🧬");

              enemyEmoji=animalEmoji; enemyType="Small"; encounterRenew();
              enemyHp=1; enemyAtk=1; enemyAtkBonus=0; enemySta=1; enemyLck=0; enemyInt=-1; enemyMgk=0;
              enemyMsg="They avenged getting polymorphed!";
              break;
            }

            var enemyAtkChange=Math.floor((1+enemyAtk+enemyAtkBonus)/2); //WTF, no way
            enemyAtkBonus-=enemyAtkChange;
            if (enemyAtkBonus>enemyAtk) enemyAtkBonus=enemyAtk;
            enemyCursed=true;
            logPlayerAction(actionString,"Cursed them -"+enemyAtkChange+" ⚔️ weaker for -1 🔵");
            break; //Enemy does not attack if  cursed
          } else if (playerMgkMax <= enemyMgk) {
            logPlayerAction(actionString,"They resisted your curse -1 🔵");
          } else {
            logPlayerAction(actionString,"Your curse had no effect on them -1 🔵");
          }

          if (enemyCastIfMgk()) break;
          enemyAttackOrRest();
          break;

        case "Friend": //They'll boost your stats
          if (playerMgk >= enemyMgk){
            var gainedXP=playerGainXP(1,25*playerLevel,"");
            logPlayerAction(actionString,"Forced revealed their secrets -1 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg);
          } else {
            logPlayerAction(actionString,"Could not overpower their will -1 🔵");
            displayPlayerCannotEffect();
          }
          break;

        case "Altar":
          logPlayerAction(actionString,"Your curse has angered the gods -1 🍀");
          playerLck=-1;
          displayPlayerEffect("🪬");
          break;

        default:
          logPlayerAction(actionString,"Your curse dispersed into the area -1 🔵");
      }
      break;

      case 'button_grab': //Player vs encounter stamina decides the success

        if (enemyType=="Shop") {
          drachmaeBuy(4,"Level");
          break;
        }

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
                logPlayerAction(actionString,"Unable to initiate a relationship ?? 🧠");
                nextEncounter();
                break;
              }
              enemyJoinedParty();
              break;
            }

          case "Recruit": //Player vs encounter stamina - knockout, dodge or asymmetrical rest
          case "Standard":
          case "Reflective":
          case "Tough":
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){ //If they are tired and player has stamina
              if (enemyType.includes("Tough")) {
                enemyAttackOrRest("Cannot grab a proper hold of them.",true);
                displayEnemyCannotEffect();
                break;
              }
              logPlayerAction(actionString,"Grabbed them into stranglehold -1 🟢");
              playerSta--;
              enemyKnockedOut();
              isFishing=false;
            } else if (enemySta - enemyStaLost > 0){ //Enemy dodges if they got stamina
              var touchChance = Math.floor(Math.random(10) * luckInterval); // Chance to make enemy uncomfortable
              if ( touchChance <= playerLck ){ //Generous
                var gainedXP=parseInt(playerGainXP(1,0,""));
                playerXP+=gainedXP; console.log("XP++ "+ gainedXP + " ("+playerXP+"/"+playerXPThreshold+")");

                logAction("🍀 ▸ ✋ <b>Luckily</b>, they were spooked. "+ decorateStatusText("","+"+gainedXP+" XP",colorGold));
                displayEnemyEffect("💨");
                displayPlayerEffect("🍀");
                animateFlipNextEncounter();
                isFishing=false;
                break;
              }
              else {
                enemyDodged("Missed, they evaded your grasp.");
                if (enemyCastIfMgk()) break;
              }
            } else { //Player and enemy have no stamina - asymetrical rest
              enemyKicked();
              if (enemyType=="Pet"){
                var gainedXP=parseInt(playerGainXP(1,0,""));
                playerXP+=gainedXP; console.log("XP++ "+ gainedXP + " ("+playerXP+"/"+playerXPThreshold+")");

                logAction(enemyEmoji+" ▸ 😱 They got spooked and fled! "+ decorateStatusText("","+"+gainedXP+" XP",colorGold));
                displayEnemyEffect("💨");
                animateFlipNextEncounter();
                isFishing=false;
              }
            }
            break;

          case "Swift": //Player can only kick tired swift enemies
            if (enemySta-enemyStaLost == 0){
              enemyKicked();
              break;
            }
            enemyAttackOrRest("They dodged that and retaliated -"+parseInt(enemyAtk+enemyAtkBonus)+" 💔");
            if (!enemyAttacked && enemyCastIfMgk()) break;
            break;

          case "Heavy":
          case "Boss":
            if (enemyCastIfMgk()) break;
            if ((enemySta - enemyStaLost) > 0){ //Enemy hits extra hard if they got stamina
              var damageReceived=(enemyAtk+enemyAtkBonus);
              var overpowerMessage="They are too big to grasp!";
              if (damageReceived>0) {
                damageReceived+=2;
                overpowerMessage="Got overpowered and hit hard -"+damageReceived+" 💔";
                logPlayerAction(actionString,overpowerMessage);
                playerHit(damageReceived);
                enemyStaLost++;
                break;
              }
              logPlayerAction(actionString,overpowerMessage);
              displayPlayerCannotEffect();
            } else { //Enemy has no stamina - asymetrical rest
              enemyKicked();
            }
            break;

          case "Trap": //Grabbing triggers the effect
          case "Trap-Roll":
          case "Trap-Attack":

            if (encounterUsed){
                logPlayerAction(actionString,"Seems like that was it for now.")
                displayPlayerCannotEffect();
                break;
              }
            if (totalBonus>0) {
              encounterUsed=true;
            }

            if (totalBonus<=0 && totalMalus>=0) displayPlayerCannotEffect();

            if (enemyHp<=0) playerHpMax-=enemyHp; //Don't lose max hp
            if (enemySta<=0) playerStaMax-=enemySta; //Don't lose max sta
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg,true,false);
            break;

          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Undead": //Grabbing is not safe
            if (enemyCastIfMgk()) break;
            var grabDmg=enemyAtk;
            if (grabDmg==0) grabDmg=1;

            var dmgMsg="Ouch, that hurt pretty bad";
            if (enemyType=="Toxic" || enemyType=="Undead") dmgMsg="Oof, that was really nasty";
            if (enemyMsg!="") dmgMsg=enemyMsg.replace(".","");
            logPlayerAction(actionString,dmgMsg+" -"+grabDmg+" 💔");
            playerHit(grabDmg,true,true);
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
              if (playerHp>playerHpMax) playerHp=playerHpMax;
              displayPlayerEffect("💢");
              //playerHit(halfHp,false,true);
            }

            if (enemyEmoji=="UNASSIGNED"){ //TODO Was 🍭, needs replacement
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

            if (!enemyTeam.includes("Lover's Memento")) { //Add to loot
              if (enemyEmoji!="🪙") playerLootString+=enemyEmoji;
              displayPlayerGainedEffect();
              displayPlayerEffect("🪙");
            } else {
              playerKarma++;
              playerLove++;
              enemyMsg="<text style=color:"+colorGold+";>You just had to take it with yourself.</text>";
            }

            if (enemyEmoji=="🪙"){
              savedCoins++
              localStorage.setItem('coins', savedCoins);
            }

            //Grab end
            isFishing=false;
            if (playerHp==0) break;
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg);
            break;

          case "Small":
            if ((enemySta-enemyStaLost)==0 && (enemyMgk-enemyMgkLost)==0) {
              enemyGrabbedIntoLoot();
            } else {
              enemyDodged("Missed, they evaded your grasp.");
              if (enemyCastIfMgk()) break;
            }
            break;

          case "Friend":
            if ((enemyName.includes("Bride")||enemyName.includes("Lethargic")) && playerLove>2){
              logPlayerAction(actionString,"You touch has provided her comfort.");
            } else {
              logPlayerAction(actionString,"Your touch was not appreciated.");
            }
            displayEnemyEffect("✋");
            isfishing=false;
            nextEncounter();
            break;

          case "Consumable":
            playerConsumed();
            displayEnemyEffect("🍴");
            if (playerHp>0) nextEncounter();
            isFishing=false;
            break;

          case "Fishing":
            var bait=checkPlayerHasItem(validBaits);
            if (bait!="" && playerUseItem(bait,"Fished out something using "+bait+decorateStatusText(""," +"+(10*playerLevel)+" XP",colorGold),"Missing a viable fishing bait.")){
              playerGainXP(1,10*playerLevel,"");

              if (procAbilityChance("🧵",33)) {
                logAction("🧵 ▸ "+bait+" Luckily the bait remained hooked.");
                displayPlayerEffect("🧵");
                playerLootString+=bait;
              }

              getRandomFish();
              displayEnemyEffect("🪝");
            } else {
              displayPlayerCannotEffect();
              logPlayerAction(actionString,"Missing a viable fishing bait.")
            }
            break;

          case "Demon":
          case "Spirit":
            logPlayerAction(actionString,"Missed, they seem untouchable.");
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
            playerChangeStats(-1, 0, 0, 0, 0, 2,0,"n/a",false,false);
            playerHit(0,false,true);
            isFishing=false;
            animateFlipNextEncounter();
            break;

          case "Checkpoint": //LVL UP
            playerXP+=playerXPThreshold;
            isFishing=false;
            logPlayerAction(actionString,"Praised the <b>"+enemyName+"</b>!")
            playerRest(true);
            encounterIndex++;
            break;

          default:
            if (enemyType.includes("Container")){
              if (enemyType.includes("Locked")){
                if (playerUseItem("🗝️","Unlocked it with a key "+decorateStatusText("","+"+(25*playerLevel)+" XP",colorGold),"Cannot open, it is locked tight.",false)){
                  playerGainXP(1,25*playerLevel,"");
                  nextEncounter();
                } else if (playerLootString.includes("📎")) {
                  logPlayerAction(actionString,"Unlocked with <b>📎 The Universal Key</b>.")
                  playerGainXP(1,25*playerLevel,"");
                  nextEncounter();
                } else {
                  displayEnemyCannotEffect();
                }
                break;
              }
              var openMessage = "Sucessfully found something.";
              displayEnemyEffect("👋");
              if (enemyMsg != ""){
                openMessage = enemyMsg;
              }
              if (totalBonus>0 || totalMalus<0) {
                playerConsumed();
              } else {
                logPlayerAction(actionString,openMessage);
              }
              if (playerHp>0) nextEncounter();
              break;
            }

            logPlayerAction(actionString,"Touched it, nothing happened.");
            displayEnemyCannotEffect();
            displayEnemyEffect("✋");
          }
        break;

      case 'button_speak':
        if (enemyType!="Dream") displayPlayerEffect("💬");

        if (enemyType=="Shop") {
          drachmaeBuy(5,"Artifact");
          break;
        }

        var convinceInt=playerInt;
        if (playerLootString.includes("📣")) {
          displayPlayerEffect("📣");
          convinceInt=playerInt*2;
        }

        switch (enemyType){
          case "Recruit": //If you are smarter they join you
            if (enemyInt < convinceInt){
              displayPlayerEffect(enemyEmoji);
              playerPartyString+=enemyEmoji
              var gainedXP=playerGainXP(1.5,0,"");
              enemyMsg=playerChangeStats(0, enemyAtk, 0, enemyLck, 0, enemyMgk, 0,"Joined forces together",false); //Cannot get health/sta/int/def from a recruit
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
          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Tough":
          case "Reflective":
            var maxEnemyAngryBoost=3;

            if (enemyInt==-1) {
              logPlayerAction(actionString,"They cannot comprehend any words.");
              displayPlayerEffect("💬");
              if (enemyCastIfMgk()) break;
              enemyAttackOrRest();
              break;
            }

            if (enemyInt < convinceInt){
              if ((enemyAtk+enemyAtkBonus)>0){
                enemyAtkBonus--;
                logPlayerAction(actionString,"Managed to calm them down -1 ⚔️");
                if ((enemyAtk+enemyAtkBonus)>0) enemyAttackOrRest();
                displayEnemyCannotEffect();
              } else if (enemyAtk>0){
                enemyDisengage();
              } else {
                if (playerUseItem("🏳️","n/a","n/a",true,true)) {playerWaive(); break;}
                logPlayerAction(actionString,"They do not seem to care at all.")
                displayPlayerCannotEffect();
              }
              break;
            } else if ((enemyInt > (convinceInt+2)) && enemyAtkBonus <= maxEnemyAngryBoost) {
              if (playerUseItem("🏳️","n/a","n/a",true,true)) {playerWaive(); break;}
              logPlayerAction(actionString,"They got more angry +1 ⚔️");
              //enemyName=enemyName+" (Angry)";
              enemyAtkBonus+=1;
            } else {
              var speechChance = Math.floor(Math.random() * luckInterval);
              if ( speechChance <= playerLck ){
                logAction("🍀 ▸ 💬 They believed your lies and left.");
                nextEncounter();
                break;
              } else {
                if (playerUseItem("🏳️","n/a","n/a",true,true)) {playerWaive(); break;}
                logPlayerAction(actionString,"They ignored whatever you said.");
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
            var heldQuestItem=checkPlayerHasItem(enemyQuestItems);
            //Either they don't want an item, or player has it + has more or same int
            if (((String(enemyQuestItems)=="")||(heldQuestItem!="")) && (convinceInt >= enemyInt)){
              if (String(enemyQuestItems).length>=1) { //Quest rewards
                //This means filter by two = guarantee artifact
                pushEncounter(getRandomEncounter(["Item"],["Artifact"]));
                playerLootString=playerLootString.replace(heldQuestItem,"");
              }
              //XP is even for interaction
              var gainedXP=playerGainXP(1,25*playerLevel,"");

              if (parseInt(enemyHp+enemyAtk+enemySta+enemyLck+enemyInt+enemyMgk+enemyMsg)==0) {
                logPlayerAction(actionString,enemyMsg+" " + decorateStatusText("","+"+gainedXP+" XP",colorGold));
                nextEncounter();
                isFishing=false;
              } else {
                playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg+" " + decorateStatusText("","+"+gainedXP+" XP",colorGold),true);
                isFishing=false;
                displayPlayerEffect("✨");
              }
            } else {
              console.log(enemyQuestItems);
              if (String(enemyQuestItems)!=""){
                logPlayerAction(actionString,"You lack the desired item: "+String(enemyQuestItems).replaceAll(","," "));
              } else {
                logPlayerAction(actionString,"Unable to initiate conversation ?? 🧠");
              }
              displayPlayerCannotEffect();
            }
            break;

          case "Death":
            visitLinkedIn();
            logPlayerAction(actionString,"Checked out IGPenguin on LinkedIn!");
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

          case "Item":
            if (encounterUsed) {
              logPlayerAction(actionString,"It doesn't cause you any new feelings.");
              displayPlayerCannotEffect();
              break;
            }

            if (enemyTeam.includes("Lover's Memento")){
              logPlayerAction(actionString,"<text style=color:"+colorRed+";>"+enemyMsg+" -1 💔</text>");
              playerKarma++;
              playerLove++;
              playerHit(1);
              displayPlayerRestedEffect();
              displayPlayerEffect("💔")
              encounterUsed=true;
              break;
            }

          default:
            logPlayerAction(actionString,"Your voice echoes around the area.");
            displayPlayerCannotEffect();
            displayPlayerEffect("💬");
        }
        break;

      case 'button_sleep':
        switch (enemyType){

          case "Curse": //Waiting triggers the curse
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg);
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
          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Tough":
          case "Reflective":
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

          case "Trap-Sleep":
            if (encounterUsed){
                logPlayerAction(actionString,"Seems like its power is exhausted.")
                displayPlayerCannotEffect();
                break;
              }
            if (totalBonus>0) {
              encounterUsed=true;
              playerRest(true);
            }

            if (enemyHp<=0) playerHpMax-=enemyHp; //Don't lose max hp
            if (enemySta<=0) playerStaMax-=enemySta; //Don't lose max sta
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyDef,enemyMsg,true,false);
            break;

          case "Dream":
            if (enemyName.includes("Waking Moment") || enemyName.includes("Worrying Realization")){
              displayPlayerCannotEffect();
              logPlayerAction(actionString,"Cannot fall asleep at the moment.")
              break;
            }
            playerRest(true);
            logPlayerAction(actionString,enemyMsg)
            nextEncounter();
            break;

          case "Friend": //They'll leave if you'll rest
            playerRest();
            logPlayerAction(actionString,"They got tired of waiting for you.");
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
    if (enemyBossType!="") enemyType=enemyBossType;

    //Set intellect 1-6 (Pure Chance)
    if (procAbilityChance("🎲",100)){
      var temporaryIntellect=chooseFrom([1,2,3,4,5,6]);
      console.log("Chance→int:"+temporaryIntellect);
      playerInt=temporaryIntellect;
    }

    redraw();
  };
}

//Enemy
function enemyRest(stamina){
  if (enemyHp - enemyHpLost > 0){
    if (document.getElementById('id_enemy_overlay').innerHTML!= "💢") displayEnemyEffect("💤")
    enemyStaLost-=stamina;
    if (enemyStaLost < 0) {
      enemyStaLost = 0;
    }
  }
}

function enemyStaminaChangeMessage(stamina,successMessage,failMessage){
  if (enemySta>enemyStaLost){
    displayEnemyAttackEffect();
  } else {
    displayEnemyRestEffect();
    displayEnemyEffect("💤");
  }

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
    actionString=playerCastType; hitMsg="Scorched them with a spell -"+damage+" 💔";
  } else { //Melee
      actionString="⚔️";
  }

  displayEnemyEffect("💢");
  var critChance = Math.floor(Math.random() * luckInterval);
  if ( (critChance <= playerLck) && applyLuck){
    logAction("🍀 ▸ "+actionString+" Your strike was blessed with luck.");
    hitMsg="Attack hit them critically -"+(damage+2)+" 💔";
    displayPlayerEffect("🍀");
    damage+=2;
  }

  if (damage<=0) {
    hitMsg="Your attack had no effect! ❌";
    displayEnemyEffect("");
  }
  if (enemyDef>0 && !magicType) {
    hitMsg=hitMsg+" ("+enemyDef+" 🔰)";
    if (damage<=0){
      hitMsg="Your attack was fully repelled! ("+enemyDef+" ️🔰)";
      displayEnemyEffect("🔰");
    }
  }

  if (!silent) logPlayerAction(actionString,hitMsg);
  enemyHpLost = enemyHpLost + damage;

  if (!magicType && procAbilityChance("🀄️",33) && playerHp<playerHpMax){
      logAction("🀄️ "+arrowSymbol+" ✨ Your attack has syphoned health +1 ❤️");
      playerHp+=1;
  }

  if (enemyHpLost >= enemyHp) {
    enemyHpLost=enemyHp; //Negate overkill damage
    enemyKilled();
    return true;
  }

  if (enemyAtk==0 && enemyAtkBonus<1) {
    enemyAtkBonus++
    logAction(enemyEmoji+" "+arrowSymbol+" 💢 They got enraged gaining +1 ⚔️");
  }
}

function enemyKilled(){
  var gainedXP=parseInt(playerGainXP(1,0,""));
  logAction(enemyEmoji + " ▸ " + "💀 They've received a fatal blow " + decorateStatusText("","+"+gainedXP+" XP",colorGold));

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
  playerChangeStats(0, enemyAtk, 0, enemyLck, 0, enemyMgk,0,enemyMsg); //Cannot get health/sta/int/def from a pet
}

function enemyKnockedOut(){
  var gainedXP=parseInt(playerGainXP(1.25,0,""));
  var knockoutString="💤 Harmlessly knocked them out "
  if ((enemyAtk+enemyAtkBonus)<=0) knockoutString="💤 Carefully put them to sleep "
  logAction(enemyEmoji + "&nbsp;▸&nbsp;" + knockoutString + decorateStatusText("","+"+gainedXP+" XP",colorGold));
  if (enemyAtk>0) playerKarma++;
  if (enemyAtk<=0) playerKarma--;
  //playerSta--;

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
  playerGainXP(1.25,0,"Grabbed it into your bag");
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
  if (enemyAtk==0 && enemyAtkBonus<1) {
    enemyAtkBonus++
    logAction(enemyEmoji+" "+arrowSymbol+" 💢 They got enraged gaining +1 ⚔️");
  }
}

function playerGainXP(multiplier=1,gainedXP=0, message="Improved your insight "){
  var intBonus=1+playerInt/20;
  var statSum=0;
  var typeMultiplier=1;

  //Per type XP multipliers
  if (enemyType=="Hot"||enemyType=="Stingy"||enemyType=="Toxic"||enemyType=="Tough") typeMultiplier=1.1;
  if (enemyType=="Swift"||enemyType=="Heavy") typeMultiplier=1.2;
  if (enemyType=="Demon"||enemyType=="Spirit"||enemyType=="Undead") typeMultiplier=1.4;
  if (enemyBossType.includes("Boss")) typeMultiplier=1.6;

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

  if (procAbilityChance("🎓",100)) gainedXP=parseInt(gainedXP*1.25);

  if ((playerXP+gainedXP)>=playerXPThreshold) logAction(enemyEmoji+" ▸ 🎉 "+"<text style=color:"+colorGold+";>"+"You are ready to <b>level up!</b></text>")

  return parseInt(gainedXP);
}


function enemyAttackOrRest(message="",isGrab=false){
  var damageReceived=enemyAtk+enemyAtkBonus;
  var staminaChangeMsg;

  if ((enemySta>enemyStaLost)&&(enemyHp>enemyHpLost)) {
    if (playerLootString.includes("🖤") || playerLootString.includes("🪣") ) {
      damageReceived--;
      displayPlayerEffect("🔰");
    }

    if (enemyType!="Demon"){
      staminaChangeMsg = "The enemy attacked you dealing -"+(enemyAtk+enemyAtkBonus)+" 💔"
    } else {
        staminaChangeMsg = "The enemy syphoned some health -"+(enemyAtk+enemyAtkBonus)+" 💔";
        if (enemyHpLost >0) {enemyHpLost-=1;}
    }

    displayEnemyAttackEffect();

    if ((damageReceived<=0) && !(playerLootString.includes("🖤") || playerLootString.includes("🪣") )){
      staminaChangeMsg=chooseFrom(["They just hang around.","They do not seem to care.","They just wait around.","They seem to be very chill."])
      if (enemyCursed && (enemyAtk+enemyAtkBonus)<=0) staminaChangeMsg="They are too weak to do any harm."
      animateUIElement(emojiWrapperUIElement,"animate__headShake","0.8"); //Play chill animation
      if (enemyType=="Pet"){ //Harder to befriend
        enemyIntBonus++;
        if ((enemyInt+enemyIntBonus)<=playerInt){
          logAction(enemyEmoji+" ▸ ⁉️ They now seem more concerned.");
          displayEnemyEffect("⁉️")
          enemyRest(1);
        } else {
          logAction(enemyEmoji+" ▸ ‼️ They got bored and left.");
          nextEncounter();
          return;
        }
      }
      if (message!="") staminaChangeMsg=message;
      if (!isGrab) {
        logAction(enemyEmoji+" "+arrowSymbol+" 💤 "+staminaChangeMsg);
        enemyRest(1);
        return; //They don't waste stamina unless necessary
      }
    } else {
      if (message!="") staminaChangeMsg=message;
      enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a");
      if (isGrab){return;}
      playerHit(damageReceived,true,false);

      if (playerLootString.includes("🥀") && (enemyHp>enemyHpLost) && (enemyAtk+enemyAtkBonus)>0 && !isGrab) {
        logAction("⚔️ ▸ 🥀 Dealt -1 💔 by <b>🥀 Thorns Payback</b>.");
        enemyHit(1,false,false,true);
        displayEnemyEffect("🥀");
      }

      if (playerLootString.includes("🖤") || playerLootString.includes("🪣") ) logAction("⚔️ ▸ <b>🔰 Unbreakable</b> provided protection +1 🔰");
      return;
    }
    enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a","Shit happened.");
  } else {
    if (message=="") {
      staminaChangeMsg="They recovered some energy.";
    } else {
      staminaChangeMsg=message;
    }
    if (enemyType=="Spirit") staminaChangeMsg = "Impossible to hit, they recovered energy."
    if (enemyType=="Spirit" && (enemySta+enemyStaLost==0)) staminaChangeMsg = "Seems to be impossible to hit."
    logPlayerAction(actionString,staminaChangeMsg);
    enemyRest(1);
  }
}

function enemyDodged(message="Missed, they evaded your grasp."){
  displayPlayerCannotEffect();
  displayEnemyEffect("🌀");
  enemyAttackOrRest(message,true); //FML
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
      logAction("🪄 ▸ <b>💠 Reflect Magic</b> resisted their spell.");
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

function enemyTurnAggressive(message="That has made them really upset!"){
  enemyType="Standard";
  enemyHp=2+playerLevel;
  enemyAtk=Math.floor(1+playerLevel/2);
  enemySta=Math.floor(2+playerLevel/2);
  enemyMsg="Got killed instead of a conversation."
  playerKarma--;
  logPlayerAction(actionString,message);
  return true;
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

  //animateUIElement(cardUIElement,"animate__fadeIn","0.8");
  animateUIElement(cardUIElement,"animate__bounceInUp","1.3");

  toggleUIElement(areaUIElement,1);
  animateUIElement(areaUIElement,"animate__bounce","1.2");

  encounterRenew();
  return
}

function procAbilityChance(abilityEmoji="",abilityChance=100) { //Congrats me!!!
  var success = Math.floor(((Math.random() * 100))<=abilityChance)
  if (success && playerLootString.includes(abilityEmoji)) {
    return true;
  }
}

function nextEncounter(animateArea=true){ //Note: Even generator encounters go through here :)
  if (!enemyType.includes("Generator")) { //Hacky hacky hack and mess on top of it
    markAsSeen(enemyName);
    previousEnemyType = enemyType;
    if (enemyType.includes("Boss") && !areaName.includes("Shrouded")) {
      curtainFadeInAndOut("<p style=\"color:"+colorGold+";letter-spacing: 1.8px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:52px;line-height:20px;\">Boss defeated!</p><p style=\"font-size:20px;\""+decorateStatusText("",enemyEmoji+emptySpace+"<b>"+enemyName+"</b>"+emptySpace+emptySpace,colorWhite),5);

      logAction("👑 ▸ "+enemyEmoji+"<text style=color:"+colorGold+";>"+" Boss defeated: <b>"+enemyName+"</b></text>")
    }
  }

  if (procAbilityChance("🥻",5)){
    var philosopherThoughts = ["area:"+areaName,"emoji:💭","name:Curious Thought","type:Prop","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Epiphany","desc:Stopped to think about the universe.<br>n/a","message:"]
    linesStory.splice(encounterIndex+1,0,philosopherThoughts);
    logAction("🥻 ▸ <b>💭 Curious Thought</b> came on your mind.")
  }

  if (animateArea) {
    toggleUIElement(areaUIElement,1);
    animateUIElement(areaUIElement,"animate__flipInX","1.2");
  }

  encounterIndex = getNextEncounterIndex();

  encounterRenew();
  loadEncounter(encounterIndex);

  //Fullscreen Curtain
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm") && (areaName != "Depths of Slumber")){ //Does not animate new area when killed
    curtainFadeInAndOut("<p style=\"color:"+colorWhite+";letter-spacing: 1.6px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:40px;\">"+areaName+"</p><p style=\"font-size:20px;margin-top:-44px;z-index:-100;position:relative;\">____________________________________</p>");
    if ((!areaName.includes("Eternal") && (!areaName.includes("Depths")))) logAction("💭 ▸ 👣 Arrived to area: <b>"+areaName+"</b>");
  }
  animateUIElement(cardUIElement,"animate__fadeIn","1.2");
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
  var levelUp = ["area:"+areaName,"emoji:🎉","name:Level Up!","type:Upgrade","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Character Upgrade","desc:<b>Choose a perk</b> to shape your character.<br>","message:"]

  if (playerXP>=playerXPThreshold){
    curtainFadeInAndOut("<p style=\"color:"+colorGold+";letter-spacing: 1.8px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:52px;line-height:20px;font-weight:600;\">Level Up!</p><p style=\"font-size:20px;\""+decorateStatusText("","New perk available.",colorWhite));
    if (playerHp<playerHpMax) playerHp=playerHpMax;
    playerRest(true);
    playerLevel++;
    playerXP=playerXP-playerXPThreshold;
    playerXPThreshold=playerLevel*200;
    updateXPProgress();
    pushEncounter(levelUp,0);
    encounterIndex=encounterIndex-1;
    nextEncounter();
    logAction("✨ ▸ <text style=color:"+colorGold+";>"+ "<b>🎉 Level Up!</b> Select a character perk.</text>")
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

    if (!silent && procAbilityChance("⛺️",33)){
      logAction("💤 ▸ <b>⛺️️ Camping Tent</b> provided bonus +1 🟢")
      playerSta++;
      displayPlayerRestedEffect();
    }

    if (!silent && procAbilityChance("🔮",33)){
      logAction("🔮 ▸ <b>👁️ Vivid Dream</b> provided bonus +1 🔵")
      playerMgk++;
      displayPlayerRestedEffect();
    }

if (playerCheckLevelUp()){
  return true;
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

    logPlayerAction(actionString,"Cast a +"+healAmount+" ❤️‍🩹 healing spell for -"+healAmount+" 🔵");
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
      logPlayerAction(actionString,"Wasted a moment of your life.");
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
      logAction("🪶  ▸ <b>♻️ Quick Reflexes</b> kicked in +"+stamina+" 🟢");
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

function playerChangeStats(bonusHp=enemyHp,bonusAtk=enemyAtk,bonusSta=enemySta,bonusLck=enemyLck,bonusInt=enemyInt,bonusMgk=enemyMgk,bonusDef=enemyDef,gainedString = "Might come in handy later.",logMessage=true,moveForward=true,actionIcon=actionString){
  var totalBonus=bonusHp+bonusAtk+bonusSta+bonusLck+bonusInt+bonusMgk+bonusDef;
  var changeSign=" +";
  if (gainedString=="") gainedString="Might come in handy later."

  if ((totalBonus >= 0) && (gainedString=="Might come in handy later.")) {
    if (totalBonus !=0){
      gainedString="Felt becoming stronger";
    }
  } else if (gainedString=="Might come in handy later.") {
    gainedString="Got cursed by it";
    if (enemyType.includes("Trap")) gainedString=enemyMsg
    if (gainedString=="") gainedString="Seems like it was a mistake."
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
    if (playerMgk<0) playerMgk=0;
    gainedString += changeSign+bonusMgk + " 🔵";
    displayPlayerEffect("🪬");
    displayPlayerGainedEffect();
  }

  if (bonusSta != 0){
    if (bonusSta<0) {
      changeSign=" "
      displayPlayerEffect(enemyEmoji);
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      displayPlayerEffect("💨");
      displayPlayerGainedEffect();
    }
    playerStaMax += parseInt(bonusSta);
    playerSta += parseInt(bonusSta);
    if (playerSta<0) playerSta=0;
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

  if (bonusDef != 0){
    if (bonusDef<0) {
      changeSign=" ";
      displayPlayerCannotEffect();
    } else {
      changeSign=" +";
      displayPlayerGainedEffect();
    }
    playerDef += parseInt(bonusDef);
    if (bonusDef<0) playerDef=0;
    gainedString += changeSign+bonusDef + " 🔰";
    displayPlayerEffect("🔰");
    displayPlayerGainedEffect();
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
    if (enemyType=="Item") displayPlayerEffect(enemyEmoji);
  }

  if (hasAnyOf(attackTypes,enemyEmoji)&&enemyType=="Item") playerAttackType=enemyEmoji;

  if (castTypes.includes(enemyEmoji)) playerCastType=enemyEmoji;

  if (enemyEmoji=="⛺️") playerSleepType=enemyEmoji;

  if (enemyEmoji=="📣") playerSpeakType=enemyEmoji;

  if (logMessage) {
    logPlayerAction(actionIcon,gainedString);
  }
  if (moveForward) nextEncounter();
  return gainedString;
}

function playerConsumed(silent=false){
  var consumedString="Replenished resources"
  var sign = "";
  if (enemyType=="Consumable") var eatEmoji= "🍴"

  var missingHp=0;
  if (playerHp<playerHpMax) missingHp=parseInt(playerHpMax)-parseInt(playerHp);
  var missingSta=parseInt(playerStaMax)-parseInt(playerSta);
  var gainStamina=0;

  if (enemyMsg!="") consumedString=enemyMsg;

  if (enemyHp>0 || enemySta>0 || enemyAtk>0  || enemyLck>0  || enemyInt>0  || enemyMgk>0) {
    if (enemyMsg=="") consumedString="That was actually tasty";
  }

  //Recover stamina if not bad food
  if (enemyHp>=0 && enemySta>=0 && enemyAtk>=0  && enemyLck>=0  && enemyInt>=0  && enemyMgk>=0 && !enemyType.includes("Container")){
    if ((parseInt(missingSta)<=0 && enemySta==0) && playerHp>=playerHpMax) {
      gainStamina+=1;
      if (enemyMsg=="") consumedString="Got an energy bonus";
    } else {
      if (missingSta>0) gainStamina+=parseInt(missingSta)+parseInt(enemySta);
    }
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
  }

  if (enemyHp<0 || enemySta<0 || enemyAtk<0  || enemyLck<0  || enemyInt<0  || enemyMgk<0) {
    if (enemyMsg=="") consumedString="That did not taste good";
    if (enemyType=="Consumable") eatEmoji="🤮";
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
    if (enemyHp>=0) {
      hpChange+=parseInt(missingHp); //Another nasty hack, why is this so spaghetti
      sign=" +"
    }
    if (hpChange<0) {
      sign="";
      heart="💔";
    }
    if (hpChange>0) playerHp += hpChange;
    consumedString += " "+sign+parseInt(hpChange) + " "+heart+" ";
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
  }

  //Apply stat changes (except hp & sta)
  playerChangeStats(0,enemyAtk,0,enemyLck,enemyInt,enemyMgk,enemyDef,consumedString,!silent,false,eatEmoji);

  //Actually damages here, to log potential lucky dmg avoidance at the right time
  if (enemyHp<0) playerHit(-1*enemyHp,true,true);

  return consumedString;
}

function playerHit(incomingDamage,applyLuck=true,typeMagic=false) {
  var hitChance = Math.floor(Math.random() * luckInterval);

  if (applyLuck && ( hitChance <= playerLck )){
    logAction("🍀 ▸ 💢 <b>Luckily</b> avoided receiving the damage.");
    displayPlayerEffect("🍀");
    return;
  }

  if (procAbilityChance("🧼",100) && bubblesUsed==false && !enemyType.includes("consumable") && !enemyType.includes("trap") && !enemyType.includes("container")) {
    bubblesUsed=true;
    logAction("🫧 ▸ 💢 Damage repelled by <b>🫧 Protective Bubble</b>.");
    displayPlayerCannotEffect();
    displayPlayerEffect("🫧");
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

    var ress="";
    validRess.forEach((item, i) => {
      if (playerLootString.includes(item)) {
        ress=item;
        return true
        }
    });
    if (ress!="" && playerUseItem(ress,"n/a","n/a",true,true)){
      logAction("💀 ▸ "+ress+" Still allive thanks to <b>💀 Cheat Death</b>.");
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
    }

    isFishing = false;
    gameOver();
    return;
  }
  displayPlayerEffect("💢");
}

function playerUseItem(item,messageSuccess = "Used "+item+" from your inventory.",messageFail = "Requires "+item+" to continue.",effect=true,silent=false,consumeItem=true){
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

function playerWaive(){
  logPlayerAction(actionString,"Waived the <b>🏳️ White Flag</b>! -3 🧠");
  displayPlayerEffect("🏳️");
  playerInt-=3;
  nextEncounter();
  return false;
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
  curtainFadeInAndOut("<p style=\"color:"+colorGold+";-webkit-text-stroke: 6.5px black;paint-order: stroke fill;letter-spacing:1.8px;line-height:20px;font-size:52px;\">Reincarnated!</p><p style=\"font-size:20px;\""+decorateStatusText("","Remember what you've learned.",colorWhite),5);

  if (playerKarma>-5){ //TODO Revise this threshold
    var randomArea=chooseFrom(["Wildland Meadows","Forsaken Village","Twisted Fairyland", "River of Sorrows"]) //Consider any artifact from all areas except endgame
    var bonusItem=getRandomEncounter(["Item"],["Artifact"],randomArea);
    bonusItem=bonusItem.replaceAll(randomArea,"Wildland Meadows")

    var bonusWrapper=["area:Wildland Meadows","emoji:🎁","name:Pleasant Surprise","type:Container","hp:0","atk:0","sta:0","lck:0","int:0","mgk:0","def:0","note:Karma Bonus","desc:Received for being a good boy!<br>","message:Opened the mysterious gift box."]

    logAction("💚 ▸ 🎁 Eligible for a good karma bonus!");
    pushEncounter(bonusWrapper,2); //Adjust to tutorial length (below as well - increment if tut longer :sweat:
    pushEncounter(bonusItem,3);
  }
  playerKarma=1; //Reset on ress
  console.log("Karma reset: 1");
}

function checkPlayerHasItem(itemArray=validBaits){
  var bait="";
  itemArray.forEach((item, i) => {
    if (playerLootString.includes(item)) {
      bait=item;
      return true;
    }
  });
  return bait;
}

//End Game
function gameOver(silent=false){
  //Random death messages
  var deathMsg=["Your life has sliped into silence.","The last breath of life has faded.","You have ran out of blood.","Your adventure has ended.","Your life has ended, shadows remain.","Your life has withered away.","Your fate has been sealed forever.","The end has come\ darkness awaits.","Silence has taken the hold.","Your journey has ended here."]
  deathMsg=chooseFrom(deathMsg)

  //Reset progress to death encounter
  if ((enemyMsg=="")||(enemyType=="Pet")||(enemyType=="Altar")||(enemyType.includes("Container"))) enemyMsg=deathMsg;
  if (enemyTeam.includes("Lover's Memento")) enemyMsg="Killed by a severe heartbreak.";
  if (!silent) logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 "+enemyMsg);
  adventureEndTime=getTime();
  adventureEndReason="\nKilled by: "+enemyEmoji+" "+enemyName;
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  playerSta=0; //You are just tired when dead :)
  playerMgk=0;

  curtainFadeInAndOut("<p style=\"color:"+colorRed+";letter-spacing: 1.8px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:52px;line-height:20px;\">You died!</p><p style=\"font-size:20px;\""+decorateStatusText("",enemyMsg,colorWhite),5);
  animateUIElement(emojiWrapperUIElement,"animate__flipInY","1.2");
  nextEncounter();

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
  if (actionString.includes(" 🪙")) { //Ahhh, yeah more hacks at 1 AM
    var price = actionString.split(" ")[0] //Very much HACKS... YOLO!!!
    actionString=actionString.slice(2);
    actionString = actionString.replace("<br>"," -"+price+" 🪙"+"<br>");
  }
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
  if (text.includes("🪙")) { //HAAAACKKKK!!!
    var price = text.split(" ")[0]
    var item = text.split(" ")[2]
    document.getElementById(elementID).innerHTML=price+narrowSpace+"🪙 <b style=\"color:"+color+";\">"+item+"</b>";
  }
}

function resetEncounterButtons(){
  if (playerSta>0 && (!enemyType.includes("Dream"))){
    setButton('button_attack',playerAttackType+" Attack");
    setButton('button_block',"🔰 Block");
    setButton('button_roll',"🌀 Dodge");
  } else {
    setButton('button_attack',playerAttackType+" Attack",colorDarkGrey);
    setButton('button_block',"🔰 Block",colorDarkGrey);
    setButton('button_roll',"🌀 Dodge",colorDarkGrey);
  }

  if ((((enemyAtk+enemyAtkBonus)<=0)&&(enemyMgk<=0)&&(enemyType!="Death"))||enemyType=="Friend")  setButton('button_roll',"👣 Leave");
  setButton('button_grab',"👋 Grab");
  setButton('button_sleep',playerSleepType+" Sleep");
  if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',playerSleepType+" Sleep",colorLightBlue);
  if (playerXP>=playerXPThreshold) setButton('button_sleep',playerSleepType+" Sleep",colorGold);
  if (playerRested) setButton('button_sleep',"💤 Sleep",colorDarkGrey);

  setButton('button_speak',playerSpeakType+" Speak");
  setButton('button_cast',playerCastType+" Cast");
  setButton('button_curse',"🪬 Curse");
  setButton('button_pray',"❤️‍🩹 Heal");
  if (playerMgk<=0){
    setButton('button_cast',playerCastType+" Cast",colorDarkGrey);
    setButton('button_pray',"❤️‍🩹 Heal",colorDarkGrey);
    setButton('button_curse',"🪬 Curse",colorDarkGrey);
  }
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
      var drinks=["🧃","🍺","🍹","🍷","🍸","🍾","🧉","🥤","🧋","🍵","⚗️","🍶"]
      if (drinks.includes(enemyEmoji)) setButton("button_grab","👄 Drink",eatColor);

      break;

    case "Altar":
      setButton('button_pray',"🙏 Pray",colorWhite);
      if (!encounterUsed) setButton('button_pray',"🙏 Pray",colorYellow);
      var blade=checkPlayerHasItem(validBlades);
      if (blade!=""&&enemyHp<0) {
        setButton("button_pray","🩸 Offer",colorRed);
        if (encounterUsed) setButton('button_pray',"🩸 Offer",colorDarkGrey);
      }
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋ Touch";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      if (isFishing) setButton('button_roll',"❌ Ditch");
      if (enemyEmoji=="🛶" || areaName=="River of Sorrows") setButton("button_roll","🛶 Sail");
      break;

    case "Curse":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      document.getElementById('button_roll').innerHTML="👣 Ignore";
      document.getElementById('button_pray').innerHTML="🧠 Endure";
      setButton('button_sleep',"😵‍💫 Submit");
      break;

    case "Item":
      grabColor=colorWhite;
      if (enemyStatusString.includes("Valuable")||enemyStatusString.includes("Quest")) grabColor=colorYellow;
      if (enemyStatusString.includes("Magnificient")) grabColor=colorLightBlue;
      if (enemyStatusString.includes("Exquisite")) grabColor=colorPurple;
      if (enemyStatusString.includes("Legendary")) grabColor=colorOrange;
      setButton('button_grab',"👋 Grab",grabColor);
      setButton('button_roll',"❌ Ditch",colorRed);
      if (enemyTeam.includes("Lover's Memento")&&!encounterUsed) setButton('button_speak',"💔 Recall",colorRed);
      if (enemyTeam.includes("Lover's Memento")&&encounterUsed) setButton('button_speak',"💔 Recall",colorDarkGrey);
      if (enemyTeam.includes("Lover's Memento")) setButton('button_grab',"👋 Grab",colorGold);
      if (enemyEmoji=="🪙") setButton('button_grab',"👋 Claim",colorLightShadeBlue);
      break;

    case "Trap":
    case "Trap-Attack":
    case "Trap-Sleep":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      if (encounterUsed) setButton('button_grab',"✋ Reach",colorDarkGrey);
      document.getElementById('button_roll').innerHTML="👣 Avoid";
      break;

    case "Trap":
    case "Trap-Roll":
    case "Prop":
      if (areaName=="River of Sorrows") setButton("button_roll","🛶 Sail");
      document.getElementById('button_grab').innerHTML="✋ Reach";
      if (encounterUsed) setButton('button_grab',"✋ Reach",colorDarkGrey);
      document.getElementById('button_roll').innerHTML="👣 Walk";
      break;

    case "Dream":
      setButton('button_grab',"✋ Reach",colorDarkGrey);
      setButton('button_roll',"👣 Walk", colorGold);
      if (enemyName.includes("Waking Moment")) setButton('button_roll',"👁️ Awaken",colorGold);
      if (playerSta==0) setButton('button_roll',"👣 Walk",colorDarkGrey);
      setButton('button_speak',"💬 Speak",colorDarkGrey);
      setButton('button_sleep',"💤 Sleep",colorLightBlue);
      if (enemyName.includes("Waking Moment") || enemyName.includes("Horrific Realization")) setButton('button_sleep',"💤 Sleep",colorDarkGrey);
      if (areaName.includes("Shrouded")) setButton('button_sleep',"🧠 Think",colorRed);
      break;

    case "Fishing":
      if (areaName=="River of Sorrows") setButton("button_roll","🛶 Sail");
      document.getElementById('button_roll').innerHTML="👣 Walk";
      setButton('button_grab',"🎣 Fish",colorDarkGrey);
      var bait=checkPlayerHasItem();
      if (bait!="" && playerLootString.includes(bait)) setButton('button_grab',"🎣 Fish",colorYellow);
      break;

    case "Small":
      if (enemyInt>-1 && enemyInt<playerInt && enemyAtk>0) {
        setButton('button_speak',"💬 Defuse");
      } else if (playerLootString.includes("🏳️")) {
        setButton('button_speak',"🏳️ Waive");
      }
      setButton('button_sleep',"💤 Rest");
      break;

    case "Recruit":
      if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){ //If they are tired and you are smarter they join you
        setButton('button_speak',"💬 Recruit");
      } else if (playerLootString.includes("🏳️")) {
        setButton('button_speak',"🏳️ Waive");
      }
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) document.getElementById('button_grab').innerHTML="🦶 Kick";
      setButton('button_sleep',"💤 Rest");
      break;

    case "Friend":
      setButton('button_speak',playerSpeakType+" Speak",colorWhite);
      if (enemyStatusString.includes("Adversary")) setButton('button_speak',playerSpeakType+" Speak",colorWhite);

      var heldQuestItem=checkPlayerHasItem(enemyQuestItems);
      if (heldQuestItem!="") {
        setButton('button_speak',heldQuestItem+" Give",colorYellow);
      }
      break;

    case "Pet":
      if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)) document.getElementById('button_grab').innerHTML="👋 Pet";
      if (enemyInt>-1 && enemyInt<playerInt && enemyAtk>0) {
        setButton('button_speak',"💬 Defuse");
      } else if (playerLootString.includes("🏳️")) {
        setButton('button_speak',"🏳️ Waive");
      }
    case "Stingy":
    case "Toxic":
    case "Hot":
    case "Tough":
    case "Standard":
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) { //Applies for all above without "break;"
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      if (enemyInt>-1 && enemyInt<playerInt && enemyAtk>0) {
        setButton('button_speak',"💬 Defuse");
      } else if (playerLootString.includes("🏳️")) {
        setButton('button_speak',"🏳️ Waive");
      }
      setButton('button_sleep',"💤 Rest");
      break;

    case "Heavy":
    case "Swift":
    case "Reflective":
      if (enemySta-enemyStaLost==0) {
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      if (enemyInt>-1 && enemyInt<playerInt && enemyAtk>0) {
        setButton('button_speak',"💬 Defuse");
      } else if (playerLootString.includes("🏳️")) {
        setButton('button_speak',"🏳️ Waive");
      }
      setButton('button_sleep',"💤 Rest");
      break;

    case "Undead":
    case "Spirit":
    case "Demon":
      if (playerMgk>0) {
        setButton('button_pray',"🔥 Banish");
      } else {
        setButton('button_pray',"🔥 Banish",colorDarkGrey);
      }
      if (enemyType!="Undead" && enemyInt>-1 && enemyInt<playerInt && enemyAtk>0) {
        setButton('button_speak',"💬 Defuse");
      } else if (playerLootString.includes("🏳️")) {
        setButton('button_speak',"🏳️ Waive");
      }
      setButton('button_sleep',"💤 Rest");
      break;

    case "Death":
      setButton('button_grab',"💌 Review",colorPink);
      setButton('button_speak',"‍👤 Meet",colorLightBlue);
      setButton('button_curse',"‍🗣️ Share",colorLightBlue);
      setButton('button_cast',"‍🦆 Tweet",colorLightBlue);
      setButton('button_sleep',"📜 Legend",colorOrange);
      setButton('button_roll',"✨ Revive",colorYellow);
      break;

    case "Shop":
      setButton('button_attack',"1 🪙 Food",colorWhite);
        if ((savedCoins-spentCoins)<1) setButton('button_attack',"1 🪙 Food",colorDarkGrey);
      setButton('button_roll',"👣 Leave",colorRed);
      setButton('button_block',"2 🪙 Loot",colorWhite);
        if ((savedCoins-spentCoins)<2) setButton('button_block',"2 🪙 Loot",colorDarkGrey);

      setButton('button_grab',"4 🪙 Level",colorYellow);
        if ((savedCoins-spentCoins)<4) setButton('button_grab',"4 🪙 Loot",colorDarkGrey);
      setButton('button_sleep',"💤 Rest",colorDarkGrey);
      setButton('button_speak',"5 🪙 Artif.",colorOrange);
        if ((savedCoins-spentCoins)<5) setButton('button_speak',"5 🪙 Artif.",colorDarkGrey);

      setButton('button_cast',"‍-",colorDarkGrey);
      setButton('button_pray',"‍-",colorDarkGrey);
      setButton('button_curse',"-",colorDarkGrey);
      break;

    default:
      if (enemyType=="Checkpoint") setButton('button_grab',"✨ Praise",colorYellow)
      if (enemyType.includes("Heavy")||enemyType.includes("Swift")) {
        if (enemySta-enemyStaLost==0) document.getElementById('button_grab').innerHTML="🦶 Kick";
      } else {
        if (!enemyType.includes("Boss")) setButton('button_roll',"👣 Walk");
        if (enemyType.includes("Container")) setButton('button_grab',"👀 <b style=\"color:"+colorYellow+";\">Search</b>");
        if (enemyType.includes("Locked")){
          setButton('button_cast',"🪄 Unlock");
          if (playerMgk<2) setButton('button_cast',"🪄 Unlock",colorDarkGrey)
          if (playerLootString.includes("🗝️")){
            document.getElementById('button_grab').innerHTML="🗝️ Unlock";
          } else if (playerLootString.includes("📎")) {
            setButton('button_grab',"️📎 Unlock",colorOrange);
          } else {
          document.getElementById('button_grab').innerHTML="👋 Reach";
          }
        }
      }
      if (enemyType.includes("Boss")) {
        if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) document.getElementById('button_grab').innerHTML="🦶 Kick";
        setButton('button_sleep',"💤 Rest");
      }
      break;
  }
  //After all button manipulations
  if (enemyHp>0 && enemySta>0) {
    if (((enemyAtk+enemyAtkBonus)<=0)) setButton('button_block',"☝️ Tease")
    if (((enemyAtk+enemyAtkBonus)<=0) && playerSta<=0) setButton('button_block',"☝️ Tease",colorDarkGrey)
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

function curtainFadeInAndOut(message="",duration=3){
  var curtainUIElement = document.getElementById('id_fullscreen_curtain');
  var fullscreenTextUIElement = document.getElementById('id_fullscreen_text');

  animateUIElement(fullscreenTextUIElement,"animate__fadeIn",1.6,true,message);
  animateUIElement(curtainUIElement,"animate__fadeIn",1.5,true);

  var animationHandler = function(){
    setBackground(areaName);
    animateUIElement(curtainUIElement,"animate__fadeOut",duration,true);
    animateUIElement(fullscreenTextUIElement,"animate__fadeOut",duration,true,message);
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
  animateUIElement(emojiWrapperUIElement,"animate__headShake","0.7"); //Animate enemy not enough stamina
}

function displayEnemyDodgeEffect(){
  animateUIElement(emojiWrapperUIElement,"animate__shakeX","0.7");
}

function displayEnemyAttackEffect(){
  animateUIElement(emojiWrapperUIElement,"animate__bounce","0.7");
}

function displayEnemyRestEffect(){
  animateUIElement(emojiWrapperUIElement,"animate__pulse","0.7");
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

function setBackground(fileName="Depths.png"){
  var fileUrl='url(https://raw.githubusercontent.com/IGPenguin/stay-dead/refs/heads/live/assets/img/file.png)';
  fileUrl=fileUrl.replaceAll("file.png",fileName.split(" ")[0]+".png");
  var bodyUIElement = document.getElementsByTagName('body')[0];

  bodyUIElement.style.backgroundImage = fileUrl;
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
    adventureEndReason="\nDebug: "+enemyEmoji+" "+enemyName
    copyAdventureToClipboard();
    redraw();
  });

  document.getElementById('id_player_level').addEventListener(eventType, ()=>{
    var newName=renameCharacter();
    try {
      var nameNumber=newName.match(/\d+/)[0];
    } catch (error){
      console.log("try adding number");
    }
    var cheatAmount=3;

    if (newName.includes("Cheater")){
      if (!isNaN(nameNumber) && nameNumber>0) cheatAmount=parseInt(nameNumber);
      playerHpMax=cheatAmount;
      playerAtk=cheatAmount;
      playerStaMax=cheatAmount;
      playerMgkMax=cheatAmount;
      playerLck=cheatAmount;
      playerInt=cheatAmount;

      playerHp=playerHpMax;
      playerSta=playerStaMax;
      playerMgk=playerMgkMax;
      redraw();
    }

    if (newName.includes("Mucho Dinero")){
      savedCoins=69;
    }

    if (newName.includes("Cleaner")){
      localStorage.setItem('coins', 0);
      savedCoins=0;
    }
  });
}

//Social features
function generateCharacterShareString(){
  var characterShareString="";
    characterShareString+="<b>"+playerName+"</b> "+"•  Lvl "+playerLevel;
    characterShareString+="\n❤️ "+playerHpMax+"  🟢 "+playerStaMax+"  ⚔️ " +playerAtk;
    if (playerMgkMax>0) characterShareString+="  🔵 " + playerMgkMax;
    if ((playerPartyString.length+playerLootString.length)>0) characterShareString+="\n";
    if (playerPartyString.length > 0) characterShareString += playerPartyString;
    if (playerLootString.length > 0) characterShareString += playerLootString;
    characterShareString += "\nLifetime: "+adventureStartTime;
    characterShareString += "\n"+emptySpace+"→ "+adventureEndTime;
    characterShareString += " (✞"+playerKarma+")";
    //characterShareString += "\nKillcount: "+playerKills;
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

  characterLegend=generateCharacterShareString()+"\n\n"+characterLegend+"\n";
  characterLegend += "https://igpenguin.github.io/stay-dead";
  characterLegend +=  "\n"+ versionCode;

  return characterLegend;
}

function copyAdventureToClipboard(){
  var adventureLogClipboard = generateCharacterLegend();
  displayPlayerEffect("📜");
  logPlayerAction(actionString,"Recapped your legendary story.");

  //Copy to clipboard
  navigator.clipboard.writeText(adventureLogClipboard);

  //Download as .txt
  var fileName = "Stay-Dead-"+playerName.replaceAll(" ","-")+"-"+adventureEndTime.replaceAll(" at ","-").replaceAll(":","-")+".txt";
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

function shareTweet(){
  var tweetUrl = "http://twitter.com/intent/tweet?url=https://igpenguin.github.io/stay-dead&text=";
  window.open(tweetUrl+encodeURIComponent("Yo @IGPenguin, check out my Stay Dead run!"+"\n\n"+generateCharacterShareString().replaceAll("&nbsp"," ").replaceAll("<b>","").replaceAll("</b>","")+"\n"));
}

function shareLinkedIn(){
  var linkedInUrl = "https://www.linkedin.com/feed/?shareActive&mini=true&text=";
  window.open(linkedInUrl+encodeURIComponent("I just finished another Stay Dead playthrough!"+"\nIt's a data-driven rougelike RPG written in JS.\nCheck it out at: https://igpenguin.github.io/stay-dead\n\n"+generateCharacterShareString().replaceAll("&nbsp"," ").replaceAll("<b>","").replaceAll("</b>","")));
}

function visitLinkedIn(){
  var profileUrl = "https://www.linkedin.com/in/igpenguin/";
  window.open(profileUrl);
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

//Technical

function hasAnyOf(array=[],item){
  return array.includes(item);
}

function chooseFrom(array=[]){
  var options = array.length
  var choice = array[Math.floor(Math.random() * options)];
  return choice;
}

function randomNumber(min=0,max=1){
  return min+Math.floor(Math.random() * max);
}

function romanNumber (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}
