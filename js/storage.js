const DB_NAME = 'KitchenHeritageDB';
const DB_VERSION = 1;
const STORE_NAME = 'recipes';

let db = null;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const store = database.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('title', 'title', { unique: false });
                store.createIndex('createdAt', 'createdAt', { unique: false });
                store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
            }
        };
    });
}

function getStore(mode = 'readonly') {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
}

function addRecipe(recipe) {
    return new Promise((resolve, reject) => {
        const store = getStore('readwrite');
        const recipeWithTimestamp = {
            ...recipe,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const request = store.add(recipeWithTimestamp);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function updateRecipe(id, updates) {
    return new Promise((resolve, reject) => {
        const store = getStore('readwrite');
        const getRequest = store.get(id);
        
        getRequest.onsuccess = () => {
            const existing = getRequest.result;
            if (!existing) {
                reject(new Error('Recipe not found'));
                return;
            }
            
            const updated = {
                ...existing,
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            const putRequest = store.put(updated);
            putRequest.onsuccess = () => resolve(updated);
            putRequest.onerror = () => reject(putRequest.error);
        };
        
        getRequest.onerror = () => reject(getRequest.error);
    });
}

function getRecipe(id) {
    return new Promise((resolve, reject) => {
        const store = getStore('readonly');
        const request = store.get(id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getAllRecipes() {
    return new Promise((resolve, reject) => {
        const store = getStore('readonly');
        const request = store.getAll();
        
        request.onsuccess = () => {
            const recipes = request.result.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            resolve(recipes);
        };
        request.onerror = () => reject(request.error);
    });
}

function deleteRecipe(id) {
    return new Promise((resolve, reject) => {
        const store = getStore('readwrite');
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function searchRecipes(query) {
    return new Promise((resolve, reject) => {
        getAllRecipes()
            .then(recipes => {
                const lowerQuery = query.toLowerCase();
                const filtered = recipes.filter(recipe => 
                    recipe.title.toLowerCase().includes(lowerQuery) ||
                    recipe.author?.toLowerCase().includes(lowerQuery) ||
                    recipe.story?.toLowerCase().includes(lowerQuery) ||
                    recipe.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
                    recipe.ingredients?.some(ing => ing.toLowerCase().includes(lowerQuery)) ||
                    recipe.instructions?.some(step => step.toLowerCase().includes(lowerQuery))
                );
                resolve(filtered);
            })
            .catch(reject);
    });
}

function exportRecipeAsJSON(recipe) {
    const dataStr = JSON.stringify(recipe, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportName = recipe.title.toLowerCase().replace(/\s+/g, '-');
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `${exportName}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.storage = {
    initDB,
    addRecipe,
    updateRecipe,
    getRecipe,
    getAllRecipes,
    deleteRecipe,
    searchRecipes,
    exportRecipeAsJSON
};
