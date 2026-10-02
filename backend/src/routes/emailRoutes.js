const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    scheduleEmail,
    getEmails,
    getScheduledEmails,
    getSentEmails
} = require("../controllers/emailController");

const router = express.Router();

router.use(authenticateToken);

router.post("/", scheduleEmail);

router.get("/", getEmails);

router.get("/scheduled", getScheduledEmails);

router.get("/sent", getSentEmails);

module.exports = router;