// API endpoints
const API_URL = 'http://localhost:8000';

// DOM Elements
const characterForm = document.getElementById('characterForm');
const characterList = document.getElementById('characterList');

// Helper function to create character card HTML
function createCharacterCard(character) {
    return `
        <div class="character-card bg-gray-50 p-4 rounded-lg shadow-sm" data-id="${character.id}">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-semibold">${character.name}</h3>
                    ${character.title ? `<p class="text-gray-600">${character.title}</p>` : ''}
                </div>
                <div class="space-x-2">
                    <button onclick="editCharacter(${character.id})" 
                        class="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onclick="deleteCharacter(${character.id}, '${character.name}')" 
                        class="text-red-600 hover:text-red-800">Delete</button>
                </div>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
                <p><span class="font-medium">Race:</span> ${character.race || 'Unknown'}</p>
                <p><span class="font-medium">Status:</span> ${character.status}</p>
                <p><span class="font-medium">Occupation:</span> ${character.occupation || 'Unknown'}</p>
            </div>
            ${character.description ? `
                <p class="mt-2 text-gray-700"><span class="font-medium">Description:</span> ${character.description}</p>
            ` : ''}
            ${character.notable_traits ? `
                <p class="mt-2 text-gray-700"><span class="font-medium">Notable Traits:</span> ${character.notable_traits}</p>
            ` : ''}
        </div>
    `;
}

// Fetch and display all characters
async function loadCharacters() {
    try {
        const response = await fetch(`${API_URL}/characters/`);
        const characters = await response.json();
        characterList.innerHTML = characters.map(createCharacterCard).join('');
    } catch (error) {
        console.error('Error loading characters:', error);
        alert('Failed to load characters');
    }
}

// Handle form submission
characterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(characterForm);
    const characterData = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(`${API_URL}/characters/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characterData)
        });
        
        if (!response.ok) throw new Error('Failed to create character');
        
        characterForm.reset();
        loadCharacters();  // Reload the character list
    } catch (error) {
        console.error('Error creating character:', error);
        alert('Failed to create character');
    }
});

// Delete character
async function deleteCharacter(id) {
    if (!confirm('Are you sure you want to delete this character?')) return;
    
    try {
        const response = await fetch(`${API_URL}/characters/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete character');
        
        loadCharacters();  // Reload the character list
    } catch (error) {
        console.error('Error deleting character:', error);
        alert('Failed to delete character');
    }
}

// Edit Modal functionality
const modal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Delete Modal Functionality
const deleteModal = document.getElementById('deleteModal');
let characterToDelete = null;

function openDeleteModal(id, name) {
    characterToDelete = id;
    document.getElementById('deleteCharacterName').textContent = name;
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('flex');
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
    characterToDelete = null;
}

// Close delete modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

// Update the delete button click handler in createCharacterCard function
function deleteCharacter(id, name) {
    openDeleteModal(id, name);
}

// Handle the actual deletion
async function confirmDelete() {
    if (!characterToDelete) return;
    
    try {
        const response = await fetch(`${API_URL}/characters/${characterToDelete}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete character');
        
        // Find the card and add a fade-out animation
        const card = document.querySelector(`[data-id="${characterToDelete}"]`);
        card.classList.add('opacity-0', 'transform', 'scale-95', 'transition-all');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            closeDeleteModal();
            loadCharacters();  // Reload the character list
        }, 300);
        
    } catch (error) {
        console.error('Error deleting character:', error);
        alert('Failed to delete character');
        closeDeleteModal();
    }
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Edit character
async function editCharacter(id) {
    try {
        const response = await fetch(`${API_URL}/characters/${id}`);
        const character = await response.json();
        
        // Populate form with character data
        const form = document.getElementById('editForm');
        form.elements.id.value = character.id;
        form.elements.name.value = character.name;
        form.elements.title.value = character.title || '';
        form.elements.race.value = character.race || '';
        form.elements.occupation.value = character.occupation || '';
        form.elements.status.value = character.status;
        form.elements.description.value = character.description || '';
        form.elements.notable_traits.value = character.notable_traits || '';
        
        openModal();
    } catch (error) {
        console.error('Error fetching character:', error);
        alert('Failed to load character data');
    }
}

// Handle edit form submission
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const characterData = Object.fromEntries(formData.entries());
    const id = characterData.id;
    delete characterData.id;  // Remove id from the data to be sent
    
    try {
        const response = await fetch(`${API_URL}/characters/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characterData)
        });
        
        if (!response.ok) throw new Error('Failed to update character');
        
        closeModal();
        loadCharacters();  // Reload the character list
    } catch (error) {
        console.error('Error updating character:', error);
        alert('Failed to update character');
    }
});

// Load characters when the page loads
document.addEventListener('DOMContentLoaded', loadCharacters);