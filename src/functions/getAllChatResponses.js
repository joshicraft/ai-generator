// src/functions/getChatResponses.js

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const ChatResponse = require('../models/chatResponse');

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.get('/', async (req, res) => {
    try {
        const chatResponses = await ChatResponse.find();
        res.json(chatResponses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports.handler = app;
