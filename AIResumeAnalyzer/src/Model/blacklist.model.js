const mongoose = require("mongoose")



const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "ADD TOKEN IN BLACKLIST"]
    },

}, { timestamps: true })


const tokenBlackListModel = mongoose.model("blacklist", blacklistTokenSchema)

module.exports = tokenBlackListModel