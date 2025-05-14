// api/ai.js

export default async function handler(req, res) {
  // Crucial: Set CORS headers *outside* the try-catch block.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');


  if (req.method === 'POST') {
    try {
      const { question } = req.body; // Access 'question' directly

      if (!question) {
        return res.status(400).json({ success: false, error: 'Missing question parameter' });
      }

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

      if (!response.ok) {
        const errorData = await response.json(); // Important: Try to get error details
        const errorMessage = errorData.error || `API error: ${response.status}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      res.status(200).json({ success: true, reply: data.choices[0]?.message?.content || "No response generated" });
    } catch (error) {
      console.error("AI Error:", error); // Log the full error, essential for debugging
      res.status(500).json({ success: false, error: error.message }); // Pass the error message
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
