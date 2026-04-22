encounterRenew();
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
    if (isNaN(savedCoins)) savedCoins=0;
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

  //Calculate total bonus/malus
  var effectArray = [enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef];
  var effectArrayBonus=effectArray.filter(function(x){ return x > 0 });
  var effectArrayMalus=effectArray.filter(function(x){ return x < 0 });
  totalBonus=effectArrayBonus.reduce((partialSum, a) => partialSum + a, "");
  totalMalus=effectArrayMalus.reduce((partialSum, a) => partialSum + a, "");
  if (totalMalus=="") totalMalus=0;
  if (totalBonus=="") totalBonus=0;
  //console.log("bonus: "+totalBonus+" malus: "+totalMalus);

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
        enemyDesc="If you see me again, bring me <b>something good</b>.<br>Perhaps this? "+String(enemyQuestItems).replaceAll(","," ");
      }
      enemyDesc=enemyDesc.replaceAll("n/a",heldItem);
    }

    enemyType="Friend";
  }
  enemyDesc = enemyDesc.replaceAll("\\",",");
  enemyDesc = enemyDesc.replaceAll("((",":");
  if (enemyName.includes("Undertaker")) {
    enemyDesc=getShopMessage();
    enemyDesc=enemyDesc+"<i><b>Unspent Drachmae: "+parseInt(savedCoins-spentCoins)+"</b></i> 🪙";
  }
  if (enemyEmoji=="🪙" && !enemyName.includes("Lucky")) enemyDesc=enemyDesc+"<i><b>Total Drachmae: "+parseInt(savedCoins)+"</b></i> 🪙";

  enemyMsg = String(selectedLine.split(",")[13].split(":")[1]).replaceAll("\\",",");
  enemyMsg = enemyMsg.replaceAll("((",":");

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
        if (playerLootString.includes("📌")) {
          enemyHit(1,false,false,true)
          logAction("📌 ▸ "+enemyEmoji+" Inflicted the <b>☠️ Ancient Voodoo</b> -1 💔")
        }
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
           if (enemyName=="Ethereal Drachma"){
             logAction("🌀 ▸ "+enemyEmoji+"<text style=color:"+colorLightShadeBlue+";>" + " Shape spawned: <b>"+enemyName+"</b></text>")
           } else if (enemyEmoji== "🪙" || enemyEmoji=="💰") {
             if (!enemyName.includes("Lucky")) logAction("🌀 ▸ "+enemyEmoji+"<text style=color:"+colorLightShadeBlue+";>" + " Found fortune: <b>"+enemyName+"</b></text>")
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
    case "Trap":
    case "Trap-Big":
    case "Trap-Obstacle":
    case "Trap-Attack":
    case "Trap-Roll":
    case "Trap-Sleep":
      if (totalBonus==0 && totalMalus==0) logAction("⚫️ ▸ "+enemyEmoji+" Encountered obstacle: <b>"+enemyName+"</b>")
      if (totalBonus>0 && totalMalus<0) logAction("🎀 ▸ "+enemyEmoji+" Noticed a curiosity: <b>"+enemyName+"</b>")
      if (totalMalus<0) logAction("⁉️ ▸ "+enemyEmoji+" Noticed a hazard: <b>"+enemyName+"</b>")
      break;
    case "Curse":
      logAction("⁉️ ▸ "+enemyEmoji+" Noticed something: <b>"+enemyName+"</b>")
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
      if (savedCoins-spentCoins==0) logAction(enemyEmoji+" ▸ 💬 You are broke, I guess that's it for now...")
      break;
    default:
      if (enemyType.includes("Boss") && !adventureLog.includes("Bride")) {
        logAction("💢 ▸ "+enemyEmoji+" <text style=color:"+colorRed+";>"+"Engaged a boss: <b>"+enemyName+"</b></text>")
        if (playerLootString.includes("📌") && ((enemyAtk+enemyAtkBonus)>0)) {
          enemyHit(1,false,false,true)
          logAction("📌 ▸ "+enemyEmoji+" Inflicted the <b>☠️ Ancient Voodoo</b> -1 💔")
        }
      }
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
        enemyMsg="I'm glad that you didn't forget."
      }
    } else if (playerLove>0){
      enemyAtkBonus-=playerLove;
      logAction("♥️ ▸ "+enemyEmoji+" She is showing some signs of mercy -"+playerLove+" ⚔️")
    }
  }
  if (enemyTeam.includes("Lost Possesion")) { //Found quest item, spawn friend who wants it
    console.log(enemyEmoji)
    var randomSlot=chooseFrom([3,4,5])
    pushEncounter(getRandomEncounter(["Friend"],[enemyEmoji]),randomSlot);
  }

  if (playerHas("👺") || playerHas("😈")) {
    if (enemyType=="Demon") {
      enemyAtkBonus=(-enemyAtk);
      enemyMgkLost=(enemyMgk);
    }
  }
  if (playerHas("🐴")) {
    enemyAtkBonus-=1;
  }
  if (playerHas("💀") || playerHas("🧟‍♂️")) {
    if (enemyType=="Undead") {
      enemyAtkBonus=(-enemyAtk);
      enemyMgkLost=(enemyMgk);
    }
  }
  if (playerHas("👻")) {
    if (enemyType=="Spirit") {
      enemyAtkBonus=(-enemyAtk);
      enemyMgkLost=(enemyMgk);
    }
  }
  if (playerHas("🦧")) {
    if (enemyType=="Small") {
      enemyAtkBonus=(-enemyAtk);
    }
  }
  runLogAdd("encounter", {
    area: areaName, emoji: enemyEmoji, name: enemyName, type: enemyType,
    hp: enemyHp, atk: enemyAtk, sta: enemySta, lck: enemyLck,
    int: enemyInt, mgk: enemyMgk, def: enemyDef, note: enemyTeam
  });
}

