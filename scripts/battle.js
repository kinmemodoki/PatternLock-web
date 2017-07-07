
var enemy = {};
enemy.id = docCookies.getItem("enemy.id")||0;
enemy.hp = docCookies.getItem("enemy.hp")||100;
var player = {
  key:docCookies.getItem("player.key"),
  weapon:docCookies.getItem("player.weapon")
}
var voyage = {
  stage:docCookies.getItem("voyage.stage"),
  step:docCookies.getItem("voyage.step")
}

var dataSet = {
  stage:['field','forest','snow','desert','vulcano'],
  enemyName:[
     'のうさぎ','オオトカゲ','ゴブリン',
     'スパイダー','まほうつかい','もりのぬし',
     'ゆきんこ','スノーマン','イエティ',
     'ガラガラヘビ','スコーピオン','サンドワーム',
     'モール','ファイアゴーレム','ドラゴン'
  ],
  enemyFile:[
    'slime','slime','slime',
    'slime','slime','slime',
    'yukinko','snowman','yeti',
    'snake','scorpion','slime',
    'slime','slime','slime',
  ]
}

var enemyController = (function(){
  var id;
  var hp;
  function calcDamage(){
    var atkPow = battleController.getPlayerPower();

  }
  return {
    setEnemy:function(enemyObj){
      id = enemyObj.id;
      hp = enemyObj.hp;
    },
    addDamage:function(damageVal){
      
    }
  }
}());

var battleController = (function(){
  var battleStatus;

  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var voyage = context.voyage ? JSON.parse(context.voyage) : {};
  var enemy = voyage.enemy ? JSON.parse(voyage.enemy) : {};
  var drop = voyage.drop ? JSON.parse(voyage.drop) : {};
  if(enemy.hp < 0 || !enemy.id){ //get new Enemy
    var random = Math.random();
    console.log(voyage);
    if(random < 0.2){
      enemy.id=2+voyage.stage*3;
    }else if(random < 0.4){
      enemy.id=1+voyage.stage*3;
    }else{
      enemy.id=0+voyage.stage*3;
    }
    console.log(enemy.id);
    enemy.hp = 100;
  }

  return {
    initialize:function(){
      viewController.msgType(dataSet.enemyName[enemy.id]+"があらわれた！");
      viewController.showEnemy(enemy.id,enemy.hp);
      battleController.commit();
    },
    isVoyage:function(){
      if(voyage.stage>=0)
        return true
      else
        return false
    },
    getPattern:function(){
      return user.key
    },
    getStage:function(){
      return voyage.stage
    },
    action:function(){
      if(battleStatus==="attack"){
        battleController.attackEnemy();
        viewController.atk();
      }else{
        battleController.resetEnemyId();
        viewController.run();
      }
    },
    attackEnemy:function(){
      damageVal = 80;
      enemy.hp = enemy.hp-damageVal;
      var percent = enemy.hp < 0 ? 0 : enemy.hp;
      viewController.damegeEnemy(damageVal,percent);
      if(enemy.hp<=0){
        var dropObj = battleController.dropItem();
        viewController.dropItem(dropObj.item);
        if(dropObj.item=="gold"){
          viewController.addGold(dropObj.amount);
        }else{
          viewController.addTresure(dropObj.amount);
        }
      }
    },
    dropItem:function(){
      drop = {item:"gold",amount:100};
      battleController.commit();
      return drop
    },
    getVoyageStep:function(){
      return voyage.step || 0
    },
    getEnemyObj:function(){
      return {id:enemy.id, hp:enemy.hp}
    },
    getPlayerPower:function(){
      return user.weapon
    },
    resetEnemyId:function(){
      enemy.id = null;
    },
    setBattleStatus:function(cmd){
      battleStatus = cmd;
    },
    commit:function(){
      voyage.enemy = JSON.stringify(enemy);
      voyage.drop = JSON.stringify(drop);
      docCookies.setItem("voyage",JSON.stringify(voyage));
    }
  }
}());

