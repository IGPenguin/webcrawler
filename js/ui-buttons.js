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
  if (enemyType=="Prop" && totalBonus>0) setButton('button_sleep',playerSleepType+" Sleep",colorSoftGreen);
  if (enemyType=="Prop" && totalMalus<0) setButton('button_sleep',playerSleepType+" Sleep",colorSoftRed);
  if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',playerSleepType+" Sleep",colorLightBlue);
  if (playerXP>=playerXPThreshold) setButton('button_sleep',playerSleepType+" Sleep",colorGold);
  if (playerRested && (!enemyType.includes("Trap"))) setButton('button_sleep',"💤 Sleep",colorDarkGrey);

  setButton('button_speak',playerSpeakType+" Speak");
  setButton('button_cast',playerCastType+" Cast");
  setButton('button_curse',"🪬 Curse");
  setButton('button_pray',"❤️‍🩹 Heal");
  if (playerMgk<=0){
    setButton('button_cast',playerCastType+" Cast",colorDarkGrey);
    setButton('button_pray',"❤️‍🩹 Heal",colorDarkGrey);
    if (playerMgk<2) setButton('button_curse',"🪬 Curse",colorDarkGrey);
  }
}

function adjustEncounterButtons(){
  resetEncounterButtons();
  var originalType=enemyType;
  if (enemyType.includes("Boss")) {
    enemyType=enemyType.replace("Boss-","");
  }
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
      if (encounterUsed) document.getElementById('button_roll').innerHTML="👣 Walk";
      document.getElementById('button_pray').innerHTML="🧠 Endure";
      if (encounterUsed) setButton('button_pray',"🧠 Endure",colorDarkGrey);
      setButton('button_sleep',"😵‍💫 Submit");
      if (encounterUsed) setButton('button_sleep',playerSleepType+" Sleep");
      if (encounterUsed) if (playerSta<playerStaMax || playerMgk<playerMgkMax) setButton('button_sleep',playerSleepType+" Sleep",colorLightBlue);
      if (encounterUsed) if (playerRested && (!enemyType.includes("Trap"))) setButton('button_sleep',"💤 Sleep",colorDarkGrey);
      break;

    case "Item":
      setButton('button_grab',"👋 Grab",grabColor);
      setButton('button_roll',"❌ Ditch",colorRed);
      if (enemyTeam.includes("Lover's Memento")&&!encounterUsed) setButton('button_speak',"💔 Recall",colorRed);
      if (enemyTeam.includes("Lover's Memento")&&encounterUsed) setButton('button_speak',"💔 Recall",colorDarkGrey);
      if (enemyTeam.includes("Lover's Memento")) setButton('button_grab',"👋 Grab",colorGold);
      if (enemyEmoji=="🪙" || enemyEmoji=="💰") setButton('button_grab',"👋 Claim",colorLightShadeBlue);
      if (enemyEmoji=="🪙" && enemyName.includes("Lucky")) setButton('button_grab',"👋 Claim",colorSoftGreen);
      if (enemyName.includes("Tarot Card:")) {
        setButton('button_grab',"👋 Accept",colorPaper);
        setButton('button_roll',"❌ Reject",colorRed);
      }
      break;

    case "Trap":
    case "Trap-Big":
    case "Trap-Attack":
    case "Trap-Sleep":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      if (encounterUsed) setButton('button_grab',"✋ Reach",colorDarkGrey);
      document.getElementById('button_roll').innerHTML="👣 Avoid";
      if (areaName=="River of Sorrows") setButton("button_roll","🛶 Sail");
      break;

    case "Trap-Roll":
    case "Prop":
      document.getElementById('button_grab').innerHTML="✋ Reach";
      if (encounterUsed) setButton('button_grab',"✋ Reach",colorDarkGrey);
      document.getElementById('button_roll').innerHTML="👣 Walk";
      if (areaName=="River of Sorrows") setButton("button_roll","🛶 Sail");
      break;

    case "Trap-Obstacle":
      document.getElementById('button_grab').innerHTML="👋 Move";
      document.getElementById('button_roll').innerHTML="👣 Walk";
      if (areaName=="River of Sorrows") setButton("button_roll","🛶 Sail");
      break;

    case "Dream":
      setButton('button_grab',"✋ Reach",colorDarkGrey);
      setButton('button_roll',"👣 Walk", colorGold);
      if (enemyName.includes("Waking Moment")) setButton('button_roll',"👁️ Awaken",colorGold);
      if (playerSta==0) setButton('button_roll',"👣 Walk",colorDarkGrey);
      setButton('button_speak',"💬 Speak",colorDarkGrey);
      setButton('button_sleep',"💤 Sleep",colorLightBlue);
      if (enemyName.includes("Regrets")) setButton('button_sleep',"🙁 Accept",colorSoftRed);
      if (enemyName.includes("Waking Moment") || enemyName.includes("Horrific Realization")) setButton('button_sleep',"💤 Sleep",colorDarkGrey);
      if (areaName.includes("Shrouded")) setButton('button_sleep',"🧠 Think",colorRed);
      break;

    case "Fishing":
      document.getElementById('button_roll').innerHTML="👣 Walk";
      if (areaName=="River of Sorrows") setButton("button_roll","🛶 Sail");
      setButton('button_grab',"🎣 Fish",colorDarkGrey);
      var bait=checkPlayerHasItem(validBaits);
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
      var availableCoins=savedCoins-spentCoins;
      setButton('button_attack',"1 🪙 Tarot",colorPaper);
        if (playerDestined) setButton('button_attack',"1 🪙 Tarot",colorDarkGrey);
        if (availableCoins<1) setButton('button_attack',"1 🪙 Tarot",colorDarkGrey);

      setButton('button_roll',"👣 Leave",colorRed);
      if (availableCoins<=0) setButton('button_roll',"👣 Leave",colorYellow);

      setButton('button_grab',"1 🪙 Item",colorLightBlue);
        if (availableCoins<1) setButton('button_grab',"1 🪙 Item",colorDarkGrey);

      setButton('button_block',"1 🪙 Risk",colorPink);
        if (availableCoins<1) setButton('button_block',"1 🪙 Risk",colorDarkGrey);

      setButton('button_sleep',"2 🪙 Level",colorYellow);
        if (availableCoins<2) setButton('button_sleep',"2 🪙 Level",colorDarkGrey);

      setButton('button_speak',"3 🪙 Artif.",colorOrange);
        if (availableCoins<3) setButton('button_speak',"3 🪙 Artif.",colorDarkGrey);

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
      break;
  }
  //After all button manipulations
  if (enemyHp>0 && enemySta>0) {
    if (((enemyAtk+enemyAtkBonus)<=0)) setButton('button_block',"☝️ Tease")
    if (((enemyAtk+enemyAtkBonus)<=0) && playerSta<=0) setButton('button_block',"☝️ Tease",colorDarkGrey)
  }
  enemyType=originalType;
}

