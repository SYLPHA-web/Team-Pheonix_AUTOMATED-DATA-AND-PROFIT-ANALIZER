const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DailyData = require('../models/DailyData');

// @route   GET api/data/:date
// @desc    Get data for a specific date
// @access  Private
router.get('/:date', auth, async (req, res) => {
    try {
        const data = await DailyData.findOne({ user: req.user.id, date: req.params.date });
        if (!data) {
            return res.json({ foodItems: [], dailyTotals: {} });
        }
        res.json({ foodItems: data.foodItems, dailyTotals: data.dailyTotals });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/data/:date
// @desc    Save data for a specific date
// @access  Private
router.post('/:date', auth, async (req, res) => {
    const { foodItems, dailyTotals } = req.body;

    try {
        let data = await DailyData.findOne({ user: req.user.id, date: req.params.date });

        if (data) {
            // Update
            data.foodItems = foodItems;
            data.dailyTotals = dailyTotals;
            await data.save();
            return res.json(data);
        }

        // Create
        data = new DailyData({
            user: req.user.id,
            date: req.params.date,
            foodItems,
            dailyTotals
        });

        await data.save();
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/data/summary/monthly
// @desc    Get data for the last 30 days
// @access  Private
router.get('/summary/monthly', auth, async (req, res) => {
    try {
        // Calculate the date 30 days ago
        const thirtyDaysAgoDate = new Date();
        thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgoDate.toISOString().split('T')[0];

        const records = await DailyData.find({
            user: req.user.id,
            date: { $gte: thirtyDaysAgoStr }
        }).sort({ date: -1 });

        res.json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
