import json
from typing import Dict, List
import google.generativeai as genai
from pydantic import BaseModel, Field
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

class SlideScript(BaseModel):
    slide_number: int = Field(description="Slide number")
    start_time: float = Field(description="Start time in seconds from beginning of video")
    end_time: float = Field(description="End time in seconds")
    narration_text: str = Field(description="Voice narration script for this slide")

class VideoScript(BaseModel):
    topic: str
    total_duration: float
    language: str
    slide_scripts: List[SlideScript]

class ScriptGenerator:
    """Generate voice narration scripts with timestamps for each slide"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name=Config.GEMINI_MODEL,
            generation_config={
                "response_mime_type": "application/json"
            }
        )
    
    def generate_scripts(self, content_data: Dict, language: str = "english", tone: str = "formal") -> Dict:
        """Generate narration script with timestamps for each slide"""
        
        tone_instructions = {
            "formal": "Use formal, academic language. Be precise and technical.",
            "casual": "Use casual, friendly language. Make it conversational and easy to understand.",
            "storytelling": "Use narrative style, build engagement with stories and examples."
        }
        
        slides_info = "\n".join([
            f"Slide {slide['slide_number']}: {slide['title']}\n"
            f"  Content: {slide['content_text']}\n"
            f"  Duration: {slide['duration']}s\n"
            f"  Has Animation: {slide['needs_animation']}\n"
            f"  Animation Description: {slide.get('animation_description', 'N/A')}\n"
            f"  Has Image: {slide['needs_image']}\n"
            for slide in content_data['slides']
        ])
        
        prompt = f"""Generate voice narration scripts for each slide in this presentation:

Topic: {content_data['topic']}
Language: {language}
Tone: {tone} - {tone_instructions.get(tone, '')}

Slides:
{slides_info}

REQUIREMENTS:
1. Create narration_text for each slide that:
   - Explains the content clearly in {language}
   - Matches the specified tone
   - Is natural spoken language (not rushed, not overly verbose)
   - Speaks at normal conversational pace (approximately 150 words per minute)
   
2. For slides WITH ANIMATIONS:
   - Narration MUST describe what viewer sees in the animation
   - Use phrases like "As you can see...", "Watch as...", "Notice how..."
   - Explain step-by-step what's happening visually
   - Example: "As you can see on screen, the triangle has sides a, b, and c. Watch as we draw squares on each side. Notice that the area of the two smaller squares equals the area of the larger square."
   
3. For slides with images:
   - Reference the image naturally: "Looking at this image...", "This diagram shows..."
   
4. For text-only slides:
   - Clear explanation without referencing visuals
   - Focus on the concept itself
   
5. Timing guidance:
   - Each slide's narration should feel complete, not rushed
   - Aim for natural pacing - pauses between concepts
   - Don't try to fit too much in short duration
   - It's okay if actual speech is slightly longer/shorter than estimated duration
   
6. Set ESTIMATED timestamps (will be corrected based on actual audio):
   - start_time: cumulative estimated time from video start
   - end_time: start_time + estimated slide duration
   - These are just estimates - actual timing will be based on generated audio
1. Create narration_text for each slide that:
   - Explains the content clearly in {language}
   - Matches the specified tone
   - Fits within the slide's duration
   - Flows naturally when spoken aloud
   
2. For slides with animations (Has Animation: True):
   - Narration MUST describe what's happening in the animation
   - Explain the visual elements step by step
   - Time the explanation to match the animation flow (5-10 seconds)
   - Example: "As you can see on screen, the rocket expels gas downward..."
   
3. For slides with images (Has Image: True):
   - Reference the image in narration
   - Example: "Looking at this diagram, we can see..."
   
4. For text-only slides:
   - Focus on explaining the concept clearly
   - No need to reference visuals
   
5. Set accurate timestamps:
   - start_time: cumulative time from video start
   - end_time: start_time + slide duration
   - Timestamps should be sequential and match slide durations

6. Narration should:
   - Introduce concepts clearly
   - Explain animations/visuals as they appear
   - Connect ideas between slides
   - End with a brief conclusion or summary

Example:
{{
  "slide_number": 1,
  "start_time": 0.0,
  "end_time": 5.0,
  "narration_text": "Welcome! Today we'll explore Newton's Second Law of Motion."
}}

Generate complete narration scripts with timestamps now.

Return a JSON object with this structure:
{{
  "topic": "topic name",
  "total_duration": total_seconds,
  "language": "language",
  "slide_scripts": [
    {{
      "slide_number": 1,
      "start_time": 0.0,
      "end_time": 5.0,
      "narration_text": "narration text"
    }}
  ]
}}"""
        
        response = self.model.generate_content(prompt)
        # Clean the response text
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()
        
        script_data = json.loads(text)
        
        # Save script
        script_path = Config.SCRIPTS_DIR / f"{content_data['topic'][:30].replace(' ', '_')}_script.json"
        with open(script_path, 'w', encoding='utf-8') as f:
            json.dump(script_data, f, indent=2, ensure_ascii=False)
        
        return script_data
