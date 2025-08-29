require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const connectDB = require('./config/db.js');
const { RATE_LIMIT } = require("./constants/constants.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.MAX_REQUESTS,
    message: RATE_LIMIT.MESSAGE
});

// Apply rate limiter globally (all routes)
app.use(limiter);

// Connect to MongoDB
connectDB()

// Health check route
app.get("/health", (req, res) => res.send("Application is healthy."))

// Main v1 route
app.use('/api/v1', require('./routes/index.js'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
