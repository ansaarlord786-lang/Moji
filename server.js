import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyBgQp6Q7ekOaQ00n9VNWV6M17nZCrRRX7k"; // 👈 replace with your Gemini API key

// Backend route
app.post("/generate", async (req, res) => {
  const { prompt, width, height } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateImage?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { text: prompt },
          size: { width, height }
        })
      }
    );

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
      res.json({
        image: "data:image/png;base64," +
               data.candidates[0].content.parts[0].inline_data.data
      });
    } else {
      res.status(400).json({ error: "No image returned", raw: data });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Gemini API", details: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
