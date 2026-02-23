// ============================================================
// LOCAL STORAGE MODULE
// Handles: favorites, ratings, dietary preferences, history
// ============================================================

const KEYS = {
    FAVORITES: 'srg_favorites',
    RATINGS: 'srg_ratings',
    PREFS: 'srg_preferences',
    HISTORY: 'srg_history'
};

// ---- Favorites ----
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(KEYS.FAVORITES)) || [];
    } catch { return []; }
}

function addFavorite(recipeId) {
    const favs = getFavorites();
    if (!favs.includes(recipeId)) {
        favs.push(recipeId);
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
    }
}

function removeFavorite(recipeId) {
    const favs = getFavorites().filter(id => id !== recipeId);
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
}

function isFavorite(recipeId) {
    return getFavorites().includes(recipeId);
}

function toggleFavorite(recipeId) {
    if (isFavorite(recipeId)) {
        removeFavorite(recipeId);
        return false;
    } else {
        addFavorite(recipeId);
        return true;
    }
}

// ---- Ratings ----
function getRatings() {
    try {
        return JSON.parse(localStorage.getItem(KEYS.RATINGS)) || {};
    } catch { return {}; }
}

function setRating(recipeId, rating) {
    const ratings = getRatings();
    ratings[recipeId] = rating;
    localStorage.setItem(KEYS.RATINGS, JSON.stringify(ratings));
}

function getRating(recipeId) {
    return getRatings()[recipeId] || 0;
}

// ---- Dietary Preferences ----
function getPreferences() {
    try {
        return JSON.parse(localStorage.getItem(KEYS.PREFS)) || { dietary: [], apiKey: '' };
    } catch { return { dietary: [], apiKey: '' }; }
}

function savePreferences(prefs) {
    localStorage.setItem(KEYS.PREFS, JSON.stringify(prefs));
}

// ---- Search History ----
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(KEYS.HISTORY)) || [];
    } catch { return []; }
}

function addToHistory(ingredients) {
    if (!ingredients || ingredients.length === 0) return;
    let history = getHistory();
    const entry = { ingredients, timestamp: Date.now() };
    history.unshift(entry);
    history = history.slice(0, 10); // Keep last 10
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

// ---- Smart Suggestions ----
/**
 * Generate "Suggested for You" recipe IDs based on:
 * - High rated recipes (4-5 stars) → same cuisine / dietary tags
 * - Saved favorites
 */
function getSuggestedRecipeIds(recipes) {
    const ratings = getRatings();
    const favs = getFavorites();

    // High rated cuisines
    const highRatedCuisines = new Set();
    const highRatedDietary = new Set();

    Object.entries(ratings).forEach(([id, rating]) => {
        if (rating >= 4) {
            const recipe = recipes.find(r => r.id === parseInt(id));
            if (recipe) {
                highRatedCuisines.add(recipe.cuisine);
                recipe.dietary.forEach(d => highRatedDietary.add(d));
            }
        }
    });

    // Score recipes for suggestion
    const scored = recipes.map(recipe => {
        let score = 0;
        if (favs.includes(recipe.id)) score += 10;
        if (highRatedCuisines.has(recipe.cuisine)) score += 5;
        recipe.dietary.forEach(d => { if (highRatedDietary.has(d)) score += 2; });
        const userRating = ratings[recipe.id] || 0;
        score += userRating * 2;
        return { id: recipe.id, score };
    });

    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(s => s.id);
}

if (typeof module !== 'undefined') {
    module.exports = { getFavorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, getRatings, setRating, getRating, getPreferences, savePreferences, getHistory, addToHistory, getSuggestedRecipeIds };
}
