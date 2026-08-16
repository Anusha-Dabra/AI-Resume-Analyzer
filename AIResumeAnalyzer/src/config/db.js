const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Database not connected: ", error)
    }
}

module.exports = connectDB