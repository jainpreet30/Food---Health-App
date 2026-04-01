const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

const MOCK_FOODS = [
  { name: "Paneer Tikka", calories: 280, macros: { protein: 18, carbs: 8, fats: 20 } },
  { name: "Chicken Breast (Grilled)", calories: 165, macros: { protein: 31, carbs: 0, fats: 3.6 } },
  { name: "Brown Rice (1 cup)", calories: 216, macros: { protein: 5, carbs: 45, fats: 1.8 } },
  { name: "Dal Tadka (1 bowl)", calories: 154, macros: { protein: 9, carbs: 20, fats: 5 } },
  { name: "Dal Makhani (1 bowl)", calories: 278, macros: { protein: 10, carbs: 32, fats: 12 } },
  { name: "Roti (1 piece)", calories: 70, macros: { protein: 2, carbs: 15, fats: 0.5 } },
  { name: "Greek Yogurt (100g)", calories: 100, macros: { protein: 10, carbs: 4, fats: 5 } },
  { name: "Apple", calories: 52, macros: { protein: 0.3, carbs: 14, fats: 0.2 } },
  { name: "Banana", calories: 89, macros: { protein: 1.1, carbs: 23, fats: 0.3 } },
  { name: "Eggs (2 boiled)", calories: 155, macros: { protein: 13, carbs: 1.1, fats: 11 } },
  { name: "Masala Dosa", calories: 415, macros: { protein: 8, carbs: 62, fats: 15 } },
  { name: "Idli (2 pieces)", calories: 116, macros: { protein: 4, carbs: 25, fats: 0.4 } },
  { name: "Sambar (1 bowl)", calories: 130, macros: { protein: 5, carbs: 20, fats: 3 } },
  { name: "Poha (1 plate)", calories: 250, macros: { protein: 5, carbs: 45, fats: 6 } },
  { name: "Upma (1 plate)", calories: 280, macros: { protein: 6, carbs: 40, fats: 10 } },
  { name: "Aloo Paratha (1 piece)", calories: 290, macros: { protein: 6, carbs: 42, fats: 11 } },
  { name: "Paneer Butter Masala (1 serve)", calories: 450, macros: { protein: 16, carbs: 15, fats: 38 } },
  { name: "Palak Paneer (1 bowl)", calories: 340, macros: { protein: 15, carbs: 12, fats: 26 } },
  { name: "Chicken Biryani (1 portion)", calories: 550, macros: { protein: 25, carbs: 65, fats: 20 } },
  { name: "Veg Biryani (1 portion)", calories: 420, macros: { protein: 10, carbs: 62, fats: 15 } },
  { name: "Rajma (1 bowl)", calories: 240, macros: { protein: 12, carbs: 40, fats: 4 } },
  { name: "Chole (1 bowl)", calories: 280, macros: { protein: 12, carbs: 45, fats: 6 } },
  { name: "Mutton Curry (1 portion)", calories: 450, macros: { protein: 32, carbs: 10, fats: 30 } },
  { name: "Fish Curry (1 portion)", calories: 320, macros: { protein: 28, carbs: 15, fats: 16 } },
  { name: "Samosa (1 piece)", calories: 260, macros: { protein: 3, carbs: 32, fats: 14 } },
  { name: "Vada Pav (1 piece)", calories: 290, macros: { protein: 5, carbs: 38, fats: 14 } },
  { name: "Pani Puri (6 pieces)", calories: 200, macros: { protein: 3, carbs: 30, fats: 8 } },
  { name: "Gulab Jamun (1 piece)", calories: 150, macros: { protein: 2, carbs: 25, fats: 5 } },
  { name: "Milk (1 cup - Toned)", calories: 120, macros: { protein: 8, carbs: 12, fats: 4.5 } },
  { name: "Almonds (10 pieces)", calories: 70, macros: { protein: 2.5, carbs: 2.5, fats: 6 } },
  { name: "Walnuts (3 whole)", calories: 80, macros: { protein: 2, carbs: 2, fats: 8 } },
  { name: "Oats (1 bowl, cooked)", calories: 150, macros: { protein: 5, carbs: 27, fats: 3 } },
  { name: "Peanut Butter (1 tbsp)", calories: 95, macros: { protein: 4, carbs: 3, fats: 8 } },
  { name: "White Bread (2 slices)", calories: 130, macros: { protein: 5, carbs: 24, fats: 2 } },
  { name: "Whey Protein (1 scoop)", calories: 120, macros: { protein: 24, carbs: 3, fats: 1 } },
  { name: "Avocado (Half)", calories: 160, macros: { protein: 2, carbs: 8, fats: 15 } },
  { name: "Sweet Potato (1 medium)", calories: 103, macros: { protein: 2, carbs: 24, fats: 0.2 } },
  { name: "Tofu (100g)", calories: 144, macros: { protein: 15, carbs: 3, fats: 8 } },
  { name: "Soya Chunks (50g dry)", calories: 172, macros: { protein: 26, carbs: 16, fats: 0.5 } }
];

// @desc    Log food entry
// @route   POST /api/logs/meal
// @access  Private
exports.addMeal = async (req, res) => {
  const { type, meal } = req.body; // type: breakfast, lunch, dinner, snacks

  try {
    const today = new Date().setHours(0, 0, 0, 0);
    let log = await DailyLog.findOne({ userId: req.user.id, date: today });

    if (!log) {
      log = new DailyLog({ userId: req.user.id, date: today });
    }

    if (log.meals[type]) {
      log.meals[type].push(meal);
    } else {
      return res.status(400).json({ message: 'Invalid meal type' });
    }

    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get daily log
// @route   GET /api/logs/daily
// @access  Private
exports.getDailyLog = async (req, res) => {
  const dateStr = req.query.date || new Date();
  const date = new Date(dateStr).setHours(0, 0, 0, 0);

  try {
    const log = await DailyLog.findOne({ userId: req.user.id, date });
    if (log) {
      res.json(log);
    } else {
      res.json({
        userId: req.user.id,
        date: date,
        waterIntake: 0,
        totalCalories: 0,
        totalMacros: { protein: 0, carbs: 0, fats: 0 },
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        exercise: []
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Log water intake
// @route   PUT /api/logs/water
// @access  Private
exports.updateWaterIntake = async (req, res) => {
  const { amount } = req.body; // amount in ml

  try {
    const today = new Date().setHours(0, 0, 0, 0);
    let log = await DailyLog.findOne({ userId: req.user.id, date: today });

    if (!log) {
      log = new DailyLog({ userId: req.user.id, date: today });
    }

    log.waterIntake += Number(amount);
    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc    Search food items (Mock)
// @route   GET /api/logs/search
// @access  Private
exports.searchFood = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  const results = MOCK_FOODS.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json(results);
};

// @desc    Log exercise
// @route   POST /api/logs/exercise
// @access  Private
exports.addExercise = async (req, res) => {
  const { type, duration, intensity, caloriesBurned } = req.body;

  try {
    const today = new Date().setHours(0, 0, 0, 0);
    let log = await DailyLog.findOne({ userId: req.user.id, date: today });

    if (!log) {
      log = new DailyLog({ userId: req.user.id, date: today });
    }

    log.exercise.push({ type, duration, intensity, caloriesBurned });

    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
