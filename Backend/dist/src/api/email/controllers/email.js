'use strict';
const nodemailer = require('nodemailer');
module.exports = {
    async send(ctx) {
        const { to, subject, message } = ctx.request.body;
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // e.g., smtp.gmail.com
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        try {
            // Send email
            await transporter.sendMail({
                from: `Rushsphere`,
                to,
                subject,
                html: `<p>${message}</p>`,
            });
            ctx.send({ message: 'Email sent successfully' });
        }
        catch (err) {
            console.error(err);
            ctx.throw(500, 'Failed to send email');
        }
    },
};
