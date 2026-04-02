const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  calories: Number,
  macros: {
    protein: Number,
    carbs: Number,
    fats: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  meals: {
    breakfast: [mealItemSchema],
    lunch: [mealItemSchema],
    dinner: [mealItemSchema],
    snacks: [mealItemSchema],
  },
  waterIntake: {
    type: Number, // in ml
    default: 0,
  },
  exercise: [
    {
      type: { type: String },
      duration: Number, // in minutes
      intensity: {
        type: String,
        enum: ['low', 'moderate', 'high'],
      },
      caloriesBurned: Number,
    }
  ],
  totalCalories: {
    type: Number,
    default: 0,
  },
  totalMacros: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
});

// Middleware to calculate totals before saving
dailyLogSchema.pre('save', function () {
  let protein = 0, carbs = 0, fats = 0, cals = 0;
  
  const allMeals = [
    ...(this.meals?.breakfast || []),
    ...(this.meals?.lunch || []),
    ...(this.meals?.dinner || []),
    ...(this.meals?.snacks || [])
  ];
  
  allMeals.forEach(meal => {
    protein += meal.macros?.protein || 0;
    carbs += meal.macros?.carbs || 0;
    fats += meal.macros?.fats || 0;
    cals += meal.calories || 0;
  });
  
  this.totalMacros = { protein, carbs, fats };
  this.totalCalories = cals;
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);
