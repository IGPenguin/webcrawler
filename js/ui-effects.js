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

  //Force end any existing anim first
  animateUIElement(fullscreenTextUIElement,"animate__fadeIn",0,true,message);
  animateUIElement(curtainUIElement,"animate__fadeIn",0,true);

  //Actual animation
  animateUIElement(fullscreenTextUIElement,"animate__fadeIn",(duration/2)+0.1,true,message,false,true);
  animateUIElement(curtainUIElement,"animate__fadeIn",duration/2,true,"",false,true);
  removeClickListeners();

  var animationHandler = function(){
    setBackground(areaName);
    animateUIElement(curtainUIElement,"animate__fadeOut",duration/1.5,true,"",false,true);
    animateUIElement(fullscreenTextUIElement,"animate__fadeOut",duration/1.5,true,message,false,true);
    registerClickListeners(1000); //Ooopa, still hacking my way through
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

  //Wow, this is nice - https://animate.style
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
