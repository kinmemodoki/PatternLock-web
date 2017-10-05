const measure = new PasswordMeasure();
const lock = new PatternLock("#patternContainer",{
  margin:35,
  radius:40,
  onDraw:function(pattern){
    //finish write pattern.
    pageCtr.onDraw();
  },
  onMove:function(pattern){
    //when add a node to stack.
    pageCtr.onMove(pattern);
    //window.navigator.vibrate(50);
  }
});

function getRank(patt){
  var str = measure.getStrength(patt);
  if(str==0)
    return 0;
  else if(str<0.40)
    return 1;
  else if(str<0.56)
    return 2;
  else
    return 3;
}

const pageCtr = (function(){
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var isConfirm = 0;
  var rank,tmpPattern,pattern;
  return {
    onDraw:()=>{
      //完了時
    },
    onMove:(pattern)=>{
      tmpPattern = pattern.join("");
      rank = getRank(pattern);
      viewCtr.showRank(rank);
    },
    confirm:()=>{
      lock.reset();
      pattern = tmpPattern;
      isConfirm = 1;
      viewCtr.setNextFunc();
      viewCtr.setMsg("もう一度同じパターンを\n入力してね");
    },
    submit:()=>{
      console.log("tmpPattern : ",tmpPattern);
      console.log("pattern : ",pattern);
      if(tmpPattern == pattern){
        //確認成功時
        console.log("atteru");
        console.log("username="+user.id+"&pattern="+tmpPattern+"&strength="+measure.getStrength(tmpPattern)+"&rank="+getRank(tmpPattern)+'&pretest=1');
        fetch("./log/regist", {
          method: 'POST',
          body: new URLSearchParams("username="+user.id+"&pattern="+tmpPattern+"&strength="+measure.getStrength(tmpPattern)+"&rank="+getRank(tmpPattern)+'&pretest=1'),
          mode: 'no-cors'
        }).then(function(response,err) {
          window.location = "./mypage.html";
        }).catch(function(err){
          alert("データ収集エラー\n何度も発生する場合，管理者に一報ください @kinmemodoki");
          gameCtr.cancelConfirm();
          window.location = "./mypage.html";
        });

      }else{
        alert("まちがってるよ");
        pageCtr.reset();
      }
      //location.href = "mypage.html";
    },
    reset:()=>{
      viewCtr.setMsg("端末認証で設定したい\nパターンを入力してね");
      lock.reset();
      viewCtr.removeFunc();
    }
  }
}());

const viewCtr = (function(){
  var value = document.getElementById("value");
  var desc = document.getElementById("desc");
  var nextbtn = document.getElementById("next");
  var resetbtn = document.getElementById("reset");
  nextbtn.addEventListener("click",pageCtr.confirm);
  resetbtn.addEventListener("click",pageCtr.reset);
  console.log(getUrlVars())
  if(getUrlVars().show==1)
    document.getElementById("meter").style.display = "block";

  return {
    setNextFunc:()=>{
      nextbtn.removeEventListener("click",pageCtr.confirm);
      nextbtn.addEventListener("click",pageCtr.submit);
    },
    setResetFunc:()=>{},
    removeFunc:()=>{
      nextbtn.removeEventListener("click",pageCtr.submit);
      nextbtn.addEventListener("click",pageCtr.confirm);
    },
    showRank:(rank)=>{
      console.log(value.innerHTML);
      switch(rank){
        case 0:
          value.innerText = "none";
          value.style.color = "#666";
          break;
        case 1:
          value.innerText = "Weak";
          value.style.color = "red";
          break;
        case 2:
          value.innerText = "Medium";
          value.style.color = "yellow";
          break;
        case 3:
          value.innerText = "Strong";
          value.style.color = "blue";
          break;
      }
    },
    setMsg:(msg)=>{
      desc.innerText = msg;
    },
    isConfirm:()=>{
      return isConfirm;
    }
  }
}());