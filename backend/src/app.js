const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Basic API rate limiting
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Email Scheduler API is running"
    });
});

module.exports = app;