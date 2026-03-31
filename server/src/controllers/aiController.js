const User = require('../models/User');

// Mock Database of Healthy Indian Meals
const MOCK_MEALS = {
  breakfast: [
    { mealName: "Poha with Sprouts", calories: 250, description: "Light and protein-rich, perfect for starting your day with fiber." },
    { mealName: "Oats Idli", calories: 180, description: "A low-calorie twist on the classic idli using fiber-rich oats." },
    { mealName: "Vegetable Upma", calories: 220, description: "Semolina cooked with colorful veggies for a balanced morning start." }
  ],
  lunch: [
    { mealName: "Moong Dal & Palak with Brown Rice", calories: 450, description: "High protein dal with spinach for iron, paired with complex carbs." },
    { mealName: "Grilled Paneer Salad", calories: 350, description: "Lean protein with fresh garden greens and a light lemon dressing." },
    { mealName: "Ragi Roti with Mixed Veg Curry", calories: 400, description: "Calcium-rich finger millet bread with a nutrient-dense vegetable stew." }
  ],
  dinner: [
    { mealName: "Chicken Shish Taouk (Indian Style)", calories: 380, description: "Skinless chicken breast grilled with mild spices and served with bell peppers." },
    { mealName: "Masoor Dal Tadka with 1 Phulka", calories: 320, description: "A light yet satisfying red lentil soup with a whole wheat flatbread." },
    { mealName: "Tofu & Broccoli Stir Fry", calories: 280, description: "A high-protein vegan option with essential micronutrients." }
  ],
  snacks: [
    { mealName: "Roasted Makhana (Fox Nuts)", calories: 120, description: "Crunchy, low-calorie snack high in antioxidants." },
    { mealName: "Sprouted Moong Salad", calories: 150, description: "Fresh sprouts with onions and tomatoes for a crunchy, healthy bite." },
    { mealName: "Greek Yogurt with Honey & Almonds", calories: 180, description: "Probiotic-rich snack with healthy fats and minimal sugar." }
  ]
};

// @desc    Suggest a meal based on user profile and current intake
// @route   POST /api/ai/suggest-meal
// @access  Private
exports.suggestMeal = async (req, res) => {
  const { mealType } = req.body;

  try {
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const suggestions = MOCK_MEALS[mealType] || MOCK_MEALS.snacks;
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

    res.json(randomSuggestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
