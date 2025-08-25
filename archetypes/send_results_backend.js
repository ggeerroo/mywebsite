const express = require('express');
const cors = require('cors');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Replace with your verified sender email and name
const sentFrom = new Sender("archetypes@gero-romano.com", "Archetype Results");

app.post('/send-results', async (req, res) => {
    const { email, summary } = req.body;
    if (!email || !summary) {
        console.error("Missing email or summary:", req.body);
        return res.status(400).json({ error: "Missing email or summary." });
    }

    const recipients = [new Recipient(email, "Quiz User")];
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject("Your Archetype Quiz Results")
        .setText(summary)
        .setHtml(`<pre>${summary}</pre>`);

    try {
        await mailerSend.email.send(emailParams);
        res.json({ success: true });
    } catch (err) {
        console.error("MailerSend error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("MailerSend backend running on port 3000");
});