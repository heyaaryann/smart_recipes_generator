// ============================================================
// APP ORCHESTRATOR — main entry point
// Wires all modules: database, matching, vision, storage, UI
// ============================================================

(function () {
    // ── State ──────────────────────────────────────────────
    const state = {
        ingredients: [],
        filters: {
            dietary: [],
            difficulty: 'all',
            maxCookTime: 0,
            sort: 'match'
        },
        results: [],
        allRecipes: RECIPES,
        activeTab: 'search',
        currentServings: {},
        isLoading: false
    };

    // ── DOM Ready ──────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        loadPreferences();
        setupIngredientInput();
        setupImageUpload();
        setupFilters();
        setupTabs();
        setupModalListeners();
        setupFavoritesPanel();
        setupSuggestions();
        renderAll();
        renderFavoritesPanel();
    });

    // ── Preferences ────────────────────────────────────────
    function loadPreferences() {
        const prefs = getPreferences();
        state.filters.dietary = prefs.dietary || [];
        // Sync UI checkboxes
        prefs.dietary.forEach(d => {
            const cb = document.querySelector(`input[data-dietary="${d}"]`);
            if (cb) cb.checked = true;
        });
        const apiKeyInput = document.getElementById('vision-api-key');
        if (apiKeyInput && prefs.apiKey) apiKeyInput.value = prefs.apiKey;
    }

    // ── Ingredient Input ────────────────────────────────────
    function setupIngredientInput() {
        const input = document.getElementById('ingredient-input');
        const addBtn = document.getElementById('add-ingredient-btn');

        function addIngredient() {
            const val = input.value.trim().toLowerCase();
            if (!val) return;
            const items = val.split(',').map(s => s.trim()).filter(Boolean);
            items.forEach(item => {
                if (item && !state.ingredients.includes(item)) {
                    state.ingredients.push(item);
                }
            });
            input.value = '';
            renderIngredientPills(state.ingredients);
            input.focus();
        }

        addBtn.addEventListener('click', addIngredient);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') addIngredient();
        });

        // Pill remove via delegation
        document.getElementById('ingredient-pills').addEventListener('click', e => {
            if (e.target.classList.contains('pill__remove')) {
                const idx = parseInt(e.target.dataset.index);
                state.ingredients.splice(idx, 1);
                renderIngredientPills(state.ingredients);
            }
        });

        // Quick-add chips
        document.querySelectorAll('.quick-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const ing = chip.dataset.ingredient;
                if (ing && !state.ingredients.includes(ing)) {
                    state.ingredients.push(ing);
                    renderIngredientPills(state.ingredients);
                    chip.classList.add('quick-chip--added');
                    setTimeout(() => chip.classList.remove('quick-chip--added'), 1000);
                }
            });
        });

        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            addToHistory(state.ingredients);
            runSearch();
        });

        // Clear all
        document.getElementById('clear-btn').addEventListener('click', () => {
            state.ingredients = [];
            renderIngredientPills(state.ingredients);
            state.results = [];
            renderRecipeGrid([], isFavorite, getRating);
            updateResultCount(0, RECIPES.length);
        });
    }

    // ── Image Upload ────────────────────────────────────────
    function setupImageUpload() {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('image-input');
        const previewImg = document.getElementById('upload-preview');
        const statusEl = document.getElementById('upload-status');

        if (!uploadZone) return;

        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('upload-zone--drag'); });
        uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('upload-zone--drag'));
        uploadZone.addEventListener('drop', e => {
            e.preventDefault();
            uploadZone.classList.remove('upload-zone--drag');
            const file = e.dataTransfer.files[0];
            if (file) handleImageFile(file);
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files[0]) handleImageFile(fileInput.files[0]);
        });

        async function handleImageFile(file) {
            if (!file.type.startsWith('image/')) {
                showToast('Please upload an image file.', 'error');
                return;
            }

            // Show preview
            const url = URL.createObjectURL(file);
            if (previewImg) { previewImg.src = url; previewImg.style.display = 'block'; }
            uploadZone.classList.add('upload-zone--loading');
            if (statusEl) statusEl.textContent = '🔍 Analysing ingredients...';

            const apiKeyInput = document.getElementById('vision-api-key');
            const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';

            try {
                const detected = await detectIngredientsFromImage(file, apiKey);
                detected.forEach(ing => {
                    if (!state.ingredients.includes(ing)) state.ingredients.push(ing);
                });
                renderIngredientPills(state.ingredients);
                if (statusEl) statusEl.textContent = `✅ Detected ${detected.length} ingredient${detected.length !== 1 ? 's' : ''}!`;
                showToast(`Detected: ${detected.join(', ')}`, 'success');
                // Save API key if provided
                if (apiKey) {
                    const prefs = getPreferences();
                    prefs.apiKey = apiKey;
                    savePreferences(prefs);
                }
            } catch (err) {
                if (statusEl) statusEl.textContent = '❌ Could not detect ingredients. Try manually.';
                showToast('Image recognition failed. Try adding ingredients manually.', 'error');
            } finally {
                uploadZone.classList.remove('upload-zone--loading');
            }
        }
    }

    // ── Filters ─────────────────────────────────────────────
    function setupFilters() {
        // Dietary checkboxes
        document.querySelectorAll('input[data-dietary]').forEach(cb => {
            cb.addEventListener('change', () => {
                state.filters.dietary = Array.from(document.querySelectorAll('input[data-dietary]:checked'))
                    .map(c => c.dataset.dietary);
                const prefs = getPreferences();
                prefs.dietary = state.filters.dietary;
                savePreferences(prefs);
                if (state.results.length > 0 || state.ingredients.length > 0) runSearch();
            });
        });

        // Difficulty
        const diffSel = document.getElementById('difficulty-filter');
        if (diffSel) diffSel.addEventListener('change', () => {
            state.filters.difficulty = diffSel.value;
            if (state.results.length > 0 || state.ingredients.length > 0) runSearch();
        });

        // Cook time
        const timeSel = document.getElementById('time-filter');
        if (timeSel) timeSel.addEventListener('change', () => {
            state.filters.maxCookTime = parseInt(timeSel.value) || 0;
            if (state.results.length > 0 || state.ingredients.length > 0) runSearch();
        });

        // Sort
        const sortSel = document.getElementById('sort-filter');
        if (sortSel) sortSel.addEventListener('change', () => {
            state.filters.sort = sortSel.value;
            applySort();
            renderRecipeGrid(state.results, isFavorite, getRating);
        });
    }

    function applySort() {
        if (state.filters.sort === 'match') {
            state.results.sort((a, b) => (b.scoreData?.score || 0) - (a.scoreData?.score || 0));
        } else if (state.filters.sort === 'time') {
            state.results.sort((a, b) => a.cookTime - b.cookTime);
        } else if (state.filters.sort === 'difficulty') {
            const order = { Easy: 0, Medium: 1, Hard: 2 };
            state.results.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        } else if (state.filters.sort === 'calories') {
            state.results.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
        }
    }

    // ── Search / Match ──────────────────────────────────────
    function runSearch() {
        showSkeletons(6);
        state.isLoading = true;

        // Small delay for UX
        setTimeout(() => {
            state.results = matchRecipes(state.ingredients, state.filters, state.allRecipes, SUBSTITUTIONS);
            applySort();
            state.isLoading = false;
            renderRecipeGrid(state.results, isFavorite, getRating);
            updateResultCount(state.results.length, state.allRecipes.length);
            // Scroll to results
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 600);
    }

    function renderAll() {
        // Show all recipes by default (no score filter)
        const initial = RECIPES.slice(0, 12);
        renderRecipeGrid(initial.map(r => ({ ...r, scoreData: null })), isFavorite, getRating);
        updateResultCount(RECIPES.length, RECIPES.length);
    }

    // ── Tabs ────────────────────────────────────────────────
    function setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('tab-btn--active'));
                tabPanels.forEach(p => p.classList.remove('tab-panel--active'));
                btn.classList.add('tab-btn--active');
                document.getElementById(`tab-${target}`)?.classList.add('tab-panel--active');

                if (target === 'favorites') renderFavoritesPanel();
                if (target === 'suggestions') renderSuggestions();
            });
        });
    }

    // ── Modal ───────────────────────────────────────────────
    function setupModalListeners() {
        // Open modal (card click or view button)
        document.getElementById('recipe-grid').addEventListener('click', e => {
            const viewBtn = e.target.closest('.btn--view');
            const favBtn = e.target.closest('.fav-btn');
            const starBtn = e.target.closest('.star-btn');

            if (favBtn) {
                e.stopPropagation();
                const id = parseInt(favBtn.dataset.recipeId);
                const isNowFav = toggleFavorite(id);
                favBtn.textContent = isNowFav ? '❤️' : '🤍';
                favBtn.classList.toggle('fav-btn--active', isNowFav);
                showToast(isNowFav ? 'Added to favorites! ❤️' : 'Removed from favorites.', 'success');
                return;
            }

            if (starBtn) {
                e.stopPropagation();
                const id = parseInt(starBtn.dataset.recipeId);
                const rating = parseInt(starBtn.dataset.rating);
                setRating(id, rating);
                // Update stars in the card
                const card = starBtn.closest('.recipe-card');
                if (card) {
                    card.querySelectorAll('.star-btn').forEach(s => {
                        s.classList.toggle('star-btn--filled', parseInt(s.dataset.rating) <= rating);
                    });
                }
                showToast(`Rated ${rating} star${rating > 1 ? 's' : ''}! ⭐`, 'success');
                return;
            }

            if (viewBtn) {
                const id = parseInt(viewBtn.dataset.recipeId);
                openRecipeModal(id);
                return;
            }
        });

        // Modal overlay click
        document.getElementById('modal-overlay').addEventListener('click', e => {
            if (e.target === document.getElementById('modal-overlay')) hideModal();

            const closeBtn = e.target.closest('#close-modal');
            if (closeBtn) hideModal();

            const favBtn = e.target.closest('.fav-btn');
            if (favBtn) {
                const id = parseInt(favBtn.dataset.recipeId);
                const isNowFav = toggleFavorite(id);
                favBtn.textContent = isNowFav ? '❤️' : '🤍';
                favBtn.classList.toggle('fav-btn--active', isNowFav);
                showToast(isNowFav ? 'Added to favorites! ❤️' : 'Removed from favorites.', 'success');
            }

            const starBtn = e.target.closest('.star-btn');
            if (starBtn) {
                const id = parseInt(starBtn.dataset.recipeId);
                const rating = parseInt(starBtn.dataset.rating);
                setRating(id, rating);
                document.querySelectorAll('#modal-overlay .star-btn').forEach(s => {
                    s.classList.toggle('star-btn--filled', parseInt(s.dataset.rating) <= rating);
                });
                showToast(`Rated ${rating} star${rating > 1 ? 's' : ''}! ⭐`, 'success');
            }

            // Serving adjuster
            const decBtn = e.target.closest('#dec-serving');
            const incBtn = e.target.closest('#inc-serving');
            if (decBtn || incBtn) {
                const overlay = document.getElementById('modal-overlay');
                const recipeId = parseInt(overlay.dataset.recipeId);
                let servings = parseInt(overlay.dataset.servings) || 2;
                if (decBtn) servings = Math.max(1, servings - 1);
                if (incBtn) servings = Math.min(20, servings + 1);
                state.currentServings[recipeId] = servings;
                const recipe = RECIPES.find(r => r.id === recipeId);
                if (recipe) {
                    const matchedRecipe = state.results.find(r => r.id === recipeId) || recipe;
                    renderModal(matchedRecipe, getRating(recipeId), servings, isFavorite);
                }
            }
        });

        // Keyboard close
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') hideModal();
        });
    }

    function openRecipeModal(recipeId) {
        const recipe = state.results.find(r => r.id === recipeId)
            || RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;
        const servings = state.currentServings[recipeId] || recipe.servings;
        renderModal(recipe, getRating(recipeId), servings, isFavorite);
        document.getElementById('modal-overlay').querySelector('.modal')?.focus();
    }

    // ── Favorites Panel ─────────────────────────────────────
    function setupFavoritesPanel() {
        const panel = document.getElementById('favorites-list');
        if (!panel) return;
        panel.addEventListener('click', e => {
            const viewBtn = e.target.closest('.fav-item__view');
            if (viewBtn) {
                const id = parseInt(viewBtn.dataset.recipeId);
                openRecipeModal(id);
            }
        });
    }

    function renderFavoritesPanel() {
        const favIds = getFavorites();
        const favRecipes = favIds.map(id => RECIPES.find(r => r.id === id)).filter(Boolean);
        // Use global UI function
        window._renderFavoritesPanel(favRecipes, getRating);
    }

    // ── Suggestions ─────────────────────────────────────────
    function setupSuggestions() { }

    function renderSuggestions() {
        const container = document.getElementById('suggestions-grid');
        if (!container) return;
        const suggestedIds = getSuggestedRecipeIds(RECIPES);
        if (suggestedIds.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">💡</div>
          <h3>No suggestions yet</h3>
          <p>Rate some recipes and we'll personalise suggestions for you!</p>
        </div>`;
            return;
        }
        const suggested = suggestedIds.map(id => RECIPES.find(r => r.id === id)).filter(Boolean);
        container.innerHTML = suggested.map(r => renderRecipeCard(
            { ...r, scoreData: null }, isFavorite(r.id), getRating(r.id)
        )).join('');
    }

})();
