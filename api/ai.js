export default async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const { question } = JSON.parse(req.body);

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

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    res.status(200).json({ 
      success: true,
      reply: data.choices[0]?.message?.content || "No response generated"
    });
    
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ 
      success: false,
      error: "AI service error: " + error.message 
    });
  }
};
