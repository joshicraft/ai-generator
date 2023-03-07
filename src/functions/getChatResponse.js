// src/functions/getChatResponse.js

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

app.get('/:id', getChatResponse, (req, res) => {
    res.json(res.chatResponse);
});

async function getChatResponse(req, res, next) {
    console.log('sssssss')
    let chatResponse;
    try {
        chatResponse = await ChatResponse.findById(req.params.id);
        if (chatResponse == null) {
            return res.status(404).json({ message: 'Chat response not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.chatResponse = chatResponse;
    next();
}

module.exports.handler = app;
