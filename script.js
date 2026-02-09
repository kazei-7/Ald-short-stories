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
let stories = JSON.parse(localStorage.getItem('mtg_stories')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderStories();
});

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
function handleSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('storyTitle').value;
    const content = document.getElementById('storyContent').value;
    const imageFile = document.getElementById('storyImage').files[0];
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
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
                })
            };
            
            stories.unshift(story);
            localStorage.setItem('mtg_stories', JSON.stringify(stories));
            renderStories();
            closeAddModal();
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
            })
        };
        
        stories.unshift(story);
        localStorage.setItem('mtg_stories', JSON.stringify(stories));
        renderStories();
        closeAddModal();
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
        <article class="mtg-card cursor-pointer" onclick="viewStory(${story.id})">
            <button onclick="deleteStory(event, ${story.id})" class="delete-card-btn" title="Détruire">
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
function viewStory(id) {
    const story = stories.find(s => s.id === id);
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
function deleteStory(event, id) {
    event.stopPropagation();
    
    if (confirm('Voulez-vous vraiment détruire cette légende du grimoire ?')) {
        stories = stories.filter(s => s.id !== id);
        localStorage.setItem('mtg_stories', JSON.stringify(stories));
        renderStories();
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