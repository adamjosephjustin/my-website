// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
// 1. Go to https://console.firebase.google.com/
// 2. Click "Add project" (Name it "AdamsPictionary")
// 3. Disable Google Analytics (simpler setup)
// 4. Click the Web icon (</>) to create an app
// 5. Copy the "firebaseConfig" object values below:

const firebaseConfig = {
    apiKey: "AIzaSyB86lfWxpcCOLXTFSbVdUPd8870c67m1Oo",
    authDomain: "adams-pictionary.firebaseapp.com",
    databaseURL: "https://adams-pictionary-default-rtdb.firebaseio.com",
    projectId: "adams-pictionary",
    storageBucket: "adams-pictionary.firebasestorage.app",
    messagingSenderId: "452825963356",
    appId: "1:452825963356:web:da690ff4440f7f09a07f99",
    measurementId: "G-8YFMBPX0ED"
};
// Initialize Firebase (We will load the SDK in index.html)
// This makes the 'db' variable available to game.js
let db;
let database;

function initFirebase() {
    try {
        if (!firebase) {
            console.error("Firebase SDK not loaded!");
            return;
        }
        const app = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log("🔥 Firebase Connected!");
    } catch (e) {
        console.error("Firebase Auth Error: Please update firebase-config.js with your keys!", e);
        alert("Game Setup Required: Please ask a parent to add the Firebase Keys to settings.");
    }
}
