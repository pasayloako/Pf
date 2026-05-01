import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://SelovAsx.vercel.app',
  'https://your-domain.vercel.app',
  'https://your-custom-domain.com'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { query } = req.body;
  
  // Validate input
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required and must be a string' });
  }
  
  // Sanitize input (basic)
  const sanitizedQuery = query.trim().slice(0, 500);
  
  if (sanitizedQuery.length === 0) {
    return res.status(400).json({ reply: 'Please enter a valid message.' });
  }
  
  try {
    // Call the external API with timeout
    const response = await axios.get(
      `https://pasayloakomego.onrender.com/api/toolbot?query=${encodeURIComponent(sanitizedQuery)}`,
      {
        timeout: 15000, // 15 seconds timeout
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Selov-Portfolio-Backend/1.0',
          'Cache-Control': 'no-cache'
        }
      }
    );
    
    // Extract reply from various possible response structures
    let reply = "I'm here to help! What would you like to know?";
    
    if (response.data) {
      // Try different possible response formats
      if (typeof response.data === 'string') {
        reply = response.data;
      } else if (response.data.reply) {
        reply = response.data.reply;
      } else if (response.data.response) {
        reply = response.data.response;
      } else if (response.data.message) {
        reply = response.data.message;
      } else if (response.data.result) {
        reply = response.data.result;
      } else if (response.data.data) {
        reply = typeof response.data.data === 'string' ? response.data.data : JSON.stringify(response.data.data);
      } else {
        // If no recognized format, stringify the response
        reply = JSON.stringify(response.data);
      }
    }
    
    // Ensure reply is a string and not too long
    if (typeof reply !== 'string') {
      reply = String(reply);
    }
    
    // Limit reply length to avoid excessive data transfer
    if (reply.length > 2000) {
      reply = reply.slice(0, 2000) + '...';
    }
    
    return res.status(200).json({ 
      reply,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
    
  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    let errorMessage = "I'm having trouble connecting. Please try again in a moment.";
    let statusCode = 500;
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        errorMessage = "The request took too long. Please try again.";
        statusCode = 504;
      } else if (error.response?.status === 404) {
        errorMessage = "The AI service is currently unavailable. Please try again later.";
        statusCode = 503;
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
        statusCode = 429;
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = "Network error. Please check your connection and try again.";
        statusCode = 503;
      } else if (error.response?.status && error.response.status >= 500) {
        errorMessage = "The AI service is experiencing issues. Please try again later.";
        statusCode = 503;
      }
    }
    
    return res.status(statusCode).json({ 
      reply: errorMessage,
      error: true,
      timestamp: new Date().toISOString()
    });
  }
}
