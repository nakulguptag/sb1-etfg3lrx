importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAx54PIOn3iN0E8_rKLHU_VLfCuh5gksqA',
  authDomain: 'novotel-grm.firebaseapp.com',
  projectId: 'novotel-grm',
  storageBucket: 'novotel-grm.appspot.com',
  messagingSenderId: '33890942487',
  appId: '1:33890942487:web:8445df99ad43453b766652'
});

const messaging = firebase.messaging();