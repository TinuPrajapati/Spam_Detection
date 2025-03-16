import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import classifyRouter from "./routes/classify.js";

const app = express();

// Allow requests from both 5173 (Vite) and 3000 (Create React App)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/", (req, res) => res.send("Hello from the backend!"));

app.post("/api/classify", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const output = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Classify this message into Promotional, Random, or Proper (job-related): ${message}. Give the response in JSON format.`,
                  },
                ],
              },
            ],
          }),
      }
    );
    const data = await output.json();
    const response = data.candidates[0].content.parts[0].text;
    const start = response.indexOf("{");
    const end = response.lastIndexOf("}")+1;
    const category = JSON.parse(response.substring(start, end));
    console.log(category);

    if (data.error) {
        console.error("🛑 API Error:", data.error);
        return res.status(500).json({ error: data.error.message });
    }

    if (!data.candidates || !data.candidates[0]) {
        console.error("⚠️ Unexpected Response Format:", data);
        return res.status(500).json({ error: "Invalid response from AI" });
    }

    res.json({ category: category.classification });
  } catch (error) {
    console.error("🔥 Error communicating with Gemini AI:", error);
    res.status(500).json({ error: "Failed to classify message" });
  }
});

// app.use("/api/classify", classifyRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
