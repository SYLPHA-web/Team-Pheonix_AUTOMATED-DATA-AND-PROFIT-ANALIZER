const mongoose = require('mongoose');

const DailyDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // format 'YYYY-MM-DD'
        required: true
    },
    foodItems: {
        type: Array,
        default: []
    },
    dailyTotals: {
        type: mongoose.Schema.Types.Mixed, // Using Mixed to store the map of item name to {quantity, profit}
        default: {}
    }
}, { timestamps: true });

// Compound index to ensure one record per user per day
DailyDataSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyData', DailyDataSchema);
