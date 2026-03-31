const User = require('../models/User');

// @desc    Update user profile and calculate metrics
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const { profile, preferences } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user) {
      if (profile) user.profile = { ...user.profile, ...profile };
      if (preferences) user.preferences = { ...user.preferences, ...preferences };

      // Calculate Metrics (BMI, TDEE)
      const { height, weight, age, gender, activityLevel, goal } = user.profile;
      
      if (height && weight && age && gender) {
        // BMI Calculation
        const heightMeters = height / 100;
        user.metrics.bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

        // BMR (Mifflin-St Jeor Equation)
        let bmr;
        if (gender === 'male') {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // Activity Multiplier
        const activityMultipliers = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          very_active: 1.9,
        };
        const multiplier = activityMultipliers[activityLevel] || 1.55;
        user.metrics.tdee = Math.round(bmr * multiplier);

        // Target Calories based on Goal
        let targetCals = user.metrics.tdee;
        if (goal === 'lose_weight') targetCals -= 500;
        if (goal === 'gain_muscle') targetCals += 500;
        user.metrics.targetCalories = targetCals;

        // Macros Breakdown (Example: 40% Carbs, 30% Protein, 30% Fats)
        // Adjust based on your preferred strategy
        user.metrics.targetMacros = {
          protein: Math.round((targetCals * 0.3) / 4),
          carbs: Math.round((targetCals * 0.4) / 4),
          fats: Math.round((targetCals * 0.3) / 9),
        };
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
