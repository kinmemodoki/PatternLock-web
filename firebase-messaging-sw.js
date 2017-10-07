importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "103953800507"
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: '実験ページ',
    icon: '/favicon.ico'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});