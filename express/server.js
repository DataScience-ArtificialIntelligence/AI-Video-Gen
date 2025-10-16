
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
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        keyword
      )}&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
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

    // Define the JSON schema for structured output
    const presentationSchema = {
      type: "OBJECT",
      properties: {
        presentation: {
          type: "OBJECT",
          properties: {
            title: {
              type: "STRING",
              description: "Main presentation title",
            },
            overallTheme: {
              type: "STRING",
              description: "Overall theme for entire presentation based on topic",
              enum: ["professional", "minimal", "vibrant", "dark", "creative"],
            },
            slides: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  slide_number: {
                    type: "INTEGER",
                    description: "Sequential slide number starting from 1",
                  },
                  slide_type: {
                    type: "STRING",
                    description: "Can be: title, content, or section",
                    enum: ["title", "content", "section"],
                  },
                  title: {
                    type: "STRING",
                    description: "Slide title (max 60 characters)",
                  },
                  subtitle: {
                    type: "STRING",
                    description: "For title slides - a compelling 2-3 sentence description",
                    nullable: true,
                  },
                  content: {
                    type: "OBJECT",
                    properties: {
                      type: {
                        type: "STRING",
                        description: "Content type",
                        enum: ["bullets", "paragraph", "table", "mixed"],
                      },
                      text: {
                        type: "STRING",
                        description: "For paragraph type content",
                        nullable: true,
                      },
                      items: {
                        type: "ARRAY",
                        description: "For bullets type (5-7 points max)",
                        items: {
                          type: "STRING",
                        },
                        nullable: true,
                      },
                      headers: {
                        type: "ARRAY",
                        description: "Table column headers (max 5 columns)",
                        items: {
                          type: "STRING",
                        },
                        nullable: true,
                      },
                      rows: {
                        type: "ARRAY",
                        description: "Table rows (max 6 rows)",
                        items: {
                          type: "ARRAY",
                          items: {
                            type: "STRING",
                          },
                        },
                        nullable: true,
                      },
                    },
                    required: ["type"],
                  },
                  image: {
                    type: "OBJECT",
                    properties: {
                      needed: {
                        type: "BOOLEAN",
                        description: "Whether this slide needs an image",
                      },
                      description: {
                        type: "STRING",
                        description:
                          "Short image search description (1-3 words)",
                        nullable: true,
                      },
                      position: {
                        type: "STRING",
                        description: "Image placement - choose based on content flow",
                        enum: ["right", "left"],
                        nullable: true,
                      },
                    },
                    required: ["needed"],
                  },
                },
                required: ["slide_number", "slide_type", "title"],
              },
            },
          },
          required: ["title", "overallTheme", "slides"],
        },
      },
      required: ["presentation"],
    };

    // System instruction
    const systemInstruction = `You are a PowerPoint content generator. You MUST respond ONLY with valid JSON following the exact schema provided. Do not include any explanations, markdown code blocks, or text outside the JSON structure.

CRITICAL RULES:
- slide_type can be: "title", "content", "section"
- content.type can be: "bullets", "paragraph", "table", "mixed"
- overallTheme should match the topic: 
  * "professional" for business, corporate, finance topics
  * "minimal" for design, architecture, minimalist topics
  * "vibrant" for creative, marketing, arts topics
  * "dark" for tech, gaming, modern topics
  * "creative" for innovative, startup, disruptive topics
- image.needed must be boolean (true/false)
- image.position can ONLY be "right" or "left" (choose based on content flow and balance)
- Only include image.description and image.position when image.needed is true
- For bullets, limit to 5-7 points per slide
- For tables, keep maximum 5 columns and 6 rows
- Keep all content concise and slide-friendly
- Ensure all JSON is valid and properly formatted

TITLE SLIDE REQUIREMENTS:
- First slide MUST be slide_type: "title"
- Title slide MUST have a compelling subtitle (2-3 sentences describing what the presentation covers)
- Title slide should NOT have an image (set needed: false)
- Subtitle should be engaging and informative, NOT just 3 words

IMAGE GUIDELINES:
- Title slides: NEVER need images (set needed: false)
- Content slides with visual topics (technology, products, places, people): should have images (set needed: true)
- Abstract concepts, text-heavy content, or data tables: typically don't need images (set needed: false)
- When needed is true, choose position wisely:
  * Use "right" for natural reading flow (most common)
  * Use "left" for variety or when content is short
- Balance image distribution: aim for 40-60% of content slides to have images
- Alternate positions for visual variety

THEME SELECTION:
- Analyze the topic and choose ONE theme for the entire presentation
- Apply the same theme to all slides for consistency
- Theme should reflect the topic's nature and target audience`;

    // User prompt
    const contentGuideline =
      contentStyle === "brief"
        ? includeImages
          ? "3-5 short bullet points (max 400 characters total)"
          : "5-7 bullet points (max 600 characters total)"
        : includeImages
        ? "2-3 concise paragraphs (max 600 characters total)"
        : "3-4 paragraphs (max 800 characters total)";

    const imageInstructions = includeImages
      ? `
3. INTELLIGENTLY decide which slides need images and their positions:
   - First slide (title): NEVER include image
   - Content slides: Set image.needed to true for visual topics
   - When image.needed is true, choose position ("right" or "left") based on:
     * Content length (short content → left works well)
     * Visual balance (alternate between slides)
     * Reading flow (right is default, left for variety)
   - Provide clear 1-3 word image descriptions when needed is true
   - Aim for 40-60% of content slides to have images
   - Distribute images evenly throughout presentation`
      : `
3. DO NOT include images in any slide:
   - Set image.needed to false for ALL slides
   - Do not provide image descriptions or positions`;

    const userPrompt = `Generate a professional PowerPoint presentation on the topic: "${topic}"

Requirements:
1. Create ${slideCount} slides (including title slide)
2. Each slide should have appropriate content: ${contentGuideline}${imageInstructions}
4. Choose ONE appropriate overallTheme for the entire presentation based on the topic
5. First slide MUST be:
   - slide_type: "title"
   - title: Main presentation title
   - subtitle: A compelling 2-3 sentence description (NOT just 3 words!)
   - image.needed: false (title slides never have images)
6. Remaining slides should be slide_type: "content" with proper content structure
7. Apply the same theme to all slides for visual consistency

IMPORTANT: 
- Keep content concise to fit on slides
- Use clear, impactful language
- Title slide subtitle should be informative and engaging
- Choose image positions thoughtfully for visual balance`;

    // Make API call with structured output
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: presentationSchema,
          },
        }),
      }
    );

    const data = await response.json();

    // Check for API errors
    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({
        error: "Gemini API error",
        details: data.error?.message || "Unknown error",
      });
    }

    let presentationData = null;

    if (data?.candidates?.length > 0) {
      const text = data.candidates[0]?.content?.parts?.[0]?.text;

      if (text) {
        try {
          presentationData = JSON.parse(text);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Response text:", text.substring(0, 500));
          return res.status(500).json({
            error: "Failed to parse AI response",
            details: parseError.message,
          });
        }
      }
    }

    // Validate response structure
    if (
      !presentationData?.presentation?.slides ||
      !Array.isArray(presentationData.presentation.slides)
    ) {
      return res.status(500).json({
        error: "Invalid response format from AI",
        details: "Missing or invalid presentation structure",
      });
    }

    // Extract slides and overall theme
    let slides = presentationData.presentation.slides;
    const overallTheme = presentationData.presentation.overallTheme || "professional";

    // Transform slides to match your frontend format
    slides = slides.map((slide) => {
      // Convert structured content to simple text format
      let contentText = "";

      if (slide.slide_type === "title") {
        // For title slides, use the full subtitle as content
        contentText = slide.subtitle || "";
      } else if (slide.content) {
        if (slide.content.type === "bullets" && slide.content.items) {
          contentText = slide.content.items
            .map((item) => `• ${item}`)
            .join("\n");
        } else if (slide.content.type === "paragraph" && slide.content.text) {
          contentText = slide.content.text;
        } else if (
          slide.content.type === "table" &&
          slide.content.headers &&
          slide.content.rows
        ) {
          // Format table as text
          const headerRow = slide.content.headers.join(" | ");
          const separator = "-".repeat(headerRow.length);
          const dataRows = slide.content.rows
            .map((row) => row.join(" | "))
            .join("\n");
          contentText = `${headerRow}\n${separator}\n${dataRows}`;
        }
      }

      // Truncate long content
      const maxLength = includeImages ? 600 : 800;
      if (contentText.length > maxLength) {
        contentText = contentText.substring(0, maxLength) + "...";
      }

      // CRITICAL: Respect both user preference AND Gemini's decision
      const shouldIncludeImage = includeImages && slide.image?.needed === true;

      return {
        title: slide.title,
        content: contentText,
        theme: overallTheme, // Apply same theme to all slides
        font: "Arial",
        imageKeyword: shouldIncludeImage ? slide.image.description : null,
        includeImage: shouldIncludeImage,
        imagePosition: shouldIncludeImage ? slide.image.position || "right" : null,
      };
    });

    // Fetch Unsplash images ONLY if user enabled images
    if (includeImages) {
      const imagePromises = slides.map(async (slide) => {
        if (slide.includeImage && slide.imageKeyword) {
          const imageUrl = await getRelevantImage(slide.imageKeyword);
          slide.image = imageUrl;

          // If image fetch fails, disable image for this slide
          if (!imageUrl) {
            slide.includeImage = false;
          }
        }
        return slide;
      });

      slides = await Promise.all(imagePromises);
    }

    // Log statistics for debugging
    const slidesWithImages = slides.filter((s) => s.includeImage).length;
    console.log(`Generated ${slides.length} slides with theme: ${overallTheme}`);
    console.log(`${slidesWithImages} slides have images`);

    res.json({ slides });
  } catch (error) {
    console.error("Presentation API error:", error);
    res.status(500).json({
      error: "Error generating presentation",
      details: error.message,
    });
  }
});

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