//Button click listeners
var callback_attack=resolveAction('button_attack');
var callback_roll=resolveAction('button_roll');
var callback_block=resolveAction('button_block');

var callback_grab=resolveAction('button_grab');
var callback_sleep=resolveAction('button_sleep');
var callback_speak=resolveAction('button_speak');

var callback_cast=resolveAction('button_cast');
var callback_pray=resolveAction('button_pray');
var callback_curse=resolveAction('button_curse');


function registerClickListeners(delay=800){
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

  setTimeout(function(){
    //console.log("register-click-listeners");
    document.getElementById('button_attack').addEventListener(eventType, callback_attack);
    document.getElementById('button_roll').addEventListener(eventType, callback_roll);
    document.getElementById('button_block').addEventListener(eventType, callback_block);

    document.getElementById('button_grab').addEventListener(eventType, callback_grab);
    document.getElementById('button_sleep').addEventListener(eventType, callback_sleep);
    document.getElementById('button_speak').addEventListener(eventType, callback_speak);

    document.getElementById('button_cast').addEventListener(eventType, callback_cast);
    document.getElementById('button_pray').addEventListener(eventType, callback_pray);
    document.getElementById('button_curse').addEventListener(eventType, callback_curse);

    document.getElementById('button_menu').addEventListener(eventType, function() { menuFade(function() { Menu.show(); }); });
  },delay)
}

function removeClickListeners(){
  var eventType = 'click';

  document.getElementById('button_attack').removeEventListener(eventType, callback_attack);
  document.getElementById('button_roll').removeEventListener(eventType, callback_roll);
  document.getElementById('button_block').removeEventListener(eventType, callback_block);

  document.getElementById('button_grab').removeEventListener(eventType, callback_grab);
  document.getElementById('button_sleep').removeEventListener(eventType, callback_sleep);
  document.getElementById('button_speak').removeEventListener(eventType, callback_speak);

  document.getElementById('button_cast').removeEventListener(eventType, callback_cast);
  document.getElementById('button_pray').removeEventListener(eventType, callback_pray);
  document.getElementById('button_curse').removeEventListener(eventType, callback_curse);

  document.getElementById('button_menu').removeEventListener(eventType, Menu.show);
}

function registerClickListenersTechnical(){
    var eventType = 'click';

    versionIDUIElement.addEventListener(eventType, ()=> {
    actionString="⚙️"
    adventureEndReason="\nDebug: "+enemyEmoji+" "+enemyName
    //copyAdventureToClipboard();
    redirectToFeedback();
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
      savedCoins=10;
      localStorage.setItem('coins', savedCoins);
    }

    if (newName.includes("Poco Dinero")){
      savedCoins=3;
      localStorage.setItem('coins', savedCoins);
    }

    if (newName.includes("Cleaner")){
      localStorage.removeItem('coins'); //Full wipe to even show tutorial
      savedCoins=0;
    }
  });
}
