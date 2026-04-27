const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// 1. SAB SE PEHLE dotenv load hona chahiye
dotenv.config();

// 2. Phir Database Connect hona chahiye
connectDB(); 

const app = express();

// Routes Import
const authRoutes = require("./routes/authRoutes"); 
const itemRoutes = require("./routes/itemRoutes");
const messageRoutes = require('./routes/messageRoutes');
const actionRoutes = require("./routes/actionRoutes");
const postRoutes = require("./routes/postRoutes");

// 3. Middleware Configuration
// Aik hi bar CORS configure karein jo sab allow kare
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/actions', actionRoutes); 
app.use("/api/posts", postRoutes);

// 5. Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ 
        success: false,
        message: err.message 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));