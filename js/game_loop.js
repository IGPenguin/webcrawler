//Having all this in a one file is truly shameful
//...submit a pull request if you dare

//Tech init
var versionCode = "fpm, ver. 9/24/24"
var cardUIElement;
var emojiUIElement;
var enemyInfoUIElement;
var playerInfoUIElement;
var toolbarCardUIElement;

var seenEncountersString = JSON.parse(localStorage.getItem("seenEncounters"));
var seenEncounters;
var randomEncounterIndex;
var encountersTotal;
var encounterIndex;
var lines;

if (seenEncountersString == null){
  seenEncounters = [];
} else {
  seenEncounters = Array.from(seenEncountersString); //Load seen encounters
}

//Player stats init
function renewPlayer(){
  playerHpMax=playerHpDefault;
  playerHp = playerHpMax;
  playerStaMax = playerStaDefault;
  playerSta = playerStaDefault;
  playerAtk = 1;
  playerDef = 0;
  playerInt = 1;
  playerMgkMax = playerMgkDefault;
  playerMgk = playerMgkDefault;
  playerLootString = "";
  playerPartyString = "";
  adventureLog = "";
}

//Generators
function getCharacterName(){
  const random_names = ["Nameless Hero", "Worthless Peasant", "Reincarnated Soul", "Wannabe Villain", "Promising Beggar", "Undead Lumberjack", "Penguin IV./XX.","Jesus H. Christ","Anthropomorphic Lizard","Unknown Soldier"];
  return random_names[Math.floor(Math.random() * random_names.length)];
}

var playerName = getCharacterName();
var playerLootString = "";
var playerPartyString = "";
var playerHpDefault = 2;
var playerStaDefault = 2;
var playerLckDefault = 0;
var playerMgkDefault = 1;

var playerHpMax = playerHpDefault;
var playerStaMax = playerStaDefault;
var playerMgkMax = playerMgkDefault;
var playerHp = playerHpMax;
var playerSta = playerStaMax;
var playerLck = playerLckDefault;
var playerMgk = playerMgkDefault;
var playerInt = 1;
var playerAtk = 1;

var luckInterval = 24; //Lower to increase chances

var actionString;
//Initial action log below
//var actionLog = "💤&nbsp;▸&nbsp;💭&nbsp;You hear some faint echoing screams.<br>💤&nbsp;▸&nbsp;💭&nbsp;It's pitch black, you can't see anything.<br>💤&nbsp;▸&nbsp;💭&nbsp;Some strange presence lurkes nearby.\n";
var actionLog = "💤&nbsp;▸&nbsp;💭 The mind dreams, the body sleeps.<br>&nbsp;<br>&nbsp;";
var adventureLog = actionLog;
var adventureEncounterCount = -1; // -1 for death
var adventureEndReason = "";

//Area init
var checkpointEncounter;
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
var enemyTeam;
var enemyDesc;
var enemyMsg;

var enemyHpLost = 0;
var enemyStaLost = 0;
var enemyAtkBonus = 0;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/encounters.csv",
        dataType: "text",
        success: function(data) {
          processData(data);
          registerClickListeners();
        }
     });
});

//Data logic

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
  loadEncounter(1);//Start from the first encounter (0 is dead)
  redraw();
}

function getNextEncounterIndex(){
  encountersTotal = lines.length-1;
  var nextItemIndex = encounterIndex+1;
  if (nextItemIndex > encountersTotal){ //Game Completed
    gameEnd();
    return 4; //Skip tutorial
  }
  return nextItemIndex;
}

function getUnseenEncounterIndex() { //Unused
  console.log("Already seen line indexes: " + seenEncounters);
  encountersTotal = lines.length;
  var max = encountersTotal;
    do {
      randomEncounterIndex = Math.floor(Math.random() * max);
      if (seenEncounters.length >= encountersTotal){
        gameEnd();
        break;
      }
    } while (seenEncounters.includes(randomEncounterIndex));
    return randomEncounterIndex;
}

function markAsSeen(seenID){
  if (!seenEncounters.includes(seenID)){
    seenEncounters.push(seenID);
    localStorage.setItem("seenEncounters", JSON.stringify(seenEncounters));
  }
}

function resetSeenEncounters(){
  localStorage.setItem("seenEncounters", JSON.stringify(""));
  seenEncounters = [];
}

function loadEncounter(index){
  encounterIndex = index;
  selectedLine = String(lines[index]);

  //Encounter data initialization, details in encounters.csv
  areaName = String(selectedLine.split(",")[0].split(":")[1]);
  enemyEmoji = String(selectedLine.split(",")[1].split(":")[1]);
  enemyName = String(selectedLine.split(",")[2].split(":")[1]);
  enemyType = String(selectedLine.split(",")[3].split(":")[1]);
  enemyHp = String(selectedLine.split(",")[4].split(":")[1]);
  enemyAtk = parseInt(String(selectedLine.split(",")[5].split(":")[1]))+enemyAtkBonus;
  enemySta = String(selectedLine.split(",")[6].split(":")[1]);
  enemyLck = String(selectedLine.split(",")[7].split(":")[1]);
  enemyInt = String(selectedLine.split(",")[8].split(":")[1]);
  enemyMgk = String(selectedLine.split(",")[9].split(":")[1]);
  enemyTeam = String(selectedLine.split(",")[10].split(":")[1]);
  enemyDesc = String(selectedLine.split(",")[11].split(":")[1]);
  enemyMsg = String(selectedLine.split(",")[12].split(":")[1]);
}

