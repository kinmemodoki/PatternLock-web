/*
TODO: 確認入力をするほど武器のゲージ(#hpbar)が貯まる
      確認中は「やめる」ボタンを押すとcancelConfirm()発動する。
*/

const talk = [
  "この鉱石で武器をつくるのか？",
  "こんな武器じゃ\nモンスターは倒せないぜ",
  "そこそこの強さだな",
  "かなり強くなったな！\nこの鉱石じゃこれが限界だ",
  "前に設定したパターンを\n入力するんだ"
];

var viewCtr = (function(){
  const msgFrame = document.getElementById("msg-window");
  const confirmBtn = document.getElementById("confirmBtn");
  const confirmYes = document.getElementById("confirmYes");
  const weapon = document.getElementById("weapon");
  const forgetBtn = document.getElementById("forgetButton");
  //const strong = document.getElementById("strong");
  const msgCtr = new WordTyping(msgFrame);
  var confirmFlag = false;



  const lock = new PatternLock("#patternContainer",{
  margin:35,
  radius:40,
  onDraw:function(pattern){
    //finish write pattern.
    //rank = 0;
    if(confirmFlag){
      if(pattern==gameCtr.getUserPtn()){
        msgCtr.type("確認できたぞ．\n次はどんなパターンで作るんだ？",{speed:40});
        lock.reset();
        confirmFlag = false;
        forgetBtn.style.display = "none";
      }else{
        lock.error();
        msgCtr.type("設定したパターンが\n違うみたいだな...",{speed:40});
      };

    }else{
      if(pattern.length<5){
        msgCtr.type("これじゃ短すぎるぞ！",{speed:40});
        lock.error();
      }else{
        msgCtr.type("これでいいのか？",{speed:40});
        tempPattern = pattern;
        confirmBtn.style.display="block";
      }
    }
  },
  onMove:function(pattern){
    //when add a node to stack.

    if(!confirmFlag){
      confirmBtn.style.display="none";
      gameCtr.changePattern(pattern);
      window.navigator.vibrate(50);
    }
  }
  });
  return {
    talk:(msg)=>{msgCtr.type(msg,{speed:40});},
    changeWeapon:(src)=>{weapon.src = src;},
    showIngot:(id)=>{weapon.src = "img/ingot/ingot"+id+".png"},
    showWeapon:(id)=>{weapon.src = "img/weapon/weapon"+id+".png"},
    hideConfirm:()=>{confirmBtn.style.display="none";},
    lockReset:()=>{lock.reset();},
    setConfirmFlag:(f)=>{confirmFlag=f;},
    showForget:(f)=>{
      if(f)
        forgetBtn.style.display = "block";
      else
        forgetBtn.style.display = "none";
    },
    setForgetBtnEvent:()=>{
      forgetBtn.addEventListener("click",()=>{
        viewCtr.setConfirmFlag(false);
        viewCtr.talk("次は忘れるなよ！\n次のパターンを設定しな");
        viewCtr.showForget(false);
        gameCtr.setForgetFlg(true);
      },false);
    },
    changeStrongText:(text)=>{
      //strong.innerText=text;
    }
  }

}());

var gameCtr = (function(){
  const measure = new PasswordMeasure();
  var tempPattern = [];
  var tempRank;
  var ingotPow;
  var weaponId;
  var forgetFlag = false;

  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var playerId = context.id ? JSON.parse(context.id) : null;

  function getRank(patt){
    var str = measure.getStrength(patt);
    console.log(patt);
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
      if(!user.weapon){
        viewCtr.setConfirmFlag(false);
        viewCtr.talk("よぉ，よくきたな\nすきなパターンで武器をつくりな");
        viewCtr.showForget(false);
      }else{
        viewCtr.setConfirmFlag(true);
        viewCtr.talk(talk[4]);
        viewCtr.showForget(true);
        viewCtr.setForgetBtnEvent();
      }
      viewCtr.showIngot(ingotPow);
      document.getElementById("buki-window").addEventListener("click",()=>{location.href="./oreSelect.html";},false);
    },
    getUserPtn:()=>{
      return user.key;
    },
    setForgetFlg:(f)=>{forgetFlag = f;},
    changePattern:(pattern)=>{
      var newRank = getRank(pattern);
      tempPattern = pattern;
      console.log("rank",tempRank,": new",newRank);
      if(tempRank != newRank && pattern.length>=5){
        tempRank = newRank;
        if(newRank==0){
          viewCtr.showIngot(ingotPow);
          viewCtr.changeStrongText("第"+ingotPow+"鉱石");
        }else{
          weaponId = newRank + ingotPow*3 -3;
          viewCtr.showWeapon(weaponId);
          viewCtr.changeStrongText("newRank");
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
      user.strength = measure.getStrength(tempPattern);
      user.rank = tempRank;
      user.weapon = weaponId;
      docCookies.setItem("player",JSON.stringify(user));
      if(user.id=="notTrace"){
        window.location = "./mypage.html";
      }else{
        console.log("isForget:",forgetFlag);
        
        fetch("/log/regist", {
          method: 'POST',
          body: new URLSearchParams("username="+user.id+"&pattern="+user.key+"&strength="+user.strength+"&rank="+user.rank+'&istest=0'+'&isforget='+forgetFlag),
          mode: 'no-cors'
        }).then(function(response){ 
          console.log(response)
          if (!response.ok)
            throw Error(response.status);
          else
            window.location = "./mypage.html";
        }).catch(function(err){
          console.log(err);
          alert("データ収集エラー("+err+")\n何度も発生する場合，管理者に一報ください @kinmemodoki");
          gameCtr.cancelConfirm();
          window.location = "./mypage.html";
        });
        
      }
    }
  }
}());

window.onload = ()=>{
  gameCtr.initFunc();
};

