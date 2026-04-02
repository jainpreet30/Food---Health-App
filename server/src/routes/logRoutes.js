const express = require('express');
const router = express.Router();
const { addMeal, getDailyLog, updateWaterIntake, searchFood, addExercise, deleteMeal, getStreakData } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.post('/meal', protect, addMeal);
router.delete('/meal/:type/:index', protect, deleteMeal);
router.get('/daily', protect, getDailyLog);
router.get('/streak', protect, getStreakData);
router.put('/water', protect, updateWaterIntake);
router.get('/search', protect, searchFood);
router.post('/exercise', protect, addExercise);
module.exports = router;
