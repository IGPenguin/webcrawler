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
  if (actionString.includes(" 🪙")) { //Ahhh, yeah more hacks at 1 AM
    var price = actionString.split(" ")[0] //Very much HACKS... YOLO!!!
    actionString=actionString.slice(2);
    if (!actionString.includes("you actually won!")) actionString = actionString.replace("<br>"," -"+price+" 🪙"+"<br>");
  }
  runLogAdd("log", {msg: actionString.replaceAll("&nbsp;"," ").replaceAll(/<[^>]+>/g,"").replace("<br>","").trim()});
  adventureLog += actionString;
}

function logAction(message){
  runLogAdd("log", {msg: message.replaceAll("&nbsp;"," ").replaceAll(/<[^>]+>/g,"").trim()});
  adventureLog += message+"<br>";
}

function logGenerator(generatorName="none"){
  console.log("Gnrt:"+generatorName);
  lastGeneratorName=generatorName;
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
