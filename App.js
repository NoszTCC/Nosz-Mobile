import {NavigationContainer} from "@react-navigation/native";

import Routes from "./screens/Routes.js";

import React, {useState, useEffect} from 'react';
import {initializeApp} from '@firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from '@firebase/auth';
import { firebase } from "@react-native-firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7dEbqAOFTgaHAgNyGWKm6N0DtIOhlCok",
  authDomain: "bdnosz.firebaseapp.com",
  projectId: "bdnosz",
  storageBucket: "bdnosz.appspot.com",
  messagingSenderId: "304409954868",
  appId: "1:304409954868:web:833478c74d88ee55681861",
  measurementId: "G-QC6QBJJ54F"
};

const app = initializeApp(firebaseConfig);

export default function App(){
  return(
    <NavigationContainer>
      <Routes/>
    </NavigationContainer>
  );
}