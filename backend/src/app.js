const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/game', gameRoutes); // Optional REST APIs

module.exports = app;
