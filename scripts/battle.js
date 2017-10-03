const dataSet = {
  stage:[
    {name:'街',file:'city',step:100000},
    {name:'始まりの平原',file:'field',step:10},
    {name:'迷いの森',file:'forest',step:10},
    {name:'白銀の雪原',file:'snow',step:10},
    {name:'不毛の砂漠',file:'desert',step:10},
    {name:'灼熱の火山',file:'vulcano',step:10}
  ],
  enemy:[
    {name:'掃除',file:'baito1',hp:500},
    {name:'お使い',file:'baito2',hp:800},
    {name:'警備',file:'baito3',hp:1000},

    {name:'スライム',file:'slime',hp:90},
    {name:'オオコウモリ',file:'bat',hp:150},
    {name:'オーガ',file:'ogre',hp:250},

    {name:'スパイダー',file:'spider',hp:120},
    {name:'まほうつかい',file:'mage',hp:220},
    {name:'もりのぬし',file:'haunted',hp:350},

    {name:'ゆきんこ',file:'yukinko',hp:290},
    {name:'スノーマン',file:'snowman',hp:450},
    {name:'イエティ',file:'yeti',hp:600},

    {name:'ガラガラヘビ',file:'snake',hp:500},
    {name:'スコーピオン',file:'scorpion',hp:600},
    {name:'サンドワーム',file:'sandworm',hp:950},

    {name:'ひのたま',file:'fireboy',hp:1200},
    {name:'マグマボール',file:'magman',hp:1400},
    {name:'ドラゴン',file:'dragon',hp:1750},
  ],
  weaponPow:
  [0,
   10,60,110,
   30,100,130,
   40,120,150,
   50,230,260,
   60,340,380,
   70,400,600]
}
const enemyMidEncount = 0.4;

var battleController = (function(){

  var battleStatus;// isAtk or isRun
  var context = getUserData();
  var user = context.player ? JSON.parse(context.player) : {};
  var voyage = context.voyage ? JSON.parse(context.voyage) : {stage:0};
  var drop = voyage.drop ? JSON.parse(voyage.drop) : {};

  var progress;
  if(voyage.step){
    if(voyage.step===0)
      progress = 0;
    else{
      progress = (voyage.step*100/dataSet.stage[voyage.stage].step)%100;
      if(progress === 0)
        progress = 100;
    }
  }else{
    progress = null;
  }
  console.log("enemy:",voyage.enemy);
  var enemy = (voyage.enemy==undefined) ? getNewEnemy():JSON.parse(voyage.enemy);
  
  console.log("progress:",progress);
  if(enemy.hp <= 0 || progress===null){
    enemy =getNewEnemy();
  }

  if(drop.gold==undefined)
    drop.gold=[0,0,0,0,0,0];
  if(drop.treasure==undefined)
    drop.treasure=[0,0,0,0,0,0];

  function getNewEnemy(){
    var id,hp;
    var random = Math.random();
    if(70<=progress && progress<=100){//ボス
      id=2+voyage.stage*3;
    }else if(random < enemyMidEncount){//ザコ中
      id=1+voyage.stage*3;
    }else{//ザコ弱
      id=0+voyage.stage*3;
    }
    return {id:id,hp:dataSet.enemy[id].hp}
  };

  return {
    initialize:function(){
      if(progress<=101){
        if(enemy.id<3){
          viewController.msgType("勇者は"+dataSet.enemy[enemy.id].name+"のバイトをしている");
          viewController.hidePlayer();
        }else{
          if(progress>=90){
            viewController.msgType(dataSet.enemy[enemy.id].name+"が逃げそうだ...");
          }else{
            viewController.msgType(dataSet.enemy[enemy.id].name+"があらわれた！");
          }
        }
        viewController.showEnemy(enemy.id,enemy.hp);
      }/*else{//宿屋
        viewController.msgType("勇者は休んでいる...");
        viewController.showRestPlayer();
        viewController.hidePlayer();
        viewController.damegeEnemy = ()=>{};
        viewController.dropItem = ()=>{};
        viewController.hideEnemy = ()=>{};
      }*/
      viewController.showWeapon(user.weapon);
      viewController.showProgress(progress);
      viewController.setDrops(drop.gold[voyage.stage],drop.treasure[voyage.stage]);
      battleController.commit();
    },
    isVoyage:function(){
      if(voyage.stage>=0)
        return true
      else
        return false
    },
    action:function(){
      voyage.step++;
      if(voyage.step>dataSet.stage[voyage.stage].step)
        voyage.step = 0;
      console.log(voyage.step);
      if(battleStatus==="attack"){
        battleController.attackEnemy();
        viewController.atk();
      }else{
        battleController.resetEnemyId();
        viewController.run();
      }
    },
    attackEnemy:function(){
      var max = 1.00, min = 0.85;

      var ransuu =((Math.random()*((max+0.01)-min))+min);
      var damageVal = Math.floor(dataSet.weaponPow[user.weapon] * ransuu);
      
      enemy.hp = enemy.hp-damageVal;
      viewController.damegeEnemy(enemy.hp <= 0 ? 0 : enemy.hp*100 / dataSet.enemy[enemy.id].hp);
      //viewController.showDamageVal(damageVal);
      if(enemy.hp<=0)
        battleController.defeatEnemy();
    },
    defeatEnemy:function(){
      window.setTimeout( ()=>{
        viewController.hideEnemy();
        var dropObj = battleController.getDropItem();
        console.log(dropObj);
        viewController.dropItem(dropObj.item);
        if(dropObj.item=="gold"){
          drop.gold[voyage.stage] += dropObj.amount;
        }else{
          drop.treasure[voyage.stage] += dropObj.amount;
        }
        viewController.setDrops(drop.gold[voyage.stage],drop.treasure[voyage.stage])
        
      }, 300);
    },
    getDropItem:()=>{
      var myDrop,treasureRate;
      var enemyRarity = enemy.id % 3;
      var ransuu =Math.random()*100;
      console.log("ransuu : ",ransuu);
      if(enemyRarity==0)//ザコ敵
        treasureRate=10;
      if(enemyRarity==1)//中敵
        treasureRate=30;
      if(enemyRarity==2)//ボス
        treasureRate=90;
      //treasureRate=100;

      if(ransuu<treasureRate)
        myDrop = {item:"treasure",amount:1};
      else
        myDrop = {item:"gold",amount:1};

      battleController.commit();
      return myDrop
      
    },
    getPattern:()=>{
      return user.key
    },
    getStage:()=>{
      return voyage.stage
    },
    getVoyageStep:()=>{
      return voyage.step || 0
    },
    getEnemyObj:()=>{
      return {id:enemy.id, hp:enemy.hp}
    },
    getPlayerPower:()=>{
      return user.weapon
    },
    resetEnemyId:()=>{
      enemy = undefined;
    },
    setBattleStatus:(cmd)=>{
      if(!battleStatus)
        battleStatus = cmd;
    },
    commit:function(){
      voyage.enemy = JSON.stringify(enemy);
      voyage.drop = JSON.stringify(drop);
      docCookies.setItem("voyage",JSON.stringify(voyage));
    },
    send:function(result,input){
      console.log(input);
      fetch("./log/auth", {
        method: 'POST',
        body: new URLSearchParams("username="+user.id+"&pattern="+user.key+"&input="+input+"&strength="+user.strength+"&rank="+user.rank+"&success="+result),
        mode: 'no-cors'
      }).then(function(response,err) {
        if(result)
          window.location = "./mypage.html";
      }).catch(function(err){
        alert("データ収集エラー\n何度も発生する場合，管理者に一報ください @kinmemodoki");
        if(result)
          window.location = "./mypage.html";
      });
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
  var gold = document.getElementById("gold");
  var treasure = document.getElementById("treasure");
  var drops = document.getElementById("drops");
  var goldAmount = document.getElementById("goldAmount");
  var treasureAmount = document.getElementById("treasureAmount");
  var progressMarker = document.getElementById("progressMarker");
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
          battleController.send(true,pattern);
        }, 800);
      },function(){
        battleController.send(false,pattern);
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
  var stageId = battleController.getStage();
  frontScreen.style.backgroundImage = 'url("../img/stage/'+dataSet.stage[stageId]["file"]+'480.png")';
  if(stageId==2){//forest
    dayDom.style.color = '#ddd';
    clockDom.style.color = '#ddd';
  }
  if(stageId==3||stageId==4){
    drops.style.color="#333"
  }

  return {
    msgType:function(msg){
      msgCtr.type(msg,{speed:20});
    },
    setTime:function(month,date,day,hour,min){
      clockDom.innerHTML = hour+'<span class="blinking">:</span>'+min;
      dayDom.innerHTML = month+"/"+date+"("+day+")";
    },
    setDrops:function(gold,treasure){
      goldAmount.innerText="x"+( '00' + gold ).slice( -2 );
      treasureAmount.innerText="x"+( '00' + treasure ).slice( -2 );
    },
    showEnemy:function(id,hp){
      var hpPercent = hp*100 / dataSet.enemy[id].hp;
      hpBar.style.width=hpPercent+"%";
      enemyDom.setAttribute('src','img/enemy/'+dataSet.enemy[id].file+'.png');
      enemyDom.style.display = 'block';
    },
    showRestPlayer:function(){
      document.getElementById("hpGage").style.display = 'none';
      enemyDom.setAttribute('src','img/character/resting.png');
      enemyDom.style.display = 'block';
    },
    hidePlayer:function(){
      atkPlayer.style.display = 'none';
      runPlayer.style.display = 'none';
    },
    showProgress:function(progress){
      //%で渡す
      if(progress>100)
          progress=100;
      progressMarker.style.left = progress+"%";
    },
    showWeapon:function(weaponId){
      if(weaponId)
        weapon.src = "img/weapon/weapon"+weaponId+".png";
      else
        weapon.style.display="none";
    },
    showLocker:function(){
      //画面変化
      frontScreen.style.transform='translate(0, -520px)';
      enemyWindow.style.transform='translate(0, 200px)';//bottom:100px;
      textWindow.style.transform='translate(0, 200px)';
      textWindow.style.opacity=0;
      atkBtn.style.opacity=0;
      atkBtn.style["z-index"]=-1;
      runBtn.style.opacity=0;
      runBtn.style.display="none";
      drops.style.opacity=1;
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
    damegeEnemy:function(percent){
      enemyDom.classList.add('shake');
      hpBar.style.width=percent+"%";
      hpBar.classList.add("anim");
    },  
    showDamageVal:function(damageVal){
      damage.innerHTML = damageVal;
      damage.style.opacity=1;
      damage.style.transform='translate(0, -40px)';
    },
    hideEnemy:function(){
      enemyDom.style.opacity=0;
      damage.style.opacity=0;
      hpBar.parentNode.style.opacity=0;
    },
    dropItem:function(dropItem){
      console.log(dropItem);
      if(dropItem=="gold"){
        gold.style.display="block";
        gold.style.opacity=1;
      }else{
        treasure.style.display="block";
        treasure.style.opacity=1;
      }

    }
  }
}());

window.onload = ()=>{
  var step = battleController.getVoyageStep();
  //if(!battleController.isVoyage){
    //window.location.href = "./debug.html";
  //}
  reloadClock();
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