function generateRandomItem(item=""){
  var randomItem=getRandomEncounter(["Item"],[],"ALL",["Artifact","Lover's Memento","Lost Possesion"]); //arg #2 empty = no required text; arg #4 excludes specific texts
  if (item=="Artifact") var randomItem=getRandomEncounter(["Item"],["Artifact"],"ALL",["Lover's Memento","Lost Possesion"]);
  return randomItem;
}

function drachmaeBuy(price=1,item="",skillSuccess=null){
  var availableCoins=(savedCoins-spentCoins)

  if (availableCoins>=price) {
    playerShopped=true;
    spentCoins+=price;
    AchievementManager.check('spend_coins', price);
    //DO NOT localStorage.setItem('coins', availableCoins); //Remove from local storage as well (coins do not endlessly add up)
    displayEnemyEffect("🪙");
    displayPlayerEffect("");

    if ((item=="Item") || (item=="Artifact")) {
      if (item=="Item")     AchievementManager.check('buy_item');
      else if (item=="Artifact") AchievementManager.check('buy_artifact');
      displayPlayerGainedEffect();
      logPlayerAction(actionString,"Splendid choice, this ought to help");
      drachmaShop[0]="area:"+"Fading Wildlands";
      var item=generateRandomItem(item).split(",");
      item[0]="area:"+areaName;
      item=String(item);
      pushEncounter(item);
      nextEncounter();
      pushEncounter(drachmaShop);
    } else if (item=="Aspect") {
      var aspectPool = [
        { stat: "❤️",  apply: function() { playerHp++; playerHpMax++; } },
        { stat: "🟢",  apply: function() { playerSta++; playerStaMax++; } },
        { stat: "🍀",  apply: function() { playerLck++; } },
        { stat: "🧠",  apply: function() { playerInt++; } }
      ];
      var picked = aspectPool[Math.floor(Math.random() * aspectPool.length)];
      picked.apply();
      displayPlayerGainedEffect();
      displayPlayerEffect(picked.stat);
      logPlayerAction(actionString, "Fate has shaped you to gain <b>+1 "+picked.stat+"</b>");
      redraw();
      return;
    } else if (item=="Gamble")  {
      if (skillSuccess === true){
        AchievementManager.check('gamble_win');
        displayPlayerGainedEffect();
        displayPlayerEffect("🍀");
        logPlayerAction(actionString,"<text style=color:"+colorDarkGreen+";>Lucky bastard, you actually won!</text>")
        drachmaPrize[0]="area:"+areaName;
        pushEncounter(drachmaPrize);
        nextEncounter();
      } else {
        AchievementManager.check('gamble_lose');
        logPlayerAction(actionString,"<text style=color:"+colorRed+";>Ooops... you lost the gamble!</text>")
        gamblingLost[0]="area:"+areaName;
        displayPlayerCannotEffect();
        displayPlayerEffect("❌");
        pushEncounter(gamblingLost);
        nextEncounter();
      }
      pushEncounter(drachmaShop);
      return;
    } else {
      AchievementManager.check('buy_level');
      displayPlayerGainedEffect();
      logPlayerAction(actionString,"Sure, grow stronger as you need");
      playerXP+=playerXPThreshold;
      playerRest(true);
      return;
    }
    return;
  } else {
    logAction("👤 ▸ ⁉️ "+"<text style=color:"+colorRed+";>You don't have enough 🪙 <b>Drachmae</b>!</text>")
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
      if (procAbilityChance("",10+playerLck)) type="Small"; //10% Small

      if (procAbilityChance("",5-playerLck)) { //5% Trap chance, lowers with luck
        pushEncounter(getRandomEncounter(["Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
      } else { //No small, no trap
        if (procAbilityChance("",5-playerLck)){//5%- Bad flavoured prop
            pushEncounter(getRandomEncounter(["Prop"],["-1"])); //Only bad flavoured props
        } else if (procAbilityChance("",5+playerLck)) { //5%+ Good flavoured prop
            pushEncounter(getRandomEncounter(["Prop"],["1"])); //Only good flavoured props
        } else {
          pushEncounter(getRandomEncounter(["Prop"],[],"",["-1","1"])); //Exclude flavoured props
        }
      }

      if (type=="Small") {
        pushEncounter(getRandomEncounter(["Small"]));
        pushEncounter(getRandomEncounter(["Container"]));
      }

      if (!areaName.includes("Fading") && (procAbilityChance("",3+playerLck))){ //3% chance for a locked container with artifact
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
        if (procAbilityChance("",20+playerLck)) { //20% Artifact
          pushEncounter(getRandomEncounter(["Item"],["Artifact"]));
        } else {
          pushEncounter(getRandomEncounter(["Item"],[],"",["Artifact","Lost Possesion"])) //Any item, but not Artifact (didnt procc) and not quest item (too late)
        }
      }
      drachmaCoin[0]="area:"+areaName;
      var bossCoinsLimit = {"Fading Wildlands": 0, "Forsaken Village": 1, "Twisted Fairyland": 2, "River of Sorrows": 3}; //One coin per area (to balance out origins)
      if (!areaName.includes("Shrouded Necropolis") && savedCoins < (bossCoinsLimit[areaName] || 0)) pushEncounter(drachmaCoin); //Unrecognized area defaults to no coin (0)
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

      var possibleEncounters=["Recruit","Standard","Stingy","Toxic","Hot","Tough","Swift","Heavy","Demon","Spirit","Curse","Altar"];
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
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
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

      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Demon","Spirit","Curse","Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
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
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
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
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
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
