const baseURL = "http://localhost:3000";
import firebase from 'firebase';


const config = {
    apiKey: "AIzaSyAU1zrxV7g0avkYuncs0oGJNMf1xUBTKyY",
    authDomain: "apiserver-e2370.firebaseapp.com",
    databaseURL: "https://apiserver-e2370.firebaseio.com",
    projectId: "apiserver-e2370",
    storageBucket: "apiserver-e2370.appspot.com",
    messagingSenderId: "1056772489992",
    appId: "1:1056772489992:web:269885026a45a8ac4f62bd",
    measurementId: "G-Z6K022L7BT"
  };
export const app = firebase.initializeApp(config);
export const provider = {
    baseURL: baseURL,
    prefix: "/api/v1",
    isSuper: (roles) => roles.includes('super'),
    isAdmin: (roles) => roles.includes('admin'),
    isGM: (roles) => roles.includes('gm'),
    isCashier: (roles) => roles.includes('cashier'),
    isDecore: (roles) => roles.includes('decore'),
    isPublic: (roles) => roles.length >= 0 // we dont care whether role you are
};