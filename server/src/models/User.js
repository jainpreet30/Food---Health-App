const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: Number, // in cm
    weight: Number, // in kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    goal: {
      type: String,
      enum: ['lose_weight', 'maintain_weight', 'gain_muscle'],
      default: 'maintain_weight',
    },
  },
  preferences: {
    dietType: {
      type: String,
      enum: ['veg', 'non-veg', 'vegan', 'jain'],
      default: 'veg',
    },
    allergies: [String],
  },
  metrics: {
    bmi: Number,
    tdee: Number,
    targetCalories: Number,
    targetMacros: {
      protein: Number,
      carbs: Number,
      fats: Number,
    },
    weeklyDietPlan: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
