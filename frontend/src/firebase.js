import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  get,
  child,
} from "firebase/database";

// Your Firebase config from Step 4
const firebaseConfig = {
  apiKey: "AIzaSyD5IShpVHM9Dy4C4Cg15j-5ik1e6Cvy0I4",
  authDomain: "iotbda-11609.firebaseapp.com",
  databaseURL: "https://iotbda-11609-default-rtdb.firebaseio.com",
  projectId: "iotbda-11609",
  storageBucket: "iotbda-11609.firebasestorage.app",
  messagingSenderId: "806540556560",
  appId: "1:806540556560:web:07f223b9e755fa8552cd95",
  measurementId: "G-ZF194M0RW3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, push, onValue, get, child };
