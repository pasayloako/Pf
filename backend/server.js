// backend/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Chatbot API proxy
app.post('/api/chat', async (req: Request, res: Response) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  try {
    const response = await axios.get(`https://pasayloakomego.onrender.com/api/toolbot?query=${encodeURIComponent(query)}`);
    const reply = response.data?.reply || response.data?.response || "I'm here to help you!";
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({ reply: 'Sorry, I encountered an error. Please try again later.' });
  }
});

// Contact form email handler
app.post('/api/contact', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Configure email transporter (for production, use real SMTP credentials)
  // For demo, we'll just simulate success
  console.log(`Contact form submission from ${name} (${email}): ${message}`);
  
  // In production, you would send an actual email:
  /*
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  await transporter.sendMail({
    from: email,
    to: 'selovasxk@gmail.com',
    subject: `Portfolio Contact: ${name}`,
    text: message,
  });
  */
  
  res.json({ message: 'Message received! I will get back to you soon.' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
