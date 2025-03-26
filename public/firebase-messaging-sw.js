importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBlEjLdyn8J2voGIupUznHaaZXW1YH930w",
    authDomain: "fir-b6deb.firebaseapp.com",
    projectId: "fir-b6deb",
    storageBucket: "fir-b6deb.firebasestorage.app",
    messagingSenderId: "619509853727",
    appId: "1:619509853727:web:4c5495797c896be6506f2a",
    measurementId: "G-PQ055ZRNVX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});