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
                    <button onclick="deleteCharacter(${character.id})" 
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

// Edit character (to be implemented)
function editCharacter(id) {
    // We'll implement this next!
    alert('Edit functionality coming soon!');
}

// Load characters when the page loads
document.addEventListener('DOMContentLoaded', loadCharacters);