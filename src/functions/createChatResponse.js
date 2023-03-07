// src/functions/createChatResponse.js

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const ChatResponse = require('../models/chatResponse');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.post('/', async (req, res) => {
    const chatResponse = new ChatResponse({
        user: req.body.user,
        ai: req.body.ai
    });

    try {
        const newChatResponse = await chatResponse.save();
        res.status(201).json(newChatResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports.handler = app;
