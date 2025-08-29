// db.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('./globalConfig');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1); // Stop the app if DB connection fails
    }
};

module.exports = connectDB;
