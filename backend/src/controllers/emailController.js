const db = require("../config/db");
const emailQueue = require("../queues/emailQueue");

async function scheduleEmail(req, res) {
    try {
        const {
            recipient,
            subject,
            body,
            scheduledAt
        } = req.body;

        if (!recipient || !subject || !body || !scheduledAt) {
            return res.status(400).json({
                message: "All email fields are required"
            });
        }

        const scheduledDate = new Date(scheduledAt);

        if (isNaN(scheduledDate.getTime())) {
            return res.status(400).json({
                message: "Invalid scheduled date"
            });
        }

        if (scheduledDate <= new Date()) {
            return res.status(400).json({
                message: "Scheduled time must be in the future"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO emails
            (user_id, recipient, subject, body, scheduled_at, status)
            VALUES (?, ?, ?, ?, ?, 'scheduled')`,
            [
                req.user.id,
                recipient,
                subject,
                body,
                scheduledDate
            ]
        );

        const emailId = result.insertId;

        const delay = scheduledDate.getTime() - Date.now();

        await emailQueue.add(
            "sendEmail",
            {
                emailId
            },
            {
                delay,
                jobId: `email-${emailId}`,
                removeOnComplete: 100,
                removeOnFail: 100
            }
        );

        res.status(201).json({
            message: "Email scheduled successfully",
            emailId,
            scheduledAt
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to schedule email"
        });
    }
}

async function getEmails(req, res) {
    try {
        const [emails] = await db.execute(
            `SELECT *
             FROM emails
             WHERE user_id = ?
             ORDER BY scheduled_at DESC`,
            [req.user.id]
        );

        res.json(emails);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch emails"
        });
    }
}

async function getScheduledEmails(req, res) {
    try {
        const [emails] = await db.execute(
            `SELECT *
             FROM emails
             WHERE user_id = ?
             AND status = 'scheduled'
             ORDER BY scheduled_at ASC`,
            [req.user.id]
        );

        res.json(emails);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch scheduled emails"
        });
    }
}

async function getSentEmails(req, res) {
    try {
        const [emails] = await db.execute(
            `SELECT *
             FROM emails
             WHERE user_id = ?
             AND status = 'sent'
             ORDER BY sent_at DESC`,
            [req.user.id]
        );

        res.json(emails);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch sent emails"
        });
    }
}

module.exports = {
    scheduleEmail,
    getEmails,
    getScheduledEmails,
    getSentEmails
};