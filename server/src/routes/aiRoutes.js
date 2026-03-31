const express = require('express');
const router = express.Router();
const { suggestMeal } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggest-meal', protect, suggestMeal);

module.exports = router;
