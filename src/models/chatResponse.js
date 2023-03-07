// src/models/chatResponse.js

const mongoose = require('mongoose');

const chatResponseSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    ai: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatResponse', chatResponseSchema);
