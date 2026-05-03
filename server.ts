import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Mock Database (In-memory for demo) ---
const users: any[] = [];
const savedListings: Record<string, string[]> = {}; // userId -> listingIds

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- API Routes ---

// Registration
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  
  // Password validation: exactly 6 digits
  if (!/^\d{6}$/.test(password)) {
    return res.status(400).json({ error: "Password must be exactly 6 numbers" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = { id: Math.random().toString(36).substr(2, 9), email, password };
  users.push(newUser);
  res.json({ message: "Registration successful", user: { id: newUser.id, email: newUser.email } });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ message: "Login successful", user: { id: user.id, email: user.email } });
});

// Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const systemContext = "You are GT.in Assistant, a career expert for the Indian job market. You help users find jobs, training programs, and give career advice. Be concise, professional, and encouraging. Focus on industries like Technology, Healthcare, Finance, and Manufacturing in India.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...(history || []).map((h: any) => ({
          role: h.role,
          parts: [{ text: h.parts[0].text }]
        })),
        { role: 'user', parts: [{ text: `${systemContext}\n\nUser: ${message}` }] }
      ],
      config: {
        maxOutputTokens: 800,
        tools: [{ googleSearch: {} }],
      },
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

// Listing Collection Proxy
app.post("/api/collect", async (req, res) => {
  try {
    const { industry } = req.body;
    const prompt = industry 
      ? `Scout and generate 10 realistic job, internship, or training listings specifically for the ${industry} industry in the Indian market. Include a realistic application URL, application deadline (YYYY-MM-DD), a brief company description (max 2 sentences), and 3 key benefits for each.`
      : "Scout and generate 20 realistic job, internship, or training listings across Technology, Healthcare, Finance, Manufacturing, Construction, Education, Hospitality, and Creative & Media in India. Include a realistic application URL, application deadline (YYYY-MM-DD), a brief company description (max 2 sentences), and 3 key benefits for each.";

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              title: { type: Type.STRING },
              industry: { 
                type: Type.STRING,
                enum: [
                  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 
                  'Construction', 'Education', 'Hospitality', 'Creative & Media'
                ]
              },
              type: { 
                type: Type.STRING,
                enum: ['Job', 'Training', 'Internship', 'Both']
              },
              skills: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              description: { type: Type.STRING },
              companyDescription: { type: Type.STRING },
              benefits: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              applyUrl: { type: Type.STRING },
              applicationDeadline: { type: Type.STRING }
            },
            required: ["companyName", "title", "industry", "type", "skills", "description", "companyDescription", "benefits", "applyUrl", "applicationDeadline"]
          }
        }
      }
    });

    const listings = JSON.parse(result.text || "[]");
    res.json(listings.map((l: any) => ({
      ...l,
      id: Math.random().toString(36).substr(2, 9),
      postedAt: new Date().toISOString().split('T')[0]
    })));
  } catch (error) {
    console.error("Collection Error:", error);
    res.status(500).json({ error: "Failed to collect listings" });
  }
});

app.post("/api/research", async (req, res) => {
  try {
    const { companyName, title } = req.body;
    const prompt = `Research and provide deep insights for a '${title}' role at '${companyName}' in India. 
    1. Latest News (recent company developments).
    2. Typical Interview Process (stages and common questions).
    3. Employee Sentiment (what workers say on Glassdoor/LinkedIn).
    4. Preparation Tips (specific tech stacks or skills to focus on).
    
    Format the response as a structured JSON object.`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            news: { type: Type.STRING },
            interview: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            prep: { type: Type.STRING }
          },
          required: ["news", "interview", "sentiment", "prep"]
        }
      }
    });

    const text = result.text || "{}";
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Research Error:", error);
    res.status(500).json({ error: "Failed to perform research" });
  }
});

// Featured Company Profiles
app.get("/api/featured-companies", async (req, res) => {
  try {
    const model = ai.models;
    const prompt = "Generate 3 professional profiles for major Indian companies that are leaders in industries like Technology, Manufacturing, and Finance. Each profile should includes: 'name', 'history' (2 sentences), 'mission' (1 sentence), and 'focus' (industry sectors).";

    const result = await model.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              history: { type: Type.STRING },
              mission: { type: Type.STRING },
              focus: { type: Type.STRING }
            },
            required: ["name", "history", "mission", "focus"]
          }
        }
      }
    });

    res.json(JSON.parse(result.text || "[]"));
  } catch (error) {
    console.error("Featured Companies Error:", error);
    res.status(500).json({ error: "Failed to generate company profiles" });
  }
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
