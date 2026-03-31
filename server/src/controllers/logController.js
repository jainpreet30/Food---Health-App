const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

const MOCK_FOODS = [
  { name: "Paneer Tikka", calories: 280, macros: { protein: 18, carbs: 8, fats: 20 } },
  { name: "Chicken Breast (Grilled)", calories: 165, macros: { protein: 31, carbs: 0, fats: 3.6 } },
  { name: "Brown Rice (1 cup)", calories: 216, macros: { protein: 5, carbs: 45, fats: 1.8 } },
  { name: "Dal Tadka", calories: 154, macros: { protein: 9, carbs: 20, fats: 5 } },
  { name: "Roti (1 piece)", calories: 70, macros: { protein: 2, carbs: 15, fats: 0.5 } },
  { name: "Greek Yogurt", calories: 100, macros: { protein: 10, carbs: 4, fats: 5 } },
  { name: "Apple", calories: 52, macros: { protein: 0.3, carbs: 14, fats: 0.2 } },
  { name: "Banana", calories: 89, macros: { protein: 1.1, carbs: 23, fats: 0.3 } },
  { name: "Eggs (2 boiled)", calories: 155, macros: { protein: 13, carbs: 1.1, fats: 11 } }
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
      res.status(404).json({ message: 'No log found for this date' });
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
