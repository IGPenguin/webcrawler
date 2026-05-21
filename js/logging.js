function dbg() {
  if (isLocalhost()) console.log.apply(console, arguments);
}

//Run Logger
function initRunLog() {
  if (!isLocalhost()) return;
  runLog = [];
  var now = new Date();
  runLogStart = now.toISOString().slice(0,19).replaceAll(":","-");
  runLogAdd("run_start", {name: playerName, version: versionCode, timestamp: now.toISOString()});
}

function runLogAdd(type, data) {
  if (!isLocalhost()) return;
  runLog.push(Object.assign({type: type}, data));
}

function downloadRunLog() {
  if (!isLocalhost() || runLog.length === 0) return;
  var fileName = "Stay-Dead-" + playerName.replaceAll(" ","-") + "-" + runLogStart + ".json";
  var el = document.createElement('a');
  el.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(runLog)));
  el.setAttribute('download', fileName);
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}

//Logging
function logPlayerAction(actionString,message){
  actionString = actionString.split(" ")[0] + "&nbsp;▸&nbsp;" + enemyEmoji + " " + message + "<br>";
  if (actionString.includes("🪙&nbsp;")) { //Ahhh, yeah more hacks at 1 AM
    var price = actionString.split("&nbsp;")[0] //Very much HACKS... YOLO!!!
    dbg(price)
    actionString=actionString.slice(2);
    if (!actionString.includes("you actually won!") && !actionString.includes("Lucky Drachma")) actionString = actionString.replace("<br>"," -"+price+"<br>");
  }

  //Change references to "She/Her" for final Boss
  if (enemyTeam.includes("Forgotten Love") && areaName.includes("Necropolis")) {
    actionString=actionString.replaceAll("them","her")
    actionString=actionString.replaceAll("their","her")
    actionString=actionString.replaceAll("They've","She has")
    actionString=actionString.replaceAll("They ","She ")
  } 

  runLogAdd("log", {msg: actionString.replaceAll("&nbsp;"," ").replaceAll(/<[^>]+>/g,"").replace("<br>","").trim()});
  adventureLog += actionString;
}

function logAction(message){

  //Change references to "She/Her" for final Boss
  if (enemyTeam.includes("Forgotten Love") && areaName.includes("Necropolis")) {
    message=message.replaceAll("them","her")
    message=message.replaceAll("their","her")
    message=message.replaceAll("They've","She has")
    message=message.replaceAll("They ","She ")
  } 

  runLogAdd("log", {msg: message.replaceAll("&nbsp;"," ").replaceAll(/<[^>]+>/g,"").trim()});
  adventureLog += message+"<br>";
}

function logGenerator(generatorName="none"){
  dbg("Gnrt:"+generatorName);
  lastGeneratorName=generatorName;
}

function getTime(){
  var d = new Date();
  return d.toLocaleString(undefined, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}
