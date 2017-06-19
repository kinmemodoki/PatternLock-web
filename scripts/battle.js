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
  stage:['city','field','desert','forest','snow','vulcano'],
  enemy:[
    ['スライム','ドブネズミ','チンピラ'],
    ['のうさぎ','オオトカゲ','ゴブリン'],
    ['ガラガラヘビ','スコーピオン','サンドワーム'],
    ['スパイダー','まほうつかい','もりのぬし'],
    ['ゆきんこ','スノーウルフ','イエティ'],
    ['モール','ファイアゴーレム','ドラゴン']
  ]
}

var frontScreen = document.getElementById("frontScrreen");
var background = document.getElementById("homescreen");
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
  margin:60,
  radius:80,
  onDraw:function(pattern){
    lock.checkForPattern(player.key,function(){
      if(battleStatus==="attack")
        addDamage(80);
      else
        runPlayer.style.transform='translate(-2200px, 0)';
      lock.disable();
      window.setTimeout( ()=>{
        window.location = "./mypage.html"
      }, 1000);
    },function(){
      //alert("Pattern is not correct");
    });

  },
  onMove:function(pattern){
    
  },
  success:function(){
    console.log("success");
    this.objectHolder[this.token].holder.addClass('patt-error');
  }
});

//preload HTML data
background.style.backgroundImage = 'url("../img/stage/'+dataSet.stage[voyage.stage]+'480.png")';

window.onload = function(){
  
  if(!player.key){
    console.log(player.key);
    window.location.href = "./debug.html";
  }
  setClock();
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
    atkPlayer.style.transform='translate(400px, 0) scaleX(-1)';
  }else{
    runPlayer.style.transform='translate(-1200px, 0)';
  }
  //画面変化
  frontScreen.style.transform='translate(0, -960px)';
  enemyWindow.style.transform='translate(0, 400px)';
  textWindow.style.transform='translate(0, 400px)';
  textWindow.style.opacity=0;
  atkBtn.style.opacity=0;
  runBtn.style.opacity=0;
  console.log(frontScreen.style)
}

function addDamage(damageVal){
  damage.innerHTML = damageVal;
  damage.style.opacity=1;
  damage.style.transform='translate(0, -40px)';
  console.log(enemy.hp-damageVal);
  var bar = enemy.hp-damageVal < 0 ? 0 : enemy.hp-damageVal;
  docCookies.setItem("enemy.hp",bar);
  hpBar.style.width=bar+"%";
  enemyDom.classList.add('shake');
}