import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2XYyuum7fgK8Av7IP9xXXUGvrvRrpZCU",
  authDomain: "spookydash-871ca.firebaseapp.com",
  projectId: "spookydash-871ca",
  storageBucket: "spookydash-871ca.firebasestorage.app",
  messagingSenderId: "895751340900",
  appId: "1:895751340900:web:508dfaa079f29190ee3071"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
