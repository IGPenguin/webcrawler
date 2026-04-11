//Game logic
function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    // Consume the action-bar skill check result (null = no check, true/false = pass/fail)
    var _skillOK = actionBarSuccess;
    actionBarSuccess = null;

    var buttonUIElement = document.getElementById(button);
    animateUIElement(buttonUIElement,"animate__pulse","0.15");
    actionString = buttonUIElement.innerHTML;
    actionVibrateFeedback(button);
    runLogAdd("action", {
      btn: button,
      player: {hp: playerHp, hpMax: playerHpMax, sta: playerSta, staMax: playerStaMax,
               mgk: playerMgk, atk: playerAtk, lck: playerLck, int: playerInt,
               def: playerDef, level: playerLevel, xp: playerXP, karma: playerKarma}
    });

    //Override boss type for action
    if (enemyType.includes("Boss")){
      enemyType=enemyType.replaceAll("Boss-","");
    }

    switch (button) {
      case 'button_attack': //Attacking always needs stamina
        var enemyAttacked=false;

        if (enemyType=="Death") {
          if (_skillOK === false) {
            permanentDeath("<p style=\"color:#fff;-webkit-text-stroke:4px black;paint-order:stroke fill;\">Gone forever.</p>");
            break;
          }
          playerReincarnate();
          break;
        }

        if (enemyType=="Dream") {
          displayPlayerCannotEffect();
          var msg="Cannot attack while asleep."
          if (enemyName.includes("Regrets")) msg="Attacking wouldn't solve anything."
          logPlayerAction(actionString,msg);
          break;
        }

        if (enemyType=="Shop") {
          if (!playerDestined) {
            drachmaeBuy(1,"Tarot");
          } else {
            displayEnemyCannotEffect();
            logAction("👤 ▸ ⁉️ <text style=color:"+colorRed+";>You've already accepted your destiny!</text>")
          }
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
          case "Trap-Sleep":
          case "Trap-Big":
            logPlayerAction(actionString,"Your attack had no effect -1 🟢");
            displayEnemyEffect("〽️");
            displayEnemyCannotEffect();
            break;
          case "Trap":
          case "Trap-Roll":
          case "Trap-Obstacle":
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

          //You hit first, they hit back if they have stamina
          case "Demon":
          case "Undead":
            if (playerLootString.includes("📿")) {
              playerAtkBonus=2;
              logAction("📿 ▸ ⚔️ Your attack was blessed with +2 ⚔️")
            }
          case "Standard":
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

            if (_skillOK === false) {
              logPlayerAction(actionString, "You missed your attack -1 🟢");
              displayEnemyDodgeEffect();
              if (!enemyAttacked) enemyAttackOrRest();
              break;
            }

            //if (enemyType=="Tough") enemyDef=1; //Hehe, should Tough have something špeci?
            enemyHit(playerAtk+playerAtkBonus-enemyDef);

            if ((parseInt(enemyHp)-parseInt(enemyHpLost) > 0) && !enemyAttacked) { //If they survive, they counterattack or regain stamina
              enemyAttackOrRest();
            }
            break;

          case "Swift": //They hit you first if they have stamina
            if (enemyCastIfMgk(true)) enemyAttacked=true;

            if (_skillOK === false) {
              logPlayerAction(actionString, "Your attack missed -1 🟢");
              displayEnemyDodgeEffect();
              if (!enemyAttacked) enemyAttackOrRest();
              break;
            }

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
              var openMessage = "Smashed it into many pieces! -1 🟢";
              displayEnemyEffect("〽️");
              displayEnemyCannotEffect();

              if (enemyType.includes("Locked")) {
                var gainedXP=playerGainXP(1,15*playerLevel,""); //Same XP gain as for spell unlock
                openMessage = "Smashed the lock open! -1 🟢 "+decorateStatusText("","+"+gainedXP+" XP",colorGold);
                enemyHp-=playerAtk;
              } else {
                logPlayerAction(actionString,openMessage);
                nextEncounter();
                break;
              }

              if (enemyType.includes("Locked")&&(enemyHp>(-3))){
                openMessage = "Smashed it, but the lock still holds -1 🟢";
                logPlayerAction(actionString,openMessage);
              } else {
                logPlayerAction(actionString,openMessage);
                enemyType=enemyType.replace("Locked-","");
                enemyHp=0;
                enemyMsg="Uncovered what was locked inside."
                redraw();
              }
              break;
            }
            logPlayerAction(actionString,"Your attack had no effect -1 🟢");
            displayEnemyEffect("〽️");
      }
      break;

      case 'button_roll': //Stamina not needed for non-enemies + dodge handling per enemy type
        if (enemyType=="Death"){
          menuFade(function() {
            SaveManager.abandonCurrentRun();
            Menu.show();
          });
          break;
        }

        const noStaForRollMessage = "Too tired to make any move.";
        var rollMessage;

        switch (enemyType){ //Dodge attack or walk if they are harmless
          case "Curse":
            if (!encounterUsed) {
              playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg);
              encounterUsed=true;
            } else {
              logPlayerAction(actionString,"Continued on your adventure.");
              nextEncounter();
            }
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

              if (_skillOK === false && (enemyAtk+enemyAtkBonus) > 0) {
                var _dodgeDmg = enemyAtk+enemyAtkBonus;
                logPlayerAction(actionString, "Dodge failed, took the hit -"+_dodgeDmg+" 💔 -1 🟢");
                displayPlayerCannotEffect();
                playerHit(_dodgeDmg);
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

            if (enemyCastIfMgk(false) && playerUseStamina(1,noStaForRollMessage)){
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
              logPlayerAction(actionString,"Threw it back into the water.");
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
              logPlayerAction(actionString,"Ditched it onto the ground.");
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
              displayPlayerCannotEffect();
              var msg="Cannot walk while asleep."
              if (enemyName.includes("Regrets")) msg="You cannot walk away from this."
              logPlayerAction(actionString,msg);
            } else {
              if (_skillOK === false) {
                playerSta = Math.max(0, playerSta - 1);
                logPlayerAction(actionString, "Struggled to leave the dream -1 🟢");
                displayPlayerCannotEffect();
                nextEncounter();
                break;
              }
              logPlayerAction(actionString,enemyMsg);
              nextEncounter();
            }
            break;
          case "Prop":
            isFishing=false;
            if (_skillOK === false) {
              if (Math.random() < 0.25) {
                logPlayerAction(actionString, "Stepped badly and sprained an ankle -1 💔");
                playerHit(1);
              } else {
                playerSta = Math.max(0, playerSta - 1);
                logPlayerAction(actionString, "Stepped badly and strained yourself -1 🟢");
                displayPlayerCannotEffect();
              }
              if (playerHp > 0) nextEncounter();
              break;
            }
            if (enemyMsg!="" && totalBonus==0 && totalMalus==0){
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

          case "Trap-Roll": //Triggers when rolling into it
          case "Trap-Obstacle":
            if (!encounterUsed) {
              if (enemyHp<=0) playerHpMax-=enemyHp; //Don't lose max hp
              if (enemySta<=0) playerStaMax-=enemySta; //Don't lose max sta
              playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk,enemyDef,enemyMsg,true,false);
              }
            //nextEncounter(); //Blocks the path ahead
            displayPlayerCannotEffect();
            break;
          case "Trap":
          case "Trap-Big":
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
          drachmaeBuy(1,"Gamble");
          break;
        }

        if (enemyType=="Death"){
          logPlayerAction(actionString,"Echoed a message to the universe.");
          redirectToFeedback();
          break;
        }

        if (enemyType=="Dream") {
          displayPlayerCannotEffect();
          var msg="Cannot block while asleep."
          if (enemyName.includes("Regrets")) msg="You cannot block your regrets."
          logPlayerAction(actionString,msg);
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

        if (_skillOK === false && (enemyAtk+enemyAtkBonus) > 0
            && enemyType!=="Pet" && enemyType!=="Small" && enemyType!=="Friend") {
          var _blockFailDmg = enemyAtk + enemyAtkBonus;
          logPlayerAction(actionString, "Block overpowered -"+_blockFailDmg+" 💔 -1 🟢");
          playerHit(_blockFailDmg);
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
          var magicDamage = playerMgk;

          if (enemyType.includes("Locked")) mkgCost=2;

          if (enemyType=="Shop") {
            displayPlayerCannotEffect();
            break;
          }

          if (enemyType=="Death"){
            // redirectToTweet();
            // logPlayerAction(actionString,"Echoed your story to the world!")
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
              var gainedXP=playerGainXP(1,15*playerLevel,"");
              logPlayerAction(actionString,"Unlocked it with a spell -"+mkgCost+" 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
              nextEncounter();
              break;
            }
          }

          if (enemyType!="Death" && playerCooked!=true && (enemyType=="Consumable" && !playerLootString.includes("🧂"))) displayPlayerEffect("🪄"); //I'm lazy

          if (_skillOK === false && !enemyType.includes("Locked") && !enemyType.includes("Container")
              && enemyType!=="Consumable" && enemyType!=="Item" && enemyType!=="Altar"
              && enemyType!=="Upgrade" && enemyType!=="Dream") {
            playerMgk -= mkgCost;
            logPlayerAction(actionString, "Spell fizzled -"+mkgCost+" 🔵");
            displayEnemyCannotEffect();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }

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
              atckmsg="They reflected your spell -"+magicDamage+" 🔵";
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
            if ((parseInt(enemyHp)-parseInt(enemyHpLost))==1) magicDamage=1; //TODO: No time to do it better now
            if (magicDamage > 2) {
              magicDamage=2;
            }

            playerMgk-=magicDamage;
            var magicBonusDamage=0;

            if (procAbilityChance("💫",100)){
              magicBonusDamage=1;
            }

            if ((enemyMgk-enemyMgkLost)<=magicDamage){
              enemyHit(magicDamage+magicBonusDamage,true);
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
          case "Trap-Obstacle":
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
                if (enemySta==1) enemySta=2;
                enemyMsg="That was very tasty";
                displayEnemyEffect("🔥");
              }

              if (playerLootString.includes("🧂")){
                logMessage="Added a tiny pinch of salt.";
                enemyName=enemyName+" (Salty)";
                displayEnemyEffect("✨");
              } else {
                enemyName=enemyName+" (Crispy)";
                playerMgk-=1;
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
          if (enemyType=="Shop") {
            displayPlayerCannotEffect();
            break;
          }

          if (enemyType=="Death"){
            // logPlayerAction(actionString,"It's kinda too late for healing now.");
            // displayPlayerCannotEffect();
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

          if (_skillOK === false && enemyType!=="Altar" && enemyType!=="Upgrade"
              && enemyType!=="Dream" && enemyType!=="Death") {
            playerMgk--;
            logPlayerAction(actionString, "Prayer went unanswered -1 🔵");
            displayPlayerCannotEffect();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }

        switch (enemyType){
          case "Curse": //Breaks only if mind is stronger
            if (playerInt>=(-1*enemyInt)){
              if (!encounterUsed) {
                logPlayerAction(actionString,"Managed to keep it together +1 🧠");
                playerInt++;
                displayPlayerGainedEffect();
                encounterUsed=true;
              } else {
                logPlayerAction(actionString,"Seems like it this has no further effect.");
                displayPlayerCannotEffect();
                displayPlayerEffect("");
              }
            } else {
              logPlayerAction(actionString,"Giving your best, but no effect.");
              displayPlayerCannotEffect();
            }
            break;

          case "Spirit":
          case "Demon":
            if ((playerMgk>0)&&(enemyInt <= playerInt )){
              var gainedXP=playerGainXP(1.25,0,"")
              logPlayerAction(actionString,"Banished them from this world! -1 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
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
          case "Trap-Big":
          case "Trap-Obstacle":
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
        if (enemyType=="Shop") {
          displayPlayerCannotEffect();
          break;
        }

        if (enemyType=="Death"){
          // shareLinkedIn();
          // logPlayerAction(actionString,"Copied your run! Paste it into LinkedIn.");
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

        if (!playerUseMagic(2,"Not enough mana, requires +2 🔵")) { //Curse is never free, upgrd handled above
            break;
          }

        if (enemyType!="Death") {displayPlayerEffect("🪬");}

          // Reflective curse-back: failed skill check = curse snaps back onto the caster
          if (_skillOK === false && enemyType === "Reflective") {
            var reflectDmg = Math.max(1, playerMgk); //TODO this is how it should work for cast, curse lowers attack (yeah lower it)
            logPlayerAction(actionString, "Curse reflected back "+reflectDmg+" 💔 -2 🔵");
            displayEnemyEffect("🔷");
            playerHit(reflectDmg);
            break;
          }

          if (_skillOK === false && enemyType!=="Upgrade" && enemyType!=="Death"
              && enemyType!=="Altar" && enemyType!=="Demon" && enemyType!=="Reflective") {
            logPlayerAction(actionString, "Curse dissolved without effect -2 🔵");
            displayEnemyCannotEffect();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }

      switch (enemyType){
        case "Reflective":
          displayEnemyEffect("🔷");
          displayEnemyCannotEffect();
          if ((enemySta+enemyStaLost)==0){
            atckmsg="They reflected your curse -2 🔵";
          } else {
            atckmsg="They reflected it and attacked -"+enemyAtk+" 💔";
          }
          if (enemyCastIfMgk(true)) enemyAttacked=true;
          if (!enemyAttacked) enemyAttackOrRest(atckmsg);
          break;

        case "Demon":
            logPlayerAction(actionString,"Your curse has made them stronger! -2 🔵");
            enemyName=enemyName+" (Cursed)";
            animateUIElement(enemyInfoUIElement,"animate__tada","1"); //Animate enemy gain
            enemyAtkBonus+=1;
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
              logAction("🪆 ▸ ‍🧬 <b>Polymorphed</b> them into a critter -2 🔵");
              displayEnemyCannotEffect();
              displayEnemyEffect("🧬");

              enemyEmoji=animalEmoji; enemyType="Small"; encounterRenew();
              enemyHp=1; enemyAtk=1; enemyAtkBonus=0; enemySta=1; enemyLck=0; enemyInt=-1; enemyMgk=0;
              enemyMsg="They avenged getting polymorphed!";
              break;
            }

            var enemyAtkChange=Math.floor((1+enemyAtk+enemyAtkBonus)/2); //WTF, no way (halves damage?)
            enemyAtkBonus-=enemyAtkChange;
            if (enemyAtkBonus>enemyAtk) enemyAtkBonus=enemyAtk;
            enemyCursed=true;
            logPlayerAction(actionString,"Cursed them -"+enemyAtkChange+" ⚔️ weaker for -2 🔵");
            logAction(enemyEmoji+" ▸ 😱 They got terrified and couldn't react.");
            break; //Enemy does not attack if  cursed
          } else if (playerMgkMax <= enemyMgk) {
            logPlayerAction(actionString,"They resisted your curse -2 🔵");
          } else {
            logPlayerAction(actionString,"Your curse had no effect on them -2 🔵");
          }
          procAbilityChance()
          if (enemyCastIfMgk()) break;
          enemyAttackOrRest();
          break;

        case "Friend": //They'll boost your stats
          if (playerMgk >= enemyMgk){
            var gainedXP=playerGainXP(1,25*playerLevel,"");
            logPlayerAction(actionString,"Forced revealed their secrets -2 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg);
          } else {
            logPlayerAction(actionString,"Could not overpower their will -2 🔵");
            displayPlayerCannotEffect();
          }
          break;

        case "Altar":
          logPlayerAction(actionString,"Your curse has angered the gods -1 🍀");
          playerLck-=1;
          displayPlayerEffect("🪬");
          break;

        default:
          logPlayerAction(actionString,"Your curse dispersed into the area -2 🔵");
      }
      break;

      case 'button_grab': //Player vs encounter stamina decides the success

        if (enemyType=="Shop") {
          drachmaeBuy(1,"Item");
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
              if (_skillOK === false) {
                logPlayerAction(actionString, "They flinched and ran away.");
                displayEnemyEffect("💨");
                animateFlipNextEncounter();
                isFishing=false;
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
              if (_skillOK === false) {
                enemyDodged("Missed, they slipped your grasp.");
                if (enemyCastIfMgk()) break;
                break;
              }
              var touchChance = Math.floor(Math.random(10) * luckInterval); // Chance to make enemy uncomfortable
              if ( touchChance <= playerLck ){ //Generous
                var gainedXP=parseInt(playerGainXP(1,0,""));

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

          case "Trap-Obstacle": //Removes from the way
            logPlayerAction(actionString,"Cleared it from the way forward.")
            nextEncounter();
            break;

          case "Trap-Attack":
            if (totalBonus>0) {
              displayEnemyCannotEffect();
              logPlayerAction(actionString,"Touched it, nothing happened.")
              break;
            }
          case "Trap": //Grabbing triggers the effect
          case "Trap-Big":
          case "Trap-Roll":
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

            if (_skillOK === false) {
              logPlayerAction(actionString, "Stumbled and shattered it to pieces.");
              displayEnemyCannotEffect();
              isFishing=false;
              nextEncounter();
              break;
            }

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
              playerRest(true);
            }

            if (!enemyTeam.includes("Lover's Memento")) { //Add to loot
              if (enemyEmoji!="🪙" && enemyEmoji!="💰") playerLootString+=enemyEmoji;
              if (enemyEmoji=="👺" || enemyEmoji=="🐴" || enemyEmoji=="🐷") playerName=enemyEmoji+" "+playerName;
              displayPlayerGainedEffect();
            } else {
              playerKarma++;
              playerLove++;
              enemyMsg="<text style=color:"+colorGold+";>You just had to take it with yourself.</text>";
            }

            if (enemyEmoji=="🪙"){
              if (enemyName.includes("Lucky")) {
                spentCoins-=2; //Temporary coin for this run only, not persistent
              } else {
                if (savedCoins==0) curtainFadeInAndOut("<p style=\"color:"+colorLightShadeBlue+";-webkit-text-stroke: 6.5px black;paint-order: stroke fill;letter-spacing:1.8px;line-height:20px;font-size:42px;\">Drachma claimed!</p><p style=\"font-size:20px;\""+decorateStatusText("","Returns on death to shape your fate.",colorWhite),6);
                savedCoins+=1;
                localStorage.setItem('coins', parseInt(savedCoins));
              }
              displayPlayerEffect("🪙");
            }

            if (enemyEmoji=="💰"){
              var coinNumber=randomNumber(2,5);
              savedCoins+=coinNumber;
              displayPlayerEffect("🪙");
              localStorage.setItem('coins', parseInt(savedCoins));
              enemyMsg="Claimed <b>Ethereal Drachmae +"+coinNumber+" 🪙</b>";
            }

            if (enemyEmoji=="🃏"){
              if (!playerName.includes("(")) playerName=playerName+" ("+enemyName.replace("Tarot Card: ","")+")"
              playerDestined=true;
            }
            //Grab end
            isFishing=false;
            if (playerHp==0) break;
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg);
            break;

          case "Small":
            if (_skillOK === false) {
              logPlayerAction(actionString, "Slipped through your fingers.");
              displayEnemyEffect("💨");
              if (enemyCastIfMgk()) break;
              if ((enemySta - enemyStaLost) > 0) enemyAttackOrRest();
              break;
            }
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
            isFishing=false;
            nextEncounter();
            break;

          case "Consumable":
            if (_skillOK === false) {
              logPlayerAction(actionString, "Slipped trough to the ground.");
              displayEnemyCannotEffect();
              isFishing=false;
              nextEncounter();
              break;
            }
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

              displayEnemyEffect("🪝");
              getRandomFish();
            } else {
              displayPlayerCannotEffect();
              logPlayerAction(actionString,"Missing a viable fishing bait.")
            }
            break;

          case "Demon":
            logPlayerAction(actionString,"Missed, they are faster than expected.");
            displayEnemyEffect("🌀");
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Spirit":
            logPlayerAction(actionString,"Missed, they seem untouchable.");
            displayEnemyEffect("🌀");
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;

          case "Death":
            // logPlayerAction(actionString,"Echoed a message to the universe.");
            // redirectToFeedback();
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
                if (playerLootString.includes("🗝️")){
                  if (_skillOK === false && Math.random() < 0.25) {
                    playerLootString = playerLootString.replace("🗝️","");
                    displayPlayerEffect("🗝️");
                    displayEnemyCannotEffect();
                    logPlayerAction(actionString,"Key snapped in the lock and was lost.");
                  } else {
                    playerUseItem("🗝️","Unlocked it with a key "+decorateStatusText("","+"+(15*playerLevel)+" XP",colorGold),"Cannot open, it is locked tight.",false);
                    playerGainXP(1,15*playerLevel,"");
                    nextEncounter();
                  }
                  break;
                } else if (playerLootString.includes("📎")) {
                  logPlayerAction(actionString,"Unlocked with <b>📎 Universal Key</b> "+decorateStatusText("","+"+(15*playerLevel)+" XP",colorGold))
                  playerGainXP(1,15*playerLevel,"");
                  nextEncounter();
                } else {
                  displayEnemyCannotEffect();
                }
                break;
              }
              if (_skillOK === false) {
                logPlayerAction(actionString, "Failed to find anything of value.");
                encounterIndex+=enemyContainerNumber;
                displayEnemyCannotEffect();
                isFishing=false;
                nextEncounter();
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
        if (enemyType!="Dream" && enemyType!="Death") displayPlayerEffect("💬");

        if (enemyType=="Shop") {
          drachmaeBuy(3,"Artifact");
          displayPlayerEffect("");
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
              if (_skillOK === false) {
                logPlayerAction(actionString,"They hesitated and walked away.");
                animateFlipNextEncounter();
                isFishing=false;
                break;
              }
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
                displayPlayerEffect(heldQuestItem)
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
                logPlayerAction(actionString,"Bring me: "+String(enemyQuestItems).replaceAll(","," "));
              } else {
                logPlayerAction(actionString,"Unable to initiate conversation ?? 🧠");
              }
              displayPlayerCannotEffect();
            }
            break;

          case "Death":
            // visitLinkedIn();
            // logPlayerAction(actionString,"Checked out IGPenguin on LinkedIn!");
            break;

          case "Dream":
            displayPlayerCannotEffect();
            var msg="Cannot speak while asleep."
            if (enemyName.includes("Regrets")) msg="Your throat shakes as you sigh."
            logPlayerAction(actionString,msg);
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

        if (enemyType=="Shop") {
          drachmaeBuy(2,"Level");
          break;
        }

        switch (enemyType){

          case "Curse": //Waiting triggers the curse
            if (!encounterUsed) {
              playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg,true,false);
              encounterUsed=true;
            } else {
              playerRest();
            }
            break;

          case "Small":
            logPlayerAction(actionString,"Moved too far away from you.");
            nextEncounter();
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
          case "Stingy":
          case "Toxic":
          case "Hot":
          case "Tough":
          case "Reflective":
            if (_skillOK === false && (enemyAtk+enemyAtkBonus) > 0) {
              logPlayerAction(actionString, "Your attempt to rest was interrupted -"+(enemyAtk+enemyAtkBonus)+" 💔");
              playerHit(enemyAtk+enemyAtkBonus);
              break;
            }
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

          case "Prop":
            if (!playerRested && (totalBonus>0 || totalMalus<0)){
              playerRest(true);
              if (totalBonus>0 && enemyMsg=="") enemyMsg="Rested very well, gaining extra"
              if (totalMalus<0 && enemyMsg=="") enemyMsg="Did not rest well, somehow lost"
              playerConsumed();
              displayPlayerEffect("💤")
            } else {
              playerRest();
            }
            break;

          case "Trap": //Rest to full if out of combat + mana
          case "Trap-Big":
          case "Trap-Obstacle":
          case "Trap-Attack":
          case "Trap-Roll":
          case "Item":
          case "Consumable":
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
            // menuFade(function() {
            //   SaveManager.abandonCurrentRun();
            //   Menu.show();
            // });
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
    if (isFishing && button!="button_cast") {
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

function getRandomFish(){ //TODO refactor into encounters.csv (in the next life)
  toggleUIElement(areaUIElement,1);
  animateUIElement(areaUIElement,"animate__bounce","1.2");
  animateUIElement(cardUIElement,"animate__bounceInUp","1.2");
  isFishing=true;
  previousArea = areaName;
  adventureEncounterCount+=1;

  lastEncounterIndex = encounterIndex-1;
  lootEncounterIndex = getUnseenLootIndex();
  markAsSeenFishing(lootEncounterIndex);
  encounterRenew();
  return true;
}

function nextEncounter(animateArea=true, skipAreaTransition=false){ //Note: Even generator encounters go through here :)
  if (!enemyType.includes("Generator")) { //Hacky hacky hack and mess on top of it
    previousArea = areaName;
    markAsSeen(enemyName);
    previousEnemyType = enemyType;
    if (enemyType.includes("Boss") && !areaName.includes("Shrouded")) {
      curtainFadeInAndOut("<p style=\"color:"+colorGold+";letter-spacing: 1.8px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:52px;line-height:20px;\">Boss defeated!</p><p style=\"font-size:20px;\""+decorateStatusText("",enemyEmoji+emptySpace+"<b>"+enemyName+"</b>"+emptySpace+emptySpace,colorWhite),4);

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
  animateUIElement(buttonsContainer,"animate__fadeIn","1.2");

  encounterIndex = getNextEncounterIndex();

  encounterRenew();

  // Peek at the area of the encounter about to be loaded so we can fade
  // BEFORE loading rather than after (gives a clean black-screen transition).
  var _peekLine = linesStory[encounterIndex] ? String(linesStory[encounterIndex]) : '';
  var _peekArea = _peekLine.split(",")[0].split(":")[1] || '';
  var _isAreaChange = previousArea !== undefined
                   && previousArea !== _peekArea
                   && _peekArea !== "Eternal Realm"
                   && !enemyType.includes("Boss"); // boss has its own curtain already

  if (_isAreaChange && !skipAreaTransition) {
    var _areaHtml = "<p style=\"color:"+colorWhite+";letter-spacing: 1.6px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:40px;\">"
                  + _peekArea
                  + "</p><p style=\"font-size:20px;margin-top:-44px;z-index:-100;position:relative;\">____________________________________</p>";
    transitionArea(_areaHtml, function () {
      loadEncounter(encounterIndex);
      setBackground(areaName);
      if (!areaName.includes("Fading") && !areaName.includes("Eternal") && !areaName.includes("Depths") && !adventureLog.includes("Arrived to area: <b>"+areaName+"</b>")) {
        logAction("💭 ▸ 👣 Arrived to area: <b>"+areaName+"</b>");
      }
      animateUIElement(cardUIElement,"animate__fadeIn","1.2");
      redraw();
    });
    return;
  }

  loadEncounter(encounterIndex);

  // Boss → new area: boss curtain handles bg swap via setBackground(areaName) while black
  if ((previousArea!=undefined) && (previousArea != areaName) && (areaName != "Eternal Realm")){
    if ((!areaName.includes("Fading")) && (!areaName.includes("Eternal")) && (!areaName.includes("Depths")) && (!adventureLog.includes("Arrived to area: <b>"+areaName+"</b>"))) logAction("💭 ▸ 👣 Arrived to area: <b>"+areaName+"</b>");
  }
  animateUIElement(cardUIElement,"animate__fadeIn","1.2");
  redraw();
}

function animateFlipNextEncounter(){
  var animationHandler = function(){
    nextEncounter();
    registerClickListeners();
    cardUIElement.removeEventListener("animationend",animationHandler);
  }
  cardUIElement.removeEventListener("animationend",animationHandler);

  animateUIElement(areaUIElement,"animate__flipOutX","1.2");
  animateUIElement(cardUIElement,"animate__flipOutY","1.2");

  removeClickListeners();

  cardUIElement.addEventListener('animationend',animationHandler);
}

function gameOver(silent=false){
  //Random death messages
  var deathMsg=["Your life has sliped into silence.","The last breath of life has faded.","You have ran out of blood.","Your adventure has ended.","Your life has ended, shadows remain.","Your life has withered away.","Your fate has been sealed forever.","The end has come\ darkness awaits.","Silence has taken the hold.","Your journey has ended here."]
  deathMsg=chooseFrom(deathMsg)

  //Reset progress to death encounter
  if ((enemyMsg=="")||(enemyType=="Pet")||(enemyType=="Altar")||(enemyType.includes("Container")||enemyType=="Prop"||enemyType=="Consumable")) enemyMsg=deathMsg;
  if (enemyTeam.includes("Lover's Memento")) enemyMsg="Killed by a severe heartbreak.";
  if (!silent) logAction(enemyEmoji+"&nbsp;▸&nbsp;💀 "+enemyMsg);
  adventureEndTime=getTime();
  adventureEndReason="\nKilled by: "+enemyEmoji+" "+enemyName;
  runLogAdd("run_end", {outcome: "death", killedBy: enemyName, killedByEmoji: enemyEmoji, area: areaName, time: adventureEndTime});
  downloadRunLog();
  SaveManager.saveSession({
    date: adventureStartTime,
    playerName: playerName,
    level: playerLevel,
    kills: playerKills,
    area: areaName,
    causeOfDeath: enemyEmoji + ' ' + enemyName,
    outcome: 'death',
    actionLog: adventureLog,
    playerHpMax: playerHpMax,
    playerStaMax: playerStaMax,
    playerAtk: playerAtk,
    playerMgkMax: playerMgkMax,
    playerLootString: String(playerLootString),
    playerPartyString: String(playerPartyString)
  });
  encounterIndex=-1; //Must be index-1 due to nextEncounter() function
  playerSta=0; //You are just tired when dead :)
  playerMgk=0;

  curtainFadeInAndOut("<p style=\"color:"+colorRed+";letter-spacing: 1.8px;-webkit-text-stroke: 6.5px black;paint-order: stroke fill;font-size:52px;line-height:20px;\">You died!</p><p style=\"font-size:20px;\""+decorateStatusText("",enemyMsg,colorWhite));
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
  runLogAdd("run_end", {outcome: "win", area: areaName, time: adventureEndTime});
  downloadRunLog();
  SaveManager.saveSession({
    date: adventureStartTime,
    playerName: playerName,
    level: playerLevel,
    kills: playerKills,
    area: areaName,
    causeOfDeath: '👑 Completed the adventure',
    outcome: 'win',
    actionLog: adventureLog,
    playerHpMax: playerHpMax,
    playerStaMax: playerStaMax,
    playerAtk: playerAtk,
    playerMgkMax: playerMgkMax,
    playerLootString: String(playerLootString),
    playerPartyString: String(playerPartyString)
  });

  // Run is over — clear the active run so Continue is not offered after a win
  SaveManager.clearGameState();

  //Reset progress to game start
  resetSeenEncounters();
  processStoryData(storyData,false);
}
