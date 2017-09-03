/*
TODO: 確認入力をするほど武器のゲージ(#hpbar)が貯まる
      確認中は「やめる」ボタンを押すとcancelConfirm()発動する。
*/

const imgSrc = ["stone1","sword1","sword2","sword3"];

const talk = [
  "この鉱石で武器をつくるのか？",
  "こんな武器じゃ\nモンスターは倒せないぜ",
  "そこそこの強さだな",
  "かなり強くなったな！\nこの鉱石じゃこれが限界だ"
];
const weaponList = [
  [1,2,3]
];

const msgFrame = document.getElementById("msg-window");
const confirmBtn = document.getElementById("confirmBtn");
const confirmYes = document.getElementById("confirmYes");
const weapon = document.getElementById("weapon");
const msgCtr = new WordTyping(msgFrame);
const measure = new PasswordMeasure();
var isConfirm = false;
var tempPattern;

const lock = new PatternLock("#patternContainer",{
  margin:35,
  radius:40,
  onDraw:function(pattern){
    //finish write pattern.
    //rank = 0;
    if(pattern.length<5){
      msgCtr.type("これじゃ短すぎるぞ！",{speed:40});
      lock.error();
    }else{
      msgCtr.type("これでいいのか？",{speed:40});
      tempPattern = pattern;
      confirmBtn.style.display="block";
    }
  },
  onMove:function(pattern){
    //when add a node to stack.
    window.navigator.vibrate(50);
    confirmBtn.style.display="none";
    var newRank = getRank(measure.getStrength(pattern));
    console.log("rank",this.rank,": new",newRank);
    if(!isConfirm){
      if(this.rank != newRank){
        this.rank = newRank;
        msgFrame.value="";
        msgCtr.type(talk[this.rank],{speed:40});
        if(this.rank==0){
          weapon.src = "img/weapon/stone"+ore+".png";
        }else{
          var weaponId = ore*3 + this.rank;
          weapon.src = "img/weapon/weapon"+weaponId+".png";
        }
      }
    }else{

    }

  }
});

var mainCtr = function(){
  var rank = 0;
  var str = 0.0;
}

window.onload = ()=>{
  msgCtr.type(talk[0],{speed:40});
  ore=getUrlVars()['ore']||0;
}

function getRank(str){
  if(str==0)
    return 0;
  else if(str<0.40)
    return 1;
  else if(str<0.56)
    return 2;
  else
    return 3;
}

function cancelConfirm(){
  msgCtr.type("どんな武器を作るんだ？",{speed:40});
  confirmBtn.style.display="none";
  lock.reset();
}

function setPattern(){
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  user.key = tempPattern;
  user.weapon = ore*3 + rank;
  docCookies.setItem("player",JSON.stringify(user));
  window.location = "./mypage.html";
}

