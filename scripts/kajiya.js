var imgSrc = ["stone1","sword1","sword2","sword3"];
var rank = 0;
var str = 0.0;

const talk = [
  "この鉱石で武器をつくるのか？\n\n（パターンの設定を行います）",
  "こんな武器じゃ\nモンスターは倒せないぜ",
  "そこそこだな",
  "かなり強くなったな！\nこの鉱石じゃこれが限界だ"
];

var msgFrame = document.getElementById("msg-window");
var msgCtr = new WordTyping(msgFrame);
var measure = new PasswordMeasure();

var lock = new PatternLock("#patternContainer",{
  margin:60,
  radius:80,
  onDraw:function(pattern){
    //finish write pattern.
    rank = 0;
  },
  onMove:function(pattern){
    //when add a node to stack.
    //console.log("MOVE!: ",pattern);
    var newRank = getRank(measure.getStrength(pattern));
    console.log("rank",rank,": new",newRank);
    if(rank != newRank){
      rank = newRank;
      msgFrame.value="";
      msgCtr.type(talk[rank]);
      //$('#main-textarea').typetype(talk[rank]);
      document.getElementById("weapon").src = "img/"+imgSrc[rank]+".png";
    }
  }
});

msgCtr.type(talk[0]);
//$('#main-textarea').typetype(talk[rank]);
//new TypeSimulate(document.getElementById("main-textarea"),"aaaaaa");

function getRank(str){
  if(str==0)
    return 0;
  else if(str<0.40)
    return 1;
  else if(str<0.56)
    return 2;
  else
    return 3;
}

