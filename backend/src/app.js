const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(authRoutes);
app.use(express.json());

module.exports = app;