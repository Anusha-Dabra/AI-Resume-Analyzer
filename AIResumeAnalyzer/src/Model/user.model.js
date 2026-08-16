const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username already exist"],
        unique: true,
    },
    email: {
        type: String,
        unique: [true, "Account already exist with this email address"],
        required: true,
    },

    password: {
        type: String,
        required: true,
    },


})

const userModel = mongoose.model("user", userSchema)

module.exports = { userModel }

