//Game logic
function resolveAction(button){ //Yeah, this is bad, like really bad
  return function(){ //Well, stackoverflow comes to the rescue
    // Consume the action-bar skill check result (null = no check, true/false = pass/fail)
    var _skillOK = actionBarSuccess;
    actionBarSuccess = null;
    var _crit = actionBarCrit;
    actionBarCrit = null;

    if (isEndingState) { resolveEnding(button); return; }

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
            permanentDeath("<p style=\"color:#fff;-webkit-text-stroke:4px black;paint-order:stroke fill;\">Another damned soul.</p>");
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
          drachmaeBuy(1,"Aspect");
          break;
        }

        var _smashableTrap = (enemyType==="Trap" || enemyType==="Trap-Roll" || enemyType==="Trap-Obstacle");
        if (enemyType!="Upgrade" && !(_smashableTrap && _crit==='success')) {
          if (playerSta > 0) playerSta--;
        }

        // Corpse state — neutralized only (killed disables the button)
        if (corpseState === "neutralized") {
          if (_skillOK === false) {
            if (_crit === 'fail') {
              logPlayerAction(actionString,"Missed so badly you hit yourself -1 💔 -1 🟢");
              playerHit(1,false);
            } else {
              logPlayerAction(actionString,"Missed the motionless target -1 🟢");
            }
            displayPlayerCannotEffect();
            break;
          }
          var _cdmg = playerAtk + playerAtkBonus;
          if (_crit === 'success') _cdmg++;
          displayEnemyEffect("💢");
          enemyHpLost = Math.min(parseInt(enemyHp), parseInt(enemyHpLost) + _cdmg);
          if (parseInt(enemyHpLost) >= parseInt(enemyHp)) {
            logPlayerAction(actionString, (_crit==='success')
              ? "Struck them extra hard — a killing blow -"+_cdmg+" 💔"
              : "Dealt a killing blow -"+_cdmg+" 💔");
            var _kxp=parseInt(playerGainXP(1,0,""));
            logAction(corpseSnapshot.emoji+" ▸ ☠️ Final blow delivered"+decorateStatusText("","+"+_kxp+" XP",colorGold));
            playerKarma--; playerKills++;
            AchievementManager.check('kill');
            transitionToCorpse("killed");
          } else {
            logPlayerAction(actionString,"Struck the helpless target -"+_cdmg+" 💔");
            wakeUpEnemy();
          }
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
            logPlayerAction(actionString, _crit==='success'
              ? "Obliterated it without a flinch."
              : "Smashed it into tiny bits -1 🟢");
            displayEnemyEffect("〽️");
            displayEnemyCannotEffect();
            isFishing=false;
            nextEncounter();
            break;

          case "Trap-Obstacle":
            displayEnemyEffect("〽️");
            displayEnemyCannotEffect();
            isFishing=false;
            if (_skillOK === false) {
              if (_crit === 'fail') {
                logPlayerAction(actionString, "Missed so bad you hurt yourself -1 💔");
                playerHit(1, false);
              } else {
                logPlayerAction(actionString, "Couldn't break through -1 🟢");
              }
              break;
            }
            logPlayerAction(actionString, _crit==='success'
              ? "Obliterated it without a flinch."
              : "Smashed it into tiny bits -1 🟢");
            nextEncounter();
            break;

          case "Trap-Attack": //Attacking causes you damage
            displayEnemyEffect("〽️");
            displayEnemyCannotEffect();

            if (encounterUsed){
                logPlayerAction(actionString,"Seems like that was it for now.")
                break;
              }

            if (totalBonus > 0) {
              if (_skillOK === false) {
                if (_crit === 'fail') {
                  playerChangeStats(-enemyHp, -enemyAtk, -enemySta, -enemyLck, -enemyInt, -enemyMgk, -enemyDef, "Terrible form — you set yourself back.", true, false);
                } else {
                  logPlayerAction(actionString, "Poor form, gained nothing. -1 🟢");
                }
                break;
              }
              encounterUsed = true;
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
              if (_crit === 'fail') {
                logPlayerAction(actionString, "Missed so bad you hit yourself -1 💔 -1 🟢");
                playerHit(1, false);
              } else {
                logPlayerAction(actionString, "You missed your attack -1 🟢");
              }
              displayEnemyDodgeEffect();
              if (!enemyAttacked) enemyAttackOrRest();
              break;
            }

            //if (enemyType=="Tough") enemyDef=1; //Hehe, should Tough have something špeci?
            if (_crit === 'success') {
              logPlayerAction(actionString, "Your attack hit them extra hard -"+(playerAtk+playerAtkBonus-enemyDef+1)+" 💔");
              enemyHit(playerAtk+playerAtkBonus-enemyDef+1,false,true,true);
            } else {
              enemyHit(playerAtk+playerAtkBonus-enemyDef);
            }

            if ((parseInt(enemyHp)-parseInt(enemyHpLost) > 0) && !enemyAttacked) { //If they survive, they counterattack or regain stamina
              enemyAttackOrRest();
            }
            break;

          case "Swift": //Dodge only on fail; player always hits on pass
            if (enemyCastIfMgk(true)) enemyAttacked=true;

            if (_skillOK === false) {
              if (_crit === 'fail') {
                logPlayerAction(actionString, "Missed them, hit yourself -1 💔 -1 🟢");
                playerHit(1, false);
              } else {
                logPlayerAction(actionString, "Your attack missed them -1 🟢");
              }
              displayEnemyDodgeEffect();
              if ((parseInt(enemySta)-parseInt(enemyStaLost) > 0) && !enemyAttacked) {
                displayEnemyEffect("🌀");
                if ((enemyAtk+enemyAtkBonus)>0){
                  enemyStaminaChangeMessage(-1,"They dodged that and retaliated -"+(enemyAtk+enemyAtkBonus)+" 💔","n/a");
                  playerHit(enemyAtk+enemyAtkBonus);
                } else {
                  enemyStaminaChangeMessage(-1,"They barely dodged your attack.","They needed to catch a breath.");
                }
              } else if (!enemyAttacked) {
                enemyAttackOrRest();
              }
              break;
            }

            if (_crit === 'success') {
              logPlayerAction(actionString, "Your attack hit them extra hard -"+(playerAtk+1)+" 💔");
              enemyHit(playerAtk+1,false,true,true);
            } else {
              enemyHit(playerAtk);
            }
            if ((parseInt(enemyHp)-parseInt(enemyHpLost) > 0) && !enemyAttacked) {
              enemyAttackOrRest();
            }
            break;

          case "Upgrade":
            //Health
            logPlayerAction(actionString,"Got more resilient <b>+1 ❤️ Health</b>.");
            displayPlayerGainedEffect();
            displayPlayerEffect("❤️");
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
                AchievementManager.check('smash_door_first');
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
          permanentDeath(null);
          break;
        }

        const noStaForRollMessage = "Too tired to make any move.";
        var rollMessage;

        switch (enemyType){ //Dodge attack or walk if they are harmless
          case "Curse":
            if (!encounterUsed) {
              if (_skillOK === true) {
                logPlayerAction(actionString,"Endured without any side-effect.");
                displayEnemyCannotEffect();
                displayPlayerEffect("✨");
                encounterUsed=true;
              } else {
                playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg);
                encounterUsed=true;
              }
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
              } else if (_skillOK === false) {
                if (Math.random() < 0.25) {
                  logPlayerAction(actionString, "Stepped badly, sprained your ankle -1 💔");
                  playerHit(1);
                } else {
                  playerSta = Math.max(0, playerSta - 1);
                  logPlayerAction(actionString, "Stumbled, almost falling over -1 🟢");
                  displayPlayerCannotEffect();
                }
              } else {
                logPlayerAction(actionString,"Walked away leaving them behind.");
              }
              isFishing=false;
              if (playerHp > 0) animateFlipNextEncounter();
              break;
            }

            if (playerSta > 0 && _crit !== 'success') playerSta--;

            if (enemyCastIfMgk(false)){
              logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
              displayEnemyCannotEffect();
              displayPlayerEffect("🌀");
              break;
            }

            if (_skillOK === false && (enemyType === "Toxic" || enemyType === "Hot")) {
              var _toxicDmg = Math.max(1, enemyAtk+enemyAtkBonus);
              logPlayerAction(actionString, "Oops, fallen right onto them -"+_toxicDmg+" 💔 -1 🟢");
              displayPlayerCannotEffect();
              playerHit(_toxicDmg);
              break;
            }

            if (_skillOK === false && (enemySta-enemyStaLost) <= 0 && (enemyAtk+enemyAtkBonus) > 0) {
              var _dodgeDmg = enemyAtk+enemyAtkBonus;
              logPlayerAction(actionString, "Dodged so slowly they hit you -"+_dodgeDmg+" 💔 -1 🟢");
              displayPlayerCannotEffect();
              playerHit(_dodgeDmg);
              break;
            }

            if (_skillOK === false && (enemyAtk+enemyAtkBonus) > 0) {
              var _dodgeDmg = enemyAtk+enemyAtkBonus;
              if (_crit === 'fail') {
                playerSta = Math.max(0, playerSta - 1);
                logPlayerAction(actionString, "Tripped right into them -"+_dodgeDmg+" 💔 -2 🟢");
              } else {
                logPlayerAction(actionString, "Dodge failed, took the hit -"+_dodgeDmg+" 💔 -1 🟢");
              }
              displayPlayerCannotEffect();
              playerHit(_dodgeDmg);
              break;
            }

            if (_crit === 'success') {
              rollMessage="Glided past, untouched.";
            } else if ((enemyAtk+enemyAtkBonus)!=0){
              rollMessage="Successfully dodged their attack -1 🟢";
            } else {
              rollMessage="They do not mean any harm -1 🟢";
            }

            enemyStaminaChangeMessage(-1,rollMessage,"Your roll was a waste of energy -1 🟢");
            displayPlayerEffect("🌀");
            break;

          case "Swift":
            if (((enemyAtk+enemyAtkBonus)<=0) && ((enemyMgk-enemyMgkLost)<=0)){
              if (enemyAtkBonus<0){
                playerGainXP(1.5,0,"They let you walk away");
              } else if (_skillOK === false) {
                if (Math.random() < 0.25) {
                  logPlayerAction(actionString, "Stepped badly, sprained your ankle -1 💔");
                  playerHit(1);
                } else {
                  playerSta = Math.max(0, playerSta - 1);
                  logPlayerAction(actionString, "Stumbled, almost falling over -1 🟢");
                  displayPlayerCannotEffect();
                }
              } else {
                logPlayerAction(actionString,"Walked away leaving them behind.");
              }
              isFishing=false;
              if (playerHp > 0) nextEncounter();
              break;
            }

            if (enemyCastIfMgk(false) && playerUseStamina(1,noStaForRollMessage)){
              logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
              break;
            }

            if (playerSta > 0 && _crit !== 'success') playerSta--;
            if (_skillOK === true) {
              enemyStaminaChangeMessage(-1,
                _crit === 'success' ? "Glided past a swift attack." : "Barely slipped a swift attack -1 🟢",
                "Rolled out of the way -1 🟢");
              displayEnemyCannotEffect();
              displayPlayerEffect("🌀");
            } else {
              if (_crit === 'fail') {
                playerSta = Math.max(0, playerSta - 1);
                enemyStaminaChangeMessage(-1,"Ran straight into their attack -"+enemyAtk+" 💔 -2 🟢","Rolled into a surprise attack -"+enemyAtk+" 💔");
              } else {
                enemyStaminaChangeMessage(-1,"Failed to dodge their attack -"+enemyAtk+" 💔","Rolled into a surprise attack -"+enemyAtk+" 💔");
              }
              playerHit(enemyAtk);
            }
            break;

          case "Heavy":
            if (((enemyAtk+enemyAtkBonus)<=0) && ((enemyMgk-enemyMgkLost)<=0)){
              if (enemyAtkBonus<0){
                playerGainXP(1.5,0,"They let you walk away");
              } else if (_skillOK === false) {
                if (Math.random() < 0.25) {
                  logPlayerAction(actionString, "Stepped badly, sprained your ankle -1 💔");
                  playerHit(1);
                } else {
                  playerSta = Math.max(0, playerSta - 1);
                  logPlayerAction(actionString, "Stumbled, almost falling over -1 🟢");
                  displayPlayerCannotEffect();
                }
              } else {
                logPlayerAction(actionString,"Walked away leaving them behind.");
              }
              isFishing=false;
              if (playerHp > 0) animateFlipNextEncounter();
              break;
            }

            if (enemyCastIfMgk(false) && playerUseStamina(1,noStaForRollMessage)){
              logPlayerAction(actionString,"Successfully dodged their spell -1 🟢");
              displayEnemyCannotEffect();
              displayPlayerEffect("🌀");
              break;
            }

            if (playerUseStamina(1,noStaForRollMessage)){
              if (_skillOK === false && (enemyAtk+enemyAtkBonus) > 0 && (enemySta-enemyStaLost) > 0) {
                enemyStaminaChangeMessage(-1,"Rolled so slow they hit you anyway -"+(enemyAtk+enemyAtkBonus)+" 💔","Rolled around wasting energy -1 🟢");
                playerHit(enemyAtk+enemyAtkBonus);
              } else {
                enemyStaminaChangeMessage(-1,"Dodged a heavy attack -1 🟢","Rolled around wasting energy -1 🟢");
                displayEnemyCannotEffect();
                displayPlayerEffect("🌀");
              }
            }
            break;

          case "Item": //You'll simply skip ahead
          case "Consumable":
          case "Checkpoint":
            if (enemyName === "Dream Shrimp") {
              displayEnemyCannotEffect();
              logPlayerAction(actionString, "Can't leave this behind.");
              break;
            }
            if (isFishing){
              isFishing=false;
              logPlayerAction(actionString,"Threw it back into the water.");
              var _savedRested = playerRested;
              nextEncounter();
              playerRested = _savedRested;
              break;
            } else {
              if (enemyTeam.includes("Lover's Memento")){
                playerAtk++;
                playerLove-=2;
                playerKarma-=2;
                AchievementManager.check('letter_ditch');
                logPlayerAction(actionString,"<text style=color:"+colorRed+";>You tossed it aside with hatred! +1 ⚔️</text>");
                displayPlayerCannotEffect();
                nextEncounter();
                break;
              }
              if (_skillOK === false) {
                if (playerSta > 0) playerSta--;
                logPlayerAction(actionString,"Threw it unnecessarily far -1 🟢");
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
                logPlayerAction(actionString, "Stepped badly, sprained your ankle -1 💔");
                playerHit(1);
              } else {
                playerSta = Math.max(0, playerSta - 1);
                logPlayerAction(actionString, "Stumbled, almost falling over -1 🟢");
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
              if (totalBonus > 0) {
                if (_skillOK === false) {
                  if (_crit === 'fail') {
                    playerChangeStats(-enemyHp, -enemyAtk, -enemySta, -enemyLck, -enemyInt, -enemyMgk, -enemyDef, "Terrible form — you set yourself back.", true, false);
                  } else {
                    logPlayerAction(actionString, "Poor form, gained nothing. -1 🟢");
                  }
                  displayPlayerCannotEffect();
                  break;
                }
                encounterUsed = true;
              }
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
          drachmaeBuy(1,"Gamble",_skillOK);
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
          playerMgk+=1;
          playerMgkMax+=1;
          isFishing=false;
          animateFlipNextEncounter();
          break;
        }

        if (playerSta > 0 && _crit !== 'success') playerSta--;

        if ((enemyAtk+enemyAtkBonus)<=0 && (enemySta-enemyStaLost) > 0 && enemyType!="Pet" && enemyType!="Small" && enemyType!="Toxic" && enemyType!="Hot"){
          if (_skillOK === true) {
            if (enemyStaminaChangeMessage(-2,"Threw them off balance -1 🟢","They needed to catch a breath -1 🟢")) {
              logAction(enemyEmoji+"&nbsp;▸&nbsp;🌀 Scrambles to recover their footing.");
            }
          } else {
            enemyStaminaChangeMessage(-1,"They dodged out of your reach -1 🟢","They needed to catch a breath -1 🟢");
          }
          displayPlayerEffect("☝️");
          displayEnemyCannotEffect();
          break;
        }

        if (!enemyType.includes("Friend") && enemyCastIfMgk(true,"Could not block their spell")){
          break;
        }

        if (enemyType === "Spirit" && (enemyAtk+enemyAtkBonus) > 0) {
          logPlayerAction(actionString, "Could not block a spectral attack -"+(enemyAtk+enemyAtkBonus)+" 💔");
          playerHit(enemyAtk+enemyAtkBonus, true, true);
          break;
        }

        if (_skillOK === false && (enemyAtk+enemyAtkBonus) > 0
            && enemyType!=="Pet" && enemyType!=="Small" && enemyType!=="Friend" && enemyType!=="Swift") {
          var _blockFailDmg = enemyAtk + enemyAtkBonus;
          if (_crit === 'fail') {
            playerSta = Math.max(0, playerSta - 1);
            logPlayerAction(actionString, "Block crumbled inward -"+_blockFailDmg+" 💔 -2 🟢");
          } else {
            logPlayerAction(actionString, "They overpowered your block -"+_blockFailDmg+" 💔 -1 🟢");
          }
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
            enemyStaminaChangeMessage(-1,
              _crit === 'success' ? "Blocked without breaking a sweat." : "Blocked a regular attack -1 🟢",
              "Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Swift":
            if (_skillOK === false && (enemyAtk+enemyAtkBonus) > 0) {
              enemyStaminaChangeMessage(-1,"They hit you before you could react -"+(enemyAtk+enemyAtkBonus)+" 💔","Blocked just for the sake of it -1 🟢");
              playerHit(enemyAtk+enemyAtkBonus);
              break;
            }
            enemyStaminaChangeMessage(-1,
              _crit === 'success' ? "Blocked without breaking a sweat." : "Blocked a swift attack -1 🟢",
              "Blocked just for the sake of it -1 🟢");
            displayPlayerEffect("🔰");
            break;

          case "Heavy": //Too heavy or spirit attack — can succeed but very hard
            if (_skillOK === true) {
              enemyStaminaChangeMessage(-1,
                _crit === 'success' ? "Blocked without breaking a sweat." : "Barely blocked a heavy attack -1 🟢",
                "They needed to catch a breath.");
              displayPlayerEffect("🔰");
              break;
            }
            if (enemyStaminaChangeMessage(-1,"Could not block a heavy attack -"+enemyAtk+" 💔","They needed to catch a breath.")){
              playerHit(enemyAtk);
            } else {
              enemyStaminaChangeMessage(-1,"n/a","Blocked, but was not attacked -1 🟢");
              displayPlayerEffect("🔰");
            }
            break;

          case "Hot":
          case "Toxic":
            if (_skillOK === false) {
              var _passiveDmg = Math.max(1, enemyAtk + enemyAtkBonus);
              logPlayerAction(actionString, enemyType === "Hot"
                ? "Stood too close, got singed -" + _passiveDmg + " 💔"
                : "Breathed the fumes in -" + _passiveDmg + " 💔");
              playerHit(_passiveDmg);
            } else {
              var _deflectMsg = enemyType === "Hot"
                ? (_crit === 'success' ? "Perfectly deflected the heat." : "Deflected the heat -1 🟢")
                : (_crit === 'success' ? "Perfectly blocked the fumes."  : "Covered your face, blocked the fumes -1 🟢");
              enemyStaminaChangeMessage(-1, _deflectMsg, "Blocked, but was not attacked -1 🟢");
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

          AchievementManager.check('cast_first');

          // Corpse state — neutralized cast deals magic damage; killed does nothing
          if (corpseState !== "") {
            if (corpseState === "killed") {
              logPlayerAction(actionString,"Already dead.");
              displayPlayerCannotEffect();
              break;
            }
            // neutralized
            if (_skillOK === false) {
              playerMgk-=mkgCost;
              if (_crit === 'fail') {
                var _cbf=Math.max(1,magicDamage);
                logPlayerAction(actionString,"Spell snapped back -"+_cbf+" 💔 -"+mkgCost+" 🔵");
                playerHit(_cbf,false);
              } else {
                logPlayerAction(actionString,"Spell fizzled -"+mkgCost+" 🔵");
              }
              displayEnemyCannotEffect();
              break;
            }
            playerMgk-=mkgCost;
            var _cmdg=Math.min(magicDamage,2);
            if (_crit==='success') _cmdg++;
            displayEnemyEffect("💢");
            enemyHpLost=Math.min(parseInt(enemyHp),parseInt(enemyHpLost)+_cmdg);
            if (parseInt(enemyHpLost)>=parseInt(enemyHp)) {
              logPlayerAction(actionString,(_crit==='success')
                ? "Spell was especially effective — a killing blow -"+_cmdg+" 💔"
                : "Spell delivered a killing blow -"+_cmdg+" 💔");
              var _kxp2=parseInt(playerGainXP(1,0,""));
              logAction(corpseSnapshot.emoji+" ▸ ☠️ Final blow delivered"+decorateStatusText("","+"+_kxp2+" XP",colorGold));
              playerKarma--; playerKills++;
              AchievementManager.check('kill');
              transitionToCorpse("killed");
            } else {
              logPlayerAction(actionString,"Struck the helpless target -"+_cmdg+" 💔");
              wakeUpEnemy();
            }
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
              AchievementManager.check('magic_unlock_first');
              enemyType=enemyType.replace("Locked-","");
              enemyHp=0;
              enemyMsg="Uncovered what was locked inside.";
              redraw();
              break;
            }
          }

          if (enemyType!="Death" && playerCooked!=true && (enemyType=="Consumable" && !playerLootString.includes("🧂"))) displayPlayerEffect("🪄"); //I'm lazy

          if (_skillOK === false && !enemyType.includes("Locked") && !enemyType.includes("Container")
              && enemyType!=="Consumable" && enemyType!=="Item" && enemyType!=="Altar"
              && enemyType!=="Upgrade" && enemyType!=="Dream" && enemyType!=="Reflective") {
            var _backfireDmg = (_crit === 'fail') ? Math.max(1, playerMgk) : 0;
            playerMgk -= mkgCost;
            if (_crit === 'fail') {
              logPlayerAction(actionString, "Spell snapped back -"+_backfireDmg+" 💔 -"+mkgCost+" 🔵");
              playerHit(_backfireDmg, false);
            } else {
              logPlayerAction(actionString, "Spell fizzled -"+mkgCost+" 🔵");
            }
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

          case "Reflective":
            if ((parseInt(enemyHp)-parseInt(enemyHpLost))==1) magicDamage=1;
            if (magicDamage > 2) magicDamage=2;
            if (_skillOK === false) {
              // Spell reflects back as HP damage
              playerMgk -= mkgCost;
              displayEnemyEffect("🔷");
              displayEnemyCannotEffect();
              logPlayerAction(actionString, "Spell reflected back -"+magicDamage+" 💔 -"+mkgCost+" 🔵");
              playerHit(magicDamage, false);
              if (enemyCastIfMgk(true)) enemyAttacked=true;
              if (!enemyAttacked) enemyAttackOrRest();
            } else {
              // Landed — spell bypasses reflection
              playerMgk-=magicDamage;
              var magicBonusDamage=0;
              if (procAbilityChance("💫",100)) magicBonusDamage=1;
              if ((enemyMgk-enemyMgkLost)<=magicDamage){
                if (_crit === 'success') {
                  logPlayerAction(actionString,"Spell pierced their defenses.");
                  enemyHit(magicDamage+magicBonusDamage+1,true);
                } else {
                  enemyHit(magicDamage+magicBonusDamage,true);
                }
              } else {
                logPlayerAction(actionString,"They resisted your spell -"+magicDamage+" 🔵");
                enemyMgkLost+=magicDamage;
                if (enemyMgkLost>enemyMgk) enemyMgkLost=enemyMgk;
              }
              if (enemyHp-enemyHpLost > 0) {
                if (enemyCastIfMgk()) break;
                enemyAttackOrRest();
              }
            }
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
              if (_crit === 'success') {
                logPlayerAction(actionString, "Your spell was especially effective -"+(magicDamage+magicBonusDamage+1)+" 💔");
                enemyHit(magicDamage+magicBonusDamage+1,true,true,true);
              } else {
                enemyHit(magicDamage+magicBonusDamage,true);
              }
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
                AchievementManager.check('salt_food');
              } else {
                enemyName=enemyName+" (Crispy)";
                playerMgk-=1;
              }

              playerCooked=true;
              AchievementManager.check('cook_food');
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
            playerLck++;
            playerInt++;
            //playerKarma++; //Hmmm
            animateFlipNextEncounter();
            break;
          }

          if (playerMgk<1 && enemyType!=="Curse" && enemyType!=="Altar"){
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
              && enemyType!=="Dream" && enemyType!=="Death" && enemyType!=="Curse") {
            playerMgk--;
            if (_crit === 'fail' && (enemyHp - enemyHpLost) < enemyHp) {
              enemyHpLost = Math.max(0, enemyHpLost - 1);
              logPlayerAction(actionString, "Healed the wrong target -1 🔵");
              displayEnemyEffect("❤️");
            } else {
              logPlayerAction(actionString, "Failed to cast a healing spell -1 🔵");
            }
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }

        switch (enemyType){
          case "Curse": //Breaks only if mind is stronger
            if (_skillOK){
              if (!encounterUsed) {
                logPlayerAction(actionString,"Managed to keep it together +1 🧠");
                playerInt++;
                displayPlayerGainedEffect();
                encounterUsed=true;
              } else {
                logPlayerAction(actionString,"Seems like that was it.");
                displayPlayerCannotEffect();
                displayPlayerEffect("");
              }
            } else {
              playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,"Gave your best, but failed.",true,false);
              encounterUsed=true;
              displayPlayerCannotEffect();
            }
            break;

          case "Spirit":
          case "Demon":
            if ((playerMgk>0)&&(enemyInt <= playerInt )){
              var gainedXP=playerGainXP(1.25,0,"")
              logPlayerAction(actionString,"Banished them from this world -1 🔵 "+decorateStatusText("","+"+gainedXP+" XP",colorGold));
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
            playerHeal(_crit === 'success');
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
            // Altar pray/offer is now on button_speak; button_pray acts as Heal here
            playerHeal();
            break;

          default:
            var prayLogMessage="Your prayer had no visible effect."
            playerHeal();
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
            playerChangeStats(0, 0, 0, 2, 0, 0,0,"n/a",false,false);
            isFishing=false;
            animateFlipNextEncounter();
            break;
        }

        if (!playerUseMagic(2,"Not enough mana, requires +2 🔵")) { //Curse is never free, upgrd handled above
            break;
          }

        AchievementManager.check('curse_first');
        if (enemyType!="Death") {displayPlayerEffect("🪬");}

          // Reflective curse-back: failed skill check = curse snaps back onto the caster
          if (_skillOK === false && enemyType === "Reflective") {
            logPlayerAction(actionString, "Curse reflected back -1 ⚔️ -2 🔵");
            displayEnemyEffect("🔷");
            displayPlayerCannotEffect();
            playerAtk = Math.max(0, playerAtk - 1);
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }

          if (_skillOK === false && enemyType!=="Upgrade" && enemyType!=="Death"
              && enemyType!=="Altar" && enemyType!=="Demon" && enemyType!=="Reflective") {
            if (_crit === 'fail') {
              playerAtk = Math.max(0, playerAtk - 1);
              logPlayerAction(actionString, "The curse turned on you -1 ⚔️ -2 🔵");
            } else {
              logPlayerAction(actionString, "Curse dissolved without effect -2 🔵");
            }
            displayEnemyCannotEffect();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }

      switch (enemyType){
        case "Reflective":
          // Curse landed (fail was caught above and broke early)
          if (playerMgkMax > enemyMgk && (enemyAtkBonus+enemyAtk)>0) {
            displayEnemyCannotEffect();
            displayEnemyEffect("🪬");
            var enemyAtkChange=Math.floor((1+enemyAtk+enemyAtkBonus)/2);
            enemyAtkBonus-=enemyAtkChange;
            if (_crit === 'success' && (enemyAtkBonus+enemyAtk) > 0) {
              enemyAtkBonus--;
              logPlayerAction(actionString,"The hex pierced their reflection -"+(enemyAtkChange+1)+" ⚔️ for -2 🔵");
            } else {
              logPlayerAction(actionString,"Curse bypassed their reflection -"+enemyAtkChange+" ⚔️ for -2 🔵");
            }
            enemyCursed=true;
            logAction(enemyEmoji+" ▸ 😱 They got terrified and couldn't react.");
          } else if (playerMgkMax <= enemyMgk) {
            logPlayerAction(actionString,"They resisted your curse -2 🔵");
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
          } else {
            logPlayerAction(actionString,"Your curse had no effect on them -2 🔵");
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
          }
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
            if (_crit === 'success' && (enemyAtkBonus+enemyAtk) > 0) {
              enemyAtkBonus--;
              logPlayerAction(actionString,"The hex sank deep -"+(enemyAtkChange+1)+" ⚔️ weaker for -2 🔵");
            } else {
              logPlayerAction(actionString,"Cursed them -"+enemyAtkChange+" ⚔️ weaker for -2 🔵");
            }
            enemyCursed=true;
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

        // Corpse search
        if (corpseState !== "") {
          if (corpseHasLoot) {
            displayEnemyEffect("👋");
            logPlayerAction(actionString,"Searched through the remains.");
            if (typeof TelemetryManager !== 'undefined') TelemetryManager.setLootSource('drop');
            pushEncounter(corpseLoot);
            corpseHasLoot=false; corpseLoot=null;
            nextEncounter();
          } else {
            logPlayerAction(actionString,"Nothing left to take.");
            displayPlayerCannotEffect();
          }
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
            } else if (enemySta - enemyStaLost > 0){ //Enemy resists if they have stamina
              if (_skillOK === false) {
                if (_crit === 'fail' && (enemyAtk+enemyAtkBonus) > 0) {
                  var _ctrAtk = enemyAtk + enemyAtkBonus;
                  logPlayerAction(actionString, "They reversed the grab! -"+_ctrAtk+" 💔");
                  displayEnemyEffect("💢");
                  playerHit(_ctrAtk);
                } else {
                  if (playerSta > 0) playerSta--;
                  enemyDodged("Missed, they slipped your grasp -1 🟢");
                }
                displayEnemyCannotEffect();
                if (enemyCastIfMgk()) break;
                break;
              }
              if (_crit === 'success') {
                // Guaranteed strangle, skip luck check
                logPlayerAction(actionString,"Grabbed them into stranglehold -1 🟢");
                if (playerSta > 0) playerSta--;
                enemyKnockedOut();
                isFishing=false;
                break;
              }
              // Regular success — luck may spook them for free, otherwise strangle
              var touchChance = Math.floor(Math.random(10) * luckInterval);
              if ( touchChance <= playerLck ){
                var gainedXP=parseInt(playerGainXP(1,0,""));
                logAction("🍀 ▸ ✋ <b>Luckily</b>, they were spooked. "+ decorateStatusText("","+"+gainedXP+" XP",colorGold));
                displayEnemyEffect("💨");
                displayPlayerEffect("🍀");
                animateFlipNextEncounter();
                isFishing=false;
                break;
              }
              logPlayerAction(actionString,"Grabbed them into stranglehold -1 🟢");
              if (playerSta > 0) playerSta--;
              enemyKnockedOut();
              isFishing=false;
            } else { //Player and enemy have no stamina - asymetrical rest
              if (_skillOK === false) {
                logPlayerAction(actionString,"Too exhausted to grab them.");
                displayPlayerCannotEffect();
                break;
              }
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
            if (_skillOK === true) {
              if (playerSta > 0) playerSta--;
              if (_crit === 'success') {
                enemyStaLost = enemySta; // Fully stagger — drain all remaining energy
                logPlayerAction(actionString, "Staggered them, fully drained their energy -1 🟢");
              } else {
                enemyStaLost = Math.min(enemySta, enemyStaLost + 2);
                logPlayerAction(actionString, "Snatched them, they slipped away -1 🟢");
              }
              displayEnemyCannotEffect();
              break;
            }
            displayEnemyEffect("🌀");
            if ((enemyAtk+enemyAtkBonus) > 0) {
              enemyAttackOrRest("Dodged that and retaliated -"+(enemyAtk+enemyAtkBonus)+" 💔");
            } else {
              enemyStaminaChangeMessage(-1, "Effortlessly dodged the grab.", "n/a");
              displayEnemyCannotEffect();
            }
            break;

          case "Heavy":
            if (enemyCastIfMgk()) break;
            if ((enemySta - enemyStaLost) <= 0) { // Tired heavy — kick them
              enemyKicked();
              break;
            }
            // Active heavy: very hard, fail enrages (+ATK)
            if (_skillOK === true) {
              if (playerSta > 0) playerSta--;
              logPlayerAction(actionString,"Managed to overpower them! -1 🟢");
              displayEnemyEffect("💢");
              enemyKnockedOut();
              isFishing=false;
            } else {
              if (_crit === 'fail') {
                enemyAtkBonus += 2;
                var _enrageAtk = enemyAtk + enemyAtkBonus;
                logPlayerAction(actionString,"Pissed them off immensely! -"+_enrageAtk+" 💔");
              } else {
                enemyAtkBonus++;
                var _enrageAtk = enemyAtk + enemyAtkBonus;
                logPlayerAction(actionString,"Enraged them, took the hit -"+_enrageAtk+" 💔");
              }
              displayEnemyEffect("💢");
              playerHit(_enrageAtk);
            }
            break;

          case "Boss":
            if (enemyCastIfMgk()) break;
            if ((enemySta - enemyStaLost) > 0){
              if (_skillOK === true) {
                if (playerSta > 0) playerSta--;
                logPlayerAction(actionString,"Managed to overpower them! -1 🟢");
                displayEnemyEffect("💢");
                enemyKnockedOut();
                isFishing=false;
              } else {
                var damageReceived=(enemyAtk+enemyAtkBonus);
                if (damageReceived>0) {
                  damageReceived += (_crit === 'fail') ? 3 : 2;
                  logPlayerAction(actionString, (_crit === 'fail')
                    ? "Completely overwhelmed! -"+damageReceived+" 💔"
                    : "Got overpowered and hit hard -"+damageReceived+" 💔");
                  playerHit(damageReceived);
                  enemyStaLost++;
                } else {
                  logPlayerAction(actionString,"They are too big to grasp!");
                  displayPlayerCannotEffect();
                }
              }
            } else {
              enemyKicked();
            }
            break;

          case "Trap-Obstacle": //Removes from the way
            if (_skillOK === false) {
              if (_crit === 'fail') {
                logPlayerAction(actionString,"So clumsy you hurt yourself -1 💔");
                playerHit(1, false);
              } else {
                if (playerSta > 0) playerSta--;
                logPlayerAction(actionString,"Tried but couldn't shift it -1 🟢");
                displayPlayerCannotEffect();
              }
              break;
            }
            if (_crit === 'success') {
              logPlayerAction(actionString,"Cleared it without a flinch.");
            } else {
              if (playerSta > 0) playerSta--;
              logPlayerAction(actionString,"Cleared it from the way forward -1 🟢");
            }
            nextEncounter();
            break;

          case "Trap-Attack":
            if (totalBonus > 0) {
              displayEnemyCannotEffect();
              logPlayerAction(actionString,"Touched it, nothing happened.");
              break;
            }
            if (_skillOK === false) {
              if (_crit === 'fail' && !encounterUsed) {
                // Fumbled in — trigger the trap and take extra damage
                if (enemyHp<=0) playerHpMax-=enemyHp;
                if (enemySta<=0) playerStaMax-=enemySta;
                playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, "Fumbled right into it.",true,false);
                playerHit(1, false);
                if (enemyHp < 0 && playerHp > 0) AchievementManager.check('survive_trap');
              } else {
                logPlayerAction(actionString,"Pulled back just in time.");
                displayPlayerCannotEffect();
              }
              break;
            }
            // Grab success: trigger the trap, spend 1 STA unless crit pass
            if (encounterUsed) { logPlayerAction(actionString,"Seems like that was it for now."); displayPlayerCannotEffect(); break; }
            if (_crit !== 'success' && playerSta > 0) playerSta--;
            if (totalBonus<=0 && totalMalus>=0) displayPlayerCannotEffect();
            if (enemyHp<=0) playerHpMax-=enemyHp;
            if (enemySta<=0) playerStaMax-=enemySta;
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg,true,false);
            if (enemyHp < 0 && playerHp > 0) AchievementManager.check('survive_trap');
            break;

          case "Trap": //Grabbing triggers the effect
          case "Trap-Big":
          case "Trap-Roll":
            if (encounterUsed){
                logPlayerAction(actionString,"Seems like that was it for now.")
                displayPlayerCannotEffect();
                break;
            }

            if (totalBonus > 0) {
              if (_skillOK === false) {
                if (_crit === 'fail') {
                  playerChangeStats(-enemyHp, -enemyAtk, -enemySta, -enemyLck, -enemyInt, -enemyMgk, -enemyDef, "Terrible form — you set yourself back.", true, false);
                } else {
                  logPlayerAction(actionString, "Poor form, gained nothing. -1 🟢");
                }
                displayPlayerCannotEffect();
                break;
              }
              encounterUsed = true;
            }

            if (totalBonus<=0 && totalMalus>=0) displayPlayerCannotEffect();

            if (enemyHp<=0) playerHpMax-=enemyHp; //Don't lose max hp
            if (enemySta<=0) playerStaMax-=enemySta; //Don't lose max sta
            playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg,true,false);
            if (enemyHp < 0 && playerHp > 0) AchievementManager.check('survive_trap');
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

              playerName=playerName;
              playerEmoji=polymorph;
              displayPlayerCannotEffect();
              playerRest(true);
            }

            if (!enemyTeam.includes("Lover's Memento")) { //Add to loot
              if (enemyEmoji!="🪙" && enemyEmoji!="💰") playerLootString+=enemyEmoji;
              if (enemyEmoji=="👺" || enemyEmoji=="🐴" || enemyEmoji=="🐷") {
                playerEmoji = enemyEmoji;
              }
              displayPlayerGainedEffect();
            } else {
              playerKarma++;
              playerLove++;
              AchievementManager.check('letter_grab');
              enemyMsg="<text style=color:"+colorGold+";>You just had to take it with yourself.</text>";
            }

            if (enemyEmoji=="🪙"){
              if (enemyName.includes("Lucky")) {
                spentCoins-=2; //Temporary coin for this run only, not persistent
              } else {
                if (savedCoins==0) curtainFadeInAndOut("<p style=\"color:"+colorLightShadeBlue+";-webkit-text-stroke: 6.5px black;paint-order: stroke fill;letter-spacing:1.8px;line-height:20px;font-size:42px;\">Drachma claimed!</p><p style=\"font-size:20px;\""+decorateStatusText("","Returns on death to shape your fate.",colorWhite),6);
                savedCoins+=1;
                localStorage.setItem('coins', parseInt(savedCoins));
                AchievementManager.check('coin_pickup', savedCoins);
              }
              displayPlayerEffect("🪙");
            }

            if (enemyEmoji=="💰"){
              var coinNumber=randomNumber(2,5);
              savedCoins+=coinNumber;
              displayPlayerEffect("🪙");
              localStorage.setItem('coins', parseInt(savedCoins));
              enemyMsg="Claimed <b>Ethereal Drachmae +"+coinNumber+" 🪙</b>";
              AchievementManager.check('coin_pickup', savedCoins);
            }

            //Item quality achievements
            if (enemyTeam.includes("Artifact") || enemyTeam.includes("Questionable Drink")) {
              AchievementManager.check('grab_artifact');
            } else if ((parseInt(totalBonus)+parseInt(totalMalus))>=2 || parseInt(enemyHp)>=2 || parseInt(enemyAtk)>=2 || (parseInt(enemyAtk)>=1 && parseInt(totalMalus)==0) || parseInt(enemySta)>=2 || parseInt(enemyMgk)>=2 || (parseInt(enemyMgk)>=1 && parseInt(totalMalus)==0)) {
              AchievementManager.check('grab_exquisite');
            } else if (parseInt(totalBonus)<=0 && enemyEmoji!='🪙' && enemyEmoji!='💰' && enemyEmoji!='🗝️' && enemyEmoji!='🔑' && !enemyTeam.includes("Lover")) {
              AchievementManager.check('grab_rubbish');
            }
            if (enemyEmoji!='🪙' && enemyEmoji!='💰') AchievementManager.check('loot_first');
            if (enemyEmoji==='🗝️' || enemyEmoji==='🔑') AchievementManager.check('key_first');
            //Grab end
            var _wasInFishing = isFishing;
            isFishing=false;
            if (playerHp==0) break;
            var _savedRested = _wasInFishing ? playerRested : false;
            playerChangeStats(enemyHp,enemyAtk,enemySta,enemyLck,enemyInt,enemyMgk,enemyDef,enemyMsg);
            if (_wasInFishing) playerRested = _savedRested;
            break;

          case "Small":
            if (_skillOK === false) {
              // Both sides tire from the failed grab attempt
              if (playerSta > 0) playerSta--;
              if (enemyStaLost < enemySta) enemyStaLost++;
              logPlayerAction(actionString, "Slipped through your fingers -1 🟢");
              displayEnemyCannotEffect();
              if (enemyCastIfMgk()) break;
              if ((enemySta - enemyStaLost) > 0) enemyAttackOrRest();
              break;
            }
            if (_crit === 'success') {
              // Perfect timing — grabbed without breaking a sweat, no stamina spent
              enemyGrabbedIntoLoot("Snatched it without breaking a sweat.");
              break;
            }
            // Normal success: spend 1 STA and pocket them
            if (playerSta > 0) playerSta--;
            enemyGrabbedIntoLoot();
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
              logPlayerAction(actionString, "Oops, slammed it to the ground.");
              displayEnemyCannotEffect();
              isFishing=false;
              nextEncounter();
              break;
            }
            //Consumable quality achievements
            if (enemyTeam.includes("Artifact") || enemyTeam.includes("Essence")) {
              AchievementManager.check('eat_legendary');
            } else if ((parseInt(totalBonus)+parseInt(totalMalus))>=2 || parseInt(enemyHp)>=2 || parseInt(enemyAtk)>=2 || parseInt(enemySta)>=2 || parseInt(enemyMgk)>=2) {
              AchievementManager.check('eat_purple');
            } else if (parseInt(enemyHp)<0 || parseInt(enemyAtk)<0 || parseInt(enemySta)<0 || parseInt(enemyLck)<0 || parseInt(enemyInt)<0 || parseInt(enemyMgk)<0) {
              AchievementManager.check('eat_hazardous');
            }
            playerConsumed();
            displayEnemyEffect("🍴");
            if (playerHp>0) nextEncounter();
            isFishing=false;
            break;

          case "Fishing":
            if (playerSta > 0) playerSta--;
            var bait=checkPlayerHasItem(validBaits);
            if (_skillOK === false) {
              if (_crit === 'fail' && bait !== "") {
                playerUseItem(bait, "Hook snagged — lost " + bait + " -1 🟢", "");
              } else {
                displayPlayerCannotEffect();
                logPlayerAction(actionString, bait !== "" ? "The fish slipped off the hook -1 🟢" : (playerSta <= 0 ? "Too tired to focus on the hook -1 🟢" : "Nothing bit the empty hook -1 🟢"));
              }
              break;
            }
            if (bait !== "") {
              AchievementManager.check('fish_bait');
              playerUseItem(bait,"Fished out something using "+bait+decorateStatusText(""," +"+(10*playerLevel)+" XP",colorGold),"");
              playerGainXP(1,10*playerLevel,"");
              if (procAbilityChance("🧵",33)) {
                logAction("🧵 ▸ "+bait+" Luckily the bait remained hooked.");
                displayPlayerEffect("🧵");
                playerLootString+=bait;
              }
            } else {
              AchievementManager.check('fish_no_bait');
              playerGainXP(1,10*playerLevel,"");
              logPlayerAction(actionString,"Caught something with bare hook"+decorateStatusText(""," +"+(10*playerLevel)+" XP",colorGold));
            }
            displayEnemyEffect("🪝");
            getRandomFish(_crit === 'success' ? getArtifactLootIndex() : undefined);
            break;

          case "Demon":
            if ((enemySta - enemyStaLost) <= 0 && (playerSta > 0)) {
              logPlayerAction(actionString,"Grabbed them into stranglehold -1 🟢");
              if (playerSta > 0) playerSta--;
              enemyKnockedOut();
              isFishing=false;
            } else if (enemySta - enemyStaLost > 0) {
              if (_skillOK === false) {
                if (playerSta > 0) playerSta--;
                logPlayerAction(actionString,"Missed, they are faster than expected -1 🟢");
                displayEnemyEffect("🌀");
                if (enemyCastIfMgk()) break;
                enemyAttackOrRest();
                break;
              }
              logPlayerAction(actionString,"Grabbed them into stranglehold -1 🟢");
              if (playerSta > 0) playerSta--;
              enemyKnockedOut();
              isFishing=false;
            } else {
              enemyKicked();
            }
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
                    AchievementManager.check('key_unlock_first');
                    enemyType=enemyType.replace("Locked-","");
                    enemyHp=0;
                    enemyMsg="Uncovered what was locked inside.";
                    redraw();
                  }
                  break;
                } else if (playerLootString.includes("📎")) {
                  logPlayerAction(actionString,"Unlocked with <b>📎 Universal Key</b> "+decorateStatusText("","+"+(15*playerLevel)+" XP",colorGold))
                  playerGainXP(1,15*playerLevel,"");
                  AchievementManager.check('key_unlock_first');
                  enemyType=enemyType.replace("Locked-","");
                  enemyHp=0;
                  enemyMsg="Uncovered what was locked inside.";
                  redraw();
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

            if (enemyType === "Prop" && (enemyEmoji.includes("🌿"))) {
              AchievementManager.check('touch_grass');
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

        // Gibberish: action-bar failure + low INT = player fumbles their words
        // Chance: 90% at INT 0, ~0% at INT 7+; skips special non-combat encounter types
        if (_skillOK === false) {
          var _noGibberishTypes = /Upgrade|Death|Dream|Altar|Container|Item|Consumable|Fishing|Prop|Shop|Curse/.test(enemyType);
          if (!_noGibberishTypes && _crit === 'fail') {
            enemyAtkBonus = Math.min(enemyAtkBonus + 1, 3);
            logPlayerAction(actionString, "Your words emboldened them +1 ⚔️");
            displayPlayerCannotEffect();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }
          var _gibberishChance = Math.max(0, 0.9 - playerInt * 0.12);
          if (!_noGibberishTypes && Math.random() < _gibberishChance) {
            logPlayerAction(actionString, "It came out as gibberish.");
            displayPlayerCannotEffect();
            if (enemyCastIfMgk()) break;
            enemyAttackOrRest();
            break;
          }
        }

        switch (enemyType){
          case "Altar": // Speak button is rebound to Pray on Altars
            displayPlayerEffect("🙏");
            var isSacrifice = (enemyHp < 0);
            if (isSacrifice) {
              var blade = checkPlayerHasItem(validBlades);
              if (blade != "") {
                playerLootString += blade;
                displayEnemyEffect("🩸");
                playerHit(1, false, true);
                if (encounterUsed) {
                  logPlayerAction(actionString, "Your sacrifice had no effect -1 💔");
                  displayPlayerCannotEffect();
                  break;
                }
                playerChangeStats(0, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg + " -1 💔", true, false);
                playerGainXP(1, 10 * playerLevel, "");
                isFishing = false;
                encounterUsed = true;
              } else {
                logPlayerAction(actionString, "No effect, missing a viable <b>🔪 Blade</b>.");
                displayPlayerCannotEffect();
              }
            } else {
              if (encounterUsed) {
                logPlayerAction(actionString, "Your prayer had no further effect.");
                displayPlayerEffect("🤲");
                displayPlayerCannotEffect();
                break;
              }
              if (_skillOK === false) {
                isFishing = false;
                encounterUsed = true;
                if (_crit === 'fail') {
                  displayPlayerCannotEffect();
                  displayEnemyEffect("⚡️");
                  playerChangeStats(-enemyHp, -enemyAtk, -enemySta, -enemyLck, -enemyInt, -enemyMgk, -enemyDef, "Angered the mighty spirits!", true, false);
                } else {
                  logPlayerAction(actionString, "Your prayer went unanswered.");
                  displayPlayerCannotEffect();
                }
                break;
              }
              playerChangeStats(enemyHp, enemyAtk, enemySta, enemyLck, enemyInt, enemyMgk, enemyDef, enemyMsg, true, false);
              displayPlayerEffect("✨");
              displayPlayerGainedEffect();
              displayEnemyCannotEffect();
              isFishing = false;
              encounterUsed = true;
            }
            break;

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
              AchievementManager.check('get_recruit');
              if ([...playerPartyString].length >= 3) AchievementManager.check('full_party');
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

            if (_crit === 'success' && (enemyAtkBonus+enemyAtk) > 0) {
              enemyAtkBonus-=2;
              logPlayerAction(actionString,"Rattled them to the core -2 ⚔️");
              displayEnemyCannotEffect();
              if ((enemyAtkBonus+enemyAtk) > 0) enemyAttackOrRest();
              break;
            }

            if (enemyInt < convinceInt){
              if ((enemyAtk+enemyAtkBonus)>0){
                enemyAtkBonus--;
                logPlayerAction(actionString,"Managed to calm them down -1 ⚔️");
                if ((enemyAtk+enemyAtkBonus)>0) {
                  enemyAttackOrRest();
                } else {
                  AchievementManager.check('calm_enemy');
                  if (enemyType === 'Boss') AchievementManager.check('calm_boss');
                  if (enemyType === 'Demon') AchievementManager.check('calm_demon');
                }
                displayEnemyCannotEffect();
              } else if (enemyAtk>0){
                AchievementManager.check('calm_enemy');
                if (enemyType === 'Boss') AchievementManager.check('calm_boss');
                if (enemyType === 'Demon') AchievementManager.check('calm_demon');
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
                displayPlayerEffect(heldQuestItem);
                AchievementManager.check('quest_complete');
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
              dbg(enemyQuestItems);
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
              AchievementManager.check('letter_remember');
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

        // Any sleep during an active fishing session locks the spot for this visit
        if (isFishing) fishingRested = true;

        if (enemyType=="Shop") {
          drachmaeBuy(2,"Level");
          break;
        }

        // Corpse rest — honor fishing restriction, otherwise delegate to playerRest()
        if (corpseState !== "") {
          if (fishingRested) {
            logPlayerAction(actionString,"Already slept at this fishing spot.");
            displayPlayerCannotEffect();
            break;
          }
          playerRest(); // sets playerRested=true internally; no-op if already rested
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
            playerRest(true);
            logPlayerAction(actionString,"Wandered too far away from you.");
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
              var _atkTotal = enemyAtk + enemyAtkBonus;
              var _interruptDmg = (_crit === 'fail') ? _atkTotal * 2 : _atkTotal;
              logPlayerAction(actionString, (_crit === 'fail')
                ? "Caught completely off guard. -" + _interruptDmg + " 💔"
                : "They interrupted your rest -" + _atkTotal + " 💔");
              displayEnemyAttackEffect();
              displayPlayerCannotEffect();
              playerHit(_interruptDmg);
              break;
            }
            if (playerHp>0){
              displayPlayerEffect("💤");
              playerGetStamina(1, _crit === 'success');
            }
            if (_crit === 'success') {
              logPlayerAction(actionString, "Refreshed exceptionally fast +1 🟢");
              break;
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
            if (_crit === 'fail') {
              if (playerSta < playerStaMax) playerSta++;
              playerRested = true;
              logPlayerAction(actionString, "Exhausted by trying to sleep.");
              displayPlayerEffect("💤");
            } else {
              playerRest();
              if (_crit === 'success') {
                playerSta++;
                logPlayerAction(actionString, "Rested exceptionally well.");
                displayPlayerRestedEffect();
              }
            }
            break;

          case "Fishing":
            if (fishingRested) {
              logPlayerAction(actionString, "Already slept at this fishing spot.");
              displayPlayerCannotEffect();
              break;
            }
            fishingRested = true;
            if (_crit === 'fail') {
              if (playerSta < playerStaMax) playerSta++;
              playerRested = true;
              logPlayerAction(actionString, "Exhausted by trying to sleep.");
              displayPlayerEffect("💤");
            } else {
              playerRest();
              if (_crit === 'success') {
                playerSta++;
                logPlayerAction(actionString, "Rested exceptionally well.");
                displayPlayerRestedEffect();
              }
            }
            break;

          case "Trap-Sleep":
            if (encounterUsed){
                logPlayerAction(actionString,"Seems like its power is exhausted.")
                displayPlayerCannotEffect();
                break;
              }

            if (totalBonus > 0) {
              if (_skillOK === false) {
                playerRest();
                if (_crit === 'fail') {
                  playerChangeStats(-enemyHp, -enemyAtk, -enemySta, -enemyLck, -enemyInt, -enemyMgk, -enemyDef, "Slept poorly, disturbed the energy.", true, false);
                } else {
                  logPlayerAction(actionString, "Rested nearby, but missed its power.");
                }
                break;
              }
              encounterUsed = true;
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
    var _wasStillFishing = isFishing;
    if (isFishing && button!="button_cast") {
      loadEncounter(lootEncounterIndex,linesLoot);
      encounterIndex=lastEncounterIndex;
    }
    if (enemyBossType!="") enemyType=enemyBossType;
    if (_wasStillFishing && button!="button_cast") {
      if (enemyType.includes('Boss')) AchievementManager.check('fish_boss');
      else if (enemyTeam && enemyTeam.includes('Artifact')) AchievementManager.check('fish_legendary');
    }

    //Set intellect 1-6 (Pure Chance)
    if (procAbilityChance("🎲",100)){
      var temporaryIntellect=chooseFrom([1,2,3,4,5,6]);
      dbg("Chance→int:"+temporaryIntellect);
      playerInt=temporaryIntellect;
    }
    redraw();
  };
}
