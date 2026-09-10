const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

app.get("/", (req, res) => {
    res.send("AI Resume Analyzer Backend is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
});