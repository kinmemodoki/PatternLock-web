const dropTable = {
  coin:[
    {min:0,max:0},
    {min:50,max:100},
    {min:200,max:500},
    {min:500,max:800},
    {min:900,max:1500},
    {min:1500,max:2200}
  ],
  drop:[
    ["ほこり","ごみ","チリ"],
    [{name:"青いモンスター",src:"img/treasure/slimeDQ.png"},{name:"小さいメダル",src:"img/treasure/smallMedal.png"},{name:"勇者のしるし",src:"img/treasure/roto.png"}],
    [{name:"伝説ソード",src:"img/treasure/masterSword.png"},{name:"妖精入り瓶",src:"img/treasure/fairyBin.png"},{name:"ハートの型器",src:"img/treasure/heartVessel.png"}],
    [{name:"ポーション",src:"img/treasure/posion.png"},{name:"クリスタル",src:"img/treasure/mithril.png"},{name:"平家の小手",src:"img/treasure/kote.png"}],
    [{name:"グランとリオン",src:"img/treasure/grandrion.png"},{name:"宇宙生命体コア",src:"img/treasure/ravosCore.png"},{name:"ロボ",src:"img/treasure/robo.png"}],
    [{name:"赤いM帽子",src:"img/treasure/Mhat.png"},{name:"でぶ羽コウラ",src:"img/treasure/pata.png"},{name:"カエルメダル",src:"img/treasure/frogCoin.png"}]
  ]
}

var viewCtr = (function(){
  var itemList = document.getElementById("item-list");

  var itemDom = document.createElement("div");
  itemDom.setAttribute("class","cell");
  itemDom.appendChild(document.createElement("img"));
  var spanDom = document.createElement("span");
  spanDom.setAttribute("class","dottext item-name");
  itemDom.appendChild(spanDom);
  var imgSrc,spanStr;
  return {
    showItem:(itemAry)=>{
      //itemAry : ["coin","item"]
      for(var i = 0; i < itemAry.length; i++){
        var targetDom = itemDom.cloneNode(true);
        if(itemAry[i]=="coin"){
          imgSrc = "img/golds.png";
          spanStr = "コインの山"
        }else{
          imgSrc = "img/treasure_bag.png";
          spanStr = "お宝ぶくろ"
        }
        targetDom.children[0].src = imgSrc;
        targetDom.children[1].innerText = spanStr;
        itemList.appendChild(targetDom);
      }
    },
    revealItem:(items)=>{
      //items : [
      //  {name:"1000コイン",src:"img/golds.png"},
      //  {name:"青いモンスター",src:"img/treasure/slimeDQ.png"}]
      itemList.textContent = null;
      for(var i = 0; i < items.length; i++){
        var targetDom = itemDom.cloneNode(true);
        imgSrc = items[i].src;
        spanStr = items[i].name;
        targetDom.children[0].src = imgSrc;
        targetDom.children[1].innerText = spanStr;
        itemList.appendChild(targetDom);
      }
    }
  } 
}());

var gameCtr = (function(){
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var voyage = context.voyage ? JSON.parse(context.voyage) : {};
  var drop = voyage.drop ? JSON.parse(voyage.drop) : {gold:[0,0,0,0,0,0],treasure:[0,0,0,0,0,0]};
  if(!user.item) user.item = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  return {
    init:()=>{
      var unrevealItems = [];
      for(var stageId=0;stageId<6;stageId++){
        console.log(drop.gold[stageId]);
        for(var i=0;i<drop.gold[stageId];i++)
          unrevealItems.push("coin");
      }
      for(var stageId=0;stageId<6;stageId++){
        for(var i=0;i<drop.treasure[stageId];i++)
          unrevealItems.push("treasure");
      }
      viewCtr.showItem(unrevealItems);
    },
    estimateItem:()=>{
      console.log("YO");
      var gainItem = [];
      var dropCoinAmount,dropItemId,gainTre;
      for(var stageId=0;stageId<6;stageId++){
        for(var i=0;i<drop.gold[stageId];i++){
          dropCoinAmount = Math.floor(Math.random() * (dropTable.coin[stageId].max - dropTable.coin[stageId].min) + dropTable.coin[stageId].min);
          gainItem.push({name:dropCoinAmount+"枚",src:"img/golds.png"});
          user.money = user.money-0 + dropCoinAmount-0;
        }
      }
      for(var stageId=0;stageId<6;stageId++){
        for(var i=0;i<drop.treasure[stageId];i++){
          dropItemId = Math.floor(Math.random() * 3);
          gainTre = dropTable.drop[stageId][dropItemId];
          gainItem.push({name:gainTre.name,src:gainTre.src});
          user.item[dropItemId + stageId*3] = 1;
        }
      }
      voyage.drop = JSON.stringify({gold:[0,0,0,0,0,0],treasure:[0,0,0,0,0,0]});
      docCookies.setItem("voyage",JSON.stringify(voyage));
      docCookies.setItem("player",JSON.stringify(user));
      viewCtr.revealItem(gainItem);
      button.removeEventListener("click",gameCtr.estimateItem,false);
      console.log(user.money);
      console.log(user.item);
    }
    //
  }
}());



gameCtr.init();
var button = document.getElementById("estimateButton")
button.addEventListener("click",gameCtr.estimateItem,false);


