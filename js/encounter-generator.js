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
        pushEncounter(getWeightedEncounter(["Item"],["Artifact"]));
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
      if (procAbilityChance("",3+playerLck+GAME_CONFIG.spawnItemDropBonus)) pushEncounter(getWeightedEncounter(["Item"])) //3% item
      if (procAbilityChance("",10+playerLck+GAME_CONFIG.spawnConsumableDropBonus)) pushEncounter(getWeightedEncounter(["Consumable"])); //10% consumable
      pushEncounter(getRandomEncounter(encounterPool));
      break;

    case 4: //Hard Encounter
      if (logCall) logGenerator("hard");
      if (procAbilityChance("",70+playerLck)) generateNextEncounters(0,false); //70% Prop or Contained Small
      if (procAbilityChance("",5+playerLck+GAME_CONFIG.spawnItemDropBonus)) pushEncounter(getWeightedEncounter(["Item"])) //5% item
      if (procAbilityChance("",30+playerLck+GAME_CONFIG.spawnConsumableDropBonus)) pushEncounter(getWeightedEncounter(["Consumable"])); //30% consumable
      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Reflective","Demon","Spirit"]));
      break;

    case 9: //Boss
      if (logCall) logGenerator("boss");

      //Prop or Contained Small after fight (not in Necropolis)
      if (!areaName.includes("Shrouded")) generateNextEncounters(0,false);

      drachmaCoin[0]="area:"+areaName;
      var bossCoinsLimit = {"Fading Wildlands": 0, "Forsaken Village": 1, "Twisted Fairyland": 2, "River of Sorrows": 3}; //One coin per area (to balance out origins)
      if (!areaName.includes("Shrouded Necropolis") && savedCoins < (bossCoinsLimit[areaName] || 0)) pushEncounter(drachmaCoin); //Unrecognized area defaults to no coin (0)
      pushEncounter(getRandomEncounter(["Boss-Standard","Boss-Swift","Boss-Demon","Boss-Heavy","Boss-Spirit","Boss-Undead","Boss-Toxic","Boss-Tough","Boss-Hot","Boss-Stingy","Boss-Reflective","Boss-Pet"]));
      break;

    case 11: //Any Enemy
      if (logCall) logGenerator("any");
      if (procAbilityChance("",50+playerLck)) generateNextEncounters(0,false); //50% Prop or Contained Small
      if (procAbilityChance("",5+playerLck+GAME_CONFIG.spawnItemDropBonus)) pushEncounter(getWeightedEncounter(["Item"])) //5% item
      if (procAbilityChance("",20+playerLck+GAME_CONFIG.spawnConsumableDropBonus)) pushEncounter(getWeightedEncounter(["Consumable"])); //20% consumable
      pushEncounter(getRandomEncounter(["Small","Standard","Stingy","Toxic","Hot","Recruit","Pet","Swift","Heavy","Tough","Demon","Spirit"]));
      break;

    case 20: //House Small
      if (logCall) logGenerator("h-small");
      if (procAbilityChance("",10+playerLck+GAME_CONFIG.spawnItemDropBonus)) { //10% item
        pushEncounter(getWeightedEncounter(["Item"]))
      } else if (procAbilityChance("",20+playerLck+GAME_CONFIG.spawnConsumableDropBonus)) { //20% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
      } else {
        generateNextEncounters(0,false); //Prop or Contained Small
      }
      pushEncounter(getRandomEncounter(["Standard","Recruit","Stingy","Toxic","Hot","Tough"]));
      pushEncounter(getRandomEncounter(["Container-2"]));
      break;

    case 30: //House Mid
      if (logCall) logGenerator("h-mid");
      if (procAbilityChance("",15+playerLck+GAME_CONFIG.spawnItemDropBonus)) { //15% item
        pushEncounter(getWeightedEncounter(["Item"]))
      } else if (procAbilityChance("",25+playerLck+GAME_CONFIG.spawnConsumableDropBonus)) { //25% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
      } else {
        generateNextEncounters(0,false); //Prop or Contained Small
      }

      var possibleEncounters=["Recruit","Standard","Stingy","Toxic","Hot","Tough","Swift","Heavy","Demon","Spirit","Curse","Altar"];
      var firstEncounter=getRandomEncounter(possibleEncounters);
      pushEncounter(firstEncounter);

      var filterType=firstEncounter[3].split(":")[1];
      possibleEncounters = possibleEncounters.filter(string => string !== filterType); // Prevents duplicate encounter types twice in a row

      pushEncounter(getRandomEncounter(possibleEncounters)); // Push second encounter which is guaranteed different type
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 31: //House Locked
      if (logCall) logGenerator("h-lock");
      var type=chooseFrom(["Item","Pet","Friend"]);
      if (type=="Item") {
        pushEncounter(getWeightedEncounter([type],["Artifact"]));
      } else {
        pushEncounter(getRandomEncounter([type,"Checkpoint"]));
      }
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
      pushEncounter(getRandomEncounter(["Small","Standard","Stingy","Toxic","Hot","Recruit","Pet","Swift","Heavy","Tough","Demon","Spirit"]));
      pushEncounter(getRandomEncounter(["Locked-Container-3"]));
      break;

    case 40: //House Hard
      if (logCall) logGenerator("h-hard");
      if (procAbilityChance("",20+playerLck+GAME_CONFIG.spawnItemDropBonus)) { //20% item, 100% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
        pushEncounter(getWeightedEncounter(["Item"]))
      } else {
        pushEncounter(getRandomEncounter(["Altar"])); //80% altar, 100% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Demon","Spirit","Curse","Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
      pushEncounter(getRandomEncounter(["Container-3"]));
      break;

    case 50: //House Big
      if (logCall) logGenerator("h-big");
      if (procAbilityChance("",30+playerLck+GAME_CONFIG.spawnItemDropBonus)) { //30% item, 100% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
        pushEncounter(getWeightedEncounter(["Item"]))
      } else {
        pushEncounter(getRandomEncounter(["Altar"])); //70% altar, 100% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
      }

      pushEncounter(getRandomEncounter(["Swift","Heavy","Tough","Demon","Spirit"]));
      pushEncounter(getRandomEncounter(["Curse","Trap","Trap-Big","Trap-Attack","Trap-Roll","Trap-Sleep","Trap-Obstacle"]));
      pushEncounter(getRandomEncounter(["Container-4"]));
      break;

    case 60: //House Huge
      if (logCall) logGenerator("h-huge");
      if (procAbilityChance("",40+playerLck+GAME_CONFIG.spawnItemDropBonus)) { //40% item/friend/checkpoint, 100% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
        pushEncounter(getRandomEncounter(["Friend","Item","Checkpoint"])) // multi-type: skip rarity weighting
      } else {
        pushEncounter(getRandomEncounter(["Altar"])); //60% altar, 100% consumable
        pushEncounter(getWeightedEncounter(["Consumable"]));
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
