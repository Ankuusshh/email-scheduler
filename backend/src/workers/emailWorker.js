require("dotenv").config();

const { Worker } = require("bullmq");

const redisConnection = require("../config/redis");
const db = require("../config/db");
const { sendEmail } = require("../services/emailService");

const worker = new Worker(
    "emailQueue",

    async (job) => {
        const { emailId } = job.data;

        console.log(`Processing email job: ${emailId}`);

        const [rows] = await db.execute(
            "SELECT * FROM emails WHERE id = ?",
            [emailId]
        );

        if (rows.length === 0) {
            throw new Error("Email not found");
        }

        const email = rows[0];

        if (email.status === "sent") {
            return;
        }

        await db.execute(
            `UPDATE emails
             SET status = 'processing'
             WHERE id = ?`,
            [emailId]
        );

        try {
            await sendEmail({
                to: email.recipient,
                subject: email.subject,
                body: email.body
            });

            await db.execute(
                `UPDATE emails
                 SET status = 'sent',
                     sent_at = NOW()
                 WHERE id = ?`,
                [emailId]
            );

            console.log(
                `Email ${emailId} sent successfully`
            );

        } catch (error) {
            await db.execute(
                `UPDATE emails
                 SET status = 'failed'
                 WHERE id = ?`,
                [emailId]
            );

            throw error;
        }
    },

    {
        connection: redisConnection,
        concurrency: 3,
        limiter: {
            max: 5,
            duration: 1000
        }
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error.message
    );
});

console.log("Email worker started");