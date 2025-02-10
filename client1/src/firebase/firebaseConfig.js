const firebaseConfig = {
    apiKey: "AIzaSyBhxlFddjCC8DFPWFiTgV6j-qu-yFATQ5w",
    authDomain: "getskybuy-7eb61.firebaseapp.com",
    projectId: "getskybuy-7eb61",
    storageBucket: "getskybuy-7eb61.appspot.com",
    messagingSenderId: "774192995710",
    appId: "1:774192995710:web:996cd9a69e35c1801e272f",
    measurementId: "G-KRSD3QS4BS"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
export { auth };
