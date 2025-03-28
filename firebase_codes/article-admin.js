// Import the functions you need from the SDKs
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
    getDoc // Add getDoc here
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Global variables
let currentUser = null;
let currentArticleId = null;
let sectionCounter = 0;

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        userEmail.textContent = user.email;
        loadArticles();
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }
});

// Logout functionality
logoutButton.addEventListener('click', () => {
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

// Tab functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and content
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        tab.classList.add('active');
        document.getElementById(`${tabId}Tab`).classList.add('active');
    });
});

// Load articles from Firestore
async function loadArticles() {
    try {
        const articlesQuery = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(articlesQuery);
        
        // Clear existing articles
        articleList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const article = doc.data();
            const articleElement = createArticleElement(doc.id, article);
            articleList.appendChild(articleElement);
        });
        
        // If no articles, show message
        if (querySnapshot.empty) {
            articleList.innerHTML = '<p>Ingen artikler funnet. Klikk på "Ny Artikkel" for å opprette en.</p>';
        }
    } catch (error) {
        console.error("Error loading articles: ", error);
        articleList.innerHTML = '<p>Feil ved lasting av artikler. Prøv igjen senere.</p>';
    }
}

function createArticleElement(id, article) {
    const div = document.createElement('div');
    div.className = 'article-card';

    const date = article.createdAt ? new Date(article.createdAt.toDate()) : new Date();
    const formattedDate = `${date.getDate()}. ${getMonthName(date.getMonth())} ${date.getFullYear()}`;

    div.innerHTML = `
        <div>
            <div class="article-title">${article.title}</div>
            <div class="article-date">Publisert: ${formattedDate}</div>
        </div>
        <div class="article-actions">
            <button class="button-primary button-small edit-article" data-id="${id}">Rediger</button>
            <button class="button-primary button-small view-article" data-id="${id}">Se Artikkel</button>
            <button class="button-primary button-danger button-small delete-article" data-id="${id}">Slett</button>
        </div>
    `;

    // Add event listeners
    div.querySelector('.edit-article').addEventListener('click', () => editArticle(id));
    div.querySelector('.view-article').addEventListener('click', () => viewArticle(id, article));
    div.querySelector('.delete-article').addEventListener('click', () => deleteArticle(id, article.title));

    return div;
}


// Function to view the article
function viewArticle(id, article) {
    // Encode the article title for URL
    const encodedTitle = encodeURIComponent(article.title);

    // Redirect to the article template with the title as a URL parameter
    window.location.href = `article-template.html?title=${encodedTitle}`;
}

// Get Norwegian month name
function getMonthName(monthIndex) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[monthIndex];
}

// New article button click
newArticleButton.addEventListener('click', () => {
    // Reset form
    modalTitle.textContent = 'Ny Artikkel';
    articleTitle.value = '';
    articleIntro.value = '';
    contentSections.innerHTML = '';
    sectionCounter = 0;
    currentArticleId = null;
    
    // Show modal
    articleModal.style.display = 'block';
});

// Add subtitle section
addSubtitleButton.addEventListener('click', () => {
    const sectionId = `section-${sectionCounter++}`;
    const div = document.createElement('div');
    div.id = sectionId;
    div.style.marginBottom = '15px';
    div.style.border = '1px solid #eee';
    div.style.padding = '10px';
    div.style.borderRadius = '4px';
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label>Subtittel:</label>
            <button class="remove-section" data-id="${sectionId}" style="background: none; border: none; color: red; cursor: pointer;">Fjern</button>
        </div>
        <input type="text" class="subtitle-input" style="width: 100%; padding: 8px; margin-top: 5px;">
        <input type="hidden" class="section-type" value="subtitle">
    `;
    contentSections.appendChild(div);
    
    // Add event listener for remove button
    div.querySelector('.remove-section').addEventListener('click', (e) => {
        const sectionId = e.target.getAttribute('data-id');
        document.getElementById(sectionId).remove();
    });
});

// Add paragraph section
addParagraphButton.addEventListener('click', () => {
    const sectionId = `section-${sectionCounter++}`;
    const div = document.createElement('div');
    div.id = sectionId;
    div.style.marginBottom = '15px';
    div.style.border = '1px solid #eee';
    div.style.padding = '10px';
    div.style.borderRadius = '4px';
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label>Paragraf:</label>
            <button class="remove-section" data-id="${sectionId}" style="background: none; border: none; color: red; cursor: pointer;">Fjern</button>
        </div>
        <textarea class="paragraph-input" rows="4" style="width: 100%; padding: 8px; margin-top: 5px;"></textarea>
        <input type="hidden" class="section-type" value="paragraph">
    `;
    contentSections.appendChild(div);
    
    // Add event listener for remove button
    div.querySelector('.remove-section').addEventListener('click', (e) => {
        const sectionId = e.target.getAttribute('data-id');
        document.getElementById(sectionId).remove();
    });
});

