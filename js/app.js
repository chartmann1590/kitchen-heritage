(function() {
    'use strict';
    
    let currentRecipeId = null;
    let isRecording = false;
    
    document.addEventListener('DOMContentLoaded', init);
    
    async function init() {
        try {
            await storage.initDB();
            
            const sharedRecipe = ExportModule.parseShareURL();
            const action = new URLSearchParams(window.location.search).get('action');
            if (sharedRecipe) {
                UI.populateForm(sharedRecipe);
                UI.showView('add');
                UI.showToast('Shared recipe loaded! Save it to your collection.', 'success');
            } else {
                await loadRecipes();
                if (action === 'add') {
                    UI.clearForm();
                    UI.showView('add');
                }
            }
            
            setupEventListeners();
            setupServiceWorker();
            setupInstallPrompt();
            
        } catch (error) {
            console.error('Initialization error:', error);
            UI.showToast('Failed to initialize app. Please refresh.', 'error');
        }
    }
    
    async function loadRecipes() {
        try {
            const recipes = await storage.getAllRecipes();
            UI.renderRecipes(recipes);
        } catch (error) {
            console.error('Failed to load recipes:', error);
            UI.showToast('Failed to load recipes', 'error');
        }
    }
    
    function setupEventListeners() {
        document.getElementById('add-recipe-btn').addEventListener('click', () => {
            UI.clearForm();
            UI.showView('add');
        });
        
        document.getElementById('back-btn').addEventListener('click', () => {
            UI.clearForm();
            UI.showView('list');
        });
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            UI.clearForm();
            UI.showView('list');
        });
        
        document.getElementById('back-to-list').addEventListener('click', () => {
            UI.showView('list');
        });
        
        UI.elements.recipesGrid.addEventListener('click', async (e) => {
            const card = e.target.closest('.recipe-card');
            if (card) {
                const id = parseInt(card.dataset.id);
                await viewRecipe(id);
            }
        });
        
        UI.elements.recipeForm.addEventListener('submit', handleFormSubmit);
        
        const photoBtn = document.getElementById('photo-btn');
        const photoInput = UI.elements.photoInput;
        
        photoBtn.addEventListener('click', () => photoInput.click());
        
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                UI.setPhotoPreview(file);
            }
        });
        
        document.getElementById('remove-photo').addEventListener('click', (e) => {
            e.preventDefault();
            UI.clearPhoto();
        });
        
        const startRecordBtn = document.getElementById('start-record-btn');
        const stopRecordBtn = document.getElementById('stop-record-btn');
        const recordingIndicator = document.getElementById('recording-indicator');
        
        startRecordBtn.addEventListener('click', () => {
            if (!window.speechModule.isSupported()) {
                UI.showToast('Voice recording not supported in this browser. Try Chrome or Edge.', 'error');
                return;
            }
            
            const success = window.speechModule.start(
                UI.handleVoiceTranscript,
                () => {
                    startRecordBtn.classList.remove('hidden');
                    stopRecordBtn.classList.add('hidden');
                    recordingIndicator.classList.add('hidden');
                    isRecording = false;
                }
            );
            
            if (success) {
                startRecordBtn.classList.add('hidden');
                stopRecordBtn.classList.remove('hidden');
                recordingIndicator.classList.remove('hidden');
                isRecording = true;
                UI.showToast('Recording... Click ingredients or instructions field to dictate', 'success');
            }
        });
        
        stopRecordBtn.addEventListener('click', () => {
            window.speechModule.stop();
            startRecordBtn.classList.remove('hidden');
            stopRecordBtn.classList.add('hidden');
            recordingIndicator.classList.add('hidden');
            isRecording = false;
        });
        
        UI.elements.searchInput.addEventListener('input', debounce(async (e) => {
            const query = e.target.value.trim();
            
            if (!query) {
                await loadRecipes();
                return;
            }
            
            try {
                const results = await storage.searchRecipes(query);
                UI.renderRecipes(results);
            } catch (error) {
                console.error('Search failed:', error);
            }
        }, 300));
        
        document.getElementById('edit-recipe-btn').addEventListener('click', async () => {
            if (currentRecipeId) {
                await editRecipe(currentRecipeId);
            }
        });
        
        document.getElementById('delete-recipe-btn').addEventListener('click', async () => {
            if (currentRecipeId) {
                await deleteRecipe(currentRecipeId);
            }
        });
        
        document.getElementById('export-pdf-btn').addEventListener('click', async () => {
            if (currentRecipeId) {
                try {
                    const recipe = await storage.getRecipe(currentRecipeId);
                    if (recipe) {
                        ExportModule.printRecipe(recipe);
                    }
                } catch (error) {
                    UI.showToast('Failed to export recipe', 'error');
                }
            }
        });
        
        document.getElementById('share-recipe-btn').addEventListener('click', async () => {
            if (currentRecipeId) {
                try {
                    const recipe = await storage.getRecipe(currentRecipeId);
                    if (recipe) {
                        const shareURL = ExportModule.generateShareURL(recipe);
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(shareURL);
                            UI.showToast('Share link copied to clipboard!', 'success');
                        } else {
                            window.prompt('Copy this share link:', shareURL);
                        }
                    }
                } catch (error) {
                    UI.showToast('Failed to generate share link', 'error');
                }
            }
        });
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = UI.getFormData();
        
        if (!formData.title || !formData.ingredients.length || !formData.instructions.length) {
            UI.showToast('Please fill in title, ingredients, and instructions', 'error');
            return;
        }
        
        try {
            if (UI.editingRecipeId) {
                await storage.updateRecipe(UI.editingRecipeId, formData);
                UI.showToast('Recipe updated successfully!', 'success');
            } else {
                await storage.addRecipe(formData);
                UI.showToast('Recipe saved successfully!', 'success');
            }
            
            UI.clearForm();
            await loadRecipes();
            UI.showView('list');
            
        } catch (error) {
            console.error('Failed to save recipe:', error);
            UI.showToast('Failed to save recipe. Please try again.', 'error');
        }
    }
    
    async function viewRecipe(id) {
        try {
            const recipe = await storage.getRecipe(id);
            if (!recipe) {
                UI.showToast('Recipe not found', 'error');
                return;
            }
            
            currentRecipeId = id;
            UI.renderRecipeDetail(recipe);
            UI.showView('detail');
            
        } catch (error) {
            console.error('Failed to load recipe:', error);
            UI.showToast('Failed to load recipe', 'error');
        }
    }
    
    async function editRecipe(id) {
        try {
            const recipe = await storage.getRecipe(id);
            if (!recipe) {
                UI.showToast('Recipe not found', 'error');
                return;
            }
            
            UI.populateForm(recipe);
            UI.showView('add');
            
        } catch (error) {
            console.error('Failed to load recipe for editing:', error);
            UI.showToast('Failed to load recipe', 'error');
        }
    }
    
    async function deleteRecipe(id) {
        const confirmed = confirm('Are you sure you want to delete this recipe? This cannot be undone.');
        
        if (!confirmed) return;
        
        try {
            await storage.deleteRecipe(id);
            UI.showToast('Recipe deleted', 'success');
            currentRecipeId = null;
            await loadRecipes();
            UI.showView('list');
            
        } catch (error) {
            console.error('Failed to delete recipe:', error);
            UI.showToast('Failed to delete recipe', 'error');
        }
    }
    
    function setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registered:', reg.scope))
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    }
    
    let deferredPrompt;
    
    function setupInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        const installBtn = document.getElementById('install-btn');
        const dismissBtn = document.getElementById('dismiss-install');
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            if (!localStorage.getItem('installDismissed')) {
                installPrompt.classList.remove('hidden');
            }
        });
        
        installBtn.addEventListener('click', async () => {
            installPrompt.classList.add('hidden');
            
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const result = await deferredPrompt.userChoice;
                console.log('Install prompt result:', result);
                deferredPrompt = null;
            }
        });
        
        dismissBtn.addEventListener('click', () => {
            installPrompt.classList.add('hidden');
            localStorage.setItem('installDismissed', 'true');
        });
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
})();
