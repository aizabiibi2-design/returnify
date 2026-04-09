const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// 1. IMPORT ROUTES (In do lines ko check karein, ye lazmi hain)
const postRoutes = require('./routes/postRoutes');
const itemRoutes = require('./routes/itemRoutes'); 

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes Registration ---

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Discovery Page (Reports) ke liye
app.use('/api/items', postRoutes); 

// Leaderboard aur Claims ke liye
app.use('/api/actions', itemRoutes); 

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});