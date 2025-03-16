import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const classifyMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: { text: `Classify this message into Promotional, Random, or Proper (job-related): ${message}` },
                max_tokens: 10
            }),
        });

        const data = await response.json();

      //console.log("🔍 API Response:", JSON.stringify(data, null, 2)); // Log entire response

        if (data.error) {
            console.error("🛑 API Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        if (!data.candidates || !data.candidates[0]) {
            console.error("⚠️ Unexpected Response Format:", data);
            return res.status(500).json({ error: "Invalid response from AI" });
        }

        const category = data.candidates[0].output || "Unknown";
        res.json({ category });

    } catch (error) {
        console.error("🔥 Error communicating with Gemini AI:", error);
        res.status(500).json({ error: "Failed to classify message" });
    }
};
