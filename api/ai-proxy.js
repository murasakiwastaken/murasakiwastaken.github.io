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
               "model": "deepseek-r1-distill-llama-70b",
  "temperature": 0.6,
  "max_completion_tokens": 4096,
  "top_p": 0.95,
  "stream": true,
  "stop": null
    messages: [{ role: 'user', content: question }],
    model: "gpt-3.5-turbo"
    messages: messages,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                },
                timeout: 10000
            }
        );

        const answer = response.data.choices[0]?.message?.content?.trim();
        return res.status(200).json({ response: answer });

    } catch (error) {
        console.error("Groq error:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "AI service error",
            response: "Sorry, I encountered an error processing your request. Please try again later."
        });
    }
};
