require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT;

// // Middleware
// app.use(cors({
//   origin: 'https://aestheticpalace.vercel.app/'
// }));

app.use(express.json());

// Verify .env variables are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing EMAIL_USER or EMAIL_PASS in .env file!");
  process.exit(1);
}

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Transporter Error:", error);
  } else {
    console.log("✅ Email Server is Ready!");
  }
});

// Contact Route
app.post('/send-email', async (req, res) => {
  const { name, email, phone, location, service, message } = req.body;

  if (!name || !email || !phone || !location || !service || !message) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'shivampatelvns23@gmail.com',
    subject: `New Service Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${location}\nService: ${service}\nMessage: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.status(200).json({ success: 'Email sent successfully!' });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: 'Error sending email.', details: error.message });
  }
});

const path = require("path");

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
