const express = require('express');
const router = express.Router();
const { suggestMeal, getWeeklyPlan, generateWeeklyPlan } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggest-meal', protect, suggestMeal);
router.get('/weekly-plan', protect, getWeeklyPlan);
router.post('/weekly-plan', protect, generateWeeklyPlan);

module.exports = router;
