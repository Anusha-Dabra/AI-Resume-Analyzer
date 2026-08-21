require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")

const cookieParser = require("cookie-parser")

/* requires all auth routes */
const authRoute = require("./Route/auth.route")

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

app.use("/api/auth", authRoute)





module.exports = app