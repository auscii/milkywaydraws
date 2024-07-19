const c = {
    apiKey: "AIzaSyDvHsf_n8ThcDy8idFNtdwJUPXXS-RrHik",
    authDomain: "milkywaydraws2k24.firebaseapp.com",
    projectId: "milkywaydraws2k24",
    storageBucket: "milkywaydraws2k24.appspot.com",
    messagingSenderId: "21046080993",
    appId: "1:21046080993:web:c1afc402213b4654234ea0"
};
firebase.initializeApp(c);
const db = firebase.firestore(), currentUser = firebase.auth().currentUser;
var usersCollection = db.collection('users'), storageReference = firebase.storage().ref();