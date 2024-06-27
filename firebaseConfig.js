import { initializeApp, } from "firebase/app";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getStorage} from "firebase/storage";


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
  export const storage = getStorage(app);

  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  export default firebaseConfig;