import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Profile Audit & Readiness Evaluation
  app.post("/api/ai/audit", async (req, res) => {
    try {
      const { profile } = req.body;
      if (!profile) {
        return res.status(400).json({ error: "Profile data is required" });
      }

      const ai = getAi();
      const prompt = `Analyze this high school student's profile for college applications and provide a structured audit.
Student Info:
- Current Grade: Grade ${profile.currentGrade}
- Target College Tier: ${profile.targetCollegeTier || 'Top 30 Universities'}
- Target Major/Interest: ${profile.targetMajor || 'Undecided'}
- Unweighted GPA: ${profile.unweightedGpa || 'N/A'} (Weighted: ${profile.weightedGpa || 'N/A'})
- SAT Score: ${profile.satScore || 'N/A'} | ACT Score: ${profile.actScore || 'N/A'}
- Activities count: ${profile.activities?.length || 0}
- Activity Details:
${JSON.stringify(profile.activities || [], null, 2)}

Provide a JSON object response with:
1. "overallScore": integer between 40 and 99 representing realistic readiness for target tier
2. "tierEvaluation": string summary (e.g. "Strong candidate for Top 30, needs deeper leadership for Ivy+")
3. "keyStrengths": array of 3 bullet points highlighting strong areas
4. "criticalGaps": array of 3 bullet points identifying missing elements (e.g. low volunteering, lack of academic spike, missing standardized test plan)
5. "recommendedFocusForCurrentGrade": array of 3 concrete action items for Grade ${profile.currentGrade}
6. "passionSpikeIdea": string describing a potential standout passion project tailored to ${profile.targetMajor || 'their interest'}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER },
              tierEvaluation: { type: Type.STRING },
              keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedFocusForCurrentGrade: { type: Type.ARRAY, items: { type: Type.STRING } },
              passionSpikeIdea: { type: Type.STRING },
            },
            required: ["overallScore", "tierEvaluation", "keyStrengths", "criticalGaps", "recommendedFocusForCurrentGrade", "passionSpikeIdea"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("AI Audit error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI audit" });
    }
  });

  // AI Smart Suggestions for specific Grade & Category
  app.post("/api/ai/suggestions", async (req, res) => {
    try {
      const { currentGrade, targetCollegeTier, targetMajor, activities } = req.body;
      const ai = getAi();

      const prompt = `You are an elite college admissions advisor. Provide 4 smart, high-impact recommendations for a high school student currently in Grade ${currentGrade} aiming for ${targetCollegeTier || 'Top Colleges'} interested in ${targetMajor || 'General Prep'}.
Current activities logged: ${activities?.map((a: any) => a.title).join(", ") || "None yet"}.

Return JSON array of 4 objects, each with:
- "title": concise action title
- "category": one of ["Academic Rigor", "Extracurricular", "Leadership", "Testing", "Volunteering", "Summer Plan"]
- "reason": why this matters for admissions
- "impactLevel": "High" or "Essential"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                reason: { type: Type.STRING },
                impactLevel: { type: Type.STRING },
              },
              required: ["title", "category", "reason", "impactLevel"],
            },
          },
        },
      });

      const suggestions = JSON.parse(response.text || "[]");
      res.json({ suggestions });
    } catch (err: any) {
      console.error("AI Suggestions error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch suggestions" });
    }
  });

  // AI Resume Bullet Polisher
  app.post("/api/ai/polish-bullet", async (req, res) => {
    try {
      const { rawDescription, role, title, category } = req.body;
      if (!rawDescription) {
        return res.status(400).json({ error: "Raw description required" });
      }

      const ai = getAi();
      const prompt = `Transform this raw activity description into 2 crisp, high-impact resume bullet points suitable for Common App or college applications.
Activity: ${title} (${role || 'Member'}, Category: ${category})
Draft Notes: "${rawDescription}"

Guidelines: Use active verbs, quantifiable metrics where logical, and clear outcome/leadership statement.
Return JSON object: { "polishedBullets": [ "bullet 1", "bullet 2" ] }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              polishedBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["polishedBullets"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("AI Polish error:", err);
      res.status(500).json({ error: err.message || "Failed to polish description" });
    }
  });

  // AI Admissions Counselor Chatbot
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, studentContext } = req.body;
      const ai = getAi();

      const systemInstruction = `You are IvyPrep AI, an encouraging, knowledgeable, and realistic college admissions counselor for high school students.
You give actionable, empathetic, and strategic advice for course selection, SAT/ACT prep, passion projects, summer activities, recommendation letters, and college lists.
Context on current student:
- Grade: ${studentContext?.currentGrade || 9}
- Target College Tier: ${studentContext?.targetCollegeTier || 'Top 50'}
- Major Interest: ${studentContext?.targetMajor || 'Undecided'}
- Unweighted GPA: ${studentContext?.unweightedGpa || 'N/A'}
- SAT: ${studentContext?.satScore || 'N/A'}
- Logged activities count: ${studentContext?.activitiesCount || 0}

Keep answers concise, structured with bullet points or quick tips, and inspiring without sugarcoating reality.`;

      const formattedContents = (messages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error("AI Chat error:", err);
      res.status(500).json({ error: err.message || "Failed to generate chat response" });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
