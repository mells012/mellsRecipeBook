class RecipeBook {
    constructor() {
        this.recipes = recipes;
        this.selectedCategories = new Set();
        this.checkedIngredients = new Set();
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderRecipes();
        this.updateShoppingList();
    }

    // ============ Event Listeners ============
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Modal
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('recipe-modal').addEventListener('click', (e) => {
            if (e.target.id === 'recipe-modal') this.closeModal();
        });

        // Clear all button
        document.getElementById('clear-all-btn').addEventListener('click', () => this.clearAllChecked());
    }

    // ============ Tab Navigation ============
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        if (tabName === 'shopping') {
            this.renderShoppingList();
        }
    }

    // ============ Recipe Rendering ============
    renderRecipes() {
        const grid = document.querySelector('.recipes-grid');
        grid.innerHTML = this.recipes.map(recipe => `
            <div class="recipe-card" onclick="recipeBook.openModal(${recipe.id})">
                <div class="recipe-card-image">${recipe.image}</div>
                <div class="recipe-card-content">
                    <h3 class="recipe-card-title">${recipe.name}</h3>
                    <p class="recipe-card-subtitle">${recipe.subtitle}</p>
                    <span class="recipe-card-category">${recipe.category}</span>
                    <div class="recipe-card-stats">
                        <div class="stat">
                            <span class="stat-value">${recipe.kcal}</span>
                            <span class="stat-label">kcal</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${recipe.protein}g</span>
                            <span class="stat-label">proteína</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ============ Modal ============
    openModal(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h2 class="modal-title">${recipe.name}</h2>
            <p class="modal-subtitle">${recipe.subtitle}</p>
            <span class="modal-category">${recipe.category}</span>

            <div class="modal-stats">
                <div class="modal-stat">
                    <span class="modal-stat-value">${recipe.kcal}</span>
                    <span class="modal-stat-label">kcal</span>
                </div>
                <div class="modal-stat">
                    <span class="modal-stat-value">${recipe.protein}g</span>
                    <span class="modal-stat-label">proteína</span>
                </div>
            </div>

            <div class="modal-section">
                <h3>🥘 Ingredientes</h3>
                <ul class="modal-ingredients">
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>👨‍🍳 Preparación</h3>
                <ol class="modal-steps">
                    ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        `;

        document.getElementById('recipe-modal').classList.add('show');
    }

    closeModal() {
        document.getElementById('recipe-modal').classList.remove('show');
    }

    // ============ Shopping List ============
    renderShoppingList() {
        this.renderFilters();
        this.updateShoppingList();
    }

    renderFilters() {
        const filtersContainer = document.querySelector('.category-filters');
        const categories = [...new Set(this.recipes.map(r => r.category))];

        filtersContainer.innerHTML = categories.map(category => `
            <div class="filter-checkbox">
                <input
                    type="checkbox"
                    id="filter-${category}"
                    value="${category}"
                    ${this.selectedCategories.has(category) ? 'checked' : ''}
                    onchange="recipeBook.toggleCategory('${category}')"
                >
                <label for="filter-${category}">${category}</label>
            </div>
        `).join('');
    }

    toggleCategory(category) {
        if (this.selectedCategories.has(category)) {
            this.selectedCategories.delete(category);
        } else {
            this.selectedCategories.add(category);
        }
        this.updateShoppingList();
        this.saveToStorage();
    }

    updateShoppingList() {
        // Get ingredients based on selected categories
        const ingredientsMap = this.getFilteredIngredients();

        const listContainer = document.querySelector('.shopping-list');

        if (ingredientsMap.size === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-text">Selecciona una categoría para ver los ingredientes</div>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = Array.from(ingredientsMap.values())
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(ingredient => `
                <div class="ingredient-item ${this.checkedIngredients.has(ingredient.name) ? 'checked' : ''}">
                    <input
                        type="checkbox"
                        class="ingredient-checkbox"
                        data-ingredient="${ingredient.name}"
                        ${this.checkedIngredients.has(ingredient.name) ? 'checked' : ''}
                        onchange="recipeBook.toggleIngredient('${ingredient.name}')"
                    >
                    <div class="ingredient-info">
                        <div class="ingredient-name">${ingredient.name}</div>
                        <div class="ingredient-recipes">
                            Recetas:
                            <div class="ingredient-recipes-list">
                                ${ingredient.recipes.map(recipe => `
                                    <span class="recipe-badge" onclick="recipeBook.openModal(${recipe.id})">${recipe.name}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
    }

    getFilteredIngredients() {
        const ingredientsMap = new Map();

        // If no categories selected, show all
        const categoriesToUse = this.selectedCategories.size === 0
            ? new Set(this.recipes.map(r => r.category))
            : this.selectedCategories;

        // Get recipes in selected categories
        const selectedRecipes = this.recipes.filter(r => categoriesToUse.has(r.category));

        // Compile ingredients
        selectedRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredientName => {
                if (!ingredientsMap.has(ingredientName)) {
                    ingredientsMap.set(ingredientName, {
                        name: ingredientName,
                        recipes: []
                    });
                }
                // Add recipe to this ingredient if not already there
                if (!ingredientsMap.get(ingredientName).recipes.find(r => r.id === recipe.id)) {
                    ingredientsMap.get(ingredientName).recipes.push({
                        id: recipe.id,
                        name: recipe.name
                    });
                }
            });
        });

        return ingredientsMap;
    }

    toggleIngredient(ingredientName) {
        if (this.checkedIngredients.has(ingredientName)) {
            this.checkedIngredients.delete(ingredientName);
        } else {
            this.checkedIngredients.add(ingredientName);
        }
        this.updateShoppingList();
        this.saveToStorage();
    }

    clearAllChecked() {
        if (confirm('¿Estás seguro de que quieres limpiar toda la lista?')) {
            this.checkedIngredients.clear();
            this.updateShoppingList();
            this.saveToStorage();
        }
    }

    // ============ Storage ============
    saveToStorage() {
        localStorage.setItem('selectedCategories', JSON.stringify([...this.selectedCategories]));
        localStorage.setItem('checkedIngredients', JSON.stringify([...this.checkedIngredients]));
    }

    loadFromStorage() {
        const savedCategories = localStorage.getItem('selectedCategories');
        const savedIngredients = localStorage.getItem('checkedIngredients');

        if (savedCategories) {
            this.selectedCategories = new Set(JSON.parse(savedCategories));
        }

        if (savedIngredients) {
            this.checkedIngredients = new Set(JSON.parse(savedIngredients));
        }
    }
}

// Initialize the app when DOM is ready
let recipeBook;
document.addEventListener('DOMContentLoaded', () => {
    recipeBook = new RecipeBook();
});
