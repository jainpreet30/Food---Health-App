const express = require('express');
const router = express.Router();
const { addMeal, getDailyLog, updateWaterIntake, searchFood } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.post('/meal', protect, addMeal);
router.get('/daily', protect, getDailyLog);
router.put('/water', protect, updateWaterIntake);
router.get('/search', protect, searchFood);

module.exports = router;
