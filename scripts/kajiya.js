/*
TODO: 確認入力をするほど武器のゲージ(#hpbar)が貯まる
      確認中は「やめる」ボタンを押すとcancelConfirm()発動する。
*/

const talk = [
  "この鉱石で武器をつくるのか？",
  "こんな武器じゃ\nモンスターは倒せないぜ",
  "そこそこの強さだな",
  "かなり強くなったな！\nこの鉱石じゃこれが限界だ"
];

var viewCtr = (function(){
  const msgFrame = document.getElementById("msg-window");
  const confirmBtn = document.getElementById("confirmBtn");
  const confirmYes = document.getElementById("confirmYes");
  const weapon = document.getElementById("weapon");
  const msgCtr = new WordTyping(msgFrame);

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
    gameCtr.chagePattern(pattern);
  }
  });
  return {
    talk:(msg)=>{msgCtr.type(msg,{speed:40});},
    changeWeapon:(src)=>{weapon.src = src;},
    showIngot:(id)=>{weapon.src = "img/ingot/ingot"+id+".png"},
    showWeapon:(id)=>{weapon.src = "img/weapon/weapon"+id+".png"},
    hideConfirm:()=>{confirmBtn.style.display="none";},
    lockReset:()=>{lock.reset();}
  }

}());

var gameCtr = (function(){
  const measure = new PasswordMeasure();
  var tempPattern;
  var tempRank;
  var ingotPow;
  var weaponId;

  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};

  function getRank(str){
    str = measure.getStrength(str);
    if(str==0)
      return 0;
    else if(str<0.40)
      return 1;
    else if(str<0.56)
      return 2;
    else
      return 3;
  }

  return {
    initFunc:()=>{
      ingotPow=user.ore||1;
      console.log(ingotPow);

      viewCtr.talk(talk[0]);
      viewCtr.showIngot(ingotPow);
      document.getElementById("buki-window").addEventListener("click",()=>{location.href="./oreSelect.html";},false);
    },
    chagePattern:(pattern)=>{
      var newRank = getRank(pattern);
      tempPattern = pattern;
      console.log("rank",tempRank,": new",newRank);
      if(tempRank != newRank && pattern.length>=5){
        tempRank = newRank;
        if(newRank==0){
          viewCtr.showIngot(ingotPow);
        }else{
          weaponId = newRank + ingotPow*3 -3;
          viewCtr.showWeapon(weaponId);
        }
        viewCtr.talk(talk[newRank]);
      }
    },
    cancelConfirm:()=>{
      tempRank=0;
      viewCtr.talk("どんな武器を作るんだ？");
      viewCtr.hideConfirm();
      viewCtr.lockReset();
      viewCtr.showIngot(ingotPow);
    },
    setPattern:()=>{
      user.key = tempPattern.join("");
      user.weapon = weaponId;
      docCookies.setItem("player",JSON.stringify(user));
      window.location = "./mypage.html";
    }
  }
}());

window.onload = ()=>{
  gameCtr.initFunc();
}

