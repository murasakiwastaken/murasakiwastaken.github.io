const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array required" });
        }

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
         "messages": [
    {
      "role": "user",
      "content": ""
    }
  ],
  "model": "compound-beta",
  "temperature": 1,
  "max_completion_tokens": 1024,
  "top_p": 1,
  "stream": true,
  "stop": null
                messages: messages // Pass the messages array from the client
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                },
                timeout: 10000
            }
        );

        const answer = response.data.choices?.[0]?.message?.content?.trim();
        return res.status(200).json({ response: answer });

    } catch (error) {
        console.error("Groq error:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "AI service error",
            response: "Sorry, I encountered an error processing your request. Please try again later."
        });
    }
};
