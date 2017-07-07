var challenge = 0;
var battleStat,cookie;
var enemy = {};
enemy.id = docCookies.getItem("enemy.id")||0;
enemy.hp = docCookies.getItem("enemy.hp")||100;
var player = {
  key:docCookies.getItem("player.key"),
  weapon:docCookies.getItem("player.weapon")
}
var voyage = {
  stage:docCookies.getItem("voyage.stage"),
  step:docCookies.getItem("voyage.step")
}

var dataSet = {
  stage:['field','forest','snow','desert','vulcano'],
  enemy:[
    ['のうさぎ','オオトカゲ','ゴブリン'],
    ['ガラガラヘビ','スコーピオン','サンドワーム'],
    ['スパイダー','まほうつかい','もりのぬし'],
    ['ゆきんこ','スノーマン','イエティ'],
    ['モール','ファイアゴーレム','ドラゴン']
  ]
}

var frontScreen = document.getElementById("frontScrreen");
var enemyWindow = document.getElementById("enemyWindow");
var enemyDom = document.getElementById("enemy");
var hpBar = document.getElementById("hpBar");
var textWindow = document.getElementById("msg-window");
var atkBtn = document.getElementById("atkBtn");
var runBtn = document.getElementById("runBtn");
var atkPlayer = document.getElementById("atkPlayer");
var runPlayer = document.getElementById("runPlayer");
var clockDom = document.getElementById("clock");
var dayDom = document.getElementById("day");
var damage = document.getElementById("damage");

var msgCtr = new WordTyping(textWindow);
var lock = new PatternLock("#patternContainer",{
  margin:35,
  radius:40,
  onDraw:function(pattern){
    lock.checkForPattern(player.key,function(){
      if(battleStatus==="attack")
        addDamage(80);
      else
        runPlayer.style.transform='translate(-2200px, 0)';
      lock.disable();
      saveContext();
      window.setTimeout( ()=>{
        window.location = "./mypage.html"
      }, 1000);
    },function(){
      //alert("Pattern is not correct");
    });

  },
  onMove:function(pattern){
    window.navigator.vibrate(50);
  },
  success:function(){
    console.log("success");
    this.objectHolder[this.token].holder.addClass('patt-error');
  }
});

//preload HTML data
frontScreen.style.backgroundImage = 'url("../img/stage/'+dataSet.stage[voyage.stage]+'480.png")';
if(voyage.stage==3){//forest
  dayDom.style.color = '#ddd';
  clockDom.style.color = '#ddd';
}


window.onload = ()=>{
  
  if(!player.key){
    console.log(player.key);
    window.location.href = "./debug.html";
  }
  setClock();
  if(voyage.step > 10){
    //宿屋
  }
  if(enemy.hp == 0){
    enemy.id = getEnemyId();
    enemy.hp = 100;
  }
  msgCtr.type(dataSet.enemy[voyage.stage][enemy.id]+"があらわれた！",{speed:20});
  hpBar.style.width=enemy.hp+"%";
}

function setClock(){
  var myDay = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var now  = new Date();
  var month = now.getMonth()+1; // 月
  var date = now.getDate(); // 日
  var day = myDay[now.getDay()]; //曜日
  var hour = now.getHours(); // 時
  var min  = now.getMinutes(); // 分
  if(hour < 10) { hour = ('00'+hour).slice(-2); }
  if(min < 10) { min = ('00'+min).slice(-2); }
  clockDom.innerHTML = hour+'<span class="blinking">:</span>'+min;
  dayDom.innerHTML = month+"/"+date+"("+day+")";
  window.setTimeout( "setClock()", 10000);
}

function command(cmd){
  battleStatus=cmd;
  if(cmd=="attack"){
    atkPlayer.style.transform='translate(350px, 0) scaleX(-1)';
  }else{
    runPlayer.style.transform='translate(-800px, 0)';
  }
  //画面変化
  var value = Math.floor(enemyWindow.getBoundingClientRect().bottom);
  frontScreen.style.transform='translate(0, -520px)';
  enemyWindow.style.transform='translate(0, 200px)';//bottom:100px;
  textWindow.style.transform='translate(0, 200px)';
  textWindow.style.opacity=0;
  atkBtn.style.opacity=0;
  runBtn.style.opacity=0;
  console.log(frontScreen.style)
}

function getEnemyId(){
  var random = Math.random();
  if(random < 0.1)
    return 2;
  else if(random < 0.4)
    return 1;
  return 0;

}

function addDamage(damageVal){
  damage.innerHTML = damageVal;
  damage.style.opacity=1;
  damage.style.transform='translate(0, -40px)';
  console.log(enemy.hp-damageVal);
  var bar = enemy.hp-damageVal < 0 ? 0 : enemy.hp-damageVal;
  enemy.hp = bar;
  hpBar.style.width=bar+"%";
  enemyDom.classList.add('shake');
}

function getEnemyImage(stage,id){

}

function saveContext(){
  docCookies.setItem("enemy.hp",enemy.hp);
  docCookies.setItem("enemy.id",enemy.id);
  docCookies.setItem("voyage.step",voyage.step++);
}