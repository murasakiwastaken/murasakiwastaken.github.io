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

    // 1. Try Groq's free API first
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768', // Free high-speed model
        messages: [{ role: 'user', content: question }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        timeout: 5000 // 5-second timeout
      }
    );

    const answer = groqResponse.data.choices[0]?.message?.content?.trim();
    return res.status(200).json({ response: answer });

  } catch (error) {
    // 2. Fallback to local Ollama if Groq fails (optional)
    console.error("Groq failed, trying Ollama...");
    try {
      const ollamaResponse = await axios.post(
        'http://localhost:11434/api/chat', // Requires Ollama running locally
        {
          model: 'llama3',
          messages: [{ role: 'user', content: question }],
        }
      );
      return res.status(200).json({ response: ollamaResponse.data.message.content });
    } catch (fallbackError) {
      // 3. Ultimate fallback
      return res.status(200).json({ 
        response: "Free AI services are currently busy. Try again later or set up Ollama locally for unlimited access.\n\n(To self-host: https://ollama.com)",
        error: true
      });
    }
  }
};
