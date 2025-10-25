
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Retry function for API calls
async function callGeminiWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} - Calling Gemini API...`);
      
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        console.log(`✅ API call successful`);
        return { response, data };
      }

      if (data.error?.code === 503 && attempt < maxRetries) {
        const delaySeconds = attempt * 4;
        console.log(`⏳ API overloaded. Waiting ${delaySeconds}s...`);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        continue;
      }

      return { response, data };

    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`⚠️ Error. Retrying in 3s...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

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

    const presentationSchema = {
      type: "OBJECT",
      properties: {
        presentation: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            overallTheme: {
              type: "STRING",
              enum: ["professional", "minimal", "vibrant", "dark", "creative"],
            },
            slides: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  slide_number: { type: "INTEGER" },
                  slide_type: {
                    type: "STRING",
                    enum: ["title", "content", "section"],
                  },
                  title: { type: "STRING" },
                  subtitle: { type: "STRING", nullable: true },
                  content: {
                    type: "OBJECT",
                    properties: {
                      type: {
                        type: "STRING",
                        enum: ["bullets", "paragraph"],
                      },
                      text: { type: "STRING", nullable: true },
                      items: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        nullable: true,
                      },
                    },
                    required: ["type"],
                  },
                  animation: {
                    type: "OBJECT",
                    properties: {
                      needed: { type: "BOOLEAN" },
                      description: { type: "STRING", nullable: true },
                      code: { type: "STRING", nullable: true },
                    },
                    required: ["needed"],
                  },
                  image: {
                    type: "OBJECT",
                    properties: {
                      needed: { type: "BOOLEAN" },
                      description: { type: "STRING", nullable: true },
                      position: {
                        type: "STRING",
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

    const systemInstruction = `You generate LIVE MOVING ANIMATIONS using HTML5 Canvas and JavaScript.

CRITICAL RULE: ANIMATIONS MUST USE frameCount TO CREATE CONTINUOUS MOTION!

Canvas: 800x400 pixels
Parameters: ctx (2D context), canvas (element), frameCount (integer that increments every frame)

MOTION FORMULAS (MANDATORY):
1. Linear Motion: position = start + frameCount * speed
2. Loop Motion: position = start + (frameCount * speed) % maxDistance
3. Oscillation: position = center + amplitude * Math.sin(frameCount * 0.05)
4. Rotation: angle = frameCount * 0.02
5. Acceleration: position = start + 0.5 * accel * Math.pow(frameCount / 30, 2)

BLACK THEME COLORS (MANDATORY):
- Background: #0a0a0a (fill canvas first!)
- Neon Green: #00ff88
- Cyan: #00d9ff  
- Magenta: #ff00ff
- Yellow: #ffff00
- Add glow: ctx.shadowBlur = 20; ctx.shadowColor = color;

COMPLETE WORKING EXAMPLES:

EXAMPLE 1 - MOVING BALL (Linear Motion):
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const x = 100 + (frameCount * 3) % 600;
const y = 200;
ctx.shadowBlur = 25;
ctx.shadowColor = '#00ff88';
ctx.fillStyle = '#00ff88';
ctx.beginPath();
ctx.arc(x, y, 25, 0, Math.PI * 2);
ctx.fill();
ctx.shadowBlur = 0;
ctx.fillStyle = '#ffffff';
ctx.font = '20px Arial';
ctx.fillText('Moving Ball', 20, 40);
ctx.fillText('Position: ' + Math.round(x), 20, 70);

EXAMPLE 2 - ROTATING TRIANGLE:
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const angle = frameCount * 0.03;
ctx.save();
ctx.translate(centerX, centerY);
ctx.rotate(angle);
ctx.shadowBlur = 20;
ctx.shadowColor = '#00d9ff';
ctx.strokeStyle = '#00d9ff';
ctx.fillStyle = 'rgba(0, 217, 255, 0.3)';
ctx.lineWidth = 4;
ctx.beginPath();
ctx.moveTo(0, -80);
ctx.lineTo(70, 40);
ctx.lineTo(-70, 40);
ctx.closePath();
ctx.fill();
ctx.stroke();
ctx.restore();
ctx.shadowBlur = 0;
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 24px Arial';
ctx.fillText('Rotating Triangle', 20, 40);
ctx.font = '16px Arial';
ctx.fillText('Angle: ' + (angle * 180 / Math.PI).toFixed(1) + '°', 20, 70);

EXAMPLE 3 - OSCILLATING PENDULUM:
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const pivotX = canvas.width / 2;
const pivotY = 50;
const length = 150;
const angleSwing = Math.sin(frameCount * 0.05) * 0.8;
const bobX = pivotX + length * Math.sin(angleSwing);
const bobY = pivotY + length * Math.cos(angleSwing);
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(pivotX, pivotY);
ctx.lineTo(bobX, bobY);
ctx.stroke();
ctx.shadowBlur = 30;
ctx.shadowColor = '#ff00ff';
ctx.fillStyle = '#ff00ff';
ctx.beginPath();
ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
ctx.fill();
ctx.shadowBlur = 0;
ctx.fillStyle = '#00ff88';
ctx.beginPath();
ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 22px Arial';
ctx.fillText('Pendulum Motion', 20, 35);

EXAMPLE 4 - ACCELERATING OBJECT (Newton F=ma):
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const mass = 2;
const force = 10;
const accel = force / mass;
const time = (frameCount % 120) / 30;
const posX = 100 + 0.5 * accel * time * time * 40;
const velocity = accel * time;
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
ctx.shadowBlur = 30;
ctx.shadowColor = '#ff00ff';
ctx.fillStyle = '#ff00ff';
ctx.beginPath();
ctx.arc(posX, canvas.height - 130, 30, 0, Math.PI * 2);
ctx.fill();
ctx.shadowBlur = 0;
if (time < 2) {
  ctx.strokeStyle = '#ffff00';
  ctx.fillStyle = '#ffff00';
  ctx.lineWidth = 5;
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#ffff00';
  ctx.beginPath();
  ctx.moveTo(posX + 35, canvas.height - 130);
  ctx.lineTo(posX + 100, canvas.height - 130);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(posX + 100, canvas.height - 130);
  ctx.lineTo(posX + 85, canvas.height - 142);
  ctx.lineTo(posX + 85, canvas.height - 118);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}
ctx.fillStyle = 'rgba(0, 217, 255, 0.2)';
ctx.fillRect(30, 30, 250, 150);
ctx.strokeStyle = '#00d9ff';
ctx.lineWidth = 2;
ctx.strokeRect(30, 30, 250, 150);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 24px Arial';
ctx.fillText('F = ma', 50, 65);
ctx.font = '18px Arial';
ctx.fillStyle = '#00ff88';
ctx.fillText('Force: ' + force + ' N', 50, 95);
ctx.fillStyle = '#ff00ff';
ctx.fillText('Mass: ' + mass + ' kg', 50, 120);
ctx.fillStyle = '#ffff00';
ctx.fillText('Velocity: ' + velocity.toFixed(1) + ' m/s', 50, 145);
ctx.fillText('Time: ' + time.toFixed(2) + ' s', 50, 170);

EXAMPLE 5 - WAVE MOTION:
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const amplitude = 60;
const wavelength = 100;
const waveSpeed = 0.08;
const centerY = canvas.height / 2;
ctx.strokeStyle = '#00d9ff';
ctx.lineWidth = 4;
ctx.shadowBlur = 20;
ctx.shadowColor = '#00d9ff';
ctx.beginPath();
for (let x = 0; x <= canvas.width; x += 3) {
  const y = centerY + amplitude * Math.sin((x / wavelength) * Math.PI * 2 - frameCount * waveSpeed);
  if (x === 0) ctx.moveTo(x, y);
  else ctx.lineTo(x, y);
}
ctx.stroke();
ctx.shadowBlur = 0;
ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
ctx.lineWidth = 1;
ctx.setLineDash([5, 5]);
ctx.beginPath();
ctx.moveTo(0, centerY);
ctx.lineTo(canvas.width, centerY);
ctx.stroke();
ctx.setLineDash([]);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 24px Arial';
ctx.fillText('Wave Motion', 30, 40);
ctx.font = '16px Arial';
ctx.fillStyle = '#00ff88';
ctx.fillText('Amplitude: ' + amplitude + 'px', 30, 70);
ctx.fillText('Wavelength: ' + wavelength + 'px', 30, 95);

EXAMPLE 6 - FALLING OBJECT (Gravity):
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const g = 9.8;
const fallTime = (frameCount % 90) / 30;
const startY = 60;
const currentY = startY + 0.5 * g * fallTime * fallTime * 18;
const vel = g * fallTime;
const ballX = canvas.width / 2;
for (let i = 0; i < frameCount % 90; i += 2) {
  const t = i / 30;
  const trailY = startY + 0.5 * g * t * t * 18;
  const alpha = 0.4 - i * 0.004;
  if (alpha > 0) {
    ctx.fillStyle = 'rgba(0, 217, 255, ' + alpha + ')';
    ctx.beginPath();
    ctx.arc(ballX, trailY, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}
ctx.shadowBlur = 30;
ctx.shadowColor = '#00d9ff';
ctx.fillStyle = '#00d9ff';
ctx.beginPath();
ctx.arc(ballX, currentY, 22, 0, Math.PI * 2);
ctx.fill();
ctx.shadowBlur = 0;
if (vel > 1) {
  const arrowLen = Math.min(vel * 10, 80);
  ctx.strokeStyle = '#ff00ff';
  ctx.fillStyle = '#ff00ff';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ff00ff';
  ctx.beginPath();
  ctx.moveTo(ballX, currentY + 25);
  ctx.lineTo(ballX, currentY + 25 + arrowLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ballX, currentY + 25 + arrowLen);
  ctx.lineTo(ballX - 8, currentY + 25 + arrowLen - 15);
  ctx.lineTo(ballX + 8, currentY + 25 + arrowLen - 15);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}
ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
ctx.fillRect(canvas.width - 250, 30, 220, 140);
ctx.strokeStyle = '#ff00ff';
ctx.lineWidth = 2;
ctx.strokeRect(canvas.width - 250, 30, 220, 140);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 22px Arial';
ctx.fillText('Free Fall', canvas.width - 230, 60);
ctx.font = '18px Arial';
ctx.fillStyle = '#00ff88';
ctx.fillText('g = ' + g + ' m/s²', canvas.width - 230, 90);
ctx.fillStyle = '#00d9ff';
ctx.fillText('t = ' + fallTime.toFixed(2) + ' s', canvas.width - 230, 115);
ctx.fillStyle = '#ff00ff';
ctx.fillText('v = ' + vel.toFixed(1) + ' m/s', canvas.width - 230, 140);

YOUR TASK:
Generate LIVE MOVING animations following these examples EXACTLY!
EVERY animation MUST use frameCount to create CONTINUOUS MOTION!
Use black background and neon colors with glowing effects!
Make objects MOVE, ROTATE, OSCILLATE, or ANIMATE continuously!`;

    const contentGuideline =
      contentStyle === "brief"
        ? "3-5 bullet points (max 500 chars)"
        : "2-3 paragraphs (max 700 chars)";

    const userPrompt = `Create stunning presentation: "${topic}"

${slideCount} slides total
Content: ${contentGuideline}
Generate LIVE MOVING animations for 75% of slides
Use BLACK background with NEON colors
Make animations that ACTUALLY MOVE using frameCount!`;

  //   const { response, data } = await callGeminiWithRetry(
  //      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  // {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         system_instruction: { parts: [{ text: systemInstruction }] },
  //         contents: [{ role: "user", parts: [{ text: userPrompt }] }],
  //         generationConfig: {
  //           responseMimeType: "application/json",
  //           responseSchema: presentationSchema,
  //           temperature: 0.85,
  //         },
  //       }),
  //     },
  //     3
  //   );
  const { response, data } = await callGeminiWithRetry(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
        temperature: 0.85,
      },
    }),
  },
  3
);


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
          return res.status(500).json({
            error: "Failed to parse AI response",
            details: parseError.message,
          });
        }
      }
    }

    if (
      !presentationData?.presentation?.slides ||
      !Array.isArray(presentationData.presentation.slides)
    ) {
      return res.status(500).json({
        error: "Invalid response format",
      });
    }

    let slides = presentationData.presentation.slides;
    const overallTheme = "dark";

    slides = await Promise.all(
      slides.map(async (slide) => {
        let contentText = "";
        if (slide.slide_type === "title") {
          contentText = slide.subtitle || "";
        } else if (slide.content) {
          if (slide.content.type === "bullets" && slide.content.items) {
            contentText = slide.content.items
              .map((item) => `• ${item}`)
              .join("\n");
          } else if (slide.content.type === "paragraph" && slide.content.text) {
            contentText = slide.content.text;
          }
        }

        const maxLength = 600;
        if (contentText.length > maxLength) {
          contentText = contentText.substring(0, maxLength) + "...";
        }

        const hasAnimation =
          slide.animation?.needed === true && slide.animation?.code;

        if (hasAnimation) {
          console.log(`   🎬 Slide ${slide.slide_number}: "${slide.title}" - LIVE Animation`);
          return {
            title: slide.title,
            content: contentText,
            theme: overallTheme,
            font: "Arial",
            hasAnimation: true,
            animationCode: slide.animation.code,
            animationDescription: slide.animation.description,
            includeImage: false,
            image: null,
          };
        } else if (includeImages && slide.image?.needed) {
          console.log(`   🖼️ Slide ${slide.slide_number}: "${slide.title}" - Image`);
          const imageUrl = await getRelevantImage(slide.image.description);
          return {
            title: slide.title,
            content: contentText,
            theme: overallTheme,
            font: "Arial",
            hasAnimation: false,
            animationCode: null,
            image: imageUrl,
            includeImage: !!imageUrl,
            imagePosition: slide.image.position || "right",
            imageKeyword: slide.image.description,
          };
        } else {
          console.log(`   📄 Slide ${slide.slide_number}: "${slide.title}" - Text only`);
          return {
            title: slide.title,
            content: contentText,
            theme: overallTheme,
            font: "Arial",
            hasAnimation: false,
            animationCode: null,
            image: null,
            includeImage: false,
          };
        }
      })
    );

    const slidesWithAnimations = slides.filter((s) => s.hasAnimation).length;
    const contentSlides = slides.length - 1;
    const percentage = contentSlides > 0 ? ((slidesWithAnimations / contentSlides) * 100).toFixed(0) : 0;
    
    console.log(`\n✅ Generated ${slides.length} slides (DARK theme)`);
    console.log(`   🎬 ${slidesWithAnimations} LIVE animations (${percentage}%)`);
    console.log(`   📺 Animations will MOVE in real-time at 60fps!\n`);

    res.json({ slides });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Error generating presentation",
      details: error.message,
    });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);

