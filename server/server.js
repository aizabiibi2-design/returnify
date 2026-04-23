const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Routes Import
const authRoutes = require("./routes/authRoutes"); 
const itemRoutes = require("./routes/itemRoutes");
const messageRoutes = require('./routes/messageRoutes');
const actionRoutes = require("./routes/actionRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();
connectDB(); // Database Connect

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/actions', actionRoutes); 
app.use("/api/posts", postRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));