const dataSet = {
  stage:[
    {name:'街',file:'city',step:100000},
    {name:'始まりの平原',file:'field',step:10},
    {name:'迷いの森',file:'forest',step:10},
    {name:'白銀の雪原',file:'snow',step:20},
    {name:'不毛の砂漠',file:'desert',step:30},
    {name:'灼熱の火山',file:'vulcano',step:40}
  ]
}

var viewController = (function(){
  const player = document.getElementById("playerIcon");
  const msgFrame = document.getElementById("msg-window");
  const weapon = document.getElementById("weapon");
  const fade = document.getElementById("fade");
  const newInfoIcon = document.getElementById("newInfo");
  const stage = document.getElementById("stage");

  const msgCtr = new WordTyping(msgFrame);
  return {
    msgType:function(msg){
      msgCtr.type(msg,{speed:40});
    },
    showWeapon:function(weaponId){
      if(weaponId)
        weapon.src = "img/weapon/weapon"+weaponId+".png";
      else
        weapon.style.display="none!important";
    },
    disableButton:()=>{
      console.log("disable button");
      fade.style.display="block";
    },
    showOssan:()=>{
      console.log("ossan");
      player.setAttribute("src","img/character/kajiya.png");
    },
    showNewInfoIcon:()=>{
      newInfoIcon.style.display="block";
    },
    changeBGI:function(stageId){
      if(stageId != undefined){
        console.log(stageId)
        stage.style["background-image"] = 'url("../img/stage/'+dataSet.stage[stageId].file+'480.png")';
      }
    }
  }
}());

window.onload = function(){
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var voyage = context.voyage ? JSON.parse(context.voyage) : {};
  var drop = context.drop ? JSON.parse(context.drop) : {};
  console.log(context);
  if(!user.id)
    location.href = "./description.html"
  if(user.weapon === undefined){
    //パスワード未設定
    console.log("not set password");
    viewController.disableButton();
    viewController.showOssan();
    viewController.changeBGI(0);
    viewController.msgType("鍛冶屋で武器を作ってくるんだ");
  }else{
    document.getElementById("toYusha").addEventListener("click",()=>{location.href="./battle.html";},false);
    if(voyage.stage === undefined || voyage.stage===0){
      //冒険未設定 && パスワード設定後
      console.log("not set voyage : ",voyage.stage);
      viewController.changeBGI(0);
      viewController.msgType("関所で冒険先を選んでみよう");
    }else{
      //冒険設定後()
      console.log("set voyage : ",voyage.stage);
      viewController.msgType("勇者は冒険に行っている...");
      viewController.changeBGI(voyage.stage);
    }
  }
  if(drop.tresure0||drop.tresure1||drop.tresure2||drop.tresure3||drop.tresure4){
    console.log("you have treasure!!");
  }
  viewController.showWeapon(user.weapon);
  document.getElementById("toKajiya").addEventListener("click",()=>{location.href="./kajiya.html";},false);
  document.getElementById("toSekisyo").addEventListener("click",()=>{location.href="./select.html";},false);
  document.getElementById("toHoumotsu").addEventListener("click",()=>{location.href="./treasury.html";},false);
  document.getElementById("toUketori").addEventListener("click",()=>{location.href="./reward.html";},false);
  document.getElementById("toDesc").addEventListener("click",()=>{location.href="./description.html";},false);

}