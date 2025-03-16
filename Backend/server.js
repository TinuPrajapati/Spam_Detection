import express from "express";
import cors from "cors";
import classifyRouter from "./routes/classify.js";

const app = express();

// Allow requests from both 5173 (Vite) and 3000 (Create React App)
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.use("/api/classify", classifyRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
