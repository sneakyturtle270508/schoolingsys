// admin.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA46HBePnhgJKKBG0WfpGnYk5bInRQXNG4",
  authDomain: "sandmontessadmin.firebaseapp.com",
  projectId: "sandmontessadmin",
  storageBucket: "sandmontessadmin.firebasestorage.app",
  messagingSenderId: "967852826423",
  appId: "1:967852826423:web:1ebfd677a89411b76984b2",
  measurementId: "G-E0VE27XL96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// DOM elements
const userEmail = document.getElementById('userEmail');
const userId = document.getElementById('userId');
const logoutButton = document.getElementById('logoutButton');
const goToArticlesButton = document.getElementById('goToArticlesButton'); // New button

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, display user info
        userEmail.textContent = user.email;
        

        // Enable the "Go to Articles" button
        goToArticlesButton.disabled = false;
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }
});

// Logout functionality
logoutButton.addEventListener('click', function() {
    signOut(auth)
        .then(() => {
            // Sign-out successful, redirect will happen via onAuthStateChanged
            console.log('User signed out successfully');
        })
        .catch((error) => {
            // An error happened
            console.error('Logout error:', error);
        });
});

// Go to Articles functionality
goToArticlesButton.addEventListener('click', function() {
    // Redirect to article-admin.html
    window.location.href = 'article-admin.html';
});