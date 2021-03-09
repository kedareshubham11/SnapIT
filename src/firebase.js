// const firebaseConfig = {
//   apiKey: "AIzaSyA46ia4pkXhcFDUwAwEqDop049scxGjdhc",
//   authDomain: "insta-clone-kd-react.firebaseapp.com",
//   databaseURL: "https://insta-clone-kd-react.firebaseio.com",
//   projectId: "insta-clone-kd-react",
//   storageBucket: "insta-clone-kd-react.appspot.com",
//   messagingSenderId: "954107326624",
//   appId: "1:954107326624:web:89166cc08cea2186c599c5",
//   measurementId: "G-27CN6ZB0JB",
// };

import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA46ia4pkXhcFDUwAwEqDop049scxGjdhc",
  authDomain: "insta-clone-kd-react.firebaseapp.com",
  databaseURL: "https://insta-clone-kd-react.firebaseio.com",
  projectId: "insta-clone-kd-react",
  storageBucket: "insta-clone-kd-react.appspot.com",
  messagingSenderId: "954107326624",
  appId: "1:954107326624:web:89166cc08cea2186c599c5",
  measurementId: "G-27CN6ZB0JB",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
