const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    try {
        // Check if we have multipart/form-data (file upload)
        if (!req.headers['content-type']?.includes('multipart/form-data')) {
            // Handle regular text questions
            const { question } = req.body;
            if (!question) return res.status(400).json({ error: "Question required" });

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: 'llama3-70b-8192',
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
            return res.status(200).json({ response: answer });
        }

        // Handle file uploads
        const form = new FormData();
        const question = req.body.question || "Analyze this file";
        
        // For file processing, you would need to:
        // 1. Save the file temporarily
        // 2. Extract text (for documents) or generate description (for media)
        // 3. Send to Groq API
        
        // This is a simplified version - in production you'd want to:
        // - Use a proper file storage solution
        // - Implement text extraction for documents
        // - Use vision APIs for images if needed
        
        // For now, we'll just acknowledge the file and respond
        const answer = `I received your ${req.body.fileType || 'file'}. ` + 
                      `While I can't directly analyze files yet, you can describe ` +
                      `its contents and I'll help with that!`;
        
        res.status(200).json({ response: answer });

    } catch (error) {
        console.error("Groq error:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "Groq API failed",
            details: error.message
        });
    }
};
