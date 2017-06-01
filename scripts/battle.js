var imgSrc = ["stone1","sword1","sword2","sword3"];
var player = document.getElementById("player");
var enemy = document.getElementById("enemy");
var challenge = 0;

var lock = new PatternLock("#patternContainer",{
  margin:60,
  radius:80,
  onDraw:function(pattern){
    challenge++;
    //console.log(player.style.animation);
    animAttackPlayer(player);
    animAttackEnemy(enemy);
  },
  onMove:function(pattern){
    
  }
});

function animAttackPlayer(dom){
  dom.style.animation = "attack_player 0.1s ease infinite";
  dom.addEventListener("animationiteration",function(e){
      dom.style.animation = "";
  });
}

function animAttackEnemy(dom){
  dom.style.animation = "attack_enemy 0.1s ease infinite";
  dom.addEventListener("animationiteration",function(e){
      dom.style.animation = "";
  });
}

