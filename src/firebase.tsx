// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, remove } from "firebase/database";
import { ref, set, get, child } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyDsIdtPDk9QPNm_5IHg_NdJ17wJ0LJeWGA",
  authDomain: "food-delivery-60799.firebaseapp.com",
  databaseURL: "https://food-delivery-60799-default-rtdb.firebaseio.com",
  projectId: "food-delivery-60799",
  storageBucket: "food-delivery-60799.firebasestorage.app",
  messagingSenderId: "556368156826",
  appId: "1:556368156826:web:a00c8c8d68408900312723",
  measurementId: "G-2QMJJBBJ64"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export const setDataFG = async (path:string, value:any) => {
  try {
    await set(ref(db, path), value);
  } catch (error) {
    console.error(`Error setting data at ${path}:`, error);
    throw error;
  }
};
export const getDataFG = async (path:string,data:string) => {
  console.log("getting"+path)
  try {
    const snapshot = await get(child(ref(db), path));
    if (snapshot.exists()) {
        return data == ""  ?  snapshot.val() : snapshot;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting data from ${path}:`, error);
    throw error;
  }
};
export const removeDataFG = async (path:string) => {
  try {
    await remove(ref(db, path));
    console.log("Data removed successfully")
    return true;
  } catch (error) {
    console.error(`Error removing data at ${path}:`, error);
    throw error;
  }
}

export default app;
