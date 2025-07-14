// ✅ src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAx54PIOn3iN0E8_rKLHU_VLfCuh5gksqA",
  authDomain: "novotel-grm.firebaseapp.com",
  projectId: "novotel-grm",
  storageBucket: "novotel-grm.appspot.com",
  messagingSenderId: "33890942487",
  appId: "1:33890942487:web:8445df99ad43453b766652"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore Instance
export const db = getFirestore(app);

// ✅ Notification Rules Collection
export const notificationRulesCollection = collection(db, 'notificationRules');

// ✅ Firebase Messaging Instance
export const messaging = getMessaging(app);
export { onMessage, getToken };
