# Smart Recipe Generator 🍽️

A premium, production-quality Single-Page Application (SPA) that suggests recipes based on your available ingredients — entered as text or detected from a photo using AI.

**Live URL**: _TBD after Netlify deployment_

---

## ✨ Features

| Feature | Details |
|---|---|
| **Ingredient Input** | Type ingredients manually or use quick-add chips |
| **AI Image Recognition** | Upload a photo → Google Vision API detects ingredients |
| **Recipe Matching** | Jaccard-similarity scoring across 25+ recipes |
| **Substitution Suggestions** | Suggests replacements for missing ingredients |
| **Dietary Filters** | Vegetarian, Vegan, Gluten-Free, Dairy-Free |
| **Difficulty & Time Filters** | Filter by Easy/Medium/Hard and max cook time |
| **Serving Adjuster** | Scale ingredient quantities for any serving size |
| **Nutritional Info** | Calories, protein, carbs, fat, fiber per recipe |
| **Favorites** | Save recipes to localStorage with ❤️ |
| **Star Ratings** | Rate 1–5 stars, persisted in localStorage |
| **Personalised Suggestions** | "For You" tab based on your ratings & favorites |
| **Loading States** | Skeleton cards during search |
| **Mobile Responsive** | Works beautifully on all screen sizes |

---

## 🧠 Technical Approach

### Recipe Matching Algorithm (`js/matching.js`)

Recipes are scored against the user's ingredient list using a **modified Jaccard similarity**:

```
Base Score  = (matched ingredients / total recipe ingredients) × 100
Sub Bonus   = (substitutable ingredients / total) × 60
Coverage+   = +10 pts if 80%+ of ingredients covered
Final Score = min(Base + Sub + Coverage, 100)
```

Filters (dietary, difficulty, cook time) are applied **after** scoring. Results are sorted by score descending by default.

### Ingredient Substitution Engine (`js/matching.js`)

A curated substitution map (e.g., `butter → olive oil`, `milk → oat milk`) boosts recipe scores when users have alternatives to required ingredients. The engine checks both directions (if user has a substitute for a required ingredient, or if the recipe lists a substitute the user has).

### Image Recognition (`js/vision.js`)

1. User uploads an image (drag-and-drop or file picker)
2. Image is base64-encoded in-browser
3. If a Google Cloud Vision API key is provided → `LABEL_DETECTION` + `OBJECT_LOCALIZATION` requests are made
4. Returned labels are mapped to known ingredient names via a food keyword dictionary
5. **Fallback**: If no API key is provided, a smart demo mode returns plausible ingredient sets (consistent per file size)

### Data Persistence (`js/storage.js`)

All user data is stored in **localStorage** — no backend required:
- `srg_favorites`: array of saved recipe IDs
- `srg_ratings`: `{recipeId: 1-5}` rating map
- `srg_preferences`: dietary preferences + API key
- `srg_history`: last 10 ingredient search sets

---

## 📂 Project Structure

```
Smart_recipe_generator/
├── index.html          # SPA shell with semantic HTML5 + ARIA
├── css/
│   └── styles.css      # Full design system (dark mode, glassmorphism)
├── js/
│   ├── database.js     # 25 recipes across 6 cuisines + substitutions
│   ├── matching.js     # Ingredient scoring + filtering + serving adjustor
│   ├── vision.js       # Google Vision API + mock fallback
│   ├── storage.js      # localStorage: favorites, ratings, prefs
│   ├── ui.js           # All DOM rendering: cards, modal, toasts, skeletons
│   └── app.js          # Main orchestrator + event handlers
└── README.md
```

---

## 🚀 Deployment (Netlify)

1. Push project to a GitHub repository
2. Go to [Netlify](https://app.netlify.com) → "Add new site" → "Import from Git"
3. Select your repo, leave build command empty (static site)
4. Set **Publish directory** to `/` (root)
5. Click **Deploy** — live in ~30 seconds ✅

No build step, no environment variables required.

---

## 🍳 Recipe Database

25 recipes spanning:

| Cuisine | Examples |
|---|---|
| 🇮🇹 Italian | Spaghetti Aglio e Olio, Margherita Pizza, Mushroom Risotto, Caprese Salad |
| 🇮🇳 Indian | Chicken Tikka Masala, Butter Chicken, Chickpea Curry, Lentil Dal |
| 🇲🇽 Mexican | Black Bean Tacos |
| 🌍 Mediterranean | Greek Salad, Lemon Garlic Salmon, Shakshuka, Hummus & Pita |
| 🌏 Asian | Vegetable Fried Rice, Beef Stir Fry, Tom Yum Soup, Shrimp Pad Thai, Kimchi Fried Rice |
| 🇺🇸 American | Avocado Toast, Caesar Salad, Banana Pancakes, Buddha Bowl, Classic Burger, Vegetable Soup, Chocolate Lava Cake |

Each recipe includes: ingredients list, step-by-step instructions, nutritional info (calories/protein/carbs/fat/fiber), difficulty level, cook time, and dietary tags.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup with ARIA accessibility
- **CSS3** — Custom properties, CSS Grid, Flexbox, animations
- **Vanilla JavaScript** — ES6+, Modules pattern, async/await
- **Google Fonts** — Inter + Poppins
- **Google Cloud Vision API** — Image ingredient recognition (free tier)
- **LocalStorage** — Client-side data persistence
- **Netlify** — Static site hosting (free tier)
