const express = require("express");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");

const cors = require("cors");

const { connectDB } = require("./config/db");
require("dotenv").config();

const app = express();

connectDB().then(async () => {
    const { sequelize } = require("./models");
    await sequelize.sync({ alter: true });

    console.log("Database synced");
});

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

app.get("/", (req, res) =>{
    res.json({
    success: true,
    message: "Library Management API is running"
});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on Port ${PORT}`)
})