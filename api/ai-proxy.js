const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Debug: Log received question
    console.log("Processing question:", question);

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
        timeout: 10000 // 10-second timeout
      }
    );

    const answer = response.data.choices[0]?.message?.content?.trim();
    return res.status(200).json({ response: answer });

  } catch (error) {
    // Detailed error logging
    console.error("Full error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    return res.status(500).json({ 
      error: "AI request failed",
      details: error.response?.data || error.message 
    });
  }
};
