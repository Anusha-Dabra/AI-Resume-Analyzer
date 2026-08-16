require("dotenv").config()
const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")

/* requires all auth routes */
const authRoute = require("./Route/auth.route")

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute)





module.exports = app