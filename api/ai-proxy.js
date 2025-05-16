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
        if (req.headers['content-type']?.includes('multipart/form-data')) {
            // Handle file uploads - this is a simplified version
            // In a real implementation, you would process the file here
            
            // For now, we'll just acknowledge the file
            return res.status(200).json({ 
                response: "I received your file! While I can't analyze files directly yet, " +
                         "you can describe its contents and I'll help with that."
            });
        }

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
                timeout: 10000 // Increased timeout
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
