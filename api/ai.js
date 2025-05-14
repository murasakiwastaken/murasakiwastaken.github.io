// api/ai.js
export default async (req, res) => {
  try {
    const { question } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 150
      })
    });

    const data = await response.json();
    res.status(200).json({ 
      response: data.choices[0]?.message?.content || "No response" 
    });
    
  } catch (error) {
    res.status(500).json({ error: "AI failed to respond" });
  }
};
