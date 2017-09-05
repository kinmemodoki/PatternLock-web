//dataset
const voyage = ["始まりの平原","迷いの森","白銀の雪原","不毛の砂漠","灼熱の火山"];

var stageSelector = (function(){
  var selectStageId = null;
  return {
    select:function(id){
      selectStageId = id;
    },
    setCookie:function(){
      console.log("cookie set ",selectStageId);
      var voyage = {stage:selectStageId+1,step:0}
      if(selectStageId != null){
        docCookies.setItem("voyage",JSON.stringify(voyage));
      }else{
        console.log("err");
      }
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
  const weapon = document.getElementById("weapon");
  const list = document.getElementById("list");

  const msgCtr = new WordTyping(msgFrame);
  return {
    msgType:function(msg){
      msgCtr.type(msg,{speed:40});
    },
    showConfirm:()=>{
      confirmFrame.style.display = "block";
    },
    hideConfirm:()=>{
      confirmFrame.style.display = "none";
    },
    showWeapon:function(weaponId){
      if(weaponId)
        weapon.src = "img/weapon/weapon"+weaponId+".png";
      else
        weapon.style.display="none";
    },
    wentPlayer:function(){
      this.msgType("気をつけて！");
      player.style.transform='translate(640px, 0)';
    },
    disableSelect:function(){
      const fade = document.getElementById("fade");
      list.style.overflow="hidden"
      fade.style["z-index"]="100";
    },
    showTreasure:(itemAry)=>{
      console.log("item :",itemAry);
      for(var i = 0; i<itemAry.length; i++){
        if(itemAry[i])
          document.getElementById("tre"+i).className = "treasure";
      }
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
  }, 500);
}
function initSelect(){
  viewController.msgType("どこにいくんだ？");
  viewController.hideConfirm();
  stageSelector.reset();
}

window.onload = function(){
  initSelect();
  var context = getUserData();
  console.log(context.player);
  var user = context.player ? JSON.parse(context.player) : {};
  var voyage = context.voyage ? JSON.parse(context.voyage) : {};
  console.log(user.weapon);
  if(user.weapon != undefined){
    viewController.showWeapon(user.weapon);
    if(user.item)
      viewController.showTreasure(user.item);
    document.getElementById("yesBtn").addEventListener("click",desideSelect,false);
    document.getElementById("noBtn").addEventListener("click",initSelect,false);
    document.getElementById("moc1").addEventListener("click",confirmSelect(0),false);
    document.getElementById("moc2").addEventListener("click",confirmSelect(1),false);
    document.getElementById("moc3").addEventListener("click",confirmSelect(2),false);
    document.getElementById("moc4").addEventListener("click",confirmSelect(3),false);
    document.getElementById("moc5").addEventListener("click",confirmSelect(4),false);
  }else{
    viewController.msgType("武器を作ってからきてね");
    viewController.disableSelect();
  }
}