//UI Logic
function redraw(){
  //Version
  document.getElementById('id_version').innerHTML = versionCode;

  //Player UI
  playerInfoUIElement = document.getElementById('id_player_info');
  toolbarCardUIElement = document.getElementById('id_toolbar_card');
  document.getElementById('id_player_name').innerHTML = playerName;
  var playerStatusString = "❤️ " + "◆".repeat(playerHp) + "◇".repeat((-1)*(playerHp-playerHpMax));
  playerStatusString += "&nbsp;&nbsp;"
  playerStatusString += "&nbsp;&nbsp;🟢 " + "◆".repeat(playerSta) + "◇".repeat(playerStaMax-playerSta);
  playerStatusString += "&nbsp;&nbsp;"
  playerStatusString += "&nbsp;&nbsp;🔵 " + "◆".repeat(playerMgk) + "◇".repeat(playerMgkMax-playerMgk);
  playerStatusString += "&nbsp;&nbsp;"
  playerStatusString += "&nbsp;&nbsp;⚔️ " + "◆".repeat(playerAtk);
  document.getElementById('id_player_status').innerHTML = playerStatusString;
  document.getElementById('id_player_party_loot').innerHTML = "";
  if (playerPartyString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "<b>Party:</b> " +playerPartyString;
  }
  if (playerLootString.length > 0) {
    document.getElementById('id_player_party_loot').innerHTML += "&nbsp;<b>Loot:</b> "+playerLootString;
  }
  if (playerPartyString.length+playerLootString.length == 0) {
    document.getElementById('id_player_party_loot').innerHTML = "∙∙∙";
  }

  //Encounter UI
  cardUIElement = document.getElementById('id_card');
  enemyInfoUIElement = document.getElementById('id_enemy_card_contents'); //This is just for animations, so :shrug:
  emojiUIElement = document.getElementById('id_emoji');

  emojiUIElement.innerHTML = enemyEmoji;
  document.getElementById('id_area').innerHTML = areaName;
  document.getElementById('id_name').innerHTML = enemyName;
  document.getElementById('id_desc').innerHTML = enemyDesc;
  document.getElementById('id_team').innerHTML = "—&nbsp;"+enemyTeam;

  //Encounter Statusbar UI
  var enemyStatusString = ""
  if (enemyHp > 0) { enemyStatusString = "❤️ " + "◆".repeat(enemyHp);}
    if (enemyHpLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyHpLost) + "◇".repeat(enemyHpLost); } //YOLO

  enemyStatusString += "&nbsp;&nbsp;"

  if (enemySta > 0) { enemyStatusString += "&nbsp;🟢 " + "◆".repeat(enemySta);}
    if (enemyStaLost > 0) { enemyStatusString = enemyStatusString.slice(0,-1*enemyStaLost) + "◇".repeat(enemyStaLost); } //YOLO

  enemyStatusString += "&nbsp;&nbsp;"

  enemyStatusString += "&nbsp;⚔️ " + "◆".repeat(enemyAtk)
  if (enemyAtkBonus<0) { enemyStatusString += "◇".repeat(-1*enemyAtkBonus); }

  enemyStatusString += "&nbsp;&nbsp;"

  if (enemyMgk > 0) {enemyStatusString += "&nbsp;🔵 " + "◆".repeat(enemyAtk);}
      //else { enemyStatusString += "&nbsp;🔵 " + "〜";} //TODO: Maybe show 0 magic?

  switch(enemyType){
    case "Standard":
    case "Recruit":
    case "Pet":
    case "Swift":
    case "Heavy":
    case "Demon":
    case "Spirit":
      break; //Show default - HP, Sta + dmg
    case "Item":
    case "Trap":
    case "Friend":
      enemyStatusString = "";
      if (enemyHp>0) {enemyStatusString += "❤️ ??&nbsp;&nbsp;";}
      if (enemyAtk>0) {enemyStatusString += "⚔️ ??&nbsp;&nbsp;";}
      if (enemySta>0) {enemyStatusString += "🟢 ??&nbsp;&nbsp;";}
      if (enemyLck>0) {enemyStatusString += "🍀 ??&nbsp;&nbsp;";}
      if (enemyInt>0) {enemyStatusString += "🧠 ??&nbsp;&nbsp;";}
      break;
    case "Consumable":
      enemyStatusString = "❤️ <b>+</b>&nbsp;&nbsp;🟢 <b>+</b>";
      break;
    default:
      enemyStatusString = "⁉️ 〜"; //Dream, Prop, Upgrade etc.
      break;
  }

  document.getElementById('id_stats').innerHTML = enemyStatusString;
  document.getElementById('id_log').innerHTML = actionLog;
  adjustEncounterButtons();
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
        if (enemyType!="Upgrade" && !playerUseStamina(1,"Too tired to attack anything.")){
            break;
          }
        switch (enemyType){
          case "Trap":
          case "Trap-Roll":
            logPlayerAction(actionString,"Smashed it into tiny pieces -1 🟢");
            nextEncounter();
            break;
          case "Trap-Attack": //Attacking causes you damage
          case "Spirit":
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" ❤️");
            playerHit(enemyAtk);
            break;
          case "Item":
          case "Consumable":
          case "Container":
            var openMessage = "Smashed it open -1 🟢";
            if (enemyMsg != ""){
              openMessage = enemyMsg.replace("."," -1 🟢");
            }
            logPlayerAction(actionString,openMessage);
            displayEnemyEffect("〽️");
            enemyAnimateDeathNextEncounter();
            break;
          case "Friend":
            logPlayerAction(actionString,"Attacked and spooked them -1 🟢");
            displayEnemyEffect("〽️");
            nextEncounter();
            break;

          case "Standard": //You hit first, they hit back if they have stamina
          case "Undead":
          case "Demon":
          case "Heavy":
          case "Recruit":
          case "Pet":
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

          case "Death":
            displayPlayerCannotEffect();
            logPlayerAction(actionString,"There is nothing to attack anymore.");
            break

          case "Upgrade":
          logPlayerAction(actionString,"Felt becoming a bit stronger.");
          displayPlayerEffect("✨");
            playerHpMax+=1;
            playerHp+=1;
            playerSta+=1; //Restore lost stamina from initial attack
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"The attack had no effect -1 🟢");
            displayEnemyEffect("〽️");
      }
      break;

      case 'button_roll': //Stamina not needed for non-enemies + dodge handling per enemy type
        const noStaForRollMessage = "Too tired to make any move.";
        switch (enemyType){ //Dodge attack
          case "Standard":
          case "Undead":
          case "Recruit":
          case "Pet":
          case "Demon":
          case "Spirit":
            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"Dodged their standard attack -1 🟢","The roll was a waste of energy -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;

          case "Swift":
            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"Failed to dodge the attack -"+enemyAtk+" 💔","Rolled into a surprise attack -"+enemyAtk+" 💔");
              playerHit(enemyAtk);
            }
            break;

          case "Heavy":
            if (playerUseStamina(1,noStaForRollMessage)){
              enemyStaminaChangeMessage(-1,"Dodged their heavy attack -1 🟢","Rolled around wasting energy  -1 🟢");
              displayPlayerEffect("🌀");
            }
            break;

          case "Item": //You'll simply skip ahead
          case "Consumable":
          case "Checkpoint":
            logPlayerAction(actionString,"Walked away leaving it behind.");
            nextEncounter();
            break;
          case "Container":
          case "Altar":
            logPlayerAction(actionString,"Left without investigating it.");
            encounterIndex+=1; //Skip loot
            nextEncounter();
            break;
          case "Dream":
            logPlayerAction(actionString,"Continued onwards, feeling anxious.");
            nextEncounter();
            break;
          case "Prop":
            logPlayerAction(actionString,"Continued on their adventure.");
            nextEncounter();
            break;
          case "Friend":
            logPlayerAction(actionString,"Walked away leaving them behind.");
            nextEncounter();
            break;

          case "Trap-Roll": //You get damage rolling into "Trap-Roll" type encounters
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            break;
          case "Trap":
          case "Trap-Attack":
            logPlayerAction(actionString,"Continued onwards, away from that.");
            nextEncounter();
            break;

          case "Death":
            displayPlayerCannotEffect();
            logPlayerAction(actionString,"There is nothing to dodge anymore.");
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Felt their body become faster.");
            displayPlayerEffect("✨");
            playerStaMax+=1;
            playerSta+=1;
            nextEncounter();
            break;
          default:
            logPlayerAction(actionString,"Felt like nothing really happened.");
        }
        break;

      case 'button_block':
        if (enemyType == "Upgrade"){
          logPlayerAction(actionString,"Felt getting somewhat wiser.");
          displayPlayerEffect("🧠");
          playerInt+=1;
          nextEncounter();
          break;
        }
        if (!playerUseStamina(1,"Was too tired to raise the shield.")){
            break;
          }
        switch (enemyType){
          case "Standard":
          case "Undead":
          case "Recruit":
          case "Pet":
          case "Demon":
            enemyStaminaChangeMessage(-1,"Blocked their normal attack -1 🟢","Blocked absolutely nothing -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Swift":
            enemyStaminaChangeMessage(-1,"Blocked their swift attack -1 🟢","Blocked absolutely nothing -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Heavy": //Too heavy or spirit attack
          case "Spirit":
            if (enemyStaminaChangeMessage(-1,"Could not block their blow -"+enemyAtk+" 💔","n/a")){
              playerHit(enemyAtk);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","Blocked, but was not attacked -1 🟢");
            }
            break;

          case "Death":
              displayPlayerCannotEffect();
              logPlayerAction(actionString,"There is nothing to block anymore.");
              break;
          default:
            logPlayerAction(actionString,"Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
        }
        break;

        case 'button_cast':
          if ((enemyType!="Upgrade" && enemyType!="Death") && !playerUseMagic(1,"Not enough magic power.")) { break; }
          if (enemyType!="Death") {displayPlayerEffect("🪄");} //I'm lazy
        switch (enemyType){
          case "Recruit": //You should be faster if you have Mgk >= them
          case "Standard":
          case "Swift":
          case "Heavy":
          case "Pet":
          case "Swift":
          case "Spirit":
          case "Demon":
          case "Undead":
          case "Friend":
            if (enemyMgk<=playerMgk){
              enemyHit(playerMgk+1,true); //Deal damage equal to your power before using it
            } else {
              logPlayerAction(actionString,"They resisted the spell -1 🔵");
            }
            if (enemyHp-enemyHpLost > 0) { //If they survive, they counterattack or regain stamina
              enemyAttackOrRest();
            }
            break;

          case "Friend": //They'll be hit (above) and then get angry //TODO: Check this, they might not get hit
            logPlayerAction(actionString,"The spell turned them adversary -1 🔵");
            displayEnemyEffect("‼️");
            enemyType="Standard";
            break;

          case "Item":
          case "Consumable":
          case "Container":
            var openMessage = "The magic power anihilated it -1 🔵";
            logPlayerAction(actionString,openMessage);
            displayEnemyEffect("〽️");
            enemyAnimateDeathNextEncounter();
            break;

          case "Dream":
            logPlayerAction(actionString,"Spent magic power on dreaming -1 🔵");
            break;

          case "Altar":
            logPlayerAction(actionString,"The spell has trashed the place -1 🔵");
            nextEncounter();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Chose magic +2 🔵 over agility -1 🟢");
            playerMgkMax+=2;
            playerMgk+=2;
            playerStaMax-=1;
            playerSta-=1;
            nextEncounter();
            break;

          case "Death": //TODO: Maybe I'll come up with something later
            displayPlayerCannotEffect();
            logPlayerAction(actionString,"Magic powers already faded away.");
            break;

          default:
            logPlayerAction(actionString,"Wasted magic power on nothing -1 🔵");
        }
        break;

        case 'button_curse': //TODO: Boosts undead and demon, curse basic enemies if Mgk > them, what else?
        if ((enemyType!="Upgrade" && enemyType!="Death") && !playerUseMagic(1,"Not enough magic power.")) { break; }
        if (enemyType!="Death") {displayPlayerEffect("🪬");}

        switch (enemyType){
          case "Undead":
          case "Demon":
              logPlayerAction(actionString,"The curse made them even stronger!");
              animateUIElement(enemyInfoUIElement,"animate__tada","1"); //Animate enemy gain
              enemyAtkBonus+=1;
              break;

          case "Standard": //Reduce enemy atk if mgk stronger then them
          case "Recruit":
          case "Swift":
          case "Heavy":
          case "Pet":
            if (playerMgkMax > enemyMgk && (enemyAtkBonus+enemyAtk)>0) {
              enemyAtkBonus-=1;
              logPlayerAction(actionString,"The curse made them weaker -1 🔵");
            } else if (playerMgkMax <= enemyMgk) {
              logPlayerAction(actionString,"They resisted the curse -1 🔵");
            } else {
              logPlayerAction(actionString,"The curse had no effect on them -1 🔵");
            }
            enemyAttackOrRest();
            break;

          case "Spirit": //They don't care
            logPlayerAction(actionString,"The curse had no effect on it -1 🔵");
            break;

          case "Friend": //They'll boost your stats
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt);
            displayPlayerEffect("💬");
            break;

          case "Dream":
            logPlayerAction(actionString,"Conjured themselves an extra nightmare -1 💔");
            playerHit(1);
            displayPlayerCannotEffect();
            break;

          case "Altar":
            logPlayerAction(actionString,"The curse has angered the gods -1 🍀");
            playerLck=-1;
            displayPlayerEffect("🪬");
            nextEncounter();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Sacrificed health -1 💔 for power +2 🔵");
            playerHit(1);
            playerHpMax-=1;
            playerMgkMax+=2;
            playerMgk+=2;
            nextEncounter();
            break;

          case "Death": //TODO: Maybe I'll come up with something later
            displayPlayerCannotEffect();
            logPlayerAction(actionString,"Cannot move the lips to curse anymore.");
            break;

          default:
            logPlayerAction(actionString,"The curse dispersed into the area -1 🔵");
        }
        break;

        case 'button_pray': //TODO:Banish demons, weaken undead, heal in combat, lift curse from artefacts
          if ((enemyType!="Upgrade" && enemyType!="Death") && !playerUseMagic(1,"Not enough magic power.")) { break; }
          if (enemyType!="Death") {displayPlayerEffect("🙏");}

        switch (enemyType){
          case "Spirit":
          case "Demon":
            console.log("player mgk: "+playerMgk+" vs enemy mgk: "+enemyMgk)
            if ( enemyMgk <= playerMgk+1 ){ // +1 cause player already used mana
              logPlayerAction(actionString,"Banished them from this world!");
              enemyAnimateDeathNextEncounter();
              break;
            } else {
              logPlayerAction(actionString,"Could not overpower this entity!");
            }
            enemyAttackOrRest();
            break;

          case "Standard":
          case "Recruit":
          case "Swift":
          case "Heavy":
          case "Pet":
            if (playerHp<playerHpMax) {
              playerHp++
              logPlayerAction(actionString,"The gods fulfiled the prayer +1 ❤️‍🩹");
            } else {
              logPlayerAction(actionString,"Wasted magic on a healing prayer -1 🔵");
            }
            enemyAttackOrRest();
            break;

          case "Undead": //Reduce attack if possible
            if (playerMgkMax > enemyMgk && (enemyAtkBonus+enemyAtk)>0) {
              enemyAtkBonus-=1;
              logPlayerAction(actionString,"The prayer made them weaker -1 🔵");
            } else if (playerMgkMax <= enemyMgk) {
              logPlayerAction(actionString,"They resisted the prayer -1 🔵");
            } else {
              logPlayerAction(actionString,"The prayer had no effect on them -1 🔵");
            }
            enemyAttackOrRest();
            break;

          case "Friend": //They'll boost your stats
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMkg);
            break;

          case "Dream":
            logPlayerAction(actionString,"Appreciated a deep sleep prayer +1 🍀");
            playerLck++;
            nextEncounter();
            break;

          case "Altar":
            var hpDiff= playerHpMax-playerHp;
            if (hpDiff>0) {
              logPlayerAction(actionString,"A heavenly ray healed all wounds +"+hpDiff+" ❤️");
              playerHp=playerHpMax;
            } else {
              logPlayerAction(actionString,"The heavens granted a blessing +1 🍀");
              playerLck+=1;
            }
            nextEncounter();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"The prayer has been heard +1 🔵");
            playerMgkMax+=1;
            playerMgk+=1;
            nextEncounter();
            break;

          case "Death": //TODO: Maybe I'll come up with something later
            logPlayerAction(actionString,"It's way too late for prayers.");
            displayPlayerCannotEffect();
            break;

          default:
            logPlayerAction(actionString,"The prayer had no visible effect -1 🔵");
        }
        break;

      case 'button_grab': //Player vs encounter stamina decides the success
        switch (enemyType){
          case "Pet": //Can become pet it when the player has higher current stamina
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){
              if (enemyInt > playerInt ) { //Cannot become a party member if it has higher int than the player
                logPlayerAction(actionString,"They got scared due to lack of empathy.");
                enemyAttackOrRest();
                break;
              }
              logPlayerAction(actionString,"They agreed to join the adventure!");
              displayPlayerEffect(enemyEmoji);
              playerPartyString+=" "+enemyEmoji;
              playerAtk+=enemyAtk;
              enemyAnimateDeathNextEncounter();
              break;
            }

          case "Recruit": //Player vs encounter stamina - knockout, dodge or asymmetrical rest
          case "Standard":
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){ //If they are tired and player has stamina
              logPlayerAction(actionString,"Knocked them out harmlessly.");
              enemyKnockedOut();
            } else if (enemySta - enemyStaLost > 0){ //Enemy dodges if they got stamina
              var touchChance = Math.floor(Math.random() * luckInterval);
              console.log("touchChance: "+touchChance+"/"+luckInterval+" lck: "+playerLck) //Generous chance to make enemy uncomfortable
              if ( touchChance <= playerLck ){
                logAction("🍀 ▸ ✋ They were spooked by the touch.");
                displayPlayerEffect("🍀");
                nextEncounter();
                break;
              }
              else {
                displayPlayerCannotEffect();
                enemyAttackOrRest();
                logPlayerAction(actionString,"Reached out too slowly, they dodged that.");
              }
            } else { //Player and enemy have no stamina - asymetrical rest
              enemyKicked();
            }
            break;

          case "Swift": //Player can only kick tired swift enemies
          case "Demon":
            if (enemySta-enemyStaLost == 0){
              enemyKicked();
              break;
            }
            logPlayerAction(actionString,"They effortlessly evaded the grasp.");
            displayEnemyEffect("🌀");
            enemyAttackOrRest();
            break;

          case "Heavy":
            if (enemySta - enemyStaLost > 0){ //Enemy hits extra hard if they got stamina
              logPlayerAction(actionString,"Got overpowered and hit extra hard -"+enemyAtk*2+" 💔");
              playerHit(enemyAtk+2);
            } else { //Enemy has no stamina - asymetrical rest
              enemyKicked();
            }
            break;

          case "Trap": //Grabbing is not safe
          case "Trap-Roll":
          case "Trap-Attack":
          case "Undead":
            logPlayerAction(actionString,enemyMsg+" -"+enemyAtk+" 💔");
            playerHit(enemyAtk);
            displayEnemyEffect("✋");
            break;

          case "Container":
            var openMessage = "Sucesfully found something.";
            displayEnemyEffect("👋");
            if (enemyMsg != ""){
              openMessage = enemyMsg;
            }
            logPlayerAction(actionString,openMessage);
            nextEncounter();
            break;

          case "Item":
            playerLootString+=" "+enemyEmoji;
            displayEnemyEffect("✋");
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt,enemyMgk);
            break;

          case "Friend":
            logPlayerAction(actionString,"The touch was not appreciated.");
            displayEnemyEffect("✋");
            nextEncounter();
            break;

          case "Consumable":
            playerConsumed();
            displayEnemyEffect("🍽");
            enemyAnimateDeathNextEncounter();
            break;

          case "Dream":
          case "Spirit":
            logPlayerAction(actionString,"Grasped right through them.");
            displayEnemyEffect("✋");
            break;

          case "Death":
            logPlayerAction(actionString,"Got reconnected with the soul.");
            displayEnemyEffect("✋");

            // Avoid log spam
            // var deathMessage="💤&nbsp;▸&nbsp;💭&nbsp;An unknown power resurrected you.<br>💤&nbsp;▸&nbsp;💭&nbsp;Hopefully it wasn't some tainted spell.";
            // logAction(deathMessage);

            if (checkpointEncounter == null){
              renewPlayer();
              encounterIndex=3; //Skip tutorial
            } else {
              //TODO load playerStats to prevent stacking via resurrecting on checkpoints
              encounterIndex=checkpointEncounter-1; //Start from checkpoint
              playerHp=playerHpMax;
              playerSta=playerStaMax;
            }
            adventureEncounterCount = -1; //For death
            nextEncounter();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Felt the chances increased +1 🍀");
            displayPlayerEffect("🍀");
            playerLck+=1;
            nextEncounter();
            break;

          case "Checkpoint": //Save and rest to full HP and Sta
            displayPlayerEffect("💾");
            logPlayerAction(actionString,"Embraced the "+enemyName+".");
            playerGetStamina(playerStaMax-playerSta,true);
            playerHp=playerHpMax;
            checkpointEncounter=encounterIndex;
            enemyAnimateDeathNextEncounter();
            curtainFadeInAndOut("<p style=\"color:#EEBC1D; -webkit-text-stroke: 6.5px black;\">&nbsp;Flame Embraced&nbsp;");
            break;
          default:
            logPlayerAction(actionString,"Touched it, nothing happened.");
            displayEnemyEffect("✋");
          }
        break;

      case 'button_speak':
        switch (enemyType){
          case "Recruit": //If they are tired and you are smarter they join you
            if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){
              logPlayerAction(actionString,"Convinced them to join the adventure!");
              displayPlayerEffect(enemyEmoji);
              animateUIElement(playerInfoUIElement,"animate__tada","1"); //Animate player gain
              playerPartyString+=" "+enemyEmoji
              playerAtk+=enemyAtk;
              enemyAnimateDeathNextEncounter();
              break;
            }

          case "Standard": //If they are dumber they will walk away
          case "Swift":
          case "Heavy":
          case "Pet":
          case "Spirit":
          case "Demon":
            if (enemyInt < playerInt){
              logPlayerAction(actionString,"Convinced them to disengage.");
              displayPlayerEffect("💬");
              nextEncounter();
              break;
            } else if ((enemyInt > (playerInt+2)) && enemyAtkBonus < 2) {
              logPlayerAction(actionString,"They strongly despised the remarks!");
              displayPlayerEffect("💬");
              enemyAtkBonus+=1;
            } else {
              var speechChance = Math.floor(Math.random() * luckInterval);
              if ( speechChance <= playerLck ){
                logAction("🍀 ▸ 💬 They believed the lies and left.");
                displayPlayerEffect("💬");
                nextEncounter();
                break;
              }
              else {
                logPlayerAction(actionString,"They ignored whatever has been said.");
              }
            }
            enemyAttackOrRest();
            break;

          case "Undead": //They don't care
            logPlayerAction(actionString,"They ignored whatever has been said.");
            break;

          case "Friend": //They'll boost your stats
            playerGainedItem(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk);
            displayPlayerEffect("💬");
            break;

          case "Death":
            copyAdventureToClipboard();
            break;

          case "Dream":
            logPlayerAction(actionString,"Cannot move the lips to speak.");
            displayPlayerCannotEffect();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Sacrificed health -1 💔 to get lucky +3 🍀");
            playerUseStamina(1);
            playerHpMax-=1;
            playerHp-=1
            playerLck+=3;
            displayPlayerEffect("🪙");
            nextEncounter();
            break;

          default:
            logPlayerAction(actionString,"The voice echoed around the area.");
            displayPlayerEffect("💬");
        }
        break;

      case 'button_sleep':
        switch (enemyType){
          case "Standard": //You get hit if they have stamina
          case "Swift":
          case "Heavy":
          case "Recruit":
          case "Pet":
          case "Spirit":
          case "Demon":
          case "Undead":
            enemyAttackOrRest();
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
          case "Dream":
          case "Container":
          case "Checkpoint":
          case "Altar":
            displayPlayerEffect("💤");
            playerGetStamina(playerStaMax-playerSta,true);
            playerMgk=playerMgkMax;
            logPlayerAction(actionString,"Rested well, recovering all powers.");
            break;

          case "Friend": //They'll leave if you'll rest
            displayPlayerEffect("💤");
            playerGetStamina(playerStaMax-playerSta);
            logPlayerAction(actionString,"They got tired of waiting and left.");
            nextEncounter();
            break;

          case "Death":
            redirectToTweet();
            break;

          case "Upgrade":
            logPlayerAction(actionString,"Decided against gaining a perk.");
            nextEncounter();
            break;

          default:
            logPlayerAction(actionString,"Cannot rest, monsters are nearby.");
            displayPlayerCannotEffect();
            displayPlayerEffect("👀");
            break;
        }
    };
    loadEncounter(encounterIndex);
    redraw();
  };
}

