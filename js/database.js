// ============================================================
// RECIPE DATABASE — 25 recipes across 6+ cuisines
// Each recipe: id, name, cuisine, emoji, description,
//   ingredients[], steps[], nutrition{}, difficulty,
//   cookTime (mins), dietary[], servings, tags[]
// ============================================================

const RECIPES = [
  {
    id: 1,
    name: "Spaghetti Aglio e Olio",
    cuisine: "Italian",
    emoji: "🍝",
    description: "Classic Italian pasta with garlic, olive oil, and chili flakes for a simple yet bold flavour.",
    ingredients: ["spaghetti", "garlic", "olive oil", "red chili flakes", "parsley", "parmesan"],
    steps: [
      "Cook spaghetti in salted boiling water until al dente. Reserve 1 cup pasta water.",
      "Thinly slice 6 garlic cloves. Sauté in ½ cup olive oil over medium heat until golden (don't burn).",
      "Add red chili flakes and a ladle of pasta water to the pan. Stir vigorously.",
      "Add drained pasta to the pan. Toss well, adding more pasta water to create a silky sauce.",
      "Garnish with chopped parsley and grated parmesan. Serve immediately."
    ],
    nutrition: { calories: 520, protein: 16, carbs: 72, fat: 18, fiber: 3 },
    difficulty: "Easy",
    cookTime: 20,
    dietary: ["vegetarian"],
    servings: 2,
    tags: ["quick", "pasta", "classic"]
  },
  {
    id: 2,
    name: "Paneer Tikka Masala",
    cuisine: "Indian",
    emoji: "🥘",
    description: "Tender marinated paneer in a rich, spiced tomato-cream sauce — a global favourite.",
    ingredients: ["paneer", "yogurt", "tomato", "onion", "garlic", "ginger", "heavy cream", "butter", "cumin", "garam masala", "paprika", "coriander"],
    steps: [
      "Marinate paneer cubes in yogurt, garlic, ginger, cumin, paprika, and garam masala for at least 30 mins.",
      "Pan-sear paneer until slightly charred. Set aside.",
      "Sauté onions in butter until golden. Add garlic, ginger, and all spices. Cook 2 mins.",
      "Add blended tomatoes. Simmer 15 mins until sauce thickens.",
      "Stir in cream and add the seared paneer. Simmer 5 mins. Garnish with coriander."
    ],
    nutrition: { calories: 480, protein: 22, carbs: 18, fat: 38, fiber: 4 },
    difficulty: "Medium",
    cookTime: 40,
    dietary: ["vegetarian", "gluten-free"],
    servings: 4,
    tags: ["spicy", "curry", "protein-rich"]
  },
  {
    id: 3,
    name: "Avocado Toast with Poached Egg",
    cuisine: "American",
    emoji: "🥑",
    description: "Creamy avocado on toasted sourdough topped with a perfectly poached egg.",
    ingredients: ["bread", "avocado", "egg", "lemon", "salt", "red chili flakes", "olive oil"],
    steps: [
      "Toast bread slices until golden and crisp.",
      "Mash avocado with lemon juice, salt, and a dash of olive oil.",
      "Bring water to a gentle simmer. Add a splash of vinegar. Crack egg into a small cup and slide in. Poach 3 mins.",
      "Spread avocado on toast. Top with poached egg.",
      "Sprinkle chili flakes and a pinch of salt. Serve immediately."
    ],
    nutrition: { calories: 320, protein: 14, carbs: 28, fat: 18, fiber: 7 },
    difficulty: "Easy",
    cookTime: 15,
    dietary: ["vegetarian"],
    servings: 1,
    tags: ["breakfast", "healthy", "quick"]
  },
  {
    id: 4,
    name: "Black Bean Tacos",
    cuisine: "Mexican",
    emoji: "🌮",
    description: "Flavourful black bean tacos with fresh salsa and lime — fully vegan and ready in 20 mins.",
    ingredients: ["tortilla", "black beans", "tomato", "onion", "cilantro", "lime", "cumin", "chili powder", "avocado", "jalapeño"],
    steps: [
      "Drain and rinse black beans. Sauté with cumin and chili powder for 5 mins.",
      "Dice tomato, onion, jalapeño, and cilantro. Mix with lime juice for fresh salsa.",
      "Warm tortillas in a dry pan for 30 seconds each side.",
      "Build tacos: beans → salsa → sliced avocado.",
      "Squeeze lime juice over everything. Serve immediately."
    ],
    nutrition: { calories: 340, protein: 14, carbs: 52, fat: 8, fiber: 12 },
    difficulty: "Easy",
    cookTime: 20,
    dietary: ["vegan", "vegetarian", "dairy-free"],
    servings: 2,
    tags: ["quick", "vegan", "street-food"]
  },
  {
    id: 5,
    name: "Greek Salad",
    cuisine: "Mediterranean",
    emoji: "🥗",
    description: "Fresh cucumber, tomato, olives, and feta tossed in a herby olive oil dressing.",
    ingredients: ["cucumber", "tomato", "red onion", "olives", "feta cheese", "olive oil", "oregano", "lemon", "salt"],
    steps: [
      "Chop cucumber, tomatoes, and red onion into chunky pieces.",
      "Add olives and crumble feta cheese on top.",
      "Drizzle with olive oil. Squeeze lemon juice.",
      "Season with oregano and salt. Toss gently.",
      "Let sit 5 mins before serving to marry the flavours."
    ],
    nutrition: { calories: 220, protein: 7, carbs: 14, fat: 16, fiber: 3 },
    difficulty: "Easy",
    cookTime: 10,
    dietary: ["vegetarian", "gluten-free"],
    servings: 2,
    tags: ["salad", "healthy", "no-cook"]
  },
  {
    id: 6,
    name: "Vegetable Fried Rice",
    cuisine: "Asian",
    emoji: "🍚",
    description: "Quick wok-tossed rice with seasonal veggies, soy sauce, and sesame oil.",
    ingredients: ["rice", "egg", "carrot", "peas", "corn", "soy sauce", "sesame oil", "garlic", "ginger", "spring onion"],
    steps: [
      "Cook rice and let it cool completely (day-old rice works best).",
      "Heat oil in a wok over high heat. Scramble eggs and set aside.",
      "Add garlic and ginger. Sauté 1 min. Add carrot — cook 3 mins.",
      "Add rice. Stir-fry on high heat 4 mins until slightly crispy.",
      "Add peas, corn, soy sauce, sesame oil, and scrambled eggs. Toss. Top with spring onion."
    ],
    nutrition: { calories: 390, protein: 12, carbs: 64, fat: 9, fiber: 5 },
    difficulty: "Easy",
    cookTime: 25,
    dietary: ["vegetarian", "dairy-free"],
    servings: 3,
    tags: ["quick", "asian", "one-pan"]
  },
  {
    id: 7,
    name: "Lemon Garlic Asparagus",
    cuisine: "Mediterranean",
    emoji: "🌿",
    description: "Pan-seared asparagus with a bright lemon-garlic butter sauce. Ready in 15 mins.",
    ingredients: ["asparagus", "lemon", "garlic", "butter", "olive oil", "thyme", "salt", "pepper"],
    steps: [
      "Trim asparagus ends. Season with salt and pepper.",
      "Heat olive oil in a pan over medium heat. Sauté asparagus for 5 mins.",
      "Transfer to a plate.",
      "Add butter, garlic, and thyme to the same pan. Sauté 1 min.",
      "Pour lemon juice into the pan. Spoon sauce over asparagus. Serve."
    ],
    nutrition: { calories: 210, protein: 5, carbs: 8, fat: 18, fiber: 4 },
    difficulty: "Easy",
    cookTime: 15,
    dietary: ["vegetarian", "gluten-free", "dairy-free"],
    servings: 2,
    tags: ["seafood", "high-protein", "quick"]
  },
  {
    id: 8,
    name: "Margherita Pizza",
    cuisine: "Italian",
    emoji: "🍕",
    description: "Homemade Neapolitan-style pizza with tomato sauce, fresh mozzarella, and basil.",
    ingredients: ["flour", "yeast", "tomato", "mozzarella", "basil", "olive oil", "salt", "sugar"],
    steps: [
      "Mix flour, yeast, salt, sugar, and warm water. Knead 10 mins. Rest 1 hour.",
      "Blend tomatoes with olive oil and salt for sauce.",
      "Stretch dough into a round. Spread sauce leaving 1-inch border.",
      "Top with torn mozzarella. Bake at 250°C (480°F) for 10–12 mins until crust is golden.",
      "Top with fresh basil leaves and a drizzle of olive oil."
    ],
    nutrition: { calories: 580, protein: 22, carbs: 78, fat: 20, fiber: 4 },
    difficulty: "Medium",
    cookTime: 90,
    dietary: ["vegetarian"],
    servings: 2,
    tags: ["pizza", "baking", "classic"]
  },
  {
    id: 9,
    name: "Tofu Stir Fry",
    cuisine: "Asian",
    emoji: "🥢",
    description: "Crispy tofu cubes with colourful vegetables in a savoury hoisin sauce glaze.",
    ingredients: ["tofu", "broccoli", "bell pepper", "onion", "garlic", "soy sauce", "hoisin sauce", "sesame oil", "cornstarch", "ginger"],
    steps: [
      "Press tofu and cube. Toss with cornstarch and pan-fry until crispy. Remove from pan.",
      "Blanch broccoli in boiling water 2 mins. Drain.",
      "In the same wok, sauté garlic and ginger. Add peppers and onion — cook 3 mins.",
      "Return tofu. Add broccoli, hoisin sauce, soy sauce, and a splash of water. Toss and serve over rice."
    ],
    nutrition: { calories: 320, protein: 18, carbs: 24, fat: 16, fiber: 6 },
    difficulty: "Medium",
    cookTime: 25,
    dietary: ["vegan", "vegetarian", "dairy-free"],
    servings: 3,
    tags: ["meat", "asian", "high-protein"]
  },
  {
    id: 10,
    name: "Mushroom Risotto",
    cuisine: "Italian",
    emoji: "🍄",
    description: "Creamy arborio rice slowly cooked with mushrooms and parmesan.",
    ingredients: ["arborio rice", "mushroom", "onion", "garlic", "white wine", "butter", "parmesan", "vegetable stock", "thyme", "olive oil"],
    steps: [
      "Warm stock in a saucepan. Keep on low heat.",
      "Sauté mushrooms in butter until golden. Set aside.",
      "In the same pan sauté diced onion and garlic in olive oil until soft.",
      "Add rice and stir 2 mins. Add wine and let it absorb.",
      "Add stock one ladle at a time, stirring constantly, about 20 mins total.",
      "Stir in mushrooms, parmesan, and butter. Season. Rest 2 mins before serving."
    ],
    nutrition: { calories: 490, protein: 14, carbs: 68, fat: 18, fiber: 3 },
    difficulty: "Hard",
    cookTime: 40,
    dietary: ["vegetarian", "gluten-free"],
    servings: 4,
    tags: ["pasta", "italian", "comfort"]
  },
  {
    id: 11,
    name: "Chickpea Curry",
    cuisine: "Indian",
    emoji: "🫘",
    description: "Hearty vegan chickpea curry cooked in a spiced tomato-onion gravy.",
    ingredients: ["chickpeas", "tomato", "onion", "garlic", "ginger", "cumin", "coriander", "turmeric", "garam masala", "coconut milk", "olive oil", "cilantro"],
    steps: [
      "Sauté diced onion in oil until golden. Add garlic and ginger paste — cook 2 mins.",
      "Add cumin, coriander, turmeric, and garam masala. Toast 1 min.",
      "Add blended tomatoes. Cook 10 mins until oil separates.",
      "Add drained chickpeas and coconut milk. Simmer 15 mins.",
      "Garnish with fresh cilantro. Serve with rice or naan."
    ],
    nutrition: { calories: 360, protein: 14, carbs: 48, fat: 12, fiber: 10 },
    difficulty: "Easy",
    cookTime: 35,
    dietary: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    servings: 4,
    tags: ["vegan", "curry", "high-fiber"]
  },
  {
    id: 12,
    name: "Caesar Salad",
    cuisine: "American",
    emoji: "🥬",
    description: "Crisp romaine lettuce with vegetarian Caesar dressing, croutons, and shaved parmesan.",
    ingredients: ["romaine lettuce", "parmesan", "bread", "egg", "garlic", "lemon", "olive oil", "worcestershire sauce", "black pepper"],
    steps: [
      "Cube bread and toast in olive oil and garlic in the oven at 180°C for 10 mins.",
      "Whisk together egg yolk, garlic, lemon juice, worcestershire sauce, and olive oil for dressing.",
      "Tear romaine leaves into a bowl.",
      "Pour dressing over lettuce and toss well.",
      "Top with croutons and shaved parmesan. Freshly crack black pepper."
    ],
    nutrition: { calories: 310, protein: 12, carbs: 22, fat: 20, fiber: 3 },
    difficulty: "Easy",
    cookTime: 20,
    dietary: ["vegetarian"],
    servings: 2,
    tags: ["salad", "classic", "quick"]
  },
  {
    id: 13,
    name: "Banana Pancakes",
    cuisine: "American",
    emoji: "🥞",
    description: "Fluffy 3-ingredient banana pancakes — naturally sweet and gluten-free.",
    ingredients: ["banana", "egg", "oats", "vanilla extract", "cinnamon", "honey"],
    steps: [
      "Mash 2 ripe bananas until smooth.",
      "Mix in 2 eggs and a splash of vanilla extract.",
      "Add oats and cinnamon. Let stand 5 mins.",
      "Cook small pancakes on a lightly oiled non-stick pan over medium heat, 2 mins per side.",
      "Drizzle with honey and serve with sliced banana."
    ],
    nutrition: { calories: 280, protein: 10, carbs: 44, fat: 6, fiber: 4 },
    difficulty: "Easy",
    cookTime: 15,
    dietary: ["vegetarian", "gluten-free", "dairy-free"],
    servings: 2,
    tags: ["breakfast", "sweet", "quick"]
  },
  {
    id: 14,
    name: "Vegan Tom Yum Soup",
    cuisine: "Asian",
    emoji: "🥣",
    description: "Tangy and spicy Thai soup with tofu, lemongrass, and mushrooms.",
    ingredients: ["tofu", "mushroom", "lemongrass", "kaffir lime leaves", "galangal", "tomato", "soy sauce", "lime", "chili", "coconut milk"],
    steps: [
      "Boil water with lemongrass, galangal, and kaffir lime leaves for 10 mins.",
      "Add mushrooms and tomatoes — cook 5 mins.",
      "Add cubed tofu and cook for 3 mins.",
      "Season with soy sauce, lime juice, and chilies.",
      "Stir in coconut milk for creaminess. Serve immediately."
    ],
    nutrition: { calories: 240, protein: 12, carbs: 14, fat: 10, fiber: 2 },
    difficulty: "Medium",
    cookTime: 25,
    dietary: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    servings: 3,
    tags: ["soup", "spicy", "thai"]
  },
  {
    id: 15,
    name: "Shakshuka",
    cuisine: "Mediterranean",
    emoji: "🍳",
    description: "Eggs poached in a rich, spiced tomato and pepper sauce — a Middle Eastern brunch classic.",
    ingredients: ["egg", "tomato", "bell pepper", "onion", "garlic", "cumin", "paprika", "feta cheese", "olive oil", "cilantro"],
    steps: [
      "Sauté diced onion and bell pepper in olive oil until soft.",
      "Add garlic, cumin, and paprika. Cook 2 mins.",
      "Add crushed tomatoes. Simmer 15 mins until thickened.",
      "Make wells in the sauce and crack in eggs. Cover and cook 5–8 mins until whites are set.",
      "Crumble feta on top. Garnish with cilantro. Serve with bread."
    ],
    nutrition: { calories: 290, protein: 16, carbs: 18, fat: 18, fiber: 5 },
    difficulty: "Easy",
    cookTime: 30,
    dietary: ["vegetarian", "gluten-free"],
    servings: 2,
    tags: ["breakfast", "brunch", "one-pan"]
  },
  {
    id: 16,
    name: "Butter Paneer",
    cuisine: "Indian",
    emoji: "🍲",
    description: "Melt-in-your-mouth paneer in a velvety tomato-butter-cream sauce.",
    ingredients: ["paneer", "butter", "tomato", "onion", "garlic", "ginger", "heavy cream", "cashews", "garam masala", "turmeric", "paprika"],
    steps: [
      "Pan-fry paneer cubes until golden. Set aside.",
      "Blend together sautéed onion, tomato, cashews, garlic, and ginger.",
      "Cook the blended sauce in butter for 10 mins.",
      "Add garam masala and cream. Simmer 5 mins.",
      "Add paneer cubes. Simmer 10 mins. Finish with a little butter and cream."
    ],
    nutrition: { calories: 520, protein: 20, carbs: 16, fat: 36, fiber: 3 },
    difficulty: "Medium",
    cookTime: 40,
    dietary: ["vegetarian", "gluten-free"],
    servings: 4,
    tags: ["curry", "indian", "rich"]
  },
  {
    id: 17,
    name: "Quinoa Buddha Bowl",
    cuisine: "American",
    emoji: "🫙",
    description: "Nourishing bowl with quinoa, roasted veggies, chickpeas, and tahini dressing.",
    ingredients: ["quinoa", "chickpeas", "sweet potato", "broccoli", "kale", "tahini", "lemon", "garlic", "olive oil", "cumin"],
    steps: [
      "Cook quinoa according to package directions.",
      "Cube sweet potato and broccoli. Toss with olive oil and cumin. Roast at 200°C for 25 mins.",
      "Roast drained chickpeas alongside for extra crunch.",
      "Whisk tahini, lemon juice, garlic, and water for dressing.",
      "Assemble bowl: quinoa → roasted veggies → chickpeas → kale → drizzle dressing."
    ],
    nutrition: { calories: 420, protein: 18, carbs: 58, fat: 14, fiber: 12 },
    difficulty: "Easy",
    cookTime: 35,
    dietary: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    servings: 2,
    tags: ["healthy", "vegan", "bowl"]
  },
  {
    id: 18,
    name: "Black Bean Burger",
    cuisine: "American",
    emoji: "🍔",
    description: "Hearty black bean burger with all the classic toppings on a brioche bun.",
    ingredients: ["black beans", "burger bun", "lettuce", "tomato", "onion", "cheese", "pickles", "ketchup", "mustard", "mayonnaise", "cumin", "salt"],
    steps: [
      "Mash black beans with cumin and salt. Form into firm patties.",
      "Heat a cast iron skillet. Pan-fry patties 4 mins per side.",
      "Add cheese slice and cover with a lid for 30 seconds to melt.",
      "Toast buns in the same pan.",
      "Build burger: sauce → lettuce → tomato → patty → pickles → onion."
    ],
    nutrition: { calories: 480, protein: 18, carbs: 54, fat: 20, fiber: 8 },
    difficulty: "Easy",
    cookTime: 20,
    dietary: ["vegetarian"],
    servings: 2,
    tags: ["meat", "burger", "american"]
  },
  {
    id: 19,
    name: "Vegetable Soup",
    cuisine: "American",
    emoji: "🥣",
    description: "Warming, nourishing soup packed with seasonal vegetables and herbs.",
    ingredients: ["carrot", "celery", "onion", "potato", "tomato", "garlic", "vegetable stock", "thyme", "bay leaf", "olive oil", "salt", "pepper"],
    steps: [
      "Dice all vegetables into similar-sized pieces.",
      "Sauté onion, carrot, and celery in olive oil for 5 mins.",
      "Add garlic, thyme, and bay leaf. Cook 1 min.",
      "Add potato, tomato, and vegetable stock. Bring to boil.",
      "Simmer 25 mins until vegetables are tender. Season and serve."
    ],
    nutrition: { calories: 190, protein: 5, carbs: 34, fat: 5, fiber: 6 },
    difficulty: "Easy",
    cookTime: 40,
    dietary: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    servings: 4,
    tags: ["soup", "healthy", "comfort"]
  },
  {
    id: 20,
    name: "Tofu Pad Thai",
    cuisine: "Asian",
    emoji: "🍜",
    description: "Authentic Pad Thai with rice noodles, tofu, bean sprouts, and peanuts.",
    ingredients: ["rice noodles", "tofu", "egg", "bean sprouts", "peanuts", "green onion", "soy sauce", "tamarind paste", "palm sugar", "garlic", "lime"],
    steps: [
      "Soak rice noodles in warm water for 20 mins. Drain.",
      "Stir-fry cubed tofu and garlic in hot oil until golden. Push to side.",
      "Scramble eggs in the same pan.",
      "Add noodles, soy sauce, tamarind, and sugar. Toss everything together.",
      "Add bean sprouts and green onion. Plate and top with crushed peanuts and lime."
    ],
    nutrition: { calories: 470, protein: 18, carbs: 56, fat: 14, fiber: 3 },
    difficulty: "Medium",
    cookTime: 30,
    dietary: ["vegetarian", "gluten-free", "dairy-free"],
    servings: 2,
    tags: ["thai", "noodles", "seafood"]
  },
  {
    id: 21,
    name: "Hummus & Pita",
    cuisine: "Mediterranean",
    emoji: "🫓",
    description: "Ultra-smooth homemade hummus with olive oil, paprika, and warm pita bread.",
    ingredients: ["chickpeas", "tahini", "lemon", "garlic", "olive oil", "cumin", "paprika", "pita bread", "salt"],
    steps: [
      "Drain chickpeas and peel each one for ultra-smooth hummus (optional but worth it).",
      "Blend chickpeas, tahini, lemon juice, garlic, and cumin until very smooth.",
      "Stream in olive oil while blending. Add ice water to achieve creaminess.",
      "Spread in a bowl, drizzle olive oil, sprinkle paprika.",
      "Warm pita in an oven or pan. Serve alongside."
    ],
    nutrition: { calories: 290, protein: 9, carbs: 34, fat: 14, fiber: 8 },
    difficulty: "Easy",
    cookTime: 15,
    dietary: ["vegan", "vegetarian", "dairy-free"],
    servings: 4,
    tags: ["dip", "vegan", "starter"]
  },
  {
    id: 22,
    name: "Caprese Salad",
    cuisine: "Italian",
    emoji: "🍅",
    description: "Simple and elegant salad of fresh mozzarella, heirloom tomatoes, and basil.",
    ingredients: ["tomato", "mozzarella", "basil", "olive oil", "balsamic vinegar", "salt", "black pepper"],
    steps: [
      "Slice tomatoes and mozzarella into equal, even rounds.",
      "Arrange alternating slices of tomato and mozzarella on a plate.",
      "Tuck basil leaves in between the slices.",
      "Drizzle with olive oil and balsamic glaze.",
      "Season with salt and freshly ground black pepper. Serve immediately."
    ],
    nutrition: { calories: 260, protein: 14, carbs: 8, fat: 18, fiber: 2 },
    difficulty: "Easy",
    cookTime: 10,
    dietary: ["vegetarian", "gluten-free"],
    servings: 2,
    tags: ["salad", "no-cook", "italian"]
  },
  {
    id: 23,
    name: "Lentil Dal",
    cuisine: "Indian",
    emoji: "🍵",
    description: "Comforting Indian red lentil dal with tempered spices and a squeeze of lemon.",
    ingredients: ["red lentils", "onion", "tomato", "garlic", "ginger", "turmeric", "cumin", "coriander", "chili", "butter", "lemon", "cilantro"],
    steps: [
      "Rinse lentils well. Boil with turmeric and water until mushy, about 20 mins.",
      "In a separate pan, heat butter. Add cumin seeds until they splutter.",
      "Add finely diced onion — sauté until golden. Add garlic, ginger, and chili.",
      "Add tomatoes. Cook until oil separates.",
      "Pour tempering into lentils. Add lemon juice and cilantro. Serve with rice."
    ],
    nutrition: { calories: 310, protein: 18, carbs: 46, fat: 6, fiber: 14 },
    difficulty: "Easy",
    cookTime: 30,
    dietary: ["vegetarian", "gluten-free"],
    servings: 4,
    tags: ["vegan", "high-fiber", "indian"]
  },
  {
    id: 24,
    name: "Chocolate Lava Cake",
    cuisine: "American",
    emoji: "🍫",
    description: "Decadent chocolate lava cake with a gooey molten centre. Only 5 ingredients.",
    ingredients: ["dark chocolate", "butter", "egg", "sugar", "flour"],
    steps: [
      "Melt dark chocolate and butter together. Let cool slightly.",
      "Whisk eggs and sugar until pale and thick.",
      "Fold chocolate mixture into eggs. Sift in flour and fold gently.",
      "Butter and flour ramekins. Pour in batter.",
      "Bake at 210°C for exactly 12 mins. Run a knife around edge and invert on plate. Serve immediately."
    ],
    nutrition: { calories: 480, protein: 8, carbs: 48, fat: 30, fiber: 2 },
    difficulty: "Medium",
    cookTime: 25,
    dietary: ["vegetarian"],
    servings: 2,
    tags: ["dessert", "sweet", "chocolate"]
  },
  {
    id: 25,
    name: "Kimchi Fried Rice",
    cuisine: "Asian",
    emoji: "🌶️",
    description: "Spicy, tangy kimchi fried rice with a fried egg on top — the perfect quick meal.",
    ingredients: ["rice", "kimchi", "egg", "soy sauce", "sesame oil", "garlic", "spring onion", "butter", "gochujang"],
    steps: [
      "Use day-old cold rice for best results.",
      "Sauté kimchi in butter for 3 mins until caramelized.",
      "Add minced garlic and gochujang. Cook 1 min.",
      "Add rice. Stir-fry on high heat. Add soy sauce and sesame oil.",
      "Fry an egg sunny-side-up in a separate pan. Serve on top of rice with spring onion."
    ],
    nutrition: { calories: 410, protein: 14, carbs: 58, fat: 14, fiber: 4 },
    difficulty: "Easy",
    cookTime: 20,
    dietary: ["dairy-free"],
    servings: 2,
    tags: ["korean", "spicy", "quick"]
  }
];

