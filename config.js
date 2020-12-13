import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyB1gKA2wTT_-LNb8Q08nRADlHVHRdRDLBg",
    authDomain: "wily-6fa85.firebaseapp.com",
    projectId: "wily-6fa85",
    storageBucket: "wily-6fa85.appspot.com",
    messagingSenderId: "542525866697",
    appId: "1:542525866697:web:7002d93b60faf0a49a0318"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore()