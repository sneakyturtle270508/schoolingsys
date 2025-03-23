// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc, 
    query, 
    orderBy, 
    Timestamp,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);

// DOM elements
const userEmail = document.getElementById('userEmail');
const logoutButton = document.getElementById('logoutButton');
const articleList = document.getElementById('articleList');
const newArticleButton = document.getElementById('newArticleButton');
const articleModal = document.getElementById('articleModal');
const modalTitle = document.getElementById('modalTitle');
const articleTitle = document.getElementById('articleTitle');
const articleIntro = document.getElementById('articleIntro');
const contentSections = document.getElementById('contentSections');
const addSubtitleButton = document.getElementById('addSubtitleButton');
const addParagraphButton = document.getElementById('addParagraphButton');
const previewButton = document.getElementById('previewButton');
const cancelButton = document.getElementById('cancelButton');
const saveArticleButton = document.getElementById('saveArticleButton');
const previewModal = document.getElementById('previewModal');
const previewContent = document.getElementById('previewContent');
const backToEditButton = document.getElementById('backToEditButton');
const publishButton = document.getElementById('publishButton');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const uploadImageButton = document.getElementById('uploadImageButton');
const imageList = document.getElementById('imageList');

// Global variables
let currentUser = null;
let currentArticleId = null;
let sectionCounter = 0;

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userEmail.textContent = user.email;
        loadArticles();
    } else {
        window.location.href = 'login.html';
    }
});

// Logout functionality
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User signed out successfully');
        })
        .catch((error) => {
            console.error('Logout error:', error);
        });
});

// Tab functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${tabId}Tab`).classList.add('active');

        if (tabId === 'images') {
            loadImages();
        }
    });
});

// Load articles from Firestore
async function loadArticles() {
    try {
        const articlesQuery = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(articlesQuery);
        
        articleList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const article = doc.data();
            const articleElement = createArticleElement(doc.id, article);
            articleList.appendChild(articleElement);
        });
        
        if (querySnapshot.empty) {
            articleList.innerHTML = '<p>Ingen artikler funnet. Klikk på "Ny Artikkel" for å opprette en.</p>';
        }
    } catch (error) {
        console.error("Error loading articles: ", error);
        articleList.innerHTML = '<p>Feil ved lasting av artikler. Prøv igjen senere.</p>';
    }
}

// Create article element
function createArticleElement(id, article) {
    const articleCard = document.createElement('article');
    articleCard.className = 'article-card';

    const date = article.createdAt ? new Date(article.createdAt.toDate()) : new Date();
    const formattedDate = `${date.getDate()}. ${getMonthName(date.getMonth())} ${date.getFullYear()}`;

    // Article header section
    const articleHeader = document.createElement('header');
    
    const articleHeading = document.createElement('h3');
    articleHeading.className = 'article-title';
    articleHeading.textContent = article.title;
    
    const publishDate = document.createElement('time');
    publishDate.className = 'article-date';
    publishDate.dateTime = date.toISOString();
    publishDate.textContent = `Publisert: ${formattedDate}`;
    
    articleHeader.appendChild(articleHeading);
    articleHeader.appendChild(publishDate);
    
    // Article actions section
    const actionSection = document.createElement('section');
    actionSection.className = 'article-actions';
    
    const editButton = document.createElement('button');
    editButton.className = 'button-primary button-small edit-article';
    editButton.dataset.id = id;
    editButton.textContent = 'Rediger';
    editButton.addEventListener('click', () => editArticle(id));
    
    const viewButton = document.createElement('button');
    viewButton.className = 'button-primary button-small view-article';
    viewButton.dataset.id = id;
    viewButton.textContent = 'Se Artikkel';
    viewButton.addEventListener('click', () => viewArticle(id, article));
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'button-primary button-danger button-small delete-article';
    deleteButton.dataset.id = id;
    deleteButton.textContent = 'Slett';
    deleteButton.addEventListener('click', () => deleteArticle(id, article.title));
    
    actionSection.appendChild(editButton);
    actionSection.appendChild(viewButton);
    actionSection.appendChild(deleteButton);
    
    // Append all sections to the article card
    articleCard.appendChild(articleHeader);
    articleCard.appendChild(actionSection);
    
    return articleCard;
}

// View article
function viewArticle(id, article) {
    const encodedTitle = encodeURIComponent(article.title);
    window.location.href = `article-template.html?title=${encodedTitle}`;
}

// Get Norwegian month name
function getMonthName(monthIndex) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[monthIndex];
}

// Image upload functionality
uploadImageButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };
    input.click();
});

async function uploadImage(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageUrl = e.target.result;

        try {
            await addDoc(collection(db, "images"), {
                url: imageUrl,
                name: file.name,
                uploadedBy: currentUser.email,
                createdAt: Timestamp.now()
            });
            alert('Bilde lastet opp!');
            loadImages();
        } catch (error) {
            console.error('Feil ved opplasting av bilde:', error);
            alert('Feil ved opplasting av bilde. Prøv igjen senere.');
        }
    };
    reader.readAsDataURL(file);
}

// Load images from Firestore
async function loadImages() {
    try {
        const imagesQuery = query(collection(db, "images"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(imagesQuery);
        
        imageList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const image = doc.data();
            const imageElement = createImageElement(doc.id, image);
            imageList.appendChild(imageElement);
        });
        
        if (querySnapshot.empty) {
            imageList.innerHTML = '<p>Ingen bilder funnet.</p>';
        }
    } catch (error) {
        console.error('Feil ved lasting av bilder:', error);
        imageList.innerHTML = '<p>Feil ved lasting av bilder. Prøv igjen senere.</p>';
    }
}

// Create image element
function createImageElement(id, image) {
    const figure = document.createElement('figure');
    figure.className = 'image-card';
    
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.name;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    const figcaption = document.createElement('figcaption');
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'button-primary button-small delete-image';
    deleteButton.dataset.id = id;
    deleteButton.textContent = 'Slett';
    deleteButton.addEventListener('click', () => deleteImage(id));
    
    figcaption.appendChild(deleteButton);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    
    return figure;
}

// Delete image
async function deleteImage(id) {
    if (confirm('Er du sikker på at du vil slette dette bildet?')) {
        try {
            await deleteDoc(doc(db, "images", id));
            alert('Bilde slettet!');
            loadImages();
        } catch (error) {
            console.error('Feil ved sletting av bilde:', error);
            alert('Feil ved sletting av bilde. Prøv igjen senere.');
        }
    }
}