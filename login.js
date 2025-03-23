// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA46HBePnhgJKKBG0WfpGnYk5bInRQXNG4",
  authDomain: "sandmontessadmin.firebaseapp.com",
  projectId: "sandmontessadmin",
  storageBucket: "sandmontessadmin.appspot.com",
  messagingSenderId: "967852826423",
  appId: "1:967852826423:web:1ebfd677a89411b76984b2",
  measurementId: "G-E0VE27XL96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// DOM elements
const loginButton = document.getElementById('loginButton');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to admin page
        window.location.href = 'admin.html';
    }
});

// Login functionality
loginButton.addEventListener('click', function() {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        errorMessage.textContent = 'Please enter both email and password';
        return;
    }
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login successful, redirect will happen via onAuthStateChanged
        })
        .catch((error) => {
            // Handle errors
            errorMessage.textContent = error.message;
            console.error('Login error:', error.code, error.message);
        });
});