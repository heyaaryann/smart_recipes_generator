// ============================================================
// UI RENDERING MODULE
// Handles all DOM rendering: cards, modals, toasts, skeletons
// ============================================================

/* ── Utility ────────────────────────────────────────────── */

function el(selector) { return document.querySelector(selector); }
function els(selector) { return document.querySelectorAll(selector); }

function showToast(message, type = 'success') {
    const container = el('#toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
    <span class="toast__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    document.body.appendChild(div);
    return div;
}

/* ── Skeleton Loaders ───────────────────────────────────── */

function showSkeletons(count = 6) {
    const grid = el('#recipe-grid');
    if (!grid) return;
    grid.innerHTML = Array.from({ length: count }, () => `
    <div class="recipe-card recipe-card--skeleton">
      <div class="skeleton skeleton--image"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text short"></div>
      </div>
    </div>
  `).join('');
}

/* ── Recipe Cards ───────────────────────────────────────── */

function getMatchBadgeClass(score) {
    if (score >= 80) return 'badge--excellent';
    if (score >= 50) return 'badge--good';
    if (score > 0) return 'badge--fair';
    return 'badge--none';
}

function getDifficultyIcon(difficulty) {
    return { Easy: '🟢', Medium: '🟡', Hard: '🔴' }[difficulty] || '⚪';
}

function renderDietaryTags(dietary) {
    const icons = { vegetarian: '🌿', vegan: '🌱', 'gluten-free': '🌾', 'dairy-free': '🥛', 'high-protein': '💪' };
    return dietary.map(d =>
        `<span class="dietary-tag" title="${d}">${icons[d] || ''} ${d}</span>`
    ).join('');
}

function renderStarRating(recipeId, currentRating) {
    return Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        const filled = star <= currentRating;
        return `<button class="star-btn ${filled ? 'star-btn--filled' : ''}" 
      data-recipe-id="${recipeId}" data-rating="${star}" 
      aria-label="Rate ${star} stars" title="${star} star${star > 1 ? 's' : ''}">★</button>`;
    }).join('');
}

function renderRecipeCard(recipe, isFav = false, rating = 0) {
    const score = recipe.scoreData ? recipe.scoreData.score : 0;
    const matchBadge = score > 0 ? `
    <div class="match-badge ${getMatchBadgeClass(score)}">
      <span class="match-badge__pct">${score}%</span>
      <span class="match-badge__label">match</span>
    </div>` : '';

    const matchedCount = recipe.scoreData ? recipe.scoreData.matched : 0;
    const totalCount = recipe.ingredients.length;

    return `
    <article class="recipe-card" data-recipe-id="${recipe.id}" role="article">
      <div class="recipe-card__visual">
        <div class="recipe-card__emoji-bg">${recipe.emoji}</div>
        ${matchBadge}
        <button class="fav-btn ${isFav ? 'fav-btn--active' : ''}" 
          data-recipe-id="${recipe.id}" 
          aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
          title="${isFav ? 'Remove from favorites' : 'Save recipe'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="recipe-card__body">
        <div class="recipe-card__meta">
          <span class="cuisine-tag">${recipe.cuisine}</span>
          <span class="difficulty-tag">${getDifficultyIcon(recipe.difficulty)} ${recipe.difficulty}</span>
        </div>
        <h3 class="recipe-card__title">${recipe.name}</h3>
        <p class="recipe-card__desc">${recipe.description}</p>
        <div class="recipe-card__stats">
          <span title="Cook time">⏱ ${recipe.cookTime} min</span>
          <span title="Calories">🔥 ${recipe.nutrition.calories} kcal</span>
          ${score > 0 ? `<span title="Ingredients matched">🧂 ${matchedCount}/${totalCount} matched</span>` : `<span>🧂 ${totalCount} ingredients</span>`}
        </div>
        ${recipe.dietary.length > 0 ? `<div class="dietary-tags">${renderDietaryTags(recipe.dietary)}</div>` : ''}
        <div class="recipe-card__footer">
          <div class="star-rating" aria-label="Recipe rating">
            ${renderStarRating(recipe.id, rating)}
          </div>
          <button class="btn btn--view" data-recipe-id="${recipe.id}">View Recipe →</button>
        </div>
      </div>
    </article>
  `;
}

