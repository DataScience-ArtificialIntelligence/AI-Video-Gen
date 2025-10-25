import json
from typing import Dict, List
import google.generativeai as genai
from pydantic import BaseModel, Field
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

class SlideContent(BaseModel):
    slide_number: int = Field(description="Slide number starting from 1")
    title: str = Field(description="Slide title")
    content_text: str = Field(description="Main content text for the slide")
    needs_image: bool = Field(description="Whether this slide needs a relevant image")
    image_keyword: str = Field(description="Keyword for image search if needs_image is True")
    needs_animation: bool = Field(description="Whether this slide needs a manim animation/video")
    animation_description: str = Field(description="Description of what animation is needed")
    duration: float = Field(description="How long this slide should be displayed in seconds")

class PresentationContent(BaseModel):
    topic: str
    total_slides: int
    slides: List[SlideContent]

class ContentGenerator:
    """Generate structured PPT content from user prompt"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name=Config.GEMINI_MODEL,
            generation_config={
                "response_mime_type": "application/json"
            }
        )
    
    def generate_content(self, topic: str, num_slides: int = 5) -> Dict:
        """Generate presentation content structure"""
        
        prompt = f"""Generate a comprehensive educational presentation about: "{topic}"

Create {num_slides} slides with the following structure:

REQUIREMENTS:
1. First slide should be a title slide introducing the topic
2. Subsequent slides should explain the concept step by step
3. For each slide, determine:
   - Whether it needs a relevant image (set needs_image=true and provide image_keyword)
   - Whether it needs a manim animation/video (set needs_animation=true and describe what to animate)
   - Duration: Estimate speaking time for narration (4-10 seconds per slide)
   - NOTE: Most slides should be text-only (needs_image=false, needs_animation=false)

4. **ANIMATIONS - Use VERY SPARINGLY** (Maximum 1-2 animations per presentation):
   - ONLY use animations when absolutely necessary to understand the concept
   - Good use cases:
     * Pythagorean theorem proof (showing triangle, squares, areas)
     * Vector addition (showing arrows combining)
     * Circular motion (showing velocity, acceleration vectors)
     * Graph transformations (showing function changes)
   - When creating animation_description, be VERY SPECIFIC:
     * Describe exact shapes, movements, transformations needed
     * Example: "Create right triangle with sides a=3, b=4, c=5. Show squares on each side. Animate squares forming, then show area calculations: a²+b²=c²"
   - BAD animation requests: Generic concepts that can be explained with text
   - Set needs_animation=false unless the concept is IMPOSSIBLE to understand without animation

5. Use images for:
   - Historical figures or famous people
   - Real-world objects or places
   - Static diagrams that support understanding
   - Background context or examples

6. Use text-only slides (MOST COMMON - 70-80% of slides) for:
   - Definitions and explanations
   - Lists of concepts or steps
   - Summary slides
   - Theoretical concepts
   - General information
   - Anything that can be explained with words alone

7. Content should be educational, clear, and engaging
8. Each slide's content_text should be concise but informative (2-4 sentences max)
9. **IMPORTANT**: Prioritize text + voice. Only add visuals when truly beneficial.

Example slide structure:
{{
  "slide_number": 2,
  "title": "What is Force?",
  "content_text": "Force is a push or pull that can change an object's motion. It is measured in Newtons (N).",
  "needs_image": true,
  "image_keyword": "force physics illustration",
  "needs_animation": true,
  "animation_description": "Show a box being pushed with force arrow, demonstrating acceleration",
  "duration": 6.0
}}

Generate complete presentation content now.

Return a JSON object with this exact structure:
{{
  "topic": "topic name",
  "total_slides": number,
  "slides": [
    {{
      "slide_number": 1,
      "title": "slide title",
      "content_text": "content description",
      "needs_image": true/false,
      "image_keyword": "search keyword",
      "needs_animation": true/false,
      "animation_description": "what to animate",
      "duration": 5.0
    }}
  ]
}}"""
        
        response = self.model.generate_content(prompt)
        # Clean the response text to get valid JSON
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()
        
        content_data = json.loads(text)
        
        # Save content structure
        content_path = Config.SLIDES_DIR / f"{topic[:30].replace(' ', '_')}_content.json"
        with open(content_path, 'w', encoding='utf-8') as f:
            json.dump(content_data, f, indent=2, ensure_ascii=False)
        
        return content_data
