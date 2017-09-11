var ingots = [
    {name:"鉄",eng:"iron",money:0,sub:"大昔から人々に使われていた金属\n邪悪なものを取り除く力があるらしい"},
    {name:"銅",eng:"copper",money:500,sub:"鉄と同じく大昔から人々に使われていた金属\n鉄と比べ加工がしやすいため武器の幅がひろがった"},
    {name:"金",eng:"gold",money:3000,sub:"現代でも変わらず高い価値をもつ金属\n電気を通しやすい不思議な力をもつ"},
    {name:"ダイヤモンド",eng:"Diamond",money:10000,sub:"めっちゃ希少な宝石\nめっちゃ硬いしめっちゃキレイ"},
    {name:"ブラックチタン",eng:"black-titan",money:30000,sub:"とても硬い金属\nかっこいい"},
    {name:"アダマンチウム",eng:"adamantium",money:60000,sub:"この世でイチバン硬い伝説の金属\nこの金属を加工できる匠は数人しかいない"},
    ];

var gameCtr = (function(){
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var myMoney = user.money || 0;
  var haveIngot = user.haveOre || [1,0,0,0,0,0];
  return {
    init:()=>{
      viewCtr.showIngots();
      viewCtr.setMyMoney(myMoney);
    },
    purchaseIngot:(ingotId)=>{
      if(ingots[ingotId-1].money<=myMoney){
        myMoney -= ingots[ingotId-1].money;
        user.money = myMoney;
        haveIngot[ingotId-1] = 1;
        user.haveOre = haveIngot;
        viewCtr.unlockIngot(ingotId);
        viewCtr.setMyMoney(myMoney);
        gameCtr.setCookie();
      }else{
        //cancel purchase
        alert("You don't have enough money!");
      }
    },
    decideIngot:()=>{
      var elm = document.querySelector("#carousel-indicators>.active");
      var oreId = elm.getAttribute("data-slide-to");
      if(haveIngot[oreId]){
        user.ore = oreId-0+1;
        gameCtr.setCookie();
        location.href = "./kajiya.html"
      }else{
        window.alert("Please purchase Ingot!!")
      }
    },
    setCookie:()=>{console.log("user");docCookies.setItem("player",JSON.stringify(user));},
    getHaveIngot:()=>{ return haveIngot }
  }
}());

var viewCtr = (function(){
  const moneyDomId = ["empty","mymoney2","mymoney3","mymoney4","mymoney5","mymoney6"];
  const purchaseDomId = ["empty","mymoney2","mymoney3","mymoney4","mymoney5","mymoney6"];

  var moneyDom = [];
  
  console.log(moneyDom);
  return {
    showIngots:()=>{
      var haveIngots = gameCtr.getHaveIngot();
      for(i in haveIngots){
        if(haveIngots[i]&&i>0)
          viewCtr.unlockIngot(i-0+1);
      }
    },
    setMyMoney:(money)=>{
      var haveIngots = gameCtr.getHaveIngot();
      for(var i = 1; i<haveIngots.length;i++){
        //haveIngots:[1,0,1,0,0,0]
        var a = moneyDomId[i+1];
        if(!haveIngots[i])
          moneyDom.push(document.getElementById(moneyDomId[i]));
      }
      for(i in moneyDom)
        moneyDom[i].innerText = money;
    },
    unlockIngot:(ingotId)=>{
      //買えるingotId：2~6
      var elm = document.getElementById("item"+ingotId);
      elm.children[0].className = "center-absolute";
      elm.children[1].children[0].innerText = ingots[ingotId-1].name;
      elm.children[1].children[1].innerText = ingots[ingotId-1].eng;
      elm.children[2].className = "hidden";
    }
  }
}());

document.getElementById("purchase2").addEventListener("click",(event)=>{gameCtr.purchaseIngot(2);},false);
document.getElementById("purchase3").addEventListener("click",(event)=>{gameCtr.purchaseIngot(3);},false);
document.getElementById("purchase4").addEventListener("click",(event)=>{gameCtr.purchaseIngot(4);},false);
document.getElementById("purchase5").addEventListener("click",(event)=>{gameCtr.purchaseIngot(5);},false);
document.getElementById("purchase6").addEventListener("click",(event)=>{gameCtr.purchaseIngot(6);},false);
document.getElementById("decide-button").addEventListener("click",gameCtr.decideIngot,false);


window.onload = function(){
  gameCtr.init();
}

/*
$('#carousel-example-generic').on('slide.bs.carousel', function () {
  console.log( "回slideメソッドを呼び出しましたね。" );
});
$('#carousel-example-generic').on('slid.bs.carousel', function () {
  console.log( "回slideメソッドを呼びおわり。" );
});
*/