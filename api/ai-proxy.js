// api/ai-proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log('Received question:', question); // Debug log

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const answer = response.data.choices[0]?.message?.content?.trim() || "No response from AI";
    console.log('AI response:', answer); // Debug log
    res.status(200).json({ response: answer });

  } catch (error) {
    console.error('Full error:', error); // Detailed logging
    res.status(500).json({ 
      error: 'AI request failed',
      details: error.response?.data || error.message 
    });
  }
}
