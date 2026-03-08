const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/medsync';

function connectToDB(){
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB:", MONGO_URI);
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });
}

module.exports = connectToDB;

