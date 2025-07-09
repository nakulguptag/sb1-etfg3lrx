import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

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

// ✅ Export Collection Reference
export const notificationRulesCollection = collection(db, 'notificationRules');
