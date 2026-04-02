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

// @desc    Get current weekly plan
// @route   GET /api/ai/weekly-plan
// @access  Private
exports.getWeeklyPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.metrics || !user.metrics.weeklyDietPlan) {
      return res.json(null);
    }
    res.json(user.metrics.weeklyDietPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Generate new weekly plan based on profile
// @route   POST /api/ai/weekly-plan
// @access  Private
exports.generateWeeklyPlan = async (req, res) => {
  try {
    // Artificial 2-second delay to mimic AI thinking
    await new Promise(resolve => setTimeout(resolve, 2000));
    const user = await User.findById(req.user.id);

    const plan = [];
    
    // Pick daily variations randomly from mock database safely ensuring full week 
    for(let i=1; i<=7; i++) {
        const breakFastItem = MOCK_MEALS.breakfast[Math.floor(Math.random() * MOCK_MEALS.breakfast.length)];
        const lunchItem = MOCK_MEALS.lunch[Math.floor(Math.random() * MOCK_MEALS.lunch.length)];
        const dinnerItem = MOCK_MEALS.dinner[Math.floor(Math.random() * MOCK_MEALS.dinner.length)];
        const snackItem = MOCK_MEALS.snacks[Math.floor(Math.random() * MOCK_MEALS.snacks.length)];
        
        const totalCal = breakFastItem.calories + lunchItem.calories + dinnerItem.calories + snackItem.calories;

        plan.push({
            day: i,
            totalCaloriesExpected: totalCal,
            meals: {
                breakfast: breakFastItem,
                lunch: lunchItem,
                dinner: dinnerItem,
                snacks: snackItem
            }
        });
    }

    if (!user.metrics) user.metrics = {};
    user.metrics.weeklyDietPlan = plan;
    
    // Disable password hashing trigger if password hasn't been changed
    const userDoc = await User.findByIdAndUpdate(req.user.id, {
        $set: { 'metrics.weeklyDietPlan': plan }
    }, { new: true });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
