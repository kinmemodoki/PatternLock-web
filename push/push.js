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
      sendToken(currentToken);
    } else {
        //firebaseの不具合でIDとれなかったとき
        console.log('No Instance ID token available. Request permission to generate one.');
      }
    })
  .catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
  });
}

messaging.getToken()
.then(function(currentToken) {
  alert(currentToken);
});

function requestPermission() {
  console.log('Requesting permission...');
  messaging.requestPermission()
  .then(function() {
    console.log('Notification permission granted.');
    fetchToken();
  })
  .catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });
  // [END request_permission]
}

function sendToken(currentToken) {
  // Show token in console and UI.
  var tokenElement = document.querySelector('#txt');
  tokenElement.textContent = currentToken;
}

messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
});