const nodemailer = require("nodemailer");

let transporter = null;

async function createTransporter() {
    if (transporter) {
        return transporter;
    }

    console.log("Creating Ethereal test account...");

    const testAccount = await nodemailer.createTestAccount();

    console.log("Ethereal account created:");
    console.log("Username:", testAccount.user);

    transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    await transporter.verify();

    console.log("Ethereal SMTP connection verified successfully");

    return transporter;
}

async function sendEmail({ to, subject, body }) {
    const mailTransporter = await createTransporter();

    const info = await mailTransporter.sendMail({
        from: testAccountFrom(),
        to,
        subject,
        text: body
    });

    console.log("Email sent:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log("Preview URL:", previewUrl);

    return info;
}

function testAccountFrom() {
    return '"Email Scheduler" <no-reply@example.com>';
}

module.exports = {
    sendEmail
};