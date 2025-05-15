const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192', // Groq's best free model
        messages: [{ role: 'user', content: question }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        timeout: 5000
      }
    );

    const answer = response.data.choices[0]?.message?.content?.trim();
    res.status(200).json({ response: answer });

  } catch (error) {
    console.error("Groq error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Groq API failed",
      details: "Check your API key or try later. Key used: " + process.env.GROQ_API_KEY?.slice(0, 5) + '...'
    });
  }
};
