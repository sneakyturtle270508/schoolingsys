
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Fetch article data from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const title = decodeURIComponent(urlParams.get('title'));

// Fetch the article from Firestore based on the title
async function fetchArticleByTitle(title) {
    try {
        const articlesQuery = query(collection(db, "articles"), where("title", "==", title));
        const querySnapshot = await getDocs(articlesQuery);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const article = doc.data();

            // Populate the article content
            document.getElementById('articleTitle').textContent = article.title;

            let articleHTML = `<p class="margin-bottom">${article.intro}</p>`; // Display the intro

            if (article.sections && article.sections.length > 0) {
                article.sections.forEach(section => {
                    if (section.type === 'subtitle') {
                        articleHTML += `<h2 class="margin-bottom">${section.content}</h2>`;
                    } else if (section.type === 'paragraph') {
                        articleHTML += `<p class="margin-bottom">${section.content}</p>`;
                    }
                });
            }

            document.getElementById('articleContent').innerHTML = articleHTML;
        } else {
            document.getElementById('articleContent').innerHTML = '<p>Ingen artikkel funnet.</p>';
        }
    } catch (error) {
        console.error("Error fetching article: ", error);
        document.getElementById('articleContent').innerHTML = '<p>Feil ved lasting av artikkel. Prøv igjen senere.</p>';
    }
}

// Fetch and display the article when the page loads
if (title) {
    fetchArticleByTitle(title);
} else {
    document.getElementById('articleContent').innerHTML = '<p>Ingen artikkel tittel angitt.</p>';
}
