const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chatbot API endpoint
app.post('/api/chat', async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  try {
    const response = await axios.get(`https://pasayloakomego.onrender.com/api/toolbot?query=${encodeURIComponent(query)}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Selov-Portfolio/1.0'
      }
    });
    
    let reply = "I'm here to help you with your questions!";
    if (response.data) {
      reply = response.data.reply || response.data.response || response.data.message || response.data.result || "I'm here to help you!";
    }
    
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({ reply: "Sorry, I encountered an error. Please try again later." });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  try {
    if (process.env.NODE_ENV === 'production' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: 'selovsaskx@gmail.com',
        subject: `Portfolio Contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
      
      res.json({ message: 'Message sent successfully! I will get back to you soon.' });
    } else {
      console.log('📧 Contact Form Submission (Demo Mode):');
      console.log(`From: ${name} (${email})`);
      console.log(`Message: ${message}`);
      res.json({ message: 'Message received! I will get back to you soon.' });
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Export for Vercel (if using serverless)
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
