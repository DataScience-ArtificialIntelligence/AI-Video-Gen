import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

async function getRelevantImage(keyword) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results?.[0]?.urls?.regular || "";
  } catch (error) {
    console.error("Image fetch error:", error);
    return "";
  }
}

app.post("/api/generate", async (req, res) => {
  try {
    const {
      topic,
      slideCount = 5,
      contentStyle = "brief",
      includeImages = false,
    } = req.body;

    // Adjust content guidelines based on style and image inclusion
    let contentGuideline;
    if (includeImages) {
      contentGuideline =
        contentStyle === "brief"
          ? "3-5 short bullet points (max 400 characters total)"
          : "2-3 concise paragraphs (max 600 characters total)";
    } else {
      contentGuideline =
        contentStyle === "brief"
          ? "5-7 bullet points (max 600 characters total)"
          : "3-4 paragraphs (max 800 characters total)";
    }

    const prompt = `
You are an expert presentation creator.
Make a ${slideCount}-slide presentation on the topic "${topic}".

IMPORTANT: Keep content concise and slide-friendly.

Each slide should have:
- title (max 60 characters, short and catchy)
- content (${contentGuideline})
- theme (one of: tech, nature, business, education, dark)
- font (Arial)
${includeImages ? "- imageKeyword (1-2 words for finding relevant image)" : ""}

CRITICAL: Content must be concise to fit on slides. Use clear, impactful language.

Return ONLY valid JSON without markdown code blocks or backticks:
{
  "slides": [
    {
      "title": "",
      "content": "",
      "theme": "",
      "font": ""${includeImages ? ',\n      "imageKeyword": ""' : ""}
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    let slidesJSON = { slides: [] };

    if (data?.candidates?.length > 0) {
      const text = data.candidates[0]?.content?.parts?.[0]?.text;

      if (text) {
        let cleaned = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        // Extract JSON if extra text exists
        const jsonMatch = cleaned.match(/{[\s\S]*}/);
        if (jsonMatch) cleaned = jsonMatch[0];

        try {
          slidesJSON = JSON.parse(cleaned);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Cleaned text snippet:", cleaned.substring(0, 300));
          return res.status(500).json({
            error: "Failed to parse AI response. Please try again.",
            details: parseError.message,
          });
        }
      }
    }

    // Validate slides structure
    if (!slidesJSON.slides || !Array.isArray(slidesJSON.slides)) {
      return res.status(500).json({ error: "Invalid response format from AI" });
    }

    // Truncate long content (safety)
    slidesJSON.slides = slidesJSON.slides.map((slide) => {
      const maxLength = includeImages ? 600 : 800;
      if (slide.content && slide.content.length > maxLength) {
        slide.content = slide.content.substring(0, maxLength) + "...";
      }
      return slide;
    });

    // Fetch Unsplash images if needed
    if (includeImages) {
      for (let slide of slidesJSON.slides) {
        if (slide.imageKeyword) {
          slide.image = await getRelevantImage(slide.imageKeyword);
          slide.includeImage = true;
        }
      }
    }

    res.json(slidesJSON);
  } catch (error) {
    console.error("Presentation API error:", error);
    res.status(500).json({
      error: "Error generating presentation",
      details: error.message,
    });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
