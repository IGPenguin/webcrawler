//Social features
function generateCharacterShareString(){
  var characterShareString="";
    characterShareString+="<b>"+playerName+"</b> "+"•  Lvl "+playerLevel;
    characterShareString+="\n❤️ "+playerHpMax+"  🟢 "+playerStaMax+"  ⚔️ " +playerAtk;
    if (playerMgkMax>0) characterShareString+="  🔵 " + playerMgkMax;
    characterShareString+="  🍀 " + playerLck;
    characterShareString+="  🧠 " + playerInt;
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
  characterLegend = characterLegend.replaceAll("&nbsp;"," ").replace(/^\n/, '');
  if (parseInt(logLength)>0) {
    characterLegend="Limited to last "+logLength+" events...\n"+characterLegend.split("\n").slice(-logLength-1).join("\n");
  }

  characterLegend=generateCharacterShareString()+"\n\n"+characterLegend+"\n";
  characterLegend += "https://igpenguin.github.io/stay-dead";
  characterLegend +=  "\n"+ versionCode + " ("+window.screen.availHeight+"x"+window.screen.availWidth+")"

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

function redirectToTweet(){
  var tweetUrl = "http://twitter.com/intent/tweet?url=https://igpenguin.github.io/stay-dead&text=";
  window.open(tweetUrl+encodeURIComponent("Yo @IGPenguin, check out my Stay Dead run!"+"\n\n"+generateCharacterShareString().replaceAll("&nbsp"," ").replaceAll("<b>","").replaceAll("</b>","")+"\n"));
}

function shareLinkedIn(){
  var shareText = "I just finished another Stay Dead playthrough!"+"\nIt's a data-driven roguelike RPG written in JS.\nCheck it out at: https://igpenguin.github.io/stay-dead\n\n"+generateCharacterShareString().replaceAll("&nbsp"," ").replaceAll("<b>","").replaceAll("</b>","");
  navigator.clipboard.writeText(shareText);
  window.open("https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent("https://igpenguin.github.io/stay-dead"));
}

function visitLinkedIn(){
  var profileUrl = "https://www.linkedin.com/in/igpenguin/";
  window.open(profileUrl);
}

// Shared entry point — accepts any pre-built plain text string.
function openFeedbackForm(text) {
  var gameLog = encodeURIComponent(text.replaceAll('<b>','').replaceAll('</b>','').replaceAll(emptySpace,'   '));
  window.open('https://docs.google.com/forms/d/e/1FAIpQLSc46BJ-S_EBmXxZgzVYLCC8l2Wece0hWXJESiRMpuMlXTC3Cw/viewform?usp=pp_url&entry.1788435593=' + gameLog);
}

function redirectToFeedback(){
  openFeedbackForm(generateCharacterLegend(50));
}
