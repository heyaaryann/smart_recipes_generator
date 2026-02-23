// ============================================================
// RECIPE MATCHING ENGINE
// - Score each recipe against user ingredients
// - Apply substitution bonuses
// - Filter by dietary, difficulty, cook time
// ============================================================

/**
 * Normalise an ingredient string for comparison
 */
function normalise(str) {
    return str.toLowerCase().trim()
        .replace(/s$/, '') // simple singularisation
        .replace(/\s+/g, ' ');
}

/**
 * Check if a recipe ingredient is matched by the user's ingredient list
 * (allowing partial word matches)
 */
function ingredientMatches(recipeIngredient, userIngredients) {
    const norm = normalise(recipeIngredient);
    return userIngredients.some(ui => {
        const normUi = normalise(ui);
        return norm.includes(normUi) || normUi.includes(norm);
    });
}

/**
 * Check if a substitution can cover a missing ingredient
 */
function substitutionCovers(recipeIngredient, userIngredients, substitutionMap) {
    const norm = normalise(recipeIngredient);
    for (const [original, subs] of Object.entries(substitutionMap)) {
        if (normalise(original) === norm || norm.includes(normalise(original))) {
            // Check if user has any substitute
            if (subs.some(sub => ingredientMatches(sub, userIngredients))) {
                return true;
            }
        }
        // also check if recipe ingredient IS a substitute
        if (subs.some(sub => normalise(sub) === norm || norm.includes(normalise(sub)))) {
            if (ingredientMatches(original, userIngredients)) return true;
        }
    }
    return false;
}

/**
 * Score a single recipe against user ingredients
 * Returns { score (0-100), matched, substituted, missing, matchedList, missingList, subList }
 */
function scoreRecipe(recipe, userIngredients, substitutionMap) {
    const total = recipe.ingredients.length;
    let matched = 0;
    let substituted = 0;
    const matchedList = [];
    const subList = [];
    const missingList = [];

    recipe.ingredients.forEach(ing => {
        if (ingredientMatches(ing, userIngredients)) {
            matched++;
            matchedList.push(ing);
        } else if (substitutionCovers(ing, userIngredients, substitutionMap)) {
            substituted++;
            subList.push(ing);
        } else {
            missingList.push(ing);
        }
    });

    // Base score: matched ingredients / total
    const baseScore = (matched / total) * 100;
    // Substitute bonus: each substituted counts 60%
    const subBonus = (substituted / total) * 60;
    // Bonus for high coverage
    const coverageBonus = (matched + substituted) / total >= 0.8 ? 10 : 0;

    const raw = baseScore + subBonus + coverageBonus;
    const score = Math.min(Math.round(raw), 100);

    return { score, matched, substituted, missing: missingList.length, matchedList, missingList, subList };
}

/**
 * Main matching function
 * @param {string[]} userIngredients - list of ingredient strings from user
 * @param {Object} filters - { dietary: string[], difficulty: string, maxCookTime: number, serving: number }
 * @param {Object[]} recipes - full recipe database
 * @param {Object} substitutions - substitution map
 * @returns Sorted, filtered recipe results with scores
 */
function matchRecipes(userIngredients, filters = {}, recipes = [], substitutions = {}) {
    if (!userIngredients || userIngredients.length === 0) {
        // No ingredients: return all recipes sorted by popularity (rating-neutral)
        return recipes.map(r => ({
            ...r,
            scoreData: { score: 0, matched: 0, substituted: 0, missing: r.ingredients.length, matchedList: [], missingList: r.ingredients, subList: [] }
        }));
    }

    let results = recipes.map(recipe => {
        const scoreData = scoreRecipe(recipe, userIngredients, substitutions);
        return { ...recipe, scoreData };
    });

    // Filter: only show recipes with at least 1 matching ingredient
    results = results.filter(r => r.scoreData.score > 0);

    // Apply dietary filter
    if (filters.dietary && filters.dietary.length > 0) {
        results = results.filter(r =>
            filters.dietary.every(d => r.dietary.includes(d))
        );
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
        results = results.filter(r => r.difficulty === filters.difficulty);
    }

    // Apply cook time filter
    if (filters.maxCookTime && filters.maxCookTime > 0) {
        results = results.filter(r => r.cookTime <= filters.maxCookTime);
    }

    // Sort by score descending
    results.sort((a, b) => b.scoreData.score - a.scoreData.score);

    return results;
}

/**
 * Get substitution suggestions for a recipe given user ingredients
 */
function getSubstitutionSuggestions(recipe, userIngredients, substitutionMap) {
    const suggestions = [];
    recipe.ingredients.forEach(ing => {
        if (!ingredientMatches(ing, userIngredients)) {
            const norm = normalise(ing);
            for (const [original, subs] of Object.entries(substitutionMap)) {
                if (normalise(original) === norm || norm.includes(normalise(original))) {
                    suggestions.push({ ingredient: ing, substitutes: subs });
                    break;
                }
            }
        }
    });
    return suggestions;
}

/**
 * Adjust ingredient quantities for serving size
 */
function adjustForServings(recipe, newServings) {
    const ratio = newServings / recipe.servings;
    // return formatted ingredient list with scaled amounts
    // Since we store ingredient names (not quantities), we reference the ratio for display
    return {
        ratio,
        nutrition: {
            calories: Math.round(recipe.nutrition.calories * ratio),
            protein: Math.round(recipe.nutrition.protein * ratio),
            carbs: Math.round(recipe.nutrition.carbs * ratio),
            fat: Math.round(recipe.nutrition.fat * ratio),
            fiber: Math.round(recipe.nutrition.fiber * ratio)
        }
    };
}

if (typeof module !== 'undefined') {
    module.exports = { matchRecipes, scoreRecipe, getSubstitutionSuggestions, adjustForServings };
}
