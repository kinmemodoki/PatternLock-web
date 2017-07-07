//dataset
const voyage = ["debug","始まりの平原","迷いの森","白銀の雪原","不毛の砂漠","灼熱の火山"];

var stageSelector = (function(){
  var selectStageId = null;
  return {
    select:function(id){
      selectStageId = id;
    },
    setCookie:function(){
      console.log("cookie set ",selectStageId);
      if(selectStageId != null)
        docCookies.setItem("voyage.stage",selectStageId-1);
      else
        console.log("err");
    },
    reset:function(){
      selectStageId = null;
    }
  }
}());

var viewController = (function(){
  const confirmFrame = document.getElementById("confirm-window");
  const player = document.getElementById("player");
  const msgFrame = document.getElementById("msg-window");
  const msgCtr = new WordTyping(msgFrame);
  return {
    msgType:function(msg){
      msgCtr.type(msg,{speed:40});
    },
    showConfirm(){
      confirmFrame.style.display = "block";
    },
    hideConfirm(){
      confirmFrame.style.display = "none";
    },
    wentPlayer:function(){
      this.msgType("気をつけて！");
      player.style.transform='translate(640px, 0)';
    }
  }
}());

function confirmSelect(num){
  var stageId = num;
  return function(){
    viewController.msgType(voyage[stageId]+"でいいのか？");
    viewController.showConfirm();
    stageSelector.select(stageId);
  }
}
function desideSelect(){
  stageSelector.setCookie();
  viewController.wentPlayer();
  window.setTimeout( ()=>{
    window.location = "./mypage.html"
  }, 1000);
}
function cancelSelect(){
  viewController.msgType("どこにいくんだ？");
  viewController.hideConfirm();
  stageSelector.reset();
}

window.onload = function(){
  document.getElementById("moc1").addEventListener("click",confirmSelect(1),false);
  document.getElementById("moc2").addEventListener("click",confirmSelect(2),false);
  document.getElementById("moc3").addEventListener("click",confirmSelect(3),false);
  document.getElementById("moc4").addEventListener("click",confirmSelect(4),false);
  document.getElementById("moc5").addEventListener("click",confirmSelect(5),false);
  document.getElementById("yesBtn").addEventListener("click",desideSelect,false);
  document.getElementById("noBtn").addEventListener("click",cancelSelect,false);
  viewController.msgType("冒険に行くのかい？");
}