var viewController = (function(){
  var frontScreen = document.getElementById("frontScrreen");
  var enemyWindow = document.getElementById("enemyWindow");
  var enemyDom = document.getElementById("enemy");
  var hpBar = document.getElementById("hpBar");
  var textWindow = document.getElementById("msg-window");
  var atkBtn = document.getElementById("atkBtn");
  var runBtn = document.getElementById("runBtn");
  var atkPlayer = document.getElementById("atkPlayer");
  var runPlayer = document.getElementById("runPlayer");
  var clockDom = document.getElementById("clock");
  var dayDom = document.getElementById("day");
  var damage = document.getElementById("damage");
  var msgCtr = new WordTyping(textWindow);
  var lock = new PatternLock("#patternContainer",{
    margin:35,
    radius:40,
    onDraw:function(pattern){
      lock.checkForPattern(battleController.getPattern(),function(){
        battleController.action();
        lock.disable();
        window.setTimeout( ()=>{
          battleController.commit();
          window.location = "./mypage.html"
        }, 1000);
      },function(){
        //alert("Pattern is not correct");
      });

    },
    onMove:function(pattern){
      window.navigator.vibrate(50);
    },
    success:function(){
      console.log("success");
      this.objectHolder[this.token].holder.addClass('patt-error');
    }
  });

  //preload HTML data
  frontScreen.style.backgroundImage = 'url("../img/stage/'+dataSet.stage[battleController.getStage()]+'480.png")';
  if(voyage.stage==1){//forest
    dayDom.style.color = '#ddd';
    clockDom.style.color = '#ddd';
  }

  return {
    msgType:function(msg){
      msgCtr.type(msg,{speed:20});
    },
    setTime:function(month,date,day,hour,min){
      clockDom.innerHTML = hour+'<span class="blinking">:</span>'+min;
      dayDom.innerHTML = month+"/"+date+"("+day+")";
    },
    showEnemy:function(id,hp){
      hpBar.style.width=hp+"%";
      enemyDom.setAttribute('src','img/enemy/'+dataSet.enemyFile[id]+'.png');
      enemyDom.style.display = 'block';

    },
    showLocker:function(){
      //画面変化
      frontScreen.style.transform='translate(0, -520px)';
      enemyWindow.style.transform='translate(0, 200px)';//bottom:100px;
      textWindow.style.transform='translate(0, 200px)';
      textWindow.style.opacity=0;
      atkBtn.style.opacity=0;
      runBtn.style.opacity=0;
    },
    comePlayer:function(cmd){
      if(cmd==='attack'){
        atkPlayer.style.transform='translate(350px, 0) scaleX(-1)';
      }else{
        runPlayer.style.transform='translate(-800px, 0)';
      }
    },
    atk:function(){

    },
    run:function(){
      runPlayer.style.transform='translate(-2200px, 0)';
    },
    damegeEnemy:function(damageVal,percent){
      damage.innerHTML = damageVal;
      damage.style.opacity=1;
      damage.style.transform='translate(0, -40px)';
      enemyDom.classList.add('shake');
      hpBar.style.width=percent+"%";
    },
    defeatEnemy:function(){

    },
    dropItem:function(itemId){

    },
    addTresure:function(){

    },
    addGold:function(amount){

    }
  }

}());

window.onload = ()=>{
  var step = battleController.getVoyageStep();
  if(!battleController.isVoyage){
    window.location.href = "./debug.html";
  }
  reloadClock();
  if(step > 10){
    //宿屋
  }
  var enemyObj = battleController.getEnemyObj();
  battleController.initialize();
}

function reloadClock(){
  var myDay = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var now  = new Date();
  var month = now.getMonth()+1; // 月
  var date = now.getDate(); // 日
  var day = myDay[now.getDay()]; //曜日
  var hour = now.getHours(); // 時
  var min  = now.getMinutes(); // 分
  if(hour < 10) { hour = ('00'+hour).slice(-2); }
  if(min < 10) { min = ('00'+min).slice(-2); }
  viewController.setTime(month,date,day,hour,min);
  window.setTimeout( "reloadClock()", 10000);
}

function command(cmd){
  window.navigator.vibrate(50);
  viewController.showLocker();
  viewController.comePlayer(cmd);
  battleController.setBattleStatus(cmd);
}