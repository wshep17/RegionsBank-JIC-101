import firebase from "firebase";

//Firebase Configuration Object
const firebaseConfig = {
	apiKey: "AIzaSyAY6Dve-nWezKcTR9J-30cbAs5mE-MF5v4",
	authDomain: "loan-calculator-chat.firebaseapp.com",
	databaseURL: "https://loan-calculator-chat.firebaseio.com",
	projectId: "loan-calculator-chat",
	storageBucket: "loan-calculator-chat.appspot.com",
	messagingSenderId: "955704721136",
	appId: "1:955704721136:web:611a5443d63319ff560c35"
}

//Initializing Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;