// Preview button click
previewButton.addEventListener('click', () => {
    const title = articleTitle.value.trim();
    const intro = articleIntro.value.trim();
    
    if (!title) {
        alert('Vennligst legg til en tittel.');
        return;
    }
    
    // Generate preview HTML
    let previewHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <h1 style="margin-bottom: 20px;">${title}</h1>
            <p style="font-size: 18px; margin-bottom: 30px;">${intro}</p>
    `;
    
    // Add sections
    const sections = contentSections.querySelectorAll('div[id^="section-"]');
    sections.forEach(section => {
        const type = section.querySelector('.section-type').value;
        
        if (type === 'subtitle') {
            const subtitle = section.querySelector('.subtitle-input').value;
            if (subtitle.trim()) {
                previewHTML += `<h2 style="margin: 25px 0 15px;">${subtitle}</h2>`;
            }
        } else if (type === 'paragraph') {
            const paragraph = section.querySelector('.paragraph-input').value;
            if (paragraph.trim()) {
                previewHTML += `<p style="margin-bottom: 15px;">${paragraph}</p>`;
            }
        }
    });
    
    previewHTML += '</div>';
    
    // Show preview
    previewContent.innerHTML = previewHTML;
    articleModal.style.display = 'none';
    previewModal.style.display = 'block';
});

// Back to edit button click
backToEditButton.addEventListener('click', () => {
    previewModal.style.display = 'none';
    articleModal.style.display = 'block';
});

// Cancel button click
cancelButton.addEventListener('click', () => {
    if (confirm('Er du sikker på at du vil avbryte? Alle endringer vil gå tapt.')) {
        articleModal.style.display = 'none';
    }
});

// Save article button click
saveArticleButton.addEventListener('click', async () => {
    const title = articleTitle.value.trim();
    const intro = articleIntro.value.trim();
    
    if (!title) {
        alert('Vennligst legg til en tittel.');
        return;
    }
    
    // Collect sections
    const sections = [];
    const sectionElements = contentSections.querySelectorAll('div[id^="section-"]');
    
    sectionElements.forEach(section => {
        const type = section.querySelector('.section-type').value;
        
        if (type === 'subtitle') {
            const subtitle = section.querySelector('.subtitle-input').value.trim();
            if (subtitle) {
                sections.push({ type: 'subtitle', content: subtitle });
            }
        } else if (type === 'paragraph') {
            const paragraph = section.querySelector('.paragraph-input').value.trim();
            if (paragraph) {
                sections.push({ type: 'paragraph', content: paragraph });
            }
        }
    });
    
    // Create article object
    const article = {
        title,
        intro,
        sections,
        author: currentUser.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    };
    
    try {
        if (currentArticleId) {
            // Update existing article
            await updateDoc(doc(db, "articles", currentArticleId), article);
            alert('Artikkel oppdatert!');
        } else {
            // Add new article
            await addDoc(collection(db, "articles"), article);
            alert('Artikkel opprettet!');
        }
        
        // Close modal and reload articles
        articleModal.style.display = 'none';
        loadArticles();
    } catch (error) {
        console.error("Error saving article: ", error);
        alert('Feil ved lagring av artikkel. Prøv igjen senere.');
    }
});

// Publish button click
publishButton.addEventListener('click', async () => {
    const title = articleTitle.value.trim();
    const intro = articleIntro.value.trim();
    
    if (!title) {
        alert('Vennligst legg til en tittel.');
        return;
    }
    
    // Collect sections
    const sections = [];
    const sectionElements = contentSections.querySelectorAll('div[id^="section-"]');
    
    sectionElements.forEach(section => {
        const type = section.querySelector('.section-type').value;
        
        if (type === 'subtitle') {
            const subtitle = section.querySelector('.subtitle-input').value.trim();
            if (subtitle) {
                sections.push({ type: 'subtitle', content: subtitle });
            }
        } else if (type === 'paragraph') {
            const paragraph = section.querySelector('.paragraph-input').value.trim();
            if (paragraph) {
                sections.push({ type: 'paragraph', content: paragraph });
            }
        }
    });
    
    // Create article object
    const article = {
        title,
        intro,
        sections,
        author: currentUser.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        published: true
    };
    
    try {
        if (currentArticleId) {
            // Update existing article
            await updateDoc(doc(db, "articles", currentArticleId), article);
            alert('Artikkel publisert!');
        } else {
            // Add new article
            await addDoc(collection(db, "articles"), article);
            alert('Artikkel publisert!');
        }
        
        // Close modals and reload articles
        previewModal.style.display = 'none';
        loadArticles();
    } catch (error) {
        console.error("Error publishing article: ", error);
        alert('Feil ved publisering av artikkel. Prøv igjen senere.');
    }
});

// Edit article
async function editArticle(id) {
    try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef); // Use getDoc to fetch a single document

        if (docSnap.exists()) {
            const article = docSnap.data();

            // Fill form
            modalTitle.textContent = 'Rediger Artikkel';
            articleTitle.value = article.title || '';
            articleIntro.value = article.intro || '';
            contentSections.innerHTML = '';
            sectionCounter = 0;
            currentArticleId = id;

            // Add sections
            if (article.sections && article.sections.length > 0) {
                article.sections.forEach(section => {
                    if (section.type === 'subtitle') {
                        addSubtitleSection(section.content);
                    } else if (section.type === 'paragraph') {
                        addParagraphSection(section.content);
                    }
                });
            }

            // Show modal
            articleModal.style.display = 'block';
        } else {
            console.error("No such article!");
            alert('Artikkelen ble ikke funnet.');
        }
    } catch (error) {
        console.error("Error editing article: ", error);
        alert('Feil ved redigering av artikkel. Prøv igjen senere.');
    }
}

// Add subtitle section with content
function addSubtitleSection(content) {
    const sectionId = `section-${sectionCounter++}`;
    const div = document.createElement('div');
    div.id = sectionId;
    div.style.marginBottom = '15px';
    div.style.border = '1px solid #eee';
    div.style.padding = '10px';
    div.style.borderRadius = '4px';
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label>Subtittel:</label>
            <button class="remove-section" data-id="${sectionId}" style="background: none; border: none; color: red; cursor: pointer;">Fjern</button>
        </div>
        <input type="text" class="subtitle-input" value="${content}" style="width: 100%; padding: 8px; margin-top: 5px;">
        <input type="hidden" class="section-type" value="subtitle">
    `;
    contentSections.appendChild(div);
    
    // Add event listener for remove button
    div.querySelector('.remove-section').addEventListener('click', (e) => {
        const sectionId = e.target.getAttribute('data-id');
        document.getElementById(sectionId).remove();
    });
}

// Add paragraph section with content
function addParagraphSection(content) {
    const sectionId = `section-${sectionCounter++}`;
    const div = document.createElement('div');
    div.id = sectionId;
    div.style.marginBottom = '15px';
    div.style.border = '1px solid #eee';
    div.style.padding = '10px';
    div.style.borderRadius = '4px';
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <label>Paragraf:</label>
            <button class="remove-section" data-id="${sectionId}" style="background: none; border: none; color: red; cursor: pointer;">Fjern</button>
        </div>
        <textarea class="paragraph-input" rows="4" style="width: 100%; padding: 8px; margin-top: 5px;">${content}</textarea>
        <input type="hidden" class="section-type" value="paragraph">
    `;
    contentSections.appendChild(div);
    
    // Add event listener for remove button
    div.querySelector('.remove-section').addEventListener('click', (e) => {
        const sectionId = e.target.getAttribute('data-id');
        document.getElementById(sectionId).remove();
    });
}

// Delete article
async function deleteArticle(id, title) {
    if (confirm(`Er du sikker på at du vil slette artikkelen "${title}"?`)) {
        try {
            await deleteDoc(doc(db, "articles", id));
            alert('Artikkel slettet!');
            loadArticles();
        } catch (error) {
            console.error("Error deleting article: ", error);
            alert('Feil ved sletting av artikkel. Prøv igjen senere.');
        }
    }
}

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

loadImages();
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