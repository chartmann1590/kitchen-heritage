const UI = (function() {
    const views = {
        list: document.getElementById('recipe-list-view'),
        add: document.getElementById('add-recipe-view'),
        detail: document.getElementById('recipe-detail-view')
    };
    
    const elements = {
        recipesGrid: document.getElementById('recipes-grid'),
        recipeForm: document.getElementById('recipe-form'),
        searchInput: document.getElementById('search-input'),
        titleInput: document.getElementById('recipe-title'),
        prepTimeInput: document.getElementById('prep-time'),
        servingsInput: document.getElementById('servings'),
        authorInput: document.getElementById('author'),
        ingredientsInput: document.getElementById('ingredients'),
        instructionsInput: document.getElementById('instructions'),
        storyInput: document.getElementById('story'),
        tagsInput: document.getElementById('tags'),
        photoInput: document.getElementById('recipe-photo'),
        photoPreview: document.getElementById('photo-preview'),
        previewImg: document.getElementById('preview-img'),
        recipeDetail: document.getElementById('recipe-detail'),
        formTitle: document.getElementById('form-title'),
        toast: document.getElementById('toast')
    };
    
    let currentPhotoData = null;
    let editingRecipeId = null;
    
    function showView(viewName) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        if (views[viewName]) {
            views[viewName].classList.add('active');
        }
    }
    
    function renderRecipes(recipes) {
        if (!recipes || recipes.length === 0) {
            elements.recipesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📖</div>
                    <h2>No recipes yet</h2>
                    <p>Start preserving your family's culinary heritage by adding your first recipe!</p>
                </div>
            `;
            return;
        }
        
        elements.recipesGrid.innerHTML = recipes.map(recipe => `
            <article class="recipe-card" data-id="${recipe.id}">
                ${recipe.photo 
                    ? `<img src="${recipe.photo}" alt="${recipe.title}" class="recipe-card-photo" loading="lazy">` 
                    : `<div class="recipe-card-photo" style="display: flex; align-items: center; justify-content: center; font-size: 3rem;">🍳</div>`
                }
                <div class="recipe-card-content">
                    <h2 class="recipe-card-title">${escapeHtml(recipe.title)}</h2>
                    <div class="recipe-card-meta">
                        ${recipe.prepTime ? `<span>🕐 ${recipe.prepTime} min</span>` : ''}
                        ${recipe.servings ? `<span>🍽️ ${recipe.servings} servings</span>` : ''}
                    </div>
                    ${recipe.tags && recipe.tags.length > 0 ? `
                        <div class="recipe-card-tags">
                            ${recipe.tags.slice(0, 3).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </article>
        `).join('');
    }
    
    function renderRecipeDetail(recipe) {
        elements.recipeDetail.innerHTML = `
            ${recipe.photo 
                ? `<img src="${recipe.photo}" alt="${recipe.title}" class="recipe-hero">` 
                : ''
            }
            <h1 class="recipe-title">${escapeHtml(recipe.title)}</h1>
            ${recipe.author ? `<p class="recipe-author">By ${escapeHtml(recipe.author)}</p>` : ''}
            
            <div class="recipe-meta-detail">
                ${recipe.prepTime ? `
                    <div class="meta-item">
                        <span class="meta-label">Prep Time</span>
                        <span class="meta-value">${recipe.prepTime} min</span>
                    </div>
                ` : ''}
                ${recipe.servings ? `
                    <div class="meta-item">
                        <span class="meta-label">Servings</span>
                        <span class="meta-value">${recipe.servings}</span>
                    </div>
                ` : ''}
            </div>
            
            <section class="recipe-section">
                <h3>Ingredients</h3>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(ing => `<li>${escapeHtml(ing)}</li>`).join('')}
                </ul>
            </section>
            
            <section class="recipe-section">
                <h3>Instructions</h3>
                <ol class="instructions-list" style="counter-reset: step;">
                    ${recipe.instructions.map(inst => `<li>${escapeHtml(inst)}</li>`).join('')}
                </ol>
            </section>
            
            ${recipe.story ? `
                <section class="recipe-section">
                    <h3>Family Story</h3>
                    <div class="recipe-story">
                        <p>${escapeHtml(recipe.story)}</p>
                    </div>
                </section>
            ` : ''}
            
            ${recipe.tags && recipe.tags.length > 0 ? `
                <div class="recipe-tags-detail">
                    ${recipe.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
        `;
    }
    
    function showToast(message, type = 'default') {
        elements.toast.textContent = message;
        elements.toast.className = `toast ${type}`;
        elements.toast.classList.remove('hidden');
        
        setTimeout(() => {
            elements.toast.classList.add('hidden');
        }, 3000);
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function getFormData() {
        const tagsValue = elements.tagsInput.value.trim();
        const tags = tagsValue 
            ? tagsValue.split(',').map(t => t.trim()).filter(t => t)
            : [];
        
        const ingredientsValue = elements.ingredientsInput.value.trim();
        const ingredients = ingredientsValue
            ? ingredientsValue.split('\n').map(i => i.trim()).filter(i => i)
            : [];
        
        const instructionsValue = elements.instructionsInput.value.trim();
        const instructions = instructionsValue
            ? instructionsValue.split('\n').map(i => i.trim()).filter(i => i)
            : [];
        
        return {
            title: elements.titleInput.value.trim(),
            prepTime: elements.prepTimeInput.value ? parseInt(elements.prepTimeInput.value) : null,
            servings: elements.servingsInput.value ? parseInt(elements.servingsInput.value) : null,
            author: elements.authorInput.value.trim() || null,
            ingredients,
            instructions,
            story: elements.storyInput.value.trim() || null,
            tags,
            photo: currentPhotoData
        };
    }
    
    function populateForm(recipe) {
        elements.titleInput.value = recipe.title || '';
        elements.prepTimeInput.value = recipe.prepTime || '';
        elements.servingsInput.value = recipe.servings || '';
        elements.authorInput.value = recipe.author || '';
        elements.ingredientsInput.value = (recipe.ingredients || []).join('\n');
        elements.instructionsInput.value = (recipe.instructions || []).join('\n');
        elements.storyInput.value = recipe.story || '';
        elements.tagsInput.value = (recipe.tags || []).join(', ');
        
        if (recipe.photo) {
            currentPhotoData = recipe.photo;
            elements.previewImg.src = recipe.photo;
            elements.photoPreview.classList.remove('hidden');
        }
        
        editingRecipeId = recipe.id;
        elements.formTitle.textContent = 'Edit Recipe';
    }
    
    function clearForm() {
        elements.recipeForm.reset();
        currentPhotoData = null;
        editingRecipeId = null;
        elements.formTitle.textContent = 'New Recipe';
        elements.photoPreview.classList.add('hidden');
    }
    
    function setPhotoPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentPhotoData = e.target.result;
            elements.previewImg.src = currentPhotoData;
            elements.photoPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
    
    function clearPhoto() {
        currentPhotoData = null;
        elements.photoPreview.classList.add('hidden');
        elements.photoInput.value = '';
    }
    
    function handleVoiceTranscript(text, isFinal) {
        const ingredientsTextarea = elements.ingredientsInput;
        const instructionsTextarea = elements.instructionsInput;
        
        const transcriptPreview = document.getElementById('transcript-preview');
        if (transcriptPreview) {
            transcriptPreview.textContent = text;
        }
        
        if (isFinal) {
            const activeElement = document.activeElement;
            
            if (activeElement === ingredientsTextarea) {
                ingredientsTextarea.value += (ingredientsTextarea.value ? '\n' : '') + text.trim();
            } else if (activeElement === instructionsTextarea) {
                instructionsTextarea.value += (instructionsTextarea.value ? '\n' : '') + text.trim();
            } else {
                // Default to instructions if no field is focused
                if (!instructionsTextarea.value) {
                    instructionsTextarea.value = text.trim();
                } else {
                    instructionsTextarea.value += '\n' + text.trim();
                }
            }
        }
    }
    
    return {
        views,
        elements,
        showView,
        renderRecipes,
        renderRecipeDetail,
        showToast,
        getFormData,
        populateForm,
        clearForm,
        setPhotoPreview,
        clearPhoto,
        handleVoiceTranscript,
        get editingRecipeId() { return editingRecipeId; },
        get currentPhotoData() { return currentPhotoData; }
    };
})();

window.UI = UI;
