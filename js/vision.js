// ============================================================
// VISION & IMAGE RECOGNITION MODULE
// Attempts Google Cloud Vision API, falls back to mock detection
// ============================================================

const VISION_API_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

// Common food labels Vision API returns, mapped to ingredient names
const VISION_FOOD_LABELS = {
    // Vegetables
    'tomato': 'tomato', 'carrot': 'carrot', 'broccoli': 'broccoli',
    'spinach': 'spinach', 'onion': 'onion', 'garlic': 'garlic',
    'potato': 'potato', 'cucumber': 'cucumber', 'pepper': 'bell pepper',
    'capsicum': 'bell pepper', 'mushroom': 'mushroom', 'celery': 'celery',
    'zucchini': 'zucchini', 'eggplant': 'eggplant', 'kale': 'kale',
    'lettuce': 'romaine lettuce', 'cabbage': 'cabbage', 'corn': 'corn',
    'pea': 'peas', 'bean': 'black beans', 'lemon': 'lemon', 'lime': 'lime',
    // Fruits
    'banana': 'banana', 'apple': 'apple', 'avocado': 'avocado',
    'strawberry': 'strawberry', 'blueberry': 'blueberry',
    // Proteins
    'chicken': 'chicken breast', 'beef': 'ground beef', 'salmon': 'salmon',
    'shrimp': 'shrimp', 'egg': 'egg', 'tofu': 'tofu',
    // Dairy
    'cheese': 'cheese', 'milk': 'milk', 'butter': 'butter', 'cream': 'heavy cream',
    'yogurt': 'yogurt',
    // Grains
    'bread': 'bread', 'rice': 'rice', 'pasta': 'spaghetti', 'noodle': 'rice noodles',
    'flour': 'flour', 'oat': 'oats',
    // Pantry
    'olive oil': 'olive oil', 'soy sauce': 'soy sauce',
};

/**
 * Convert File object to base64
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Call Google Cloud Vision API to detect food ingredients in image
 * @param {File} imageFile
 * @param {string} apiKey - Google Cloud Vision API Key
 * @returns {string[]} list of detected ingredient names
 */
async function detectIngredientsFromImage(imageFile, apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        return detectIngredientsMock(imageFile);
    }

    try {
        const base64 = await fileToBase64(imageFile);
        const body = {
            requests: [{
                image: { content: base64 },
                features: [
                    { type: 'LABEL_DETECTION', maxResults: 20 },
                    { type: 'OBJECT_LOCALIZATION', maxResults: 20 }
                ]
            }]
        };

        const response = await fetch(`${VISION_API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.warn('Vision API error:', response.status);
            return detectIngredientsMock(imageFile);
        }

        const data = await response.json();
        const labels = [];

        // Extract from label detection
        if (data.responses?.[0]?.labelAnnotations) {
            data.responses[0].labelAnnotations.forEach(label => {
                if (label.score > 0.6) labels.push(label.description.toLowerCase());
            });
        }

        // Extract from object localisation
        if (data.responses?.[0]?.localizedObjectAnnotations) {
            data.responses[0].localizedObjectAnnotations.forEach(obj => {
                if (obj.score > 0.6) labels.push(obj.name.toLowerCase());
            });
        }

        return mapLabelsToIngredients(labels);
    } catch (err) {
        console.error('Vision API call failed:', err);
        return detectIngredientsMock(imageFile);
    }
}

/**
 * Map raw Vision API labels to recipe ingredient names
 */
function mapLabelsToIngredients(labels) {
    const ingredients = new Set();
    labels.forEach(label => {
        for (const [keyword, ing] of Object.entries(VISION_FOOD_LABELS)) {
            if (label.includes(keyword)) {
                ingredients.add(ing);
                break;
            }
        }
    });
    return [...ingredients];
}

/**
 * Smart mock detection — returns a plausible set of common ingredients
 * Used as fallback when no API key is provided
 */
async function detectIngredientsMock(imageFile) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return common kitchen ingredients as demo
    const commonSets = [
        ['tomato', 'onion', 'garlic', 'bell pepper'],
        ['chicken breast', 'garlic', 'lemon', 'olive oil'],
        ['egg', 'butter', 'milk', 'flour'],
        ['carrot', 'potato', 'celery', 'onion'],
        ['avocado', 'tomato', 'lime', 'cilantro'],
        ['mushroom', 'garlic', 'olive oil', 'thyme'],
        ['salmon', 'lemon', 'garlic', 'butter'],
        ['broccoli', 'garlic', 'soy sauce', 'sesame oil']
    ];

    // Pseudo-random based on file name/size for consistency
    const idx = (imageFile.size || 0) % commonSets.length;
    return commonSets[idx];
}

if (typeof module !== 'undefined') {
    module.exports = { detectIngredientsFromImage };
}
