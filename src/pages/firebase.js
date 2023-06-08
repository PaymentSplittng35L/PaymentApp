import { initializeApp } from "firebase/app";

import 'firebase/auth';

import {
    GoogleAuthProvider,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    signInWithPopup,
} from "firebase/auth";

import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";
// const firebaseConfig = {
//   apiKey: "AIzaSyBg0Tbdrf9a73P1_66An2GY_ZZZmhTQ0OI",
//   authDomain: "myproject2-64909.firebaseapp.com",
//   projectId: "myproject2-64909",
//   storageBucket: "myproject2-64909.appspot.com",
//   messagingSenderId: "1036775344211",
//   appId: "1:1036775344211:web:7dbcf9191ea5fc760d1ea6",
//   measurementId: "G-0ZPMBEJ23B"
// };

const firebaseConfig = {
    apiKey: "AIzaSyC_xdgN2q3UQm70g_tRi2ILynikrkCuhZg",
    authDomain: "test-966dc.firebaseapp.com",
    projectId: "test-966dc",
    storageBucket: "test-966dc.appspot.com",
    messagingSenderId: "155507898533",
    appId: "1:155507898533:web:0d9a9e43bcf8677c32f54c",
    measurementId: "G-PMSV26DM4S"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordResetEmail,
    logout,
    signInWithEmailAndPassword,
  };