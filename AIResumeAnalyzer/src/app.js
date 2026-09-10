require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")

const cookieParser = require("cookie-parser")

/* requires all auth routes */
const authRoute = require("./Route/auth.route")

/* requires all interview routes */
const interviewRouter = require("./Route/interview.routes")


app.use(express.json())
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/interview", interviewRouter)





module.exports = app