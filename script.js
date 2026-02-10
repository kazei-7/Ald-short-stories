// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDuwXo_a3Xarsl8Ob47JfuTSEflEilXWxw",
    authDomain: "ald-short-stories.firebaseapp.com",
    projectId: "ald-short-stories",
    storageBucket: "ald-short-stories.firebasestorage.app",
    messagingSenderId: "879215917183",
    appId: "1:879215917183:web:4c47a70c8c6df024a6274a",
    measurementId: "G-CDSJYG1DRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create mystical particles
function createParticles() {
    const container = document.getElementById('particles');
    // Fewer particles on mobile for better performance
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

createParticles();

// Storage for stories
let stories = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadStoriesFromFirebase();
});

// Load stories from Firebase
async function loadStoriesFromFirebase() {
    try {
        const storiesQuery = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(storiesQuery);
        
        stories = [];
        querySnapshot.forEach((doc) => {
            stories.push({
                firestoreId: doc.id,
                ...doc.data()
            });
        });
        
        renderStories();
    } catch (error) {
        console.error("Erreur lors du chargement des histoires:", error);
        alert("Erreur lors du chargement des histoires. Veuillez réessayer.");
    }
}

// Preview image
function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
}

// Open add modal
function openAddModal() {
    document.getElementById('addModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close add modal
function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('storyForm').reset();
    document.getElementById('imagePreview').classList.add('hidden');
}

// Close view modal
function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Get random mana symbols
function getRandomMana() {
    const colors = [
        { class: 'mana-red', symbol: '' },
        { class: 'mana-blue', symbol: '' },
        { class: 'mana-green', symbol: '' }
    ];
    
    const count = Math.floor(Math.random() * 3) + 1;
    let mana = '';
    
    for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        mana += `<span class="mana-symbol ${color.class}">${color.symbol}</span>`;
    }
    
    return mana;
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('storyTitle').value;
    const content = document.getElementById('storyContent').value;
    const imageFile = document.getElementById('storyImage').files[0];
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>⏳ Inscription en cours...</span>';
    submitBtn.disabled = true;
    
    try {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const story = {
                    id: Date.now(),
                    title: title,
                    content: content,
                    image: e.target.result,
                    mana: getRandomMana(),
                    date: new Date().toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    }),
                    timestamp: Date.now()
                };
                
                await addDoc(collection(db, 'stories'), story);
                await loadStoriesFromFirebase();
                closeAddModal();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
            reader.readAsDataURL(imageFile);
        } else {
            // Story without image - create mystical placeholder
            const story = {
                id: Date.now(),
                title: title,
                content: content,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%237b4397;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230e68ab;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="28" fill="%23d4af37" text-anchor="middle" dominant-baseline="middle" font-family="Cinzel"%3E✦%3C/text%3E%3C/svg%3E',
                mana: getRandomMana(),
                date: new Date().toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                }),
                timestamp: Date.now()
            };
            
            await addDoc(collection(db, 'stories'), story);
            await loadStoriesFromFirebase();
            closeAddModal();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'histoire:", error);
        alert("Erreur lors de l'ajout de l'histoire. Veuillez réessayer.");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Render stories grid
function renderStories() {
    const grid = document.getElementById('storiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (stories.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    grid.innerHTML = stories.map(story => `
        <article class="mtg-card cursor-pointer" onclick="viewStory('${story.firestoreId}')">
            <button onclick="deleteStory(event, '${story.firestoreId}')" class="delete-card-btn" title="Détruire">
                ✕
            </button>
            <div class="card-image-frame m-2 sm:m-3">
                <img src="${story.image}" alt="${story.title}" class="card-image">
            </div>
            <div class="card-title-bar">
                <div class="flex justify-between items-center gap-2">
                    <h3 class="title-font text-base sm:text-lg font-bold text-gold truncate flex-1">${story.title}</h3>
                    <div class="mana-cost flex-shrink-0">${story.mana}</div>
                </div>
            </div>
            <div class="card-text-box">
                <p class="text-xs text-gold/60 mb-2 italic">${story.date}</p>
                <p class="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">${story.content.substring(0, 150)}...</p>
            </div>
        </article>
    `).join('');
}

// View story in modal
function viewStory(firestoreId) {
    const story = stories.find(s => s.firestoreId === firestoreId);
    if (!story) return;
    
    const viewContent = document.getElementById('viewContent');
    viewContent.innerHTML = `
        <div class="card-image-frame m-3 sm:m-4 md:m-6">
            <img src="${story.image}" alt="${story.title}" class="w-full h-64 sm:h-80 md:h-96 object-cover">
        </div>
        <div class="px-6 pb-6 sm:px-8 sm:pb-8 md:px-10 md:pb-10 lg:px-14 lg:pb-14">
            <div class="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
                <div class="flex-1">
                    <h2 class="title-font text-3xl sm:text-4xl md:text-5xl font-black text-gold mb-2">${story.title}</h2>
                    <p class="text-xs sm:text-sm text-gold/60 italic">${story.date}</p>
                </div>
                <div class="mana-cost scale-125 sm:scale-150 mt-0 sm:mt-2">${story.mana}</div>
            </div>
            <div class="divider"></div>
            <div class="text-base sm:text-lg leading-relaxed text-white/90 whitespace-pre-wrap">
                ${story.content}
            </div>
        </div>
    `;
    
    document.getElementById('viewModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Delete story
async function deleteStory(event, firestoreId) {
    event.stopPropagation();
    
    if (confirm('Voulez-vous vraiment détruire cette légende du grimoire ?')) {
        try {
            await deleteDoc(doc(db, 'stories', firestoreId));
            await loadStoriesFromFirebase();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression. Veuillez réessayer.");
        }
    }
}

// Close modals on escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAddModal();
        closeViewModal();
    }
});

// Close modals on background click
document.getElementById('addModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeAddModal();
    }
});

document.getElementById('viewModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeViewModal();
    }
});

// Make functions global
window.previewImage = previewImage;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.closeViewModal = closeViewModal;
window.handleSubmit = handleSubmit;
window.viewStory = viewStory;
window.deleteStory = deleteStory;
