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

/*
?status=regist : 登録フェイズ
?show=0 : 強度メータ表示しない

regist
（登録）：（確認）：（送信）

auth
（確認）自動送信（送信）：（わすれた）->registでリロード
*/
function create_privateid( n ){
      var CODE_TABLE = "0123456789"
          + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          + "abcdefghijklmnopqrstuvwxyz";
      var r = "";
      for (var i = 0, k = CODE_TABLE.length; i < n; i++){
          r += CODE_TABLE.charAt(Math.floor(k * Math.random()));
      }
      return r;
    }

function execCopy(string){
  // true なら実行できている falseなら失敗か対応していないか
  return result;
}

const pageCtr = (function(){
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var isConfirm = 0;
  var isforget = 0;
  var rank,tmpPattern,pattern;

  if(!user.id){
    user.id = window.prompt("ID認識が出来ませんでした\n服部があなたが認識できるIDを入力してね", "");
  }
  return {
    onDraw:()=>{
      //完了時
      console.log("username="+user.id+"&pattern="+tmpPattern+"&strength="+measure.getStrength(tmpPattern)+"&rank="+getRank(tmpPattern)+'&istest=1&success=1');
      if(getUrlVars().status=="auth"){
        lock.checkForPattern(user.prepattern,function(){
          //あってた
          lock.disable();
          viewCtr.setMsg("認証成功！");
          fetch("/log/auth", {
            method: 'POST',
            body: new URLSearchParams("username="+user.id+"&pattern="+tmpPattern+"&strength="+measure.getStrength(tmpPattern)+"&rank="+getRank(tmpPattern)+'&istest=1&success=1'),
            mode: 'no-cors'
          }).then(function(response,err) {
            if(response.status != 200)
              alert("データ収集サーバにアクセスできませんでした\n何度も発生する場合，管理者に一報ください @kinmemodoki");
            viewCtr.setMsg("ページを閉じても大丈夫です");
            //window.location = "https://docs.google.com/forms/d/e/1FAIpQLScoZxGO5nMAkyTgwoC3bG9OqOcxe4wbLlwfYSK_9RAqRwQpHQ/viewform?usp=pp_url&entry.1435948606="+user.id;
          }).catch(function(err){
            alert("データ収集エラー\n何度も発生する場合，管理者に一報ください @kinmemodoki");
            gameCtr.cancelConfirm();
            //location.href = "mypage.html";  
          });
          
        },function(){
          //まちがってた
          
        });
      }
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
    forget:()=>{
      window.location.href="/demo.html?status=regist&forget=1";
    },
    submit:()=>{
      console.log("pattern : ",pattern);
      if(tmpPattern == pattern){
        //確認成功時
        user.prepattern = tmpPattern;
        docCookies.setItem("player",JSON.stringify(user));
        console.log("username="+user.id+"&pattern="+tmpPattern+"&strength="+measure.getStrength(tmpPattern)+"&rank="+getRank(tmpPattern)+'&isforget='+isforget+'&istest=1');
        fetch("/log/regist", {
          method: 'POST',
          body: new URLSearchParams("username="+user.id+"&pattern="+tmpPattern+"&strength="+measure.getStrength(tmpPattern)+"&rank="+getRank(tmpPattern)+'&isforget='+isforget+'&istest=1'),
          mode: 'no-cors'
        }).then(function(response,err) {
          if(response.status != 200)
            alert("データ収集サーバにアクセスできませんでした\n何度も発生する場合，管理者に一報ください @kinmemodoki");
          alert("これで実験はすべて終了です！\n長い間どうもありがとうございました！\n服部夢二");
          viewCtr.setMsg("ページを閉じても大丈夫です");
          lock.disable();
          pageCtr.reset = function(){};
          pageCtr.submit = function(){};
        })

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
  console.log(getUrlVars().status)
  if(getUrlVars().show=="0"){
    document.getElementById("meter").style.display = "none";
  }
  if(getUrlVars().status=="auth"){
    desc.innerText = "設定したパターンを入力してね";
    document.getElementById("meter").style.display = "none";
    var forget = document.getElementById("forget");
    forget.addEventListener("click",pageCtr.forget);
    nextbtn.style.display = "none";
    resetbtn.style.display = "none";
  }else{
    document.getElementById("forget").style.display = "none";
  }

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