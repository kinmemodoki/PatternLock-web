var challenge = 0;
var battleStat;
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

var enemyHp = 100;
var password = '7415369';

var msgCtr = new WordTyping(textWindow);
var lock = new PatternLock("#patternContainer",{
  margin:60,
  radius:80,
  onDraw:function(pattern){
    lock.checkForPattern(password,function(){
      if(battleStatus=="attack")
        addDamage(80);
      else
        runPlayer.style.transform='translate(-2200px, 0)';
      window.setTimeout( ()=>{
        window.location = "./mypage"
      }, 2000);
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

window.onload = function(){
  clock();
  console.log(lock.error());
  lock.setPattern('7415369');
  msgCtr.type("スコーピオンがあらわれた！",{speed:20});

  lock.checkForPattern('11111',function(){
        alert("You unlocked your app");
    },function(){
        alert("Pattern is not correct");
    });
}

function addDamage(damageVal){
  damage.innerHTML = damageVal;
  damage.style.opacity=1;
  damage.style.transform='translate(0, -40px)';
  var bar = enemyHp-damageVal < 0 ? 0 : enemyHp-damageVal;
  hpBar.style.width=bar+"%";
  enemyDom.classList.add('shake');
}

function animHp(){

}



function clock(){
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
  window.setTimeout( "clock()", 10000);
}

function command(cmd){
  console.log(cmd);
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