function renderRecipeGrid(recipes, getFavFn, getRatingFn) {
    const grid = el('#recipe-grid');
    if (!grid) return;

    if (recipes.length === 0) {
        grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <h3>No recipes found</h3>
        <p>Try adding more ingredients or adjusting your filters.</p>
      </div>
    `;
        return;
    }

    grid.innerHTML = recipes.map(r => renderRecipeCard(r, getFavFn(r.id), getRatingFn(r.id))).join('');
}

/* ── Recipe Detail Modal ────────────────────────────────── */

function renderModal(recipe, ratingVal = 0, servings = null, getFavFn) {
    const displayServings = servings || recipe.servings;
    const ratio = displayServings / recipe.servings;
    const nutrition = {
        calories: Math.round(recipe.nutrition.calories * ratio),
        protein: Math.round(recipe.nutrition.protein * ratio),
        carbs: Math.round(recipe.nutrition.carbs * ratio),
        fat: Math.round(recipe.nutrition.fat * ratio),
        fiber: Math.round(recipe.nutrition.fiber * ratio)
    };

    const isFav = getFavFn ? getFavFn(recipe.id) : false;
    const score = recipe.scoreData ? recipe.scoreData.score : 0;
    const missedIngredients = recipe.scoreData ? recipe.scoreData.missingList : [];
    const subIngredients = recipe.scoreData ? recipe.scoreData.subList : [];

    const ingredientHtml = recipe.ingredients.map(ing => {
        const isMissing = missedIngredients.includes(ing);
        const isSub = subIngredients.includes(ing);
        let cls = 'ingredient-item';
        let icon = '✅';
        if (isMissing) { cls += ' ingredient-item--missing'; icon = '❌'; }
        else if (isSub) { cls += ' ingredient-item--sub'; icon = '🔄'; }
        return `<li class="${cls}">${icon} ${ing}${ratio !== 1 ? ` <em>(×${ratio.toFixed(1)})</em>` : ''}</li>`;
    }).join('');

    const stepsHtml = recipe.steps.map((step, i) => `
    <div class="step-item">
      <div class="step-num">${i + 1}</div>
      <p class="step-text">${step}</p>
    </div>
  `).join('');

    el('#modal-overlay').innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal__header">
        <div class="modal__emoji">${recipe.emoji}</div>
        <div class="modal__header-info">
          <div class="modal__tags">
            <span class="cuisine-tag">${recipe.cuisine}</span>
            ${recipe.dietary.map(d => `<span class="dietary-tag">${d}</span>`).join('')}
          </div>
          <h2 id="modal-title" class="modal__title">${recipe.name}</h2>
          <p class="modal__desc">${recipe.description}</p>
          <div class="modal__quick-stats">
            <span>⏱ ${recipe.cookTime} min</span>
            <span>${getDifficultyIcon(recipe.difficulty)} ${recipe.difficulty}</span>
            <span>👥 ${displayServings} serving${displayServings > 1 ? 's' : ''}</span>
            ${score > 0 ? `<span class="match-score-inline ${getMatchBadgeClass(score)}">${score}% match</span>` : ''}
          </div>
        </div>
        <div class="modal__actions">
          <button class="fav-btn ${isFav ? 'fav-btn--active' : ''} fav-btn--large" 
            data-recipe-id="${recipe.id}" title="${isFav ? 'Remove from favorites' : 'Save recipe'}">
            ${isFav ? '❤️' : '🤍'}
          </button>
          <button class="modal__close" id="close-modal" aria-label="Close modal">✕</button>
        </div>
      </div>

      <div class="modal__body">
        <!-- Serving Adjuster -->
        <div class="serving-adjuster">
          <span class="serving-label">Servings:</span>
          <button class="serving-btn" id="dec-serving" aria-label="Decrease servings">−</button>
          <span id="serving-count" class="serving-count">${displayServings}</span>
          <button class="serving-btn" id="inc-serving" aria-label="Increase servings">+</button>
        </div>

        <!-- Nutrition Bar -->
        <div class="nutrition-card">
          <h4 class="section-title">Nutrition <em>(per ${displayServings} serving${displayServings > 1 ? 's' : ''})</em></h4>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="nutrition-val">${nutrition.calories}</div>
              <div class="nutrition-label">Calories</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-val">${nutrition.protein}g</div>
              <div class="nutrition-label">Protein</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-val">${nutrition.carbs}g</div>
              <div class="nutrition-label">Carbs</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-val">${nutrition.fat}g</div>
              <div class="nutrition-label">Fat</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-val">${nutrition.fiber}g</div>
              <div class="nutrition-label">Fiber</div>
            </div>
          </div>
        </div>

        <div class="modal__columns">
          <!-- Ingredients -->
          <div class="modal__section">
            <h4 class="section-title">Ingredients</h4>
            ${missedIngredients.length > 0 ? `
              <div class="legend">
                <span>✅ have it</span>
                <span>🔄 substitute</span>
                <span>❌ missing</span>
              </div>` : ''}
            <ul class="ingredient-list">${ingredientHtml}</ul>
          </div>

          <!-- Steps -->
          <div class="modal__section modal__section--steps">
            <h4 class="section-title">Instructions</h4>
            <div class="steps-list">${stepsHtml}</div>
          </div>
        </div>

        <!-- Rating -->
        <div class="rating-section">
          <h4 class="section-title">Rate this recipe</h4>
          <div class="star-rating star-rating--large">
            ${renderStarRating(recipe.id, ratingVal)}
          </div>
        </div>
      </div>
    </div>
  `;

    el('#modal-overlay').classList.add('modal-overlay--visible');
    el('#modal-overlay').setAttribute('data-recipe-id', recipe.id);
    el('#modal-overlay').setAttribute('data-servings', displayServings);
}

function hideModal() {
    const overlay = el('#modal-overlay');
    if (overlay) {
        overlay.classList.remove('modal-overlay--visible');
        setTimeout(() => { overlay.innerHTML = ''; }, 300);
    }
}

/* ── Favorites Panel ────────────────────────────────────── */

function renderFavoritesPanel(favRecipes, getRatingFn) {
    const panel = el('#favorites-list');
    if (!panel) return;

    if (favRecipes.length === 0) {
        panel.innerHTML = `
      <div class="empty-favorites">
        <p>❤️ Save recipes you love!</p>
        <p class="empty-favorites__hint">Tap the heart icon on any recipe.</p>
      </div>
    `;
        return;
    }

    panel.innerHTML = favRecipes.map(r => `
    <div class="fav-item" data-recipe-id="${r.id}">
      <span class="fav-item__emoji">${r.emoji}</span>
      <div class="fav-item__info">
        <span class="fav-item__name">${r.name}</span>
        <span class="fav-item__detail">${r.cookTime} min · ${r.difficulty}</span>
      </div>
      <button class="fav-item__view btn btn--sm" data-recipe-id="${r.id}">View</button>
    </div>
  `).join('');
}

/* ── Ingredient Pills ───────────────────────────────────── */

function renderIngredientPills(ingredients) {
    const container = el('#ingredient-pills');
    if (!container) return;
    container.innerHTML = ingredients.map((ing, idx) => `
    <span class="pill">
      ${ing}
      <button class="pill__remove" data-index="${idx}" aria-label="Remove ${ing}">×</button>
    </span>
  `).join('');
}

/* ── Result count ───────────────────────────────────────── */

function updateResultCount(count, total) {
    const countEl = el('#result-count');
    if (countEl) {
        countEl.textContent = count > 0
            ? `${count} recipe${count !== 1 ? 's' : ''} found`
            : 'No recipes found';
    }
}

if (typeof module !== 'undefined') {
    module.exports = { showToast, showSkeletons, renderRecipeGrid, renderRecipeCard, renderModal, hideModal, renderFavoritesPanel, renderIngredientPills, updateResultCount };
}