// Substitution map for ingredient flexibility
const SUBSTITUTIONS = {
  "butter": ["margarine", "coconut oil", "olive oil"],
  "milk": ["oat milk", "almond milk", "soy milk", "coconut milk"],
  "egg": ["flax egg", "chia egg", "applesauce"],
  "heavy cream": ["coconut cream", "cashew cream"],
  "parmesan": ["nutritional yeast", "pecorino"],
  "chicken": ["tofu", "tempeh", "chickpeas"],
  "beef": ["mushrooms", "lentils", "jackfruit"],
  "shrimp": ["tofu", "mushrooms"],
  "flour": ["almond flour", "oat flour", "rice flour"],
  "soy sauce": ["tamari", "coconut aminos"],
  "yogurt": ["coconut yogurt", "cashew yogurt"],
  "cheese": ["vegan cheese", "nutritional yeast"],
  "mozzarella": ["vegan mozzarella"],
  "feta cheese": ["vegan feta"],
  "bread": ["gluten-free bread", "rice cakes"],
  "tortilla": ["corn tortilla", "lettuce wrap"],
  "pita bread": ["gluten-free pita", "rice crackers"],
  "pasta": ["zucchini noodles", "rice pasta", "gluten-free pasta"],
  "spaghetti": ["zucchini noodles", "rice pasta"],
  "arborio rice": ["cauliflower rice", "regular rice"],
  "rice": ["cauliflower rice", "quinoa"]
};

// Export for use
if (typeof module !== 'undefined') {
  module.exports = { RECIPES, SUBSTITUTIONS };
}
