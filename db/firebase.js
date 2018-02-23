var firebase = require(firebase);
var config = {
    apiKey: "AIzaSyBeZyYpoe0d9CDaHALOu-aLsACKk2xVApk",
    authDomain: "club-central.firebaseapp.com",
    databaseURL: "https://club-central.firebaseio.com",
    storageBucket: "club-central.appspot.com",
  };
firebase.initializeApp(config);
var database = firebase.database();