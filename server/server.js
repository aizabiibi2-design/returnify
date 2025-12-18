const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // 1. CORS ko yahan import karein
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// middleware
// 2. CORS ko ijazat dein (Frontend port 5173 ke liye)
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});