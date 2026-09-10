const app = require("./src/app")
const connectDB = require("./src/config/db")




connectDB()

app.get("/", (req, res) => {
    res.send("AI Resume Analyzer Backend is running");
});

app.listen(3000, () => {
    console.log("server started");
})