//Enemy
function enemyRenew(){
  enemyStaLost = 0;
  enemyHpLost = 0;
  enemyAtkBonus = 0;
}

function enemyRest(stamina){
  if (enemyHp - enemyHpLost > 0){
    animateUIElement(enemyInfoUIElement,"animate__pulse","0.4"); //Animate enemy rest
    enemyStaLost-=stamina;
    if (enemyStaLost < 0) {
      enemyStaLost = 0;
    }
  }
}

function enemyStaminaChangeMessage(stamina,successMessage,failMessage){
  if (enemyStaLost < enemySta) {
    logPlayerAction(actionString,successMessage);
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

function enemyHit(damage,magicType=false){
  var hitMsg = "Hit them with an attack -"+damage+" 💔";
  if (magicType==true) {actionString="🪄 "; hitMsg="Scorched them with a spell -"+damage+" 💔";}

  displayEnemyEffect("💢");
  var critChance = Math.floor(Math.random() * luckInterval);
  console.log("critChance: "+critChance+"/"+luckInterval+" lck: "+playerLck) //Chance to crit
  if ( critChance <= playerLck ){
    logAction("🍀 ▸ ⚔️ The strike was blessed with luck.");
    hitMsg="The attack hit them critically -"+(damage+2)+" 💔";
    displayPlayerEffect("🍀");
    damage+=2;
  }

  logPlayerAction(actionString,hitMsg);
  enemyHpLost = enemyHpLost + damage;

  if (enemyHpLost >= enemyHp) {
    enemyHpLost=enemyHp; //Negate overkill damage
    logAction(enemyEmoji + "&nbsp;▸&nbsp;" + "💀 Successfully eliminated them.");
    enemyAnimateDeathNextEncounter();
  } else {
    animateUIElement(enemyInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
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
  enemyAnimateDeathNextEncounter();
}

function enemyAttackOrRest(){
  var staminaChangeMsg;
  if (enemySta-enemyStaLost > 0) {
    if (enemyType!="Demon"){staminaChangeMsg = "The enemy attacked -"+enemyAtk+" 💔"}
    else {
        staminaChangeMsg = "The enemy siphoned health -"+enemyAtk+" 💔";
        if (enemyHpLost >0) {enemyHpLost-=1;}
      }
    if (enemyAtk+enemyAtkBonus<=0){
      staminaChangeMsg="The enemy is too weak to do any harm."
    } else {
      enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a");
      playerHit(enemyAtk+enemyAtkBonus);
      return;
    }
    enemyStaminaChangeMessage(-1,staminaChangeMsg,"n/a");
  } else {
    enemyRest(1);
  }
}

function nextEncounter(){
  animateVersus(1);
  adventureEncounterCount+=1;
  markAsSeen(encounterIndex);
  encounterIndex = getNextEncounterIndex();

  //Fullscreen Curtain
  previousArea = areaName;
  enemyRenew();
  loadEncounter(encounterIndex);
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm")){ //Does not animate new area when killed
    curtainFadeInAndOut("&nbsp;"+areaName+"&nbsp;");
  }
  animateUIElement(cardUIElement,"animate__fadeIn","0.8");
}

function enemyAnimateDeathNextEncounter(){
  animateUIElement(cardUIElement,"animate__flipOutY","1"); //Maybe this will look better?
  //animateUIElement(cardUIElement,"animate__fadeOutDown","0.75");
  var animationHandler = function(){
    nextEncounter();
    redraw();
    cardUIElement.removeEventListener("animationend",animationHandler);
  }
  cardUIElement.addEventListener('animationend',animationHandler);
}

function animateVersus(time = "1"){
  var versusText = document.getElementById('id_versus');
  animateUIElement(versusText,"animate__fadeIn",time);
}

//Player
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

function playerGainedItem(bonusHp,bonusAtk,bonusSta,bonusLck,bonusInt,bonusMkg){
  var gainedString;
  if (enemyMsg != "") {
    gainedString = enemyMsg;
  } else {
    gainedString="Felt becoming stronger";
  }

  if ((bonusHp+bonusAtk+bonusSta+bonusLck+bonusInt+bonusMkg)<=0){ //TODO: Properly support negative gains = curses
    displayPlayerEffect("🪬");
    gainedString="Got cursed by the gods"+bonusMkg+" 🔵";
  }

  if (bonusHp > 0) {
    playerHpMax += parseInt(bonusHp);
    playerHp += parseInt(bonusHp);
    gainedString += " +"+bonusHp + " ❤️";
    displayPlayerEffect("✨");
  }
  if (bonusAtk > 0){
    playerAtk += parseInt(bonusAtk);
    gainedString += " +"+bonusAtk + " ⚔️";
    displayPlayerEffect("✨");
  }
  if (bonusSta > 0){
    playerStaMax += parseInt(bonusSta);
    playerSta += parseInt(bonusSta);
    gainedString += " +"+bonusSta + " 🟢";
    displayPlayerEffect("✨");
  }
  if (bonusLck > 0){
    playerLck += parseInt(bonusLck);
    gainedString += " +"+bonusLck + " 🍀";
    displayPlayerEffect("🍀");
  }
  if (bonusInt > 0){
    playerInt += parseInt(bonusInt);
    gainedString += " +"+bonusInt + " 🧠";
    displayPlayerEffect("🧠");
  }

  animateUIElement(playerInfoUIElement,"animate__tada","1"); //Animate player gain
  logPlayerAction(actionString,gainedString);
  nextEncounter();
}

function playerConsumed(){
  var consumedString = "Mmm, that was refreshing "

  var missingHp=playerHpMax-playerHp;
  var missingSta=playerStaMax-playerSta;

  if ((missingHp > 0) || (missingSta > 0)){

    if (missingHp > 0){
      playerHp += missingHp;
      consumedString += "+"+missingHp + " ❤️ ";
    }

    if (missingSta > 0){
      playerGetStamina(missingSta,true);
      consumedString += "+"+missingSta + " 🟢";
    }
    animateUIElement(playerInfoUIElement,"animate__pulse","0.4"); //Animate player rest
  } else {
    var tooFullStaLost = 2;
    consumedString="Lost energy due to overeating -"+tooFullStaLost+" 🟢";
    animateUIElement(toolbarCardUIElement,"animate__shakeX","0.5"); //Animate hitreact
    playerUseStamina(tooFullStaLost);
  }
  logPlayerAction(actionString,consumedString);
}

function playerHit(incomingDamage){
  var hitChance = Math.floor(Math.random() * luckInterval);
  console.log("hitChance: "+hitChance+"/"+luckInterval+" lck: "+playerLck) //Chance to not get hit
  if ( hitChance <= playerLck ){
    logAction("🍀&nbsp;▸&nbsp;💢 Luckily avoided receiving the damage.");
    displayPlayerEffect("🍀");
    return;
  }

  playerHp = playerHp - incomingDamage;
  animateUIElement(playerInfoUIElement,"animate__shakeX","0.5"); //Animate hitreact
  if (playerHp <= 0){
    playerHp=0; //Prevent redraw issues post-overkill
    var deathChance = Math.floor(Math.random() * luckInterval * 3); //Small chance to not die
    console.log("deathChance: "+deathChance+"/"+(luckInterval*3)+" lck: "+playerLck)
    if ( deathChance <= playerLck ){
      playerHp+=1;
      logAction("🍀&nbsp;▸&nbsp;💀 Luckily got a second chance to live.");
      displayPlayerEffect("🍀");
      return;
    }
    gameOver();
    return;
  }
  displayPlayerEffect("💢");
}

//End Game
function gameOver(){
  //Reset progress to death encounter
  logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 Got killed, ending the adventure. ");
  adventureEndReason="\nDefeated by: "+enemyEmoji+" "+enemyName;
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  nextEncounter();
  animateUIElement(cardUIElement,"animate__flip","1");
  playerSta=0; //You are just tired when dead :)
  resetSeenEncounters();
}

function gameEnd(){
  var winMessage="🧠 ▸ 💭 Just had a deja vu, feels really familiar (NG+).";
  logAction(winMessage);

  //Reset progress to game start
  resetSeenEncounters();
  encounterIndex=4;

  //TODO: Proper credits!!!
  alert("༼ つ ◕_◕ ༽つ Unbelievable, you finished the game!\nSpecial thanks: 0melapics on Freepik.com, https://animate.style and Stackoverflow.com");
}

//Logging
function logPlayerAction(actionString,message){
  actionString = actionString.substring(0,actionString.indexOf(" ")) + "&nbsp;▸&nbsp;" + enemyEmoji + " " + message + "<br>";
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

//UI Buttons
function resetEncounterButtons(){
  document.getElementById('button_attack').innerHTML="⚔️ Attack";
  document.getElementById('button_block').innerHTML="🔰 Block";
  document.getElementById('button_roll').innerHTML="🌀 Roll";
  document.getElementById('button_cast').innerHTML="🪄 Cast";
  document.getElementById('button_curse').innerHTML="🪬 Curse";
  document.getElementById('button_pray').innerHTML="🙏 Pray";
  document.getElementById('button_grab').innerHTML="✋ Grab";
  document.getElementById('button_sleep').innerHTML="💤 Rest";
  document.getElementById('button_speak').innerHTML="💬 Speak";
}

function adjustEncounterButtons(){
  resetEncounterButtons();
  switch (enemyType){
    case "Upgrade":
      document.getElementById('button_attack').innerHTML="❤️ Vitality";
      document.getElementById('button_roll').innerHTML="🟢 Agility";
      document.getElementById('button_block').innerHTML="🧠 Wisdom";
      document.getElementById('button_cast').innerHTML="🔮 Sorcery";
      document.getElementById('button_curse').innerHTML="🩸 Hatred";
      document.getElementById('button_pray').innerHTML="📿 Faith";
      document.getElementById('button_grab').innerHTML="🍀 Fortune";
      document.getElementById('button_speak').innerHTML="🪙 Greed"; //Lose HP but gain luck +3
      document.getElementById('button_sleep').innerHTML="💀 Pain";
      break;
    case "Container":
      document.getElementById('button_grab').innerHTML="👋 Search";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      break;
    case "Consumable":
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_grab').innerHTML="🍴 Consume";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      break;
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋ Touch";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
    case "Item":
    case "Trap":
    case "Trap-Roll":
    case "Trap-Attack":
    case "Prop":
    case "Dream":
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
      break;
    case "Recruit":
        if ((enemyInt < playerInt) && (enemySta-enemyStaLost == 0)){ //If they are tired and you are smarter they join you
          document.getElementById('button_speak').innerHTML="💬 Recruit";
        }
        if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) {
          document.getElementById('button_grab').innerHTML="🦶 Kick";
        }
        break;
    case "Pet":
      if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)){
        document.getElementById('button_grab').innerHTML="👋 Pet";
      }
    case "Standard":
      if ((playerSta == 0)&&(enemySta-enemyStaLost==0)) { //Applies for all above without "break;"
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      break;
    case "Heavy":
    case "Swift":
      if ((enemySta-enemyStaLost)==0) {
        document.getElementById('button_grab').innerHTML="🦶 Kick";
      }
      break;
    case "Death":
      document.getElementById('button_speak').innerHTML="💌 Share";
      document.getElementById('button_sleep').innerHTML="🦆 Tweet";
      break;
    case "Checkpoint":
      document.getElementById('button_grab').innerHTML="💾 Save";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_sleep').innerHTML="💤 Sleep";
    default:
  }
}

//UI Effects
function curtainFadeInAndOut(message=""){
  var curtainUIElement = document.getElementById('id_fullscreen_curtain');
  var fullscreenTextUIElement = document.getElementById('id_fullscreen_text');

  animateUIElement(fullscreenTextUIElement,"animate__fadeIn",1.1,true,message);
  animateUIElement(curtainUIElement,"animate__fadeIn",1,true);

  var animationHandler = function(){
    animateUIElement(curtainUIElement,"animate__fadeOut",2.5,true);
    animateUIElement(fullscreenTextUIElement,"animate__fadeOut",2.5,true,message);
    curtainUIElement.removeEventListener("animationend",animationHandler);
  }
  curtainUIElement.addEventListener('animationend',animationHandler);
}

function displayEnemyEffect(message){
  displayEffect(message,document.getElementById('id_enemy_overlay'));
}

function displayPlayerEffect(message){
  displayEffect(message,document.getElementById('id_player_overlay'));
}

function displayPlayerCannotEffect(){
  animateUIElement(playerInfoUIElement,"animate__headShake","0.7"); //Animate Player not enough stamina
}

function displayEffect(message,documentElement){
  animateUIElement(documentElement,"animate__fadeOut",1.3,true,message)
}

function animateUIElement(documentElement,animation,time="0s",hidden = false,message=""){
  if (hidden){
    documentElement.innerHTML = message;
    documentElement.style.display = "block";
  }
documentElement.classList.remove(animation);
void documentElement.offsetWidth; // trigger a DOM reflow

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

  document.getElementById('id_player_name').addEventListener(eventType, ()=>{
    playerName=prompt("Name your character: ");
    if (!playerName.replace(/\s/g, '').length){
      playerName="Nameless Character";
    }
    redraw();
  });
}

//Social
function generateCharacterShareString(){
  var characterShareString="";
  characterShareString+="\nCharacter: "+playerName;
  characterShareString+="\n❤️ "+"◆".repeat(playerHpMax)+"  🟢 "+"◆".repeat(playerStaMax)+"  ⚔️ " + "×".repeat(playerAtk);

  if (playerPartyString.length > 0) {
    characterShareString += "\nParty: " +playerPartyString;
  }
  if (playerLootString.length > 0) {
    characterShareString += "\nLoot: "+playerLootString;
  }

  characterShareString+="\n\n"+ versionCode;

  return characterShareString;
}

function copyAdventureToClipboard(){
  displayPlayerEffect("💌");
  logPlayerAction(actionString,"The legend was copied into clipboard.");
  adventureLog = adventureLog.replaceAll("<br>","\n");
  adventureLog += generateCharacterShareString();
  adventureLog += "\nhttps://igpenguin.github.io/webcrawler";
  navigator.clipboard.writeText(adventureLog);
}

function redirectToTweet(){
  var tweetUrl = "http://twitter.com/intent/tweet?url=https://igpenguin.github.io/webcrawler&text=";
  window.open(tweetUrl+encodeURIComponent("Hey @IGPenguin,\nI made it to stage #"+adventureEncounterCount+" in WebCrawler!"+adventureEndReason+"\n"+generateCharacterShareString()));
}

//Mobile specific
function vibrateButtonPress(){
  if (!("vibrate" in window.navigator)){
    console.log("Vibrate not supported!");
    return;
  }
  window.navigator.vibrate([5,20,10]);
}

async function actionVibrateFeedback(buttonID){
  vibrateButtonPress();
  await new Promise(resolve => setTimeout(resolve, 100)); // muhehe
}
