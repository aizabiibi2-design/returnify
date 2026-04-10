const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// 1. IMPORT ROUTES 
// Dhayan dain: Agar server.js aur routes folder sath hain, toh './' use hota hai
const postRoutes = require("./routes/postRoutes");
const itemRoutes = require("./routes/itemRoutes"); 
const authRoutes = require("./routes/authRoutes"); 

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

// 2. USE ROUTES 
app.use("/api/auth", authRoutes);
app.use("/api/items", postRoutes); 
app.use("/api/actions", itemRoutes); 

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});