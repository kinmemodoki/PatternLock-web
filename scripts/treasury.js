var data = [
  {name:"dummy1",description:"ダミーだよ",src:"slimeDQ.png"},
  {name:"dummy2",description:"ダミーだよ"},
  {name:"dummy3",description:"ダミーだよ"},
  {name:"青いモンスター",description:"ぷるぷる...\nボクは悪いモンスターじゃないよ．",src:"slimeDQ.png"},
  {name:"小さいメダル",description:"世界に110枚あるといわれている\n貴重なメダル．",src:"smallMedal.png"},
  {name:"勇者のしるし",description:"勇者の証をしめすペンダント．\nかぶとと剣とで1セット．",src:"roto.png"},
  {name:"伝説ソード",description:"伝説の退魔の剣．\n最近は脆くなったが壊れても10分で直る．",src:"masterSword.png"},
  {name:"妖精入り瓶",description:"体力がなくなっても回復してくれる．\nこのゲームでは意味がない．",src:"fairyBin.png"},
  {name:"ハートの型器",description:"体力の上限が上がるか\nHPが100%回復してふっとびにくくなる．",src:"heartVessel.png"},
  {name:"ポーション",description:"HPが50-60回復する．\nたまにコンビニで売ってる．",src:"posion.png"},
  {name:"クリスタル",description:"強い力を持った不思議な石．\nまれに属性を持つ．",src:"mithril.png"},
  {name:"平家の小手",description:"実は小数点以下の確率で盗めない．",src:"kote.png"},
  {name:"グランとリオン",description:"カエルの騎士がもっていた伝説の剣．\nまたの名を「正宗」．",src:"grandrion.png"},
  {name:"宇宙生命体コア",description:"巨大な宇宙生命体のコア．\nきっと真ん中の敵がコアだ！",src:"ravosCore.png"},
  {name:"ロボ",description:"大昔に動いていたロボ．\n別世界では緑化計画は成功していたかもしれない．",src:"robo.png"},
  {name:"赤いM帽子",description:"有名な配管工がかぶっていた帽子．\n踏みつけてジャンプできるらしい．",src:"Mhat.png"},
  {name:"でぶ羽コウラ",description:"最強の武器になるはずだったが...\nフライパンのほうが強かった...",src:"pata.png"},
  {name:"カエルメダル",description:"いもむしが踏みつけられると\n落とすメダル．Gimme Frog Coins !",src:"frogCoin.png"},
];

var viewCtr = (function(){
  const msgFrame = document.getElementById("msg-window");
  const iconFrame = document.getElementById("icon");
  const itemName = document.getElementById("name");
  const rate = document.getElementById("rate");
  const msgCtr = new WordTyping(msgFrame);
  msgCtr.type("これまでにゲットしたお宝がみれますよ.\n色のついたお宝をタップしてね．",{speed:40});
  return {
    setItems:(items)=>{
      //var dom;
      var count = 0;
      if(!items)
        return
      for(var i = 3; i<items.length;i++){
        if(items[i]){
          count++;
          console.log("tre"+i);
          var dom = document.getElementById("tre"+i);
          dom.className = "";
          dom.eventParam = i;
          dom.addEventListener("click",viewCtr.showItem,false);
        }
      }
      console.log(count);
      viewCtr.setPersentage("取得率:"+Math.floor(count*100/15));
    },
    setPersentage:(per)=>{
      rate.innerText = per+"%";
    },
    showItem:(event)=>{
      var itemId = event.target.eventParam;
      console.log(itemId);
      iconFrame.setAttribute("src","img/treasure/"+data[itemId].src);
      msgCtr.type(data[itemId].description);
      itemName.innerText = data[itemId].name;
    }
  }

}());

var gameCtr = (function(){
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var havingItem = user.item;
  return {
    init:()=>{
      viewCtr.setItems(havingItem);
    }
  }
}());

window.onload = ()=>{
  gameCtr.init();
}