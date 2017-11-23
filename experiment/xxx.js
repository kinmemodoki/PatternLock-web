
// get Cookie data
var context = getUserData();  
var user = context.player ? JSON.parse(context.player) : {};

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDS8ZSgmRIWZ6fEZCIIWiXCG4OjbMlSp1M",
  authDomain: "css-pre-exp.firebaseapp.com",
  projectId: "css-pre-exp",
  messagingSenderId: "842556271550"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
console.log(messaging); 

function fetchToken() {
  messaging.getToken()
  .then(function(currentToken) {
    if (currentToken) {
      console.log(currentToken);
      updateUI(currentToken);
    } else {
      //firebaseのprojectが死んどるぞ
      console.log('No Instance ID token available. Request permission to generate one.');
    }
  })
  .catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
  });
}

/*messaging.getToken()
.then(function(currentToken) {
  alert(currentToken);
});*/

function create_privateid( n ){
  var CODE_TABLE = "0123456789"
      + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      + "abcdefghijklmnopqrstuvwxyz";
  var r = "";
  for (var i = 0, k = CODE_TABLE.length; i < n; i++){
      r += CODE_TABLE.charAt(Math.floor(k * Math.random()));
  }
  r = document.getElementById("text").value + r;
  return r;
}

async function sendData(){
  try{
    //user.id設定
    if(!user.id){
      user.id = create_privateid(24);
    }

    //グループ取得
    var isSpec = document.getElementById("isSec").sec.value;
    var education = document.getElementById("education").edu.value;
    var specialist = isSpec=="specialist" ? 1 : 0;
    if(!isSpec)
      throw new Error("アンケートが選択されてないよ");
    var res = await fetch("/log/user/"+isSpec);
    if(res.status!=200)
      if(window.confirm("サーバ接続失敗．\n実験を記録せずにつづけますか？")){
        throw new Error("実験グループ取得失敗\nすみません！サーバエラーです...");
      }
    }
      
    if(res%2==0){
      var group = "a";
    }else{
      var group = "b";
    }

    //token取得
    var myToken = await messaging.getToken();
    if(!myToken){
      if(window.confirm('PUSH通知が許可されてませんが良いですか？\n(iOSは設定できません＞＜)')){
        myToken = "";
      }else{
        throw new Error("送信が中断されました");
      }
    }

    //送信処理
    document.getElementById("load-container").style.display = "block";
    console.log("username="+user.id+"&edu="+education+"&specialist="+specialist+"&group="+group+"&pid="+myToken);

    await fetch("/log/user/", {
      method: 'POST',
      body: new URLSearchParams("username="+user.id+"&edu="+user.key+"&specialist="+specialist+"&group="+group+"&pid="+myToken)
    }).then((res,err)=>{
      console.log(res.status);
    });

    //ページ遷移
    if(group=="a"){
      user.group = "a";
      docCookies.setItem("player",JSON.stringify(user));
    }else if(group=="b"){
      user.group = "b";
      docCookies.setItem("player",JSON.stringify(user));
    }
    window.location = "redirect.html?status=Desc&term=1"
  } catch(err){
    alert(err);
